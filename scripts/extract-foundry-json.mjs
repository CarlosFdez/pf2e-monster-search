import { join } from "path";
import { opendir, readFile } from "fs/promises";
import { capitalize, sortEntries, writeCSV, writeJSON } from "./functions.mjs";

async function readFoundryEntries() {
    // Backup types to handle entries without a creature type
    const types = new Set(["humanoid", "astral", "aberration", "animal", "celestial", "fiend", "monitor", "fey", "construct", "beast", "elemental", "spirit", "dragon", "undead", "fungus", "plant"]);

    const foundryRoot = String.raw`D:\Programming\FoundryVTT\pathfinder-beta\packs\data`;

    const results = [];
    const descriptions = {};

    const dir = await opendir(foundryRoot);
    for await (const dirent of dir) {
        if (!dirent.isDirectory()) continue;
        const path = join(dir.path, dirent.name);
        for await (const fileent of await opendir(path)) {
            if (!(fileent.isFile() && fileent.name.toLowerCase().endsWith(".json"))) {
                continue;
            }

            const contents = await readFile(join(path, fileent.name));
            const data = JSON.parse(contents);
            if (data.type !== "npc") continue;

            const creatureType = data.data.details.creatureType;
            const traits = data.data.traits.traits.value ?? [];
            const type = creatureType || capitalize(traits.find(t => types.has(t)));

            results.push({
                id: data._id,
                name: data.name,
                source: data.data.details.source.value,
                rarity: data.data.traits.rarity,
                type: type?.includes(",") ? type.split(",")[0].trim() : type,
                level: data.data.details.level.value,
            });

            descriptions[data._id] = {
                name: data.name,
                traits: traits,
                notes: data.data.details.publicNotes ?? "",
            };
        }
    }

    return { results, descriptions };
}

// Read and write out data
(async () => {
    console.log("Extracting Foundry Entries");
    const { results, descriptions } = await readFoundryEntries();
    await writeCSV("output/foundry_output.csv", sortEntries(results));
    await writeJSON("output/foundry_descriptions.json", descriptions);
})().then(() => console.log("Finished Extracting Foundry entries")).catch(console.error);
