# EML External Editor

VS Code language support for RFC 5322 `.eml` files — email messages
saved to disk. This was written to use VS Code / Codium together with the
[external-editor-revived](https://github.com/Frederick888/external-editor-revived)
extension for Thunderbird/Betterbird.

## What it does

Adds syntax highlighting that distinguishes:

- Header names (`From:`, `Subject:`, etc.) from header values
- Folded continuation lines in long headers
- Quoted reply lines beginning with `>`
- The signature block, introduced by a `--` marker line

No code execution, no MIME body decoding — just colorization
of the on-disk message text.

## Reflow

Alt-Q (Option-Q on macOS) reflows the paragraph containing the
cursor, wrapping at the column given by `editor.wordWrapColumn`
(default 72). Quote prefixes (`> `, `> > `, etc.) are preserved on
every wrapped line, so the structure of quoted replies survives
reflow. Headers and the signature block (after a `-- ` marker)
are left untouched.

Cmd-/ toggles `> ` on selected lines — useful for converting
plain text into a quoted form when writing a reply by hand.

### If you also have Rewrap installed

Both this extension and Rewrap (or Rewrap Revived) bind Alt-Q,
and VS Code's keybinding resolver doesn't always pick the more
specific `when` clause — so Rewrap's binding can end up winning
on `.eml` files. Symptom: Alt-Q on an `.eml` file does nothing
visible.

The reliable fix is a user-level keybinding override (user
keybindings always win over extension-contributed ones). Open
your user `keybindings.json` via Cmd-K Cmd-S → page icon at the
top right, and add:

```json
{
  "key": "alt+q",
  "command": "eml.reflow",
  "when": "editorTextFocus && editorLangId == eml"
}
```

## Scope

This extension handles single-message `.eml` files only.
Mailbox files (`.mbox`), which concatenate many messages with
`From`-prefixed separator lines, are not supported.

## License

Terms are in the LICENSE.txt file bundled with this extension.
