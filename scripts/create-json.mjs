import { readCSV, sortBy, writeJSON } from "./functions.mjs";

const dataRaw = await readCSV("output/output.csv");
const data = dataRaw.map((entry) => {
    return {
        ...entry,
        level: Number(entry.level),
        regions: entry.regions.split(",").map((e) => e.trim()).filter(r => r),
    };
}).sort(sortBy("level"));

writeJSON("output/output.json", data);
