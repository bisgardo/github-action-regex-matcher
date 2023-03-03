const core = require('@actions/core');
const {match} = require('./lib');

const pattern = core.getInput('pattern');
const input = core.getInput('input');

core.setOutput('undeclared', ' bla bla ');
core.setOutput('declared', ' bla bla ');

try {
  match(pattern, input)
      .forEach((val, name) => core.setOutput(name, val));
} catch (e) {
  // The only way this should happen is if the pattern is invalid.
  core.setFailed(e.message);
}
