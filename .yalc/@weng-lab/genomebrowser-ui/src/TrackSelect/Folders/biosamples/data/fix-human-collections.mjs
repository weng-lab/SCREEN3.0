import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "human_with_wgbs.json");
const outputPath = join(__dirname, "humans_fixed.json");

const expectedCounts = {
  Core: 170,
  Partial: 1155,
  Ancillary: 562,
};

const counts = {
  Core: 0,
  Partial: 0,
  Ancillary: 0,
  NA: 0,
};

const specialCases = {
  GM12866_ENCDO000ABQ: "NA",
  neural_crest_cell_ENCDO222AAA: "Partial",
};

const specialCaseFound = Object.fromEntries(
  Object.keys(specialCases).map((name) => [name, false]),
);

function classifyTrack(track) {
  const specialCollection = specialCases[track.name];
  if (specialCollection) {
    specialCaseFound[track.name] = true;
    return specialCollection;
  }

  const assays = new Set(
    track.assays.map((assay) => assay.assay.toLowerCase()),
  );

  if (!assays.has("dnase")) {
    return "Ancillary";
  }

  if (
    assays.has("h3k4me3") &&
    assays.has("h3k27ac") &&
    assays.has("ctcf")
  ) {
    return "Core";
  }

  return "Partial";
}

function isAggregate(track) {
  return track.name === "aggregate-biosample-data" || track.ontology === "aggregate";
}

function validateCounts() {
  const mismatches = Object.entries(expectedCounts).filter(
    ([collection, expected]) => counts[collection] !== expected,
  );

  if (mismatches.length === 0) {
    return;
  }

  console.error("Classification count validation failed.");
  console.error("Expected:", expectedCounts);
  console.error("Actual:", counts);
  process.exit(1);
}

const input = JSON.parse(await readFile(inputPath, "utf8"));
const changes = [];

const fixedTracks = input.tracks.map((track) => {
  const collection = classifyTrack(track);

  if (!isAggregate(track)) {
    counts[collection] += 1;
  }

  if (track.collection !== collection) {
    changes.push({
      name: track.name,
      displayName: track.displayName,
      from: track.collection,
      to: collection,
    });
  }

  return {
    ...track,
    collection,
  };
});

validateCounts();

await writeFile(
  outputPath,
  `${JSON.stringify({ ...input, tracks: fixedTracks }, null, 2)}\n`,
);

console.log("Wrote", outputPath);
console.log("Counts excluding aggregate:", counts);
console.log("Changed tracks:", changes.length);
console.log("Special cases found:", specialCaseFound);

const changeCounts = changes.reduce((acc, change) => {
  const key = `${change.from} -> ${change.to}`;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

console.log("Change counts:", changeCounts);
