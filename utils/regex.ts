// utils/regex.ts

export interface RegexMatchResult {
    matchedText: string;
    index: number;
    groups: string[];
}

export function testRegexPattern(
    pattern: string,
    text: string,
    flags: { global: boolean; ignoreCase: boolean; multiline: boolean }
) {
    if (!pattern) return { error: null, matches: [], highlightedText: text };

    try {
        // Flags 'g', 'gi', 'gim')
        let flagString = '';
        if (flags.global) flagString += 'g';
        if (flags.ignoreCase) flagString += 'i';
        if (flags.multiline) flagString += 'm';

        const regex = new RegExp(pattern, flagString);
        const matches: RegexMatchResult[] = [];

        if (!flags.global) {
            const match = regex.exec(text);
            if (match) {
                matches.push({
                    matchedText: match[0],
                    index: match.index,
                    groups: match.slice(1),
                });
            }
        } else {
            let match;
            const lastIndices: Record<number, boolean> = {};

            while ((match = regex.exec(text)) !== null) {
                if (lastIndices[regex.lastIndex]) {
                    regex.lastIndex++;
                    continue;
                }
                lastIndices[regex.lastIndex] = true;

                matches.push({
                    matchedText: match[0],
                    index: match.index,
                    groups: match.slice(1),
                });

                if (regex.lastIndex === match.index) {
                    regex.lastIndex++;
                }
            }
        }

        return { error: null, matches };
    } catch (err: any) {
        return { error: err.message || 'Invalid Regular Expression', matches: [] };
    }
}
