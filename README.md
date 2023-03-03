# `bisgardo/regex`

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
If the group is named, the match is exposed as a field with the group's name as well.

*Notice:* It appears that at some point in the stack, the output values actually get trimmed.
At least, in the example above, the value of output `_0` is `bla bla`, i.e. not surrounded by whitespace
as would be expected for the 0th match group.
