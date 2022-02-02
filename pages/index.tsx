import { css } from '@emotion/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { MonsterData, MonsterList, Regions } from './api/data';
import MonsterInfo from '../components/monster-info';
import MonsterTable from '../components/monster-table';

function useFilterSet() {
    const [selectedRaw, setSelected] = useState<string[]>([]);
    const selected = new Set(selectedRaw);

    return {
        selected,
        has: selected.has.bind(selected),
        set: (item: string, value: boolean) => {
            const items = new Set(selected);
            if (value) {
                items.add(item);
            } else {
                items.delete(item);
            }

            setSelected([...items])
        },
    }
}

const Home: NextPage = () => {
    const [selected, setSelected] = useState<string>("");
    const selectedRegions = useFilterSet();
    const [minLevel, setMinLevel] = useState<string>("");
    const [maxLevel, setMaxLevel] = useState<string>("");

    const monsters = useMemo(() => {
        const regions = selectedRegions.selected;
        const minLevelFixed = Number(minLevel) || null;
        const maxLevelFixed = Number(maxLevel) || null;
        console.log(MonsterList.length)
        return MonsterList.filter((row) => {
            if (regions.size) {
                if (!row.regions.length && !regions.has("Blank")) return false;
                if (!row.regions.every((region) => regions.has(region))) return false;
            }

            if (minLevelFixed !== null && row.level < minLevelFixed) return false;
            if (maxLevelFixed !== null && row.level > maxLevelFixed) return false;
            return true;
        });
    }, [selectedRegions.selected, minLevel, maxLevel]);

    return (
        <div css={Container}>
            <Head>
                <title>PF2e Monster Search</title>
                <meta name="description" content="Simple Monster Search by Territory" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main css={Main}>
                <div css={FiltersStyle}>
                    <div css={LevelsStyle}>
                        <span>Level</span>
                        <input value={minLevel} onChange={(evt) => setMinLevel(evt.target.value)}/>
                        <span>to</span>
                        <input value={maxLevel} onChange={(evt) => setMaxLevel(evt.target.value)}/>
                    </div>
                    <div css={RegionsStyle}>
                        {["Blank", ...Regions].map((region) => (
                            <label key={region}>
                                <input type="checkbox" checked={selectedRegions.has(region)} onChange={(evt) => selectedRegions.set(region, evt.target.checked)} />
                                {region}
                            </label>
                        ))}
                    </div>
                </div>

                <div css={MonsterSectionStyle}>
                    <MonsterInfo monster={MonsterData[selected]} />
                    <MonsterTable data={monsters} selected={selected} onSelect={setSelected} />
                </div>
            </main>

            <footer css={FooterStyle}>
                <span>
                    Built by Supe using data from <a href="https://foundryvtt.com/packages/pf2e/">PF2e for Foundry VTT</a> (with help from <a href="https://docs.google.com/spreadsheets/d/1OqX2Gr1TIEywXj0GFUTMoRmSYaCs6AzSWeUsf8EFcdc/edit#gid=415658932">this sheet</a>). Data published under the <a href="https://paizo.com/community/communityuse">CUP</a>. Data can be contributed to <a href="https://github.com/CarlosFdez/pf2e-monster-search/blob/master/output/output.csv">this sheet</a>.
                </span>
            </footer>
        </div>
    );
}

const Container = css`
  padding: 0 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 100px;
`;

const Main = css`
  padding: 1rem 0;
  flex: 1;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
`;

const FiltersStyle = css`
    display: flex;
    gap: 16px;
`;

const RegionsStyle = css`
    display: flex;
    gap: 3px;
    flex-wrap: wrap;
    label {
        border: 1px solid #00000033;
        border-radius: 3px;
        padding: 0 4px;

        input {
            padding: 0;
            margin: 0;
            margin-right: 4px
        }
    }
`;

const LevelsStyle = css`
    display: flex;
    gap: 3px;
    input {
        width: 100px;
    }
`;

const MonsterSectionStyle = css`
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-y: hidden;
  gap: 50px;
`;

const FooterStyle = css`
    display: flex;
    flex: 0 1 auto;
    padding: 1.5rem 0;
    border-top: 1px solid #eaeaea;
    justify-content: center;
    align-items: center;

    a {
        text-decoration: underline;
    }
`;

export default Home;
