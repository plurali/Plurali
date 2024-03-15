# Plurali

- Production: https://plurali.icu
- [Data Transparency](DATA.md)

## Contributors

Plurali is developed as a non-profit application in it's maintainers' free time - therefore we ask for patience for new features to be implemented or bugs to be fixed. We appreciate every issue report. PRs are welcomed, as long as they are structured and discussed with maintainer(s) beforehand (eg. in an issue, on Discord or via other communication channels).

Currently, Plurali is overseen and maintained by it's creator, Liliana (@lilianalillyy). If you're interested in joining the maintainer team, write an email to `pilchova@lilianaa.dev`.

We would also love to recognize some of it's users who frequently contribute to Plurali's development, eg. testing new features, reporting bugs or coming up with ideas for new features or improving the existing ones: 
- **SeraphimValley** - Reporting of bugs brainstorming fixes + ideas for improving/implementing new/exsting features   

## Reporting issues

We welcome issue reports, however to make sure we can efficiently fix the issue you're experiencing we need details about how to get to the issue at hand.

- Please provide steps to reproduce, for example: `in dashboard click to user settings -> click on update settings -> page crashes`
- If this is a per-user bug, provide us with the Simply Plural ID or your User ID. If you don't want this information shared publicly, create the issue without it and contact `liliana1110` on Discord or email `pilchova@lilianaa.dev`.

## Self-hosting

Self-hosting Plurali, at least at the moment, is not officially supported. It is planned, however not a priority at the moment.

There are hacks to be done in the codebase in order to get Plurali to work, for example currently things like the API base URL, CDN URL, CSP, etc.. are hardcoded. One would have to rewrite those manually in order to get their own instance working. Additionally, Plurali's codebase - in it's current state - does not follow semver or any other versioning convention. This means that major changes and restructuring may occur from commit to commit, as there are many things planned and in development, such as the full rewrite of the frontend to React. Issues may be encountered modified Plurali instances when rebasing to newer revisions from the repository.

**TL;DR**: In Plurali's current state, unless you 100% know what you're doing I don't recommend self-hosting. The codebase is not accustomed to it, dirty hacks are required and issues may arise. 
**You won't be provided with support in self-hosted instances unless you can reproduce the issue on the official instance - https://plurali.icu**.

## Codebase structure

The codebase is structured in a monorepo. Common packages, like the API client or utilities are in the `packages` directory. Full applications, eg the frontend (and it's `v2` version) are in the `apps` directory. The backend itself is the root project.


| Package                           |               Description                |
| :-------------------------------- | :--------------------------------------: |
| - root -                          |             The backend API              |
|                                   |                                          |
| [frontend](apps/frontend)         |         Vue 3 frontend (current)         |
| [frontend-v2](apps/frontend-v2)   |      React rewrite of the frontend       |
|                                   |                                          |
| [api-client](packages/api-client) |     Client for the backend REST API      |
| [plural-api](packages/plural-api) |         Simply Plural API client         |
| [editor](packages/editor)         | Text Editor configuration and utilities* |
| [sanitizer](packages/sanitizer)   |       Sanitizer of HTML content**        |
| [common](packages/common)         |             Common utilities             |

*The plan is to migrate away from TinyMCE and create a better rich text editor, however for the sake of ensuring the current
content created by Plurali users is migrated correctly, the bin/collect-html-tags.ts util parses all current content and creates a list of all currently used
HTML tags that TinyMCE created. This util is not meant to invade user's privacy and it will never purposefully expose any personal data. 
As per Plurali's commitment for transparency, it's source code is disclosed.

**Based on the Sanitizer polyfill by Mozilla: https://github.com/mozilla/sanitizer-polyfill
