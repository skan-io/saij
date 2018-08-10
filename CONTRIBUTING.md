# Contributing to Saij

Thanks for your interest in contributing to Saij ML and AI Engine.


## Submitting Bug Reports

Please use the [GitHub issue tracker](https://github.com/skan-io/saij/issues). Before creating a new issue, do a quick search to see if the problem has been reported already.


## Contributing Code

Follow the Angular commit message guidelines when committing code, or use the provided `npm run git` command to run [_commitizen_](https://github.com/commitizen/cz-cli) commits.

Make sure that your pull request follows our pull request guidelines below before submitting it.

Please also follow code style, use the linter provided to help with styling.  All code must pass 100% test coverage and cover all use cases before merge.


## Contributor License Agreement

Your contribution will be under our [license](./LICENSE) as per [GitHub's terms of service](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license).


## Pull request guidelines

Before working on a pull request, create an issue explaining what you want to contribute. This ensures that your pull request won't go unnoticed, and that you are not contributing something that is not suitable for the project. The pull request description should reference the original issue.

Your pull request must:

    - Follow Saij's coding style.

    - Pass the integration tests run automatically by the Travis Continuous
   Integration system.

    - Address a single issue or add a single item of functionality.

    - Use clear commit messages in Angular standard.

    - Be possible to merge automatically.


### Address a single issue or add a single item of functionality

Please submit separate pull requests for separate issues.  This allows each to
be reviewed on its own merits.


### Use clear commit messages

Commit messages should be short, and appropriately typed and scoped. We follow
[Angular Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
for the formatting of commit messages.

> NOTE: that general changes should be typed as **chore**, minor/major changes should be typed as **feat**.

Git commit message should look like:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Please keep the type, scope and subject line short, no more than 50 characters.
