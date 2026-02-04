// scripts/auto-ugc-s3.js
import fs from "fs";
import fetch from "node-fetch";

// Base URL of Pixels UGC assets
const BASE_URL = "https://mesh-online-assets.s3.us-east-2.amazonaws.com/uploadedAssets/ugc/objects/";

// Fetch UGC file names automatically from S3 HTML listing
async function fetchUGCFromS3() {
  const res = await fetch(BASE_URL);
  const html = await res.text();

  // Extract all obj_ugc-* filenames
  const ids = [...html.matchAll(/obj_ugc-[\w-]+\.png/g)].map(m => m[0].replace(".png", ""));
  return ids;
}

// Build ugc-index.json automatically
function buildUGCIndex(ids) {
  const ugc = ids.map(id => ({
    id: id,
    name: id.split("-").slice(2, -1).join("-"), // extract name from ID
    creator: "Unknown",
    creatorWallet: "",
    type: "UGC",
    sprite: `${BASE_URL}${id}.png`,
    frames: 1,
    frameWidth: 64,
    frameHeight: 64
  }));

  fs.writeFileSync("./public/data/ugc-index.json", JSON.stringify(ugc, null, 2));
  console.log("UGC index updated:", ugc.length, "items");
}

// Main
async function main() {
  const ids = await fetchUGCFromS3();
  buildUGCIndex(ids);
}

main();
