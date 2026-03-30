// api/video.js — HuggingFace video generation via Vercel serverless

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  const HF_KEY = process.env.HF_KEY; // Set in Vercel env vars

  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  try {
    // Using HuggingFace Inference API with damo-vilab/text-to-video-ms-1.7b
    const response = await fetch(
      "https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { num_inference_steps: 25, num_frames: 16 }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      // Model still loading? Return loading status
      if (response.status === 503) {
        return res.status(503).json({ error: "Model loading. Retry in 30 seconds." });
      }
      throw new Error(err);
    }

    // Response is binary video data
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:video/mp4;base64,${base64}`;

    return res.status(200).json({ url: dataUrl });
  } catch (err) {
    return res.status(500).json({ error: "Video generation failed", details: err.message });
  }
}
