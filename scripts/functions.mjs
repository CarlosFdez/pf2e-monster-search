import * as csv from "fast-csv";
import * as fs from "fs";
import { readFile, writeFile } from "fs/promises";
import getStream from "get-stream";

export function writeCSV(filepath, data) {
    const stream = csv.format({ headers: true, delimiter: "," });
    stream.pipe(fs.createWriteStream(filepath));
    for (const row of data) {
        stream.write(row);
    }
    stream.end();
    return getStream(stream);
}

/**
 * Reads a CSV string into a list of objects
 * @param {object[]} data
 */
export function readCSV(filepath) {
    return getStream.array(fs.createReadStream(filepath).pipe(csv.parse({ headers: true })));
}

export function writeJSON(filepath, data) {
    return writeFile(filepath, JSON.stringify(data), { encoding: "utf8" });
}

export const sortBy = (key) => {
    return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

export function capitalize(value) {
    if (!value) return null;
    return value.charAt(0)?.toUpperCase() + value.substring(1);
}

export function sortEntries(results) {
    const sources = ["Pathfinder Core Rulebook", "Pathfinder Gamemastery Guide", "Pathfinder Bestiary", "Pathfinder Lost Omens", "Pathfinder One-Shot", "Pathfinder Adventure", "Pathfinder #"];
    let finalBucket = [...results].sort(sortBy("level"));
    const buckets = [];
    for (const source of sources) {
        const bucket = finalBucket.filter((r) => r.source.startsWith(source));
        finalBucket = finalBucket.filter((r) => !bucket.includes(r));
        buckets.push(bucket.sort(sortBy("source")));
    }
    buckets.push(finalBucket.sort(sortBy("source")));
    return buckets.flat();
}

export async function getIgnored() {
    const ignoredFileStr = await readFile("ignored.txt", { encoding: "utf8" })
    const ignoredEntries = ignoredFileStr.split(/\r?\n/g).map(r => r.trim());
    return new Set(ignoredEntries.filter(e => !!e));
}
