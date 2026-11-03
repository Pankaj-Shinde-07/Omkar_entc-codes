const files = [
  { path: 'micro_keil/7 segment/main.c', group: 'micro', language: 'C', label: '7 segment display' },
  { path: 'micro_keil/8 bit dac/sine wave/main.c', group: 'micro', language: 'C', label: 'Sine wave' },
  { path: 'micro_keil/8 bit dac/square wave/main.c', group: 'micro', language: 'C', label: 'Square wave' },
  { path: 'micro_keil/8 bit dac/triangular wave/main.c', group: 'micro', language: 'C', label: 'Triangular wave' },
  { path: 'micro_keil/dc motor/DC_Motor.c', group: 'micro', language: 'C', label: 'DC motor' },
  { path: 'micro_keil/led/LED_test.c', group: 'micro', language: 'C', label: 'LED test' },
  { path: 'micro_keil/relay buzz/main.c', group: 'micro', language: 'C', label: 'Relay buzzer' },
  { path: 'micro_keil/stepper/Stepper.c', group: 'micro', language: 'C', label: 'Stepper motor' },
  { path: 'micro_keil/EXTERNAL  dx.txt', group: 'micro', language: 'Notes', label: 'External interrupt notes' },
  { path: 'micro_keil/INTER d.txt', group: 'micro', language: 'Notes', label: 'Internal interrupt notes' },
  { path: 'vlsi/ALU 4 bit/test.txt', group: 'vlsi', language: 'Verilog', label: '4-bit ALU · testbench' },
  { path: 'vlsi/ALU 4 bit/verl.txt', group: 'vlsi', language: 'Verilog', label: 'ALU folder · verl.txt' },
  { path: 'vlsi/full adder/test.txt', group: 'vlsi', language: 'Verilog', label: 'Full adder · testbench' },
  { path: 'vlsi/full adder/verlog.txt', group: 'vlsi', language: 'Verilog', label: 'Full adder · design' },
  { path: 'vlsi/jk ff/test.txt', group: 'vlsi', language: 'Verilog', label: 'JK flip-flop · testbench' },
  { path: 'vlsi/jk ff/ver.txt', group: 'vlsi', language: 'Verilog', label: 'JK flip-flop · design' },
  { path: 'vlsi/johnson_counter/test.txt', group: 'vlsi', language: 'Verilog', label: 'Johnson counter · testbench' },
  { path: 'vlsi/johnson_counter/ver.txt', group: 'vlsi', language: 'Verilog', label: 'Johnson counter · design' },
  { path: 'vlsi/mux_4to1/Testbench.txt', group: 'vlsi', language: 'Verilog', label: '4-to-1 mux · testbench' },
  { path: 'vlsi/mux_4to1/verlog.txt', group: 'vlsi', language: 'Verilog', label: '4-to-1 mux · design' },
  { path: 'vlsi/t ff/test.txt', group: 'vlsi', language: 'Verilog', label: 'T flip-flop · testbench' },
  { path: 'vlsi/t ff/ver.txt', group: 'vlsi', language: 'Verilog', label: 'T flip-flop · design' },
  { path: 'vlsi/up down counter/test.txt', group: 'vlsi', language: 'Verilog', label: 'Up/down counter · testbench' },
  { path: 'vlsi/up down counter/ver.txt', group: 'vlsi', language: 'Verilog', label: 'Up/down counter · design' },
];

const list = document.querySelector('#file-list');
const search = document.querySelector('#search');
const resultCount = document.querySelector('#result-count');
const breadcrumbs = document.querySelector('#breadcrumbs');
const selectedName = document.querySelector('#selected-name');
const fileKind = document.querySelector('#file-kind');
const badge = document.querySelector('#language-badge');
const sourceLink = document.querySelector('#source-link');
const copyButton = document.querySelector('#copy-button');
const codeWrap = document.querySelector('#code-wrap');
const codeView = document.querySelector('#code-view');
const codeContent = document.querySelector('#code-content');
const codeMessage = document.querySelector('#code-message');
const lineCount = document.querySelector('#line-count');
const toast = document.querySelector('#toast');
let activeFilter = 'all';
let activeFile = null;
let currentText = '';
let toastTimer;

const syntax = {
  C: {
    keywords: new Set(['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extern', 'for', 'goto', 'if', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while']),
    types: new Set(['int', 'float', 'double', 'sfr', 'sbit', 'bit', 'code', 'data', 'idata', 'xdata', 'pdata']),
  },
  Verilog: {
    keywords: new Set(['always', 'and', 'assign', 'begin', 'buf', 'case', 'casex', 'casez', 'deassign', 'default', 'disable', 'else', 'end', 'endcase', 'endfunction', 'endmodule', 'endtask', 'for', 'forever', 'fork', 'function', 'if', 'initial', 'join', 'negedge', 'or', 'parameter', 'posedge', 'repeat', 'release', 'repeat', 'reg', 'signed', 'task', 'time', 'wait', 'while', 'wire']),
    types: new Set(['input', 'output', 'inout', 'integer', 'logic', 'localparam', 'real', 'realtime', 'tri', 'tri0', 'tri1', 'wand', 'wor']),
  },
};

function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function visibleFiles() {
  const query = search.value.trim().toLowerCase();
  return files.filter((file) => {
    const matchesGroup = activeFilter === 'all' || file.group === activeFilter;
    const matchesSearch = !query || `${file.path} ${file.label} ${file.language}`.toLowerCase().includes(query);
    return matchesGroup && matchesSearch;
  });
}

function updateCounts() {
  document.querySelector('[data-stat="files"]').textContent = String(files.length).padStart(2, '0');
  document.querySelectorAll('.filter-button').forEach((button) => {
    const count = button.dataset.filter === 'all'
      ? files.length
      : files.filter((file) => file.group === button.dataset.filter).length;
    button.lastElementChild.textContent = String(count);
  });
}

function renderList() {
  const matches = visibleFiles();
  list.replaceChildren();
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? 'file' : 'files'}`;

  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-results';
    empty.textContent = 'No files match that search. Try a different name or collection.';
    list.append(empty);
    return;
  }

  for (const file of matches) {
    const row = document.createElement('button');
    row.className = `file-row${file.path === activeFile?.path ? ' is-selected' : ''}`;
    row.type = 'button';
    row.setAttribute('role', 'option');
    row.setAttribute('aria-selected', String(file.path === activeFile?.path));
    row.dataset.group = file.group;

    const icon = document.createElement('span');
    icon.className = 'file-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = file.group === 'micro' ? (file.language === 'C' ? 'C' : 'TXT') : 'V';

    const copy = document.createElement('span');
    copy.className = 'file-row-copy';
    const name = document.createElement('span');
    name.className = 'file-row-name';
    name.textContent = file.label;
    const path = document.createElement('span');
    path.className = 'file-row-path';
    path.textContent = file.path;
    copy.append(name, path);

    const ext = document.createElement('span');
    ext.className = 'file-ext';
    ext.textContent = file.path.split('.').at(-1).toUpperCase();
    row.append(icon, copy, ext);
    row.addEventListener('click', () => openFile(file));
    list.append(row);
  }
}

function setMessage(message, kind = '') {
  codeView.hidden = true;
  codeMessage.hidden = false;
  codeMessage.className = `code-message${kind ? ` is-${kind}` : ''}`;
  codeMessage.textContent = message;
  lineCount.textContent = 'READY';
  copyButton.disabled = true;
}

function addToken(parent, text, kind = '') {
  if (!text) return;
  if (!kind) {
    parent.append(document.createTextNode(text));
    return;
  }
  const token = document.createElement('span');
  token.className = `token-${kind}`;
  token.textContent = text;
  parent.append(token);
}

function highlightLine(target, line, language, state) {
  const rules = syntax[language];
  if (!rules) {
    target.textContent = line || ' ';
    return;
  }

  let index = 0;
  let plain = '';
  const flushPlain = () => {
    addToken(target, plain);
    plain = '';
  };
  const addTyped = (value, kind) => {
    flushPlain();
    addToken(target, value, kind);
    index += value.length;
  };

  while (index < line.length) {
    const rest = line.slice(index);

    if (state.inBlockComment) {
      const end = rest.indexOf('*/');
      if (end === -1) {
        addTyped(rest, 'comment');
        break;
      }
      addTyped(rest.slice(0, end + 2), 'comment');
      state.inBlockComment = false;
      continue;
    }

    if (rest.startsWith('//')) {
      addTyped(rest, 'comment');
      break;
    }
    if (rest.startsWith('/*')) {
      state.inBlockComment = true;
      continue;
    }

    const first = line[index];
    if (first === '"' || first === "'") {
      let end = index + 1;
      while (end < line.length) {
        if (line[end] === '\\') { end += 2; continue; }
        if (line[end] === first) { end += 1; break; }
        end += 1;
      }
      addTyped(line.slice(index, end), 'string');
      continue;
    }

    if (first === '#' && language === 'C') {
      const directive = rest.match(/^#[A-Za-z_]\w*/);
      if (directive) { addTyped(directive[0], 'preprocessor'); continue; }
    }

    const numeric = rest.match(language === 'Verilog'
      ? /^(?:\d+'[sS]?[bBoOdDhH][0-9a-fA-F_xXzZ?]+|\d+(?:\.\d+)?)/
      : /^(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?:[uUlLfF]+)?/);
    if (numeric) { addTyped(numeric[0], 'number'); continue; }

    if (language === 'Verilog' && first === '`') {
      const macro = rest.match(/^`[A-Za-z_]\w*/);
      if (macro) { addTyped(macro[0], 'preprocessor'); continue; }
    }

    const identifier = rest.match(/^[A-Za-z_$][\w$]*/);
    if (identifier) {
      const word = identifier[0];
      const kind = rules.keywords.has(word) ? 'keyword' : rules.types.has(word) ? 'type' : '';
      if (kind) { addTyped(word, kind); continue; }
      plain += word;
      index += word.length;
      continue;
    }

    plain += first;
    index += 1;
  }

  flushPlain();
  if (line.length === 0) addToken(target, ' ');
}

function drawCode(text, language) {
  codeContent.replaceChildren();
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const fragment = document.createDocumentFragment();
  const state = { inBlockComment: false };
  lines.forEach((line, index) => {
    const row = document.createElement('span');
    row.className = 'code-line';
    const number = document.createElement('span');
    number.className = 'line-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(3, '0');
    const value = document.createElement('span');
    value.className = 'line-text';
    highlightLine(value, line, language, state);
    row.append(number, value);
    fragment.append(row);
  });
  codeContent.append(fragment);
  codeMessage.hidden = true;
  codeView.hidden = false;
  lineCount.textContent = `${lines.length} ${lines.length === 1 ? 'LINE' : 'LINES'}`;
  copyButton.disabled = text.length === 0;
}

async function openFile(file) {
  activeFile = file;
  currentText = '';
  renderList();
  breadcrumbs.replaceChildren();
  file.path.split('/').forEach((part, index, parts) => {
    if (index > 0) {
      const separator = document.createElement('span');
      separator.className = 'crumb-separator';
      separator.textContent = '/';
      breadcrumbs.append(separator);
    }
    const crumb = document.createElement(index === parts.length - 1 ? 'strong' : 'span');
    crumb.textContent = part;
    breadcrumbs.append(crumb);
  });
  selectedName.textContent = file.label;
  fileKind.textContent = file.group === 'micro' ? 'MICROCONTROLLER / KEIL' : 'DIGITAL LOGIC / VLSI';
  badge.textContent = file.language;
  badge.dataset.language = file.language;
  sourceLink.href = `https://github.com/Pankaj-Shinde-07/Omkar_entc-codes/blob/main/${encodePath(file.path)}`;
  sourceLink.setAttribute('aria-label', `Open ${file.path} on GitHub`);
  setMessage('Loading source…');
  codeWrap.scrollTop = 0;

  try {
    const response = await fetch(encodePath(file.path));
    if (!response.ok) throw new Error(`Source request failed (${response.status})`);
    currentText = await response.text();
    if (activeFile?.path !== file.path) return;
    if (currentText.length === 0) {
      setMessage('This file is empty in the uploaded archive.', 'empty');
    } else {
      drawCode(currentText, file.language);
    }
  } catch (error) {
    if (activeFile?.path !== file.path) return;
    setMessage(`Could not load this file. Open it directly on GitHub. (${error.message})`, 'error');
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

search.addEventListener('input', renderList);
document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderList();
  });
});

copyButton.addEventListener('click', async () => {
  if (!activeFile || currentText.length === 0) return;
  try {
    await navigator.clipboard.writeText(currentText);
    showToast('Source copied to clipboard');
  } catch {
    showToast('Clipboard access is unavailable in this browser');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === 'Escape' && document.activeElement === search) {
    search.value = '';
    renderList();
    search.blur();
  }
});

renderList();
updateCounts();
openFile(files[0]);
