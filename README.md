# get-pr-number-action

A GitHub action to provide a consistent approach to get number of a pull request

## Example

```yaml
# This action works only on push and pull_request event
on: [push, pull_request]

jobs:
  get-pr-number:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Get PR number
      id: action
      uses: kamatama41/get-pr-number-action@v0
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
    - name: Show the number
      run: echo "PR number is ${{ steps.action.outputs.number }}"
```

This is a test.
This is a test (2).
This is a test (3).
This is a test (4).
