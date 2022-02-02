import { DataRow } from "../pages/api/data";
import { css } from "@emotion/react";
import FittedText from "./fitted-text";
import React from "react";

interface MonsterTableProps {
    data: DataRow[];
    selected?: string;
    onSelect: (id: string) => void;
}

export default function MonsterTable(props: MonsterTableProps) {
    const { data, selected, onSelect } = props;

    return (
        <div
            css={MonsterTableStyle}
            onClick={(evt) => {
                const newSelection = (evt.target as HTMLElement).closest("tr")?.dataset.id;
                if (!newSelection) return;
                onSelect(newSelection);
            }}
        >
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="level">Level</th>
                        <th>Source</th>
                        <th>Regions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((data) =>
                        <RowMemo
                            key={data.id}
                            row={data}
                            selected={data.id === selected}
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Row(props: { row: DataRow; selected?: boolean }) {
    const { row, selected } = props;
    return (
      <tr className={selected ? "selected" : ""} data-id={row.id}>
        <td className="name"><FittedText>{row.name}</FittedText></td>
        <td className="level">{row.level}</td>
        <td className="source"><FittedText>{row.source}</FittedText></td>
        <td className="region">{row.regions.join(", ")}</td>
      </tr>
    )
}
const RowMemo = React.memo(Row);

const MonsterTableStyle = css`
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 20px;
    flex: 1;

    table {
        border-collapse: collapse;
        width: 100%;
    }

    thead th {
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 1;
    }

    tbody tr {
        cursor: pointer;
    }

    td, th {
        text-align: left;
        padding: 0 4px;
    }

    td {
        font-size: 0.9em;
    }

    td.name, td.source {
        max-width: 200px;
        display: flex;
        overflow: hidden;
        & > div {
            flex: 1;
        }
    }

    .level {
        text-align: end;
    }

    td.region {
        min-width: 200px;
    }

    .selected {
        background-color: #0044CC;
        color: white;
    }
`;
