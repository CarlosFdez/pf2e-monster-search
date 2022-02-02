import { css } from "@emotion/react";
import FittedText from "./fitted-text";
import { Monster } from "../pages/api/data";

export default function MonsterInfo(props: { monster?: Monster }) {
    const { monster } = props;
    if (!monster) return <MonsterEmpty/>;
    return (
        <div css={MonsterInfoStyle}>
            <header>
                <h1><FittedText>{monster.name}</FittedText></h1>
                <h1 className="level">Level {monster.level}</h1>
            </header>
            <div css={TraitsListStyle}>
                {monster.traits.map(trait => <span key={trait}>{trait}</span>)}
            </div>
            <div dangerouslySetInnerHTML={{ __html: monster.notes}}/>
        </div>
    )
}

function MonsterEmpty() {
    return (
        <div css={MonsterEmptyStyle}>
            No Monster selected, click one to view its description
        </div>
    );
}

const MonsterInfoStyle = css`
    width: 550px;
    overflow-y: auto;
    padding: 5px;

    header {
        display: flex;
        justify-content: space-between;
    }

    h1 {
        font-size: 1.75em;
    }

    .level {
        white-space: nowrap;
    }
`;

const MonsterEmptyStyle = css`
    width: 550px;
`;

const TraitsListStyle = css`
    display: flex;

    span {
        padding: 0 5px;
        color: white;
        background-color: #522e2c;
        border-color: #d8c483;
        border-width: 2px;
        border-style: double;
    }
`;
