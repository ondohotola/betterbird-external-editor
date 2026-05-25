# Change Log

## [0.0.11] – 2026-05-25

- **Auto-wrap as you type (default on).** Text typed
  in a body paragraph now wraps at
  `editor.wordWrapColumn` (default 72) on the
  keystroke that pushes the line past the column.
  The break is the latest whitespace at or before
  the column; any quote prefix (`>`, `|`) or bare
  indent on the line is re-applied to the wrapped
  continuation. Headers, the signature block,
  attribution lines, and empty quote lines are
  skipped — same exclusions Alt-Q already honors.
  Pastes are not auto-wrapped; only single-character
  typed inserts trigger the behavior. Disable
  globally or per-folder via the new
  `eml.autoWrap.enabled` setting.
- **Signature marker is now a hard paragraph
  boundary.** Alt-Q on a body paragraph that sits
  directly above `-- ` (no blank line between)
  previously consumed the signature block into the
  paragraph and rewrapped it. The walker now treats
  the bare `-- ` line as a stop condition in its
  own right, so the signature stays intact whether
  or not a blank line separates it from the body.

## [0.0.10] – 2026-05-24

- **Attribution lines stay intact.** A line
  matching `On <date>, <name> wrote:` — the
  conventional reply attribution — is now
  treated as a self-contained paragraph and
  left unchanged by Alt-Q, even if it
  overshoots `editor.wordWrapColumn`.
  Previously Alt-Q rewrapped such a line,
  scattering the sender's name, date, and email
  address across two or three short lines.
- **`|` recognized as quote prefix.** Lines
  starting with `|` (an older Unix-mailer
  alternate to `>` used by mh, some pine
  configurations, and archived mailing-list
  posts) now reflow with the `|` prefix
  preserved on every wrapped line. Mixed
  prefixes like `| >` are recognized too.

## [0.0.9] – 2026-05-24

- **Tile icon updated.** A different image now
  appears on the marketplace listing tile, in
  marketplace search results, and in the
  Extensions sidebar next to the entry.

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
