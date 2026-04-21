#!/usr/bin/env python3
"""
Scraper für Bayer Pflanzenschutzmittel – https://agrar.bayer.de
Ausgabe: public/data/products.json + public/images/products/<slug>.jpg
"""

import asyncio
import json
import re
import sys
import urllib.request
from pathlib import Path
from urllib.parse import urljoin

from playwright.async_api import async_playwright

BASE_URL = "https://agrar.bayer.de"
LIST_URL = "https://agrar.bayer.de/pflanzenschutz"
OUT_JSON = Path("public/data/products.json")
OUT_IMGS = Path("public/images/products")

# ── helpers ──────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[®™]", "", name)
    name = re.sub(r"[^a-z0-9]+", "-", name)
    return name.strip("-")


def clean(s: str) -> str:
    # entfernt unsichtbare Unicode-Steuerzeichen die Bayer in Titles einbaut
    return re.sub(r"[​-‏‪-‮⁠-⁤﻿]", "", s).strip()


def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            dest.write_bytes(r.read())
        return True
    except Exception as e:
        print(f"  ⚠ Bild-Download fehlgeschlagen: {e}")
        return False


# ── scraper ──────────────────────────────────────────────────────────────────

async def wait_for_page(page):
    try:
        await page.wait_for_load_state("networkidle", timeout=8_000)
    except Exception:
        pass
    await asyncio.sleep(1)


async def scrape_product(page, url: str) -> dict | None:
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
        await wait_for_page(page)
    except Exception as e:
        print(f"  ⚠ Seite nicht geladen ({url}): {e}")
        return None

    body = await page.locator("body").text_content() or ""

    # Name + Kategorie aus Breadcrumb "Pflanzenschutzmittel / Herbizid / Adengo®"
    # Zuverlässiger als page.title() bei SPA-Navigation
    bc_match = re.search(
        r"Pflanzenschutzmittel\s*/\s*([^/\n]+?)\s*/\s*([^\n]+)",
        body,
    )
    name     = clean(bc_match.group(2)).strip() if bc_match else ""
    category = bc_match.group(1).strip()        if bc_match else ""

    # Fallback: URL-Slug als Name
    if not name:
        from urllib.parse import unquote
        name = unquote(page.url.split("/")[-1].split("?")[0])

    # Beschreibung: nach dem JS-Marker → Produktname (erste nicht-leere Zeile) → Beschreibung
    description = ""
    marker_idx = body.find('var base64Search = ""')
    if marker_idx != -1:
        after_marker = body[marker_idx:]
        lines = [l.strip() for l in after_marker.split("\n") if l.strip()]
        for i, line in enumerate(lines[:20]):
            if clean(line) == name and i + 1 < len(lines):
                candidate = lines[i + 1]
                if len(candidate) > 20 and not candidate.startswith("var ") and "{" not in candidate:
                    description = candidate
                break

    # Wirkstoffe: aus der Formulierungstabelle nach "Wirkstoff\n"
    wirkstoff = ""
    ws_idx = body.find("\n                    Wirkstoff\n")
    if ws_idx != -1:
        ws_section = body[ws_idx:ws_idx + 600]
        # Paare: "225,0 g/l\n                                Isoxaflutole"
        entries = re.findall(
            r"([\d,.]+\s*g/(?:kg|l)\w*)\s+([A-ZÄÖÜ][A-Za-zäöüÄÖÜß\-]{2,60}(?:\s+\w+)*)",
            ws_section,
        )
        if entries:
            wirkstoff = ", ".join(
                f"{a.strip()} {re.sub(r'\\s+', ' ', n).strip()}" for a, n in entries
            )

    # ── Strukturierte Extra-Felder aus .product-detail-content ──────────────
    formulierung = ""
    wirkstoffe: list[dict] = []
    eigenschaften: list[str] = []
    gebinde: list[dict] = []

    # Formulierung + strukturierte Wirkstoffe (technical-infos)
    try:
        tech_divs = await page.locator(".technical-infos > div").all()
        for div in tech_divs:
            heading = (await div.locator("h6").first.text_content() or "").strip()
            if heading == "Formulierung":
                val = await div.locator("span").first.text_content() or ""
                formulierung = val.strip()
            elif heading == "Wirkstoff":
                lis = await div.locator("ul.silent-list > li").all()
                for li in lis:
                    raw = (await li.text_content() or "").strip()
                    # z. B. "225,0 g/l\n                                Isoxaflutole"
                    # oder  "150 g/l\n                                Cyprosulfamide (Safener)"
                    # oder  "86,77 g/l\n       Thiencarbazone\n((als Methylester 90 g/l))"
                    lines = [
                        re.sub(r"\s+", " ", ln).strip()
                        for ln in raw.split("\n")
                        if ln.strip()
                    ]
                    if not lines:
                        continue
                    amount = lines[0]
                    name_parts = lines[1:] if len(lines) > 1 else []
                    name_joined = " ".join(name_parts).strip()
                    # Safener-Flag
                    safener = "(Safener)" in name_joined
                    clean_name = re.sub(r"\s*\(Safener\)\s*", "", name_joined).strip()
                    # doppelte Klammern reduzieren: "((als Methylester))" → "(als Methylester)"
                    clean_name = re.sub(r"\(\(([^)]+)\)\)", r"(\1)", clean_name)
                    if amount and clean_name:
                        wirkstoffe.append({
                            "amount":  amount,
                            "name":    clean_name,
                            "safener": safener,
                        })
    except Exception as e:
        print(f"  ⚠ technical-infos Parsing: {e}")

    # Eigenschaften (USP-Bullets)
    try:
        lis = await page.locator(".usp li").all()
        for li in lis:
            txt = (await li.text_content() or "").strip()
            txt = re.sub(r"\s+", " ", txt)
            if txt and len(txt) < 200:
                eigenschaften.append(txt)
    except Exception as e:
        print(f"  ⚠ USP Parsing: {e}")

    # Gebinde-Tabelle (Artikelnummer / Verpackungsgröße / Paletteneinheit)
    try:
        rows = await page.locator(".gebinde-table tbody tr").all()
        for row in rows:
            tds = await row.locator("td").all()
            if len(tds) >= 3:
                a = (await tds[0].text_content() or "").strip()
                v = (await tds[1].text_content() or "").strip()
                p = (await tds[2].text_content() or "").strip()
                if a and v:
                    gebinde.append({
                        "artikelnummer":    re.sub(r"\s+", " ", a),
                        "verpackungsgroesse": re.sub(r"\s+", " ", v),
                        "paletteneinheit":  re.sub(r"\s+", " ", p),
                    })
    except Exception as e:
        print(f"  ⚠ Gebinde Parsing: {e}")

    # Bild-URL: pim.bayercropscience.de, bevorzuge 1000x500
    image_url = ""
    imgs = await page.locator("img").all()
    for size in ("1000x500", "250x250", "135x135", ""):
        for img in imgs:
            src = await img.get_attribute("src") or ""
            if "pim.bayercropscience.de" in src and (not size or size in src):
                image_url = src
                break
        if image_url:
            break

    return {
        "name":          name,
        "description":   description,
        "category":      category,
        "wirkstoff":     wirkstoff,
        "formulierung":  formulierung,
        "wirkstoffe":    wirkstoffe,
        "eigenschaften": eigenschaften,
        "gebinde":       gebinde,
        "image_url":     image_url,
        "source_url":    page.url,
    }


async def collect_product_urls(page) -> list[str]:
    print(f"Lade Produktliste: {LIST_URL}")
    await page.goto(LIST_URL, wait_until="domcontentloaded", timeout=30_000)
    await wait_for_page(page)
    await asyncio.sleep(2)

    links = await page.locator("a[href*='ProductRedirect']").all()
    seen: dict[str, str] = {}
    for link in links:
        href = await link.get_attribute("href") or ""
        if "ProductId" not in href:
            continue
        pid_match = re.search(r"ProductId=(\d+)", href)
        pid = pid_match.group(1) if pid_match else href
        if pid not in seen:
            seen[pid] = href if href.startswith("http") else urljoin(BASE_URL, href)

    result = sorted(seen.values())
    print(f"  → {len(result)} eindeutige Pflanzenschutzmittel-URLs gefunden")
    return result


async def main():
    OUT_IMGS.mkdir(parents=True, exist_ok=True)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        )
        page = await context.new_page()

        product_urls = await collect_product_urls(page)
        if not product_urls:
            print("Keine Produkt-URLs gefunden – Abbruch.")
            sys.exit(1)

        products = []
        skipped  = 0
        imgs_ok  = 0

        for i, url in enumerate(product_urls, 1):
            slug = url.split("?")[0].split("/")[-1]
            print(f"[{i:>3}/{len(product_urls)}] {slug}")
            data = await scrape_product(page, url)

            if not data or not data["name"]:
                print("  ⚠ Kein Name – übersprungen")
                skipped += 1
                continue

            if data["image_url"]:
                ext  = ".png" if "type=png" in data["image_url"].lower() else ".jpg"
                dest = OUT_IMGS / f"{slugify(data['name'])}{ext}"
                if download_image(data["image_url"], dest):
                    data["local_image"] = str(dest)
                    imgs_ok += 1

            products.append(data)
            await asyncio.sleep(0.6)

        await browser.close()

    OUT_JSON.write_text(
        json.dumps(products, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    cats: dict[str, int] = {}
    for p in products:
        k = p["category"] or "–"
        cats[k] = cats.get(k, 0) + 1

    print("\n" + "═" * 54)
    print(f"  Produkte gefunden   : {len(product_urls)}")
    print(f"  Produkte gescraped  : {len(products)}")
    print(f"  Übersprungen        : {skipped}")
    print(f"  Bilder gespeichert  : {imgs_ok}")
    print(f"  JSON gespeichert    : {OUT_JSON}")
    print()
    print("  Kategorien:")
    for cat, n in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"    {cat:<22} {n}x")
    print("═" * 54)


if __name__ == "__main__":
    asyncio.run(main())
