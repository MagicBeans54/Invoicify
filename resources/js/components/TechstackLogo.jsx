import { cn } from '@/lib/utils';

/**
 * Techstacks brand mark in mint green.
 *
 * Official artwork fetched from https://github.com/dreamerrri/techstacks
 * (public/favicon.svg). The upstream fill is #00c896; it is normalized here
 * to the app theme's signature mint (#24D6AE, `--primary`).
 *
 * Rendered inline (rather than <img>) so the mark uses `currentColor` and
 * tracks the theme, and stays crisp at any size. A standalone file copy
 * lives at public/images/techstack_logo.svg (used for the favicon).
 */
function TechstackGlyph({ className }) {
    return (
        <svg
            viewBox="0 0 1813 1441"
            aria-hidden="true"
            className={className}
            fill="currentColor"
        >
            <path
                d="M0 720.5 710.6 9.9v417.8L417.8 720.5l292.8 292.8v417.8zm1813 0-719.7 719.8v-417.9l301.9-301.9-301.9-301.9V.8z"
                fillRule="evenodd"
            />
            <path
                d="M1266.4 674.9h-209.8l-59 451H806.3l-59-451H546.6L697 524.6h419z"
                fillRule="evenodd"
            />
        </svg>
    );
}

export function TechstackMark({ className }) {
    return (
        <span role="img" aria-label="Techstacks" className={cn('inline-flex shrink-0 text-primary', className)}>
            <TechstackGlyph className="size-full" />
        </span>
    );
}

export default TechstackMark;
