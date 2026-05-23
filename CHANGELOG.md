# Change Log

## [0.0.8] – 2026-05-24

- **Marketplace tile icon.** A 256×256 PNG
  rendered from the project's Betterbird SVG
  now appears on the marketplace listing tile,
  in marketplace search results, and in the
  Extensions sidebar next to the entry.

## [0.0.7] – 2026-05-21

- **Reflow preserves leading indentation on
  unquoted paragraphs.** A paragraph indented
  with spaces or tabs (no `>` prefix) now keeps
  its indent on every wrapped output line. Inner
  wrap width is reduced by the indent so the
  rightmost column still respects
  `editor.wordWrapColumn`.

## [0.0.6] – 2026-05-21

- **Reflow now handles selections covering more
  than one paragraph.** Mark several paragraphs
  (including any blank or quote-only lines
  between them) and Alt-Q reflows each paragraph
  independently. Empty quote lines (`> `, `>> `)
  are uniformly treated as paragraph breaks,
  whether between paragraphs or directly under
  the caret. With just a caret on a content line
  the behavior is unchanged from 0.0.5.

## [0.0.5] – 2026-05-21

- **Reflow respects blank quoted lines.** Alt-Q on
  a quoted paragraph now treats quote-only lines
  (`> `, `>> `, etc.) as paragraph boundaries,
  alongside fully blank lines and quote-depth
  changes. Previously a whole `>`-quoted block
  would collapse into one paragraph because the
  empty quote markers were read as content.

## [0.0.4] – 2026-05-17

- **Built-in reflow on Alt-Q (Option-Q on macOS).**
  A new `eml.reflow` command wraps the paragraph
  containing the cursor at the column given by
  `editor.wordWrapColumn` (default 72) and preserves
  any leading quote prefix (`> `, `> > `, etc.) on
  every wrapped line. Headers and the signature
  block (after a `-- ` line) are left untouched.
- **Known conflict with Rewrap on Alt-Q.** When both
  extensions are installed, VS Code's keybinding
  resolver may pick Rewrap's `alt+q` over this
  extension's even though our `when` clause is more
  specific (the resolver's rule is "later registration
  wins among matching bindings", not "more specific
  when-clause wins"). If Alt-Q does nothing visible
  on an `.eml` file, add a user-level keybinding
  override — see the README for the exact entry.

## [0.0.2] – 2026-05-16

- **Quoted lines, signatures and body text now pick up
  theme colors.** In 0.0.1 the grammar's body context
  never entered, so the inner scopes rendered with only
  the outer `text.eml` and no theme color. Fixed by
  flattening the body patterns into the top-level rule
  list.
- **New `language-configuration.json`** declares
  `lineComment` as `"> "`. Cmd-/ toggles the quote
  prefix on selected lines, and Rewrap / Rewrap Revived
  uses the same declaration to reflow `>`-quoted blocks
  on Alt-Q, re-applying the prefix to each wrapped line.

## [0.0.1] – 2026-05-16

Initial release — TextMate grammar for RFC 5322 `.eml`
files. Headers scoped for theming. Quoted-line,
signature and body-text rules were defined but not
applied due to a grammar bug, fixed in 0.0.2.
