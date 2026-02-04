// scripts/auto-ugc-s3-auto.js
import fs from "fs";
import fetch from "node-fetch";

const BASE_URL = "https://mesh-online-assets.s3.us-east-2.amazonaws.com/uploadedAssets/ugc/objects/";
const OUTPUT_PATH = "./public/data/ugc-index.json";

async function fetchUGCFromS3() {
  console.log("Fetching UGC list from S3...");
  const res = await fetch(BASE_URL);
  const html = await res.text();

  // Extract all obj_ugc-*.png file names
  const ids = [...html.matchAll(/obj_ugc-[\w-]+\.png/g)].map(m => m[0].replace(".png", ""));
  console.log(`Found ${ids.length} UGC items.`);
  return ids;
}

function buildUGCIndex(ids) {
  const ugc = ids.map(id => ({
    id: id,
    name: id.split("-").slice(2, -1).join("-") || id,
    creator: "Unknown",
    creatorWallet: "",
    type: "UGC",
    sprite: `${BASE_URL}${id}.png`,
    frames: 1,
    frameWidth: 64,
    frameHeight: 64
  }));

  // Ensure folder exists
  fs.mkdirSync("./public/data", { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(ugc, null, 2));
  console.log(`UGC index generated at ${OUTPUT_PATH}`);
}

// Main
async function main() {
  try {
    const ids = await fetchUGCFromS3();
    buildUGCIndex(ids);
  } catch (err) {
    console.error("Error generating UGC index:", err);
  }
}

main();
