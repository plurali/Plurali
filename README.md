# Plurali

- Production: https://plurali.icu
- [Data Transparency](DATA.md)

# Project structure

| Package                              |               Description                |
| :----------------------------------- | :--------------------------------------: |
| - root -                             |             The backend API              |
| [frontend](frontend)                 |         Vue 3 frontend (current)         |
| [frontend-v2](frontend-v2)           |      React rewrite of the frontend       |
| [account-deletion](account-deletion) |     Script for user account deletion     |
| [slate](slate)                       | Slate Editor configuration and utilities* |
| [sanitizer](sanitizer)               |       Sanitizer of HTML content**        |

*The plan is to migrate away from TinyMCE and create a better rich text editor, however for the sake of ensuring the current
content created by Plurali users is migrated correctly, the bin/html-tags.ts util parses all current content and creates a list of all currently used
HTML tags that TinyMCE created. This util is not meant to invade user's privacy and it will never purposefully expose any personal data. 
As per Plurali's commitment for transparency, it's source code is disclosed.

**Based on the Sanitizer polyfill by Mozilla: https://github.com/mozilla/sanitizer-polyfill