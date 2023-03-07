# `bisgardo/regex-parse`

GitHub action for matching an input string against a regular expression pattern and extracting named groups.

The output fields are dynamically determined by the pattern and whether it matches the inputs:

- No outputs are emitted if the pattern is not matched.
- If the pattern is matched but doesn't include a given group, then the output for the given group is the empty string.

## Example

The following workflow snippet defines a single job `my_job` which simply runs the action to trim a fixed string.
A subsequent step prints all the output values to illustrate how the extracted group matches are accessed.

```yaml
jobs:
  my_job:
    runs-on: ubuntu-latest
    steps:
    - uses: bisgardo/regex@v1
      id: my_step
      with:
        pattern: '^\s*(?<trimmed>.*?)\s*$'
        input: ' bla bla '
    - run: |
        echo "0: '${{steps.my_step.outputs._0}}'"
        echo "1: '${{steps.my_step.outputs._1}}'"
        echo "trimmed: ${{steps.my_step.outputs.trimmed}}'"
```

If the string matches, the groups are exposed in the step's output as fields numbered by the group index prefixed by `_`.
If the group is [named](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences#using_named_groups),
the match is exposed as a field with the group's name as well.

If a group is named `_<n>` where `<n>` is a number and there is a group number `<n>`,
then the output field will contain the value captured by the named group.
