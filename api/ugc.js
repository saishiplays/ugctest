// /api/ugc.js
import fetch from "node-fetch";

const BASE_URL = "https://mesh-online-assets.s3.us-east-2.amazonaws.com/uploadedAssets/ugc/objects/";

export default async function handler(req, res) {
  try {
    // Fetch S3 HTML listing
    const html = await fetch(BASE_URL).then(r => r.text());

    // Extract all obj_ugc-*.png filenames
    const ids = [...html.matchAll(/obj_ugc-[\w-]+\.png/g)].map(m => m[0].replace(".png", ""));

    // Build JSON response dynamically
    const ugc = ids.map(id => ({
      id,
      name: id.split("-").slice(2, -1).join("-") || id,
      creator: "Unknown",
      sprite: `${BASE_URL}${id}.png`,
      frames: 1,
      frameWidth: 64,
      frameHeight: 64
    }));

    // Send JSON
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(ugc));
  } catch (err) {
    console.error("Error fetching UGC:", err);
    res.status(500).json({ error: "Failed to fetch UGC" });
  }
}
