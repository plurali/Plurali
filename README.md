# Plurali

- Production: https://plurali.icu
- [Data Transparency](DATA.md)

## We're between fronts ∞

For years, Simply Plural quietly kept this place running. Now it’s closing its doors, and the Plurali you knew steps back with a fond farewell, going dark alongside it.

I believe I speak for most systems when I say: thank you. For every front entry, every reminder, and every member given a name; and to the people behind it, who carried this with care, for years, because it mattered. It did, and it still does.

### Nothing you’ve built is disappearing 💜

Completely new Plurali is coming, and it holds it all in one place: the fronting tracker and everything you had in Simply Plural, and with even better Plurali profiles on top of it. 

A little more room for everyone.

> 🚧 **The new Plurali is in closed-source development** until it's public beta release.

### Contribute to the development 🫂

Plurali is maintained as a non-profit application. Originally developed by its creator, Mia (a.k.a. Liliana - @lilianalillyy), Plurali is now brewed in the liliana.digital labs.

We're always looking for people who are willing to contribute to the development of Plurali - and you don't need to be a tech wizard to do so. We appreciate help with testing, design, people who give us feedback, any suggestions for new features. If you're interested, shoot a mail to `hello@liliana.digital` - we can figure something out!

### Your data is safe 🧷

Plurali still holds a little - the public profile pages and your custom descriptions. 

For details on what we store and why, see our [data transparency note](DATA.md). Former users can request a copy or removal of their data any time at `hello@liliana.digital`.

## Reporting issues

We welcome issue reports, however to make sure we can efficiently fix the issue you're experiencing we need details about how to get to the issue at hand.

- Please provide steps to reproduce, for example: `in dashboard click to user settings -> click on update settings -> page crashes`
- If this is a per-user bug, provide us with your User ID. If you don't want this information shared publicly, create the issue without it and contact us at `hello@liliana.digital`

We would also love to recognize some of Plurali's users who frequently contribute to its development:
- **SeraphimValley** - Reporting of bugs, brainstorming fixes, and ideas for improving/implementing new features

## Self-hosting

Self-hosting Plurali is not officially supported at this time. There probably is no sane reason to do so, as Simply Plural has shut down. 

## Codebase structure

The codebase is structured in a monorepo. Common packages, like the API client or utilities are in the `packages` directory. Full applications, eg the frontend (and its `v2` version) are in the `apps` directory. The backend itself is at the root of this project.

| Package                           |               Description                |
| :-------------------------------- | :--------------------------------------: |
| - root -                          |             The backend API              |
|                                   |
| [frontend](apps/frontend)         |         Vue 3 frontend (current)         |
| [frontend-v2](apps/frontend-v2)   |      React rewrite of the frontend       |
|                                   |
| [api-client](packages/api-client) |     Client for the backend REST API      |
| [editor](packages/editor)         | Text Editor configuration and utilities* |
| [sanitizer](packages/sanitizer)   |       Sanitizer of HTML content**        |
| [common](packages/common)         |             Common utilities             |

*The plan was to migrate away from TinyMCE and create a better rich text editor. For the sake of ensuring the current content created by Plurali users would've been migrated correctly, the bin/collect-html-tags.ts util parsed all current content and created a list of all currently used HTML tags that TinyMCE created. This util was not developed in any way to invade user's privacy and it does not expose any personal data - the only output is a list of tags (p, h1, h2, h3, img, ...), there's no text or rendering of the content. As per Plurali's commitment for transparency, its source code is disclosed.

**Based on the Sanitizer polyfill by Mozilla: https://github.com/mozilla/sanitizer-polyfill
