const vscode = require("vscode");

const ATTRIBUTION_RE = /^On .*\d.*\bwrote:\s*$/;

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("eml.reflow", reflow),
  );
}

function reflow(editor, edit) {
  const doc = editor.document;
  const wrapColumn = vscode.workspace
    .getConfiguration("editor", doc)
    .get("wordWrapColumn", 72);

  const sel = editor.selection;
  let line = sel.start.line;
  const lastLine = sel.end.line;

  while (line <= lastLine) {
    const block = findParagraph(doc, line);
    if (!block) {
      line++;
      continue;
    }
    reflowParagraph(doc, edit, block, wrapColumn);
    line = block.endLine + 1;
  }
}

function reflowParagraph(doc, edit, block, wrapColumn) {
  const { startLine, endLine, prefix, isAttribution } = block;

  // Attribution lines ("On X, Y wrote:") are left
  // intact even if they overshoot the column —
  // splitting them produces less readable output than
  // tolerating the overshoot.
  if (isAttribution) return;

  const stripped = [];
  for (let i = startLine; i <= endLine; i++) {
    const text = doc.lineAt(i).text;
    stripped.push(text.startsWith(prefix) ? text.slice(prefix.length) : text);
  }

  const joined = stripped.join(" ").replace(/\s+/g, " ").trim();
  if (!joined) return;

  const innerWidth = Math.max(wrapColumn - prefix.length, 10);
  const wrapped = hardWrap(joined, innerWidth);
  const result = wrapped.map((piece) => prefix + piece).join("\n");

  edit.replace(
    new vscode.Range(startLine, 0, endLine, doc.lineAt(endLine).text.length),
    result,
  );
}

function detectPrefix(text) {
  // Matches "> ", "> > ", ">> ", "| ", "|| ", and mixed
  // sequences like "| > ". The `|` form is an older
  // Unix-mailer alternate to `>` (mh, some pine setups,
  // archived mailing-list posts). Failing that, a bare
  // leading indent of spaces or tabs — also preserved
  // verbatim on every wrapped line.
  const match = text.match(/^((?:[>|]\s*)+|[ \t]+)/);
  return match ? match[1] : "";
}

function isEmptyQuote(text, prefix) {
  return text.slice(prefix.length).trim() === "";
}

function isAttribution(text) {
  return ATTRIBUTION_RE.test(text);
}

function findParagraph(doc, line) {
  const here = doc.lineAt(line).text;
  if (here.trim() === "") return null;

  // RFC 5322 separates headers from body with the first blank line.
  let bodyStart = 0;
  for (let i = 0; i < doc.lineCount; i++) {
    if (doc.lineAt(i).text === "") {
      bodyStart = i + 1;
      break;
    }
  }
  if (line < bodyStart) return null;

  // Conventional signature marker; leave the block below alone.
  for (let i = bodyStart; i < doc.lineCount; i++) {
    if (doc.lineAt(i).text === "-- ") {
      if (line >= i) return null;
      break;
    }
  }

  const prefix = detectPrefix(here);

  // Quote-only line (e.g. "> "): not part of any paragraph.
  if (isEmptyQuote(here, prefix)) return null;

  // Attribution line ("On X, Y wrote:"): a self-contained
  // one-line paragraph that reflowParagraph will pass
  // through unchanged.
  if (isAttribution(here)) {
    return { startLine: line, endLine: line, prefix, isAttribution: true };
  }

  let startLine = line;
  while (startLine > bodyStart) {
    const prev = doc.lineAt(startLine - 1).text;
    if (prev.trim() === "") break;
    if (detectPrefix(prev) !== prefix) break;
    if (isEmptyQuote(prev, prefix)) break;
    if (isAttribution(prev)) break;
    startLine--;
  }

  let endLine = line;
  while (endLine < doc.lineCount - 1) {
    const next = doc.lineAt(endLine + 1).text;
    if (next.trim() === "") break;
    if (detectPrefix(next) !== prefix) break;
    if (isEmptyQuote(next, prefix)) break;
    if (isAttribution(next)) break;
    endLine++;
  }

  return { startLine, endLine, prefix };
}

function hardWrap(text, width) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  return lines;
}

exports.activate = activate;
