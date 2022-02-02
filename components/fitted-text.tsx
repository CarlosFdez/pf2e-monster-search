import { css } from "@emotion/react";
import { PropsWithChildren, useRef } from "react"
import { useIsomorphicLayoutEffect } from "react-use";

export default function FittedText(props: PropsWithChildren<{}>) {
    const ref = useRef<HTMLDivElement>(null);

    useIsomorphicLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            const parent = el.parentElement;
            if (!parent) return;

            const ratio = el.clientWidth > 0 ? Math.min(1, parent.clientWidth / el.clientWidth) : 1;
            el.style.transform = `scaleX(${ratio})`;
        });

        observer.observe(el);

        return () => observer.unobserve(el);
    }, [props.children])

    return (
        <div css={Wrapper}>
            <div ref={ref} css={InnerStyle}>{props.children}</div>
        </div>
    );
}

const Wrapper = css`
    display: flex;
    overflow: hidden;
`;

const InnerStyle = css`
    flex: 1;
    transform-origin: left;
    white-space: nowrap;
`;
