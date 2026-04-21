export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { voiceId, ...body } = req.body

  if (!voiceId) {
    return res.status(400).json({ error: 'voiceId required' })
  }

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify(body),
    }
  )

  if (!upstream.ok) {
    const errTxt = await upstream.text()
    return res.status(upstream.status).send(errTxt)
  }

  const audioBuffer = await upstream.arrayBuffer()
  res.setHeader('Content-Type', 'audio/mpeg')
  res.status(200).send(Buffer.from(audioBuffer))
}
