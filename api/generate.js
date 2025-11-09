export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { title, lyrics, style } = req.body;

  try {
    // Gunakan Hugging Face Model "facebook/musicgen-small" (gratis)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Create a ${style} song titled "${title}" with lyrics: ${lyrics}`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      url: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate music" });
  }
}
