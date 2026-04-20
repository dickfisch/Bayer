# Graph Report - .  (2026-04-20)

## Corpus Check
- Large corpus: 57 files · ~538,007 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 283 nodes · 299 edges · 54 communities detected
- Extraction: 73% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.86)
- Token cost: 10,472 input · 5,446 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Husar Plus Herbicide|Husar Plus Herbicide]]
- [[_COMMUNITY_Prosaro Product Profile|Prosaro Product Profile]]
- [[_COMMUNITY_Adengo Maize Herbicide|Adengo Maize Herbicide]]
- [[_COMMUNITY_Page Routing Components|Page Routing Components]]
- [[_COMMUNITY_App Shell & Entry|App Shell & Entry]]
- [[_COMMUNITY_GHS Hazard Labels|GHS Hazard Labels]]
- [[_COMMUNITY_Social & UI Icons|Social & UI Icons]]
- [[_COMMUNITY_Herbicide Regulation|Herbicide Regulation]]
- [[_COMMUNITY_Bonus Badge Design|Bonus Badge Design]]
- [[_COMMUNITY_Bayer Brand Colors|Bayer Brand Colors]]
- [[_COMMUNITY_Field Podcast Episode|Field Podcast Episode]]
- [[_COMMUNITY_Code Icon Graphics|Code Icon Graphics]]
- [[_COMMUNITY_React Framework Assets|React Framework Assets]]
- [[_COMMUNITY_Consulting Hero Scene|Consulting Hero Scene]]
- [[_COMMUNITY_Maize Breeding Field|Maize Breeding Field]]
- [[_COMMUNITY_Resoil Soil Health|Re:soil Soil Health]]
- [[_COMMUNITY_Graphify Knowledge Graph|Graphify Knowledge Graph]]
- [[_COMMUNITY_Brand Stripe Graphics|Brand Stripe Graphics]]
- [[_COMMUNITY_Premeo Bonus Points|Premeo Bonus Points]]
- [[_COMMUNITY_Corn Weather Image|Corn Weather Image]]
- [[_COMMUNITY_Rapeseed Advisory Scene|Rapeseed Advisory Scene]]
- [[_COMMUNITY_Advisor Portrait Style|Advisor Portrait Style]]
- [[_COMMUNITY_Digital Farming Scene|Digital Farming Scene]]
- [[_COMMUNITY_Mobile Farming Theme|Mobile Farming Theme]]
- [[_COMMUNITY_Female Advisor Portrait|Female Advisor Portrait]]
- [[_COMMUNITY_Podcast Studio Setup|Podcast Studio Setup]]
- [[_COMMUNITY_huSAR Grain Herbicide|huSAR Grain Herbicide]]
- [[_COMMUNITY_App Routing & Scroll|App Routing & Scroll]]
- [[_COMMUNITY_Navigation Component|Navigation Component]]
- [[_COMMUNITY_Beratung Page Logic|Beratung Page Logic]]
- [[_COMMUNITY_Brand Logo Mark|Brand Logo Mark]]
- [[_COMMUNITY_Video Placeholder Icon|Video Placeholder Icon]]
- [[_COMMUNITY_Vite Build Tool|Vite Build Tool]]
- [[_COMMUNITY_Premeo Loyalty Program|Premeo Loyalty Program]]
- [[_COMMUNITY_Field Advisory Hero|Field Advisory Hero]]
- [[_COMMUNITY_Corn Field Landscape|Corn Field Landscape]]
- [[_COMMUNITY_Potato Crop Management|Potato Crop Management]]
- [[_COMMUNITY_Footer Component|Footer Component]]
- [[_COMMUNITY_Weather Sun Icon|Weather Sun Icon]]
- [[_COMMUNITY_Magazine Placeholder Icon|Magazine Placeholder Icon]]
- [[_COMMUNITY_Bayer Advisor Portrait A|Bayer Advisor Portrait A]]
- [[_COMMUNITY_Bayer Advisor Portrait B|Bayer Advisor Portrait B]]
- [[_COMMUNITY_Maize Cob Close-up|Maize Cob Close-up]]
- [[_COMMUNITY_Button Component|Button Component]]
- [[_COMMUNITY_Card Component|Card Component]]
- [[_COMMUNITY_Label Component|Label Component]]
- [[_COMMUNITY_TileCard Component|TileCard Component]]
- [[_COMMUNITY_PageHeader Component|PageHeader Component]]
- [[_COMMUNITY_Bayer Corporate Logo|Bayer Corporate Logo]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Selmayer Advisor|Selmayer Advisor]]
- [[_COMMUNITY_Efficacy Control|Efficacy Control]]
- [[_COMMUNITY_Hero App Visual|Hero App Visual]]

## God Nodes (most connected - your core abstractions)
1. `Husar Plus` - 17 edges
2. `Product` - 14 edges
3. `Adengo` - 14 edges
4. `Product` - 11 edges
5. `React + Vite Project Setup` - 6 edges
6. `Bonus Icon SVG` - 6 edges
7. `Icons SVG Sprite` - 6 edges
8. `Bayer Cross Logo` - 6 edges
9. `Podcast Episode 2 Thumbnail` - 6 edges
10. `React Logo SVG` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Page Title: Bayer Agrar Deutschland` --conceptually_related_to--> `React + Vite Project Setup`  [AMBIGUOUS]
  index.html → README.md
- `Main JSX Script Module` --conceptually_related_to--> `React + Vite Project Setup`  [INFERRED]
  index.html → README.md
- `TransitionLink()` --calls--> `usePageTransition()`  [INFERRED]
  src/components/TransitionLink.jsx → src/context/TransitionContext.jsx
- `BeratungStart()` --calls--> `usePageTransition()`  [INFERRED]
  src/pages/BeratungStart.jsx → src/context/TransitionContext.jsx
- `Home()` --calls--> `usePageTransition()`  [INFERRED]
  src/pages/Home.jsx → src/context/TransitionContext.jsx

## Hyperedges (group relationships)
- **FieldConsultationScene** —  [INFERRED]

## Communities

### Community 0 - "Husar Plus Herbicide"
Cohesion: 0.12
Nodes (18): Iodosulfuron-methyl-Natrium, Mesosulfuron-methyl, Bayer, Oeldispersion (OD), Herbizid, Husar Plus, Pflanzenschutzmittel Zulassung Deutschland, Mefenpyr-diethyl (+10 more)

### Community 1 - "Prosaro Product Profile"
Cohesion: 0.16
Nodes (15): Packaging, Organisation, Formulation, Concept, Crop, Concept, Crop, RegulatoryIdentifier (+7 more)

### Community 2 - "Adengo Maize Herbicide"
Cohesion: 0.19
Nodes (15): Adengo, Anwenderkategorie: Beruflich, Baumschulgehölzpflanzen, Bayer, Cyprosulfamide, Früher Nachauflauf, HRAC/WSSA Gruppen 2 und 27, Herbizid (+7 more)

### Community 3 - "Page Routing Components"
Cohesion: 0.17
Nodes (4): BeratungStart(), Home(), usePageTransition(), TransitionLink()

### Community 4 - "App Shell & Entry"
Cohesion: 0.18
Nodes (12): App Entry Point, Favicon (SVG), Main JSX Script Module, Page Title: Bayer Agrar Deutschland, Root DOM Element (#root), ESLint Configuration, React Compiler (optional), Rationale: React Compiler Disabled by Default (+4 more)

### Community 5 - "GHS Hazard Labels"
Cohesion: 0.2
Nodes (12): Manufacturer, GHSPictogram, GHSPictogram, HazardStatement, HazardStatement, HazardStatement, HazardStatement, ProductCategory (+4 more)

### Community 6 - "Social & UI Icons"
Cohesion: 0.33
Nodes (9): Bluesky Icon, Social Media Icons Category, UI Icons Category, Discord Icon, Documentation Icon, GitHub Icon, Social / Person Icon, Icons SVG Sprite (+1 more)

### Community 7 - "Herbicide Regulation"
Cohesion: 0.33
Nodes (9): Agricultural Field, Environmental Impact of Herbicide Use, Flufenacet Ban, Flufenacet (Herbicide), Herbicide Application, Pesticide Regulation / Policy, Sustainable Agriculture, Tractor with Boom Sprayer (+1 more)

### Community 8 - "Bonus Badge Design"
Cohesion: 0.43
Nodes (7): Adobe Illustrator (Authoring Tool), Bonus / Reward Concept, Pink-Red Linear Gradient Fill, Hexagon Shape, BONUS Label Text, Number 80, Bonus Icon SVG

### Community 9 - "Bayer Brand Colors"
Cohesion: 0.43
Nodes (7): Bayer Cross Logo, Circular Cross Emblem, Brand Color: Cyan Blue (#00BCFF), Brand Color: Dark Blue (#10384F), Brand Color: Lime Green (#89D329), SVG Vector Format, BAYER Letterforms in Cross Layout

### Community 10 - "Field Podcast Episode"
Cohesion: 0.48
Nodes (7): Agriculture / Grain Field Topic, Field Trial Marker 'UK', Podcast Guest (Female, White Shirt), Podcast Host (Male, Headphones, OSCA Recorder), OSCA Mobile Recording Device, Outdoor Field Podcast Recording, Podcast Episode 2 Thumbnail

### Community 11 - "Code Icon Graphics"
Cohesion: 0.4
Nodes (5): Adobe Illustrator 30.3.0, Code Comment Symbol, Double Slash Icon, Programming / Coding Icon, White Fill (#fff)

### Community 12 - "React Framework Assets"
Cohesion: 0.4
Nodes (6): React Atomic Orbital Symbol, React Brand Color #00D8FF, React Framework, Iconify Logos Icon Set, React Logo SVG, SVG Static Asset

### Community 13 - "Consulting Hero Scene"
Cohesion: 0.67
Nodes (6): AgriculturalField, AgriculturalConsultant, FarmerOrClient, HeroImage, PlantSample, Tractor

### Community 14 - "Maize Breeding Field"
Cohesion: 0.53
Nodes (6): Maize / Corn (Zea mays), Maize Field / Breeding Plot, Vegetative Growth Stage V6–V8, Maiszüchtung – Maisspitzen (Photograph), Maisspitzen (Maize Leaf Tips), Golden Hour Backlighting

### Community 15 - "Re:soil Soil Health"
Cohesion: 0.8
Nodes (6): Plant Growth (Pflanzenwachstum), Regenerative Agriculture, re:soil (Brand), Soil Health (Bodengesundheit), Tagline: Starker Boden. Starke Pflanzen., Visual Identity / Leitbild Image

### Community 16 - "Graphify Knowledge Graph"
Cohesion: 0.6
Nodes (5): Graph Report (GRAPH_REPORT.md), Graphify Knowledge Graph, Graphify Output Directory (graphify-out/), Rule: Run graphify update after code changes, Wiki Index (graphify-out/wiki/index.md)

### Community 17 - "Brand Stripe Graphics"
Cohesion: 0.4
Nodes (5): Tool: Adobe Illustrator 30.3.0, Visual Motif: Stylized Barcode / Vertical Stripes, UI Element: Decorative Banner Graphic, Brand Color: Green #649f1f, SVG Graphic: code_3

### Community 18 - "Premeo Bonus Points"
Cohesion: 0.6
Nodes (5): Bonus Points Program (Bonuspunkte), BONUS Typography, Hexagon Badge Shape, Premeo Brand, Premeo Bonuspunkte SVG Asset

### Community 19 - "Corn Weather Image"
Cohesion: 0.5
Nodes (5): CornField, CornLeaf, Image, OvercastSky, Rain

### Community 20 - "Rapeseed Advisory Scene"
Cohesion: 0.5
Nodes (5): Agricultural Consulting Scene, Crop Plant Inspection, Farmer / Client, Field Advisors (Bayer), Rapeseed Field

### Community 21 - "Advisor Portrait Style"
Cohesion: 0.4
Nodes (5): Visual Appearance, Photo Background, Clothing / Attire, Person (Advisor/Consultant), Portrait Photo

### Community 22 - "Digital Farming Scene"
Cohesion: 0.7
Nodes (5): BackgroundImage, Person, OutdoorAgriSetting, Smartphone, AgriculturalTractor

### Community 23 - "Mobile Farming Theme"
Cohesion: 0.6
Nodes (5): Image, Person, Object, Vehicle, Theme

### Community 24 - "Female Advisor Portrait"
Cohesion: 0.5
Nodes (5): Bayer Company Logo, Female Advisor, Gray Studio Background, Portrait Photo, White Collared Shirt

### Community 25 - "Podcast Studio Setup"
Cohesion: 0.7
Nodes (5): Lightbulb Illustration Poster, Podcast Recording Equipment, Podcast Host or Guest (Male, Young Adult), Podcast Recording Studio, Podcast Thumbnail (Episode 1)

### Community 26 - "huSAR Grain Herbicide"
Cohesion: 0.4
Nodes (5): Agrochemical, Bayer, Grain Crop Protection, Herbicide, huSAR Plus Herbicide

### Community 27 - "App Routing & Scroll"
Cohesion: 0.5
Nodes (0): 

### Community 28 - "Navigation Component"
Cohesion: 0.5
Nodes (0): 

### Community 29 - "Beratung Page Logic"
Cohesion: 0.5
Nodes (0): 

### Community 30 - "Brand Logo Mark"
Cohesion: 0.5
Nodes (4): Adobe Illustrator (Generator), Logo Mark / Brand Visual, Parallelogram Shape, code_2.svg Graphic

### Community 31 - "Video Placeholder Icon"
Cohesion: 0.5
Nodes (4): Dummy Video Icon (SVG), Invisible Bounding Box, Circle Border Shape, Play Arrow Shape

### Community 32 - "Vite Build Tool"
Cohesion: 0.5
Nodes (4): Vite, Dark Mode Support, Vite Logo, SVG Asset

### Community 33 - "Premeo Loyalty Program"
Cohesion: 0.67
Nodes (4): Bayer, Premeo Bonus Reward Box, Premeo Bonus Program, Tagline: Verlass dich drauf.

### Community 34 - "Field Advisory Hero"
Cohesion: 0.67
Nodes (4): AgriculturalField, ConsultingScene, HeroImage, Tractor

### Community 35 - "Corn Field Landscape"
Cohesion: 0.5
Nodes (4): Agricultural Landscape, Corn Field, Golden Hour Sky, Tree Line / Forest Edge

### Community 36 - "Potato Crop Management"
Cohesion: 0.83
Nodes (4): Agricultural Field / Potato Crop, Bayer CropScience, BCS Kartoffelbestand (Potato Field), Potato Plant (Solanum tuberosum)

### Community 37 - "Footer Component"
Cohesion: 0.67
Nodes (0): 

### Community 38 - "Weather Sun Icon"
Cohesion: 0.67
Nodes (3): Dummy/Placeholder Asset, Sun Weather Concept, Weather Icon SVG (Sun)

### Community 39 - "Magazine Placeholder Icon"
Cohesion: 1.0
Nodes (3): Dummy Magazine Icon (SVG), Header/Title Box, Newspaper / Magazine

### Community 40 - "Bayer Advisor Portrait A"
Cohesion: 0.67
Nodes (3): Bayer Logo, Person, Portrait Photo

### Community 41 - "Bayer Advisor Portrait B"
Cohesion: 1.0
Nodes (3): Bayer Logo, Person, Portrait Photo

### Community 42 - "Maize Cob Close-up"
Cohesion: 0.67
Nodes (3): Corn Cob (Maize), Maize Husk (Leaf Sheaths), Maize Kernel

### Community 43 - "Button Component"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Card Component"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Label Component"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "TileCard Component"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "PageHeader Component"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Bayer Corporate Logo"
Cohesion: 1.0
Nodes (2): Bayer Corporate Logo (Bayer Cross), Bayer Brand Identity

### Community 49 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Selmayer Advisor"
Cohesion: 1.0
Nodes (1): Person

### Community 52 - "Efficacy Control"
Cohesion: 1.0
Nodes (1): Wirksamkeitskontrolle

### Community 53 - "Hero App Visual"
Cohesion: 1.0
Nodes (1): Isometric Stacked Layers (Hero Image)

## Ambiguous Edges - Review These
- `Page Title: Bayer Agrar Deutschland` → `React + Vite Project Setup`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to

## Knowledge Gaps
- **92 isolated node(s):** `Root DOM Element (#root)`, `Favicon (SVG)`, `Vite React Plugin (@vitejs/plugin-react)`, `Vite React SWC Plugin (@vitejs/plugin-react-swc)`, `Rationale: React Compiler Disabled by Default` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Button Component`** (2 nodes): `Button()`, `Button.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Card Component`** (2 nodes): `Card()`, `Card.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Label Component`** (2 nodes): `Label()`, `Label.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TileCard Component`** (2 nodes): `TileCard.jsx`, `TileCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PageHeader Component`** (2 nodes): `PageHeader()`, `PageHeader.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bayer Corporate Logo`** (2 nodes): `Bayer Corporate Logo (Bayer Cross)`, `Bayer Brand Identity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Selmayer Advisor`** (1 nodes): `Person`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Efficacy Control`** (1 nodes): `Wirksamkeitskontrolle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hero App Visual`** (1 nodes): `Isometric Stacked Layers (Hero Image)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Page Title: Bayer Agrar Deutschland` and `React + Vite Project Setup`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What connects `Root DOM Element (#root)`, `Favicon (SVG)`, `Vite React Plugin (@vitejs/plugin-react)` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Husar Plus Herbicide` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._