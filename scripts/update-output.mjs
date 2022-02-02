import { getIgnored, readCSV, writeCSV } from "./functions.mjs";

const dataRaw = await readCSV("output/output.csv");
const dataMap = Object.fromEntries(dataRaw.map(d => [d.id, d]));
const ignored = await getIgnored();

const foundryData = await readCSV("output/foundry_output.csv");

for (const fvttData of foundryData) {
    const data = dataMap[fvttData.id];
    fvttData.regions = data?.regions;
    fvttData.type ??= data?.type;
}

await writeCSV("output/output.csv", foundryData.filter(d => !ignored.has(d.name)));
