# `bisgardo/github-action-regex-parse`

GitHub action for matching an input string against a regular expression pattern and extracting named groups.

*Inputs:*

- `pattern`: The regular expression pattern to match against.
- `input`: The string to match against the pattern.

*Outputs:*

The output fields are dynamically determined by the pattern and whether the input matches it:

- No outputs are emitted if the pattern is not matched.
- If the input matches the pattern, then there is one output for each of the matched groups, including named groups.
  If the match doesn't include a given group, then the output for that group is the empty string.

The capture of the `<n>`th group is written to output field `_<n>`.
This includes group 0 which consists of the entre match and which may be used to determine if the pattern was matched at all.

If the group is [named](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences#using_named_groups),
then the capture is additionally output in an output field of the same name.

For example, the pattern `(a)(?<x>b)(c)(?<y>d)` matched against the string `abcd` results in the following output fields:

- `_0` with contents `abcd`
- `_1` with contents `a`
- `_2` and `x` with contents `b`
- `_3` with contents `c`
- `_4` and `y` with contents `d`

Matches are performed using the regular expression engine from the JavaScript standard library.

## Example workflow

The following workflow snippet defines a single job `my_job` which simply runs the action to trim a fixed string.

A subsequent step prints all the output values to illustrate how the extracted group matches are accessed.

An additional job `my_dependent_job` is defined to illustrate how to access the outputs from other jobs
that `needs` the one containing the action.

The example uses the `ubuntu-latest` runner, but the action works on any type of machine.

```yaml
...
jobs:
  my_job:
    runs-on: ubuntu-latest
    outputs:
      blahblah-trimmed: "${{steps.my_step.outputs.trimmed}}"
    steps:
    - uses: bisgardo/github-action-regex-parse@v1
      id: my_step
      with:
        pattern: '^\s*(?<trimmed>.*?)\s*$'
        input: ' blah blah '
    - run: |
        echo "0: '${{steps.my_step.outputs._0}}'"             # "0: ' blah blah '"
        echo "1: '${{steps.my_step.outputs._1}}'"             # "1: 'blah blah'"
        echo "trimmed: '${{steps.my_step.outputs.trimmed}}'"  # "trimmed: 'blah blah'"

  my_dependent_job:
    runs-on: ubuntu-latest
    needs: my_job
    steps:
      - run: |
        echo "trimmed: '${{needs.my_job.outputs.blahblah-trimmed}}'"  # "trimmed: 'blah blah'"
```

The captured groups are available in subsequent steps of the job `my_job` as the template variables

* `_0`: `${{steps.my_step.outputs._0}}`
* `_1`: `${{steps.my_step.outputs._1}}`
* `trimmed`: `${{steps.my_step.outputs.trimmed}}`

Since we declared the [`output`](https://docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs) block in `my_job`,
one of the variables (`trimmed`) is also exposed (as `blahblah-trimmed`) to the dependent job `my_dependent_job`:

* `blahblah-trimmed`: `${{needs.my_job.outputs.blahblah-trimmed}}`

You can also make the workflow fail based on the (lack of) match by adding a conditional step like

```yaml
- name: Fail if non-empty input did not match pattern
  if: "steps.my_step.outputs._0 == ''"
  run: exit 1
```
