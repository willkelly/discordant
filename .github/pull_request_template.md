## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Test improvements

## Related Issues

<!-- Link to related issues: Fixes #123, Closes #456 -->

## Changes Made

<!-- List the specific changes you made -->

- Change 1
- Change 2
- Change 3

## Testing

<!-- Describe the tests you ran to verify your changes -->

### Quality Checks

- [ ] `deno task fmt` - Code formatting passes
- [ ] `deno task lint` - Linting passes
- [ ] `deno task check` - Type checking passes
- [ ] `deno task test` - All tests pass
- [ ] `deno task quality` - Full quality suite passes

### Manual Testing

<!-- Describe any manual testing you performed -->

- [ ] Tested in development mode (`deno task dev`)
- [ ] Tested production build (`deno task build`)
- [ ] Tested on multiple browsers (if UI changes)
- [ ] Tested XMPP connectivity (if protocol changes)

## Deno Best Practices

- [ ] All imports include explicit `.ts` extensions
- [ ] Used union types instead of enums
- [ ] No `any` types used
- [ ] Proper type-only exports (`export type`)
- [ ] Web Standards APIs used where applicable
- [ ] JSDoc comments added for public APIs

## Screenshots

<!-- If applicable, add screenshots to demonstrate the changes -->

## Breaking Changes

<!-- Describe any breaking changes and migration path -->

## Additional Notes

<!-- Any additional information that reviewers should know -->

## Checklist

- [ ] My code follows the Deno best practices in CONTRIBUTING.md
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
