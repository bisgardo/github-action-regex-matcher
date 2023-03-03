function match(pattern, input) {
    const match = input.match(pattern);
    const res = new Map();
    if (match) {
        // Not using 'Object.entries' for 'match' as that includes the non-array elements.
        let idx = 0;
        for (const m of match) {
            res.set(`${idx++}`, m || ''); // TODO need to prepend '_' to make the output key valid?
        }
        Object.entries(match.groups || {})
            .forEach(([name, val]) => res.set(name, val || ''));
    }
    return res;
}

module.exports = { match };
