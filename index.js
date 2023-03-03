const core = require('@actions/core');
const {match} = require('./lib');

const pattern = core.getInput('pattern', {trimWhitespace: false});
const input = core.getInput('input', {trimWhitespace: false});

try {
    match(pattern, input)
        .forEach((val, name) => core.setOutput(name, val));
} catch (e) {
    // The only way this should happen is if the pattern is invalid.
    core.setFailed(e.message);
}
