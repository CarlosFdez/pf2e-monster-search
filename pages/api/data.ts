import MonsterList from "../../output/output.json";
import MonsterDataRaw from "../../output/foundry_descriptions.json";

export type DataRow = typeof MonsterList[number];
export type Monster = typeof MonsterDataRaw[keyof typeof MonsterDataRaw] & DataRow;

const MonsterData: Record<string, Monster> = {};
for (const [key, value] of Object.entries(MonsterDataRaw)) {
    const data = MonsterList.find((d) => d.id === key);
    MonsterData[key] = {
        id: key,
        type: data?.type ?? "",
        ...value,
        level: data?.level ?? 0,
        rarity: data?.rarity ?? "common",
        source: data?.source ?? "",
        regions: data?.regions ?? [],
    };
}

const Regions = new Set(MonsterList.flatMap(data => data.regions).filter(r => r));

export { MonsterList, MonsterData, Regions };
