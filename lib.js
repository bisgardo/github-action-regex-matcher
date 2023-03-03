const core = require("@actions/core");
const unmatchedGroupVal = '';

function match(pattern, input) {
    const match = input.match(pattern);
    const res = new Map();
    if (match) {
        // Not using 'Object.entries' for 'match' as that includes the non-array elements.
        let idx = 0;
        for (const m of match) {
            core.info(`match idx='${idx}' val='${m}'`);
            res.set(`_${idx++}`, m || unmatchedGroupVal);
        }
        Object.entries(match.groups || {})
            .forEach(([name, val]) => {
                core.info(`match name='${name}' val='${val}'`);
                res.set(name, val || unmatchedGroupVal);
            });
    }
    return res;
}

module.exports = {match};
