const number = new Intl.NumberFormat('pt-BR');
const CATEGORY_COLORS = {
  Imagens: '#f2b36b', Documentos: '#dbe2e4', Vídeos: '#f39c97', Videos: '#f39c97',
  Áudio: '#7cc3c3', Audio: '#7cc3c3', Musicas: '#7cc3c3', Músicas: '#7cc3c3',
  Compactados: '#f8d6a2', Instaladores: '#c08a62', Planilhas: '#bfdc5a',
  Codigo: '#c6d5cf', Código: '#c6d5cf', Outros: '#f2f0e8', Arquivo: '#a7b9c5',
};
const FALLBACK_COLORS = ['#f2b36b', '#dbe2e4', '#f39c97', '#7cc3c3', '#f8d6a2', '#c08a62', '#bfdc5a', '#f2f0e8'];
const state = {
  target: '~/Downloads',
  plan: [],
  scanData: null,
  result: null,
  groups: [],
  scanned: false,
  scanning: false,
  applying: false,
  applied: false,
  previewMode: 'after',
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const esc = (text) => String(text ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function fmtSize(bytes = 0) {
  const size = Number(bytes) || 0;
  if (size >= 1024 ** 3) return `${(size / 1024 ** 3).toFixed(1).replace('.', ',')} GB`;
  if (size >= 1024 ** 2) return `${(size / 1024 ** 2).toFixed(0)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${number.format(size)} B`;
}

function folderName(path) {
  return String(path || '').replace(/[\\/]+$/, '').split(/[\\/]/).filter(Boolean).pop() || path || 'Pasta';
}

function setTarget(path, shortcut = null) {
  if (!path) return;
  state.target = path;
  $('#targetPath').value = path;
  $('#folderName').textContent = folderName(path);
  $('#pickError').textContent = '';
  $$('#folderChips [data-shortcut]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.shortcut === shortcut));
  });
  state.plan = [];
  state.groups = [];
  state.scanData = null;
  state.result = null;
  state.scanned = false;
  state.applied = false;
  $('#toMap').disabled = true;
}

function setStage(step, complete = false) {
  document.body.dataset.stage = String(step);
  $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.id === `step${step}`));
  $$('.flow-stepper [data-step]').forEach((button) => {
    const index = Number(button.dataset.step);
    button.classList.toggle('active', !complete && index === step);
    button.classList.toggle('done', complete || index < step);
    if (complete) button.setAttribute('aria-current', 'false');
    else if (index === step) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

async function goStep(step) {
  if (step < 1 || step > 5) return;
  if (step === 1) {
    setStage(1);
    return;
  }
  if (step === 2) {
    setStage(2);
    if (!state.scanned) await scanFolder();
    else renderAnalysis();
    return;
  }
  if (!state.scanned) {
    await goStep(2);
    if (!state.scanned) return;
  }
  if (step === 3) {
    setStage(3);
    renderMap();
  } else if (step === 4) {
    setStage(4);
    state.previewMode = 'after';
    renderPreview();
  } else if (step === 5) {
    if (state.applied) {
      setStage(5, true);
      renderApplied();
    } else {
      openConfirm();
    }
  }
}

function groupOperations(operations = state.plan) {
  const groups = new Map();
  operations.forEach((operation, index) => {
    const name = operation.action === 'arquivar' ? 'Arquivo' : (operation.category || 'Outros');
    if (!groups.has(name)) groups.set(name, { name, count: 0, bytes: 0, files: [], color: CATEGORY_COLORS[name] || FALLBACK_COLORS[groups.size % FALLBACK_COLORS.length] });
    const group = groups.get(name);
    group.count++;
    group.bytes += Number(operation.size) || 0;
    group.files.push({ ...operation, _index: index });
  });
  return [...groups.values()].sort((a, b) => b.bytes - a.bytes || b.count - a.count);
}

function catDots(count, color, cap = 80) {
  const shown = Math.min(Math.max(0, count), cap);
  const dots = Array.from({ length: shown }, (_, index) => `<i class="file-cat" style="--cat-color:${color};--i:${index}"></i>`).join('');
  const more = count > shown ? `<span class="cat-more">+${number.format(count - shown)}</span>` : '';
  return `${dots}${more}`;
}

function renderCatGrid(container, groups, emptyMessage = 'Nenhuma operação precisa ser aplicada.') {
  const target = typeof container === 'string' ? $(container) : container;
  if (!target) return;
  if (!groups.length) {
    target.innerHTML = `<div class="cat-grid-empty">${esc(emptyMessage)}</div>`;
    return;
  }
  target.innerHTML = groups.map((group) => `
    <article class="cat-group">
      <h3 title="${esc(group.name)}">${esc(group.name)}</h3>
      <p>${number.format(group.count)} arquivos · ${fmtSize(group.bytes)}</p>
      <div class="cat-cloud" aria-hidden="true">${catDots(group.count, group.color)}</div>
    </article>`).join('');
}

function renderScanCats(count) {
  const container = $('#scanCats');
  const total = Math.min(280, Math.max(36, Number(count) || 72));
  container.innerHTML = catDots(total, '#dbe2e4', total);
  [...container.children].forEach((cat, index) => {
    cat.style.setProperty('--cat-color', FALLBACK_COLORS[index % FALLBACK_COLORS.length]);
  });
}

function renderAnalysis() {
  if (!state.scanData) return;
  const counts = state.scanData.counts || {};
  $('#scanTitle').textContent = `${folderName(state.target)} analisada`;
  $('#scanFiles').textContent = number.format(counts.analisados || 0);
  $('#scanOps').textContent = number.format(counts.operacoes || 0);
  $('#scanPercent').textContent = '100%';
  $('#scanBar').style.width = '100%';
  $('#scanTrack').classList.remove('running');
  $('#scanCaption').textContent = counts.operacoes ? 'Tudo pronto para revisar.' : 'Não encontrei operações para aplicar.';
  $('#scanSummary').innerHTML = `<span class="summary-pill">${number.format(counts.ignorados || 0)} ignorados</span><span class="summary-pill">${fmtSize(counts.bytes || 0)}</span>`;
  $('#scanFacts').innerHTML = `<span class="summary-pill">${number.format(counts.operacoes || 0)} operações</span><span class="summary-pill">${number.format(state.groups.length)} categorias</span>`;
  $('#toMap').disabled = false;
}

async function scanFolder() {
  if (state.scanning) return;
  const target = $('#targetPath').value.trim();
  if (!target) {
    setStage(1);
    $('#pickError').textContent = 'Escolha uma pasta para continuar.';
    return;
  }
  state.target = target;
  state.scanning = true;
  state.scanned = false;
  $('#scanTitle').textContent = `Farejando ${folderName(target)}…`;
  $('#scanFiles').textContent = '…';
  $('#scanOps').textContent = '…';
  $('#scanPercent').textContent = '…';
  $('#scanBar').style.width = '28%';
  $('#scanTrack').classList.add('running');
  $('#scanCaption').textContent = 'Lendo os arquivos com cuidado…';
  $('#scanError').textContent = '';
  $('#toMap').disabled = true;
  renderScanCats(120);
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Não foi possível analisar a pasta.');
    state.scanData = data;
    state.plan = data.operations || [];
    state.groups = groupOperations(state.plan);
    state.scanned = true;
    renderAnalysis();
  } catch (error) {
    $('#scanPercent').textContent = '—';
    $('#scanBar').style.width = '0';
    $('#scanTrack').classList.remove('running');
    $('#scanCaption').textContent = 'A análise foi interrompida.';
    $('#scanError').textContent = error.message || String(error);
  } finally {
    state.scanning = false;
  }
}

function renderMap() {
  const counts = state.scanData?.counts || {};
  $('#mapTitle').textContent = `${folderName(state.target)}: ${number.format(counts.analisados || 0)} arquivos analisados`;
  $('#mapSummary').innerHTML = `<span class="summary-pill">${number.format(counts.operacoes || 0)} operações</span><span class="summary-pill">${number.format(counts.ignorados || 0)} ignorados</span>`;
  $('#mapFacts').innerHTML = `<span class="summary-pill">${number.format(state.groups.length)} categorias</span><span class="summary-pill">${fmtSize(counts.bytes || 0)} em operações</span>`;
  renderCatGrid('#mapGrid', state.groups);
}

function treeItem(label, count = '', kind = 'tree-file') {
  const item = document.createElement('li');
  item.className = kind;
  const text = document.createElement('span');
  text.textContent = label;
  item.appendChild(text);
  if (count !== '') {
    const amount = document.createElement('span');
    amount.className = 'tree-count';
    amount.textContent = count;
    item.appendChild(amount);
  }
  return item;
}

function renderPreviewTree(mode) {
  const list = $('#previewTree');
  list.replaceChildren();
  const total = Number(state.scanData?.counts?.analisados || 0);
  if (mode === 'before') {
    $('#previewTreeTitle').textContent = 'AGORA';
    $('#previewTreeCount').textContent = `${number.format(total)} arquivos em ${folderName(state.target)}`;
    list.appendChild(treeItem(folderName(state.target), `${number.format(total)} soltos`, 'tree-folder'));
    const entries = state.plan.slice(0, 10);
    entries.forEach((operation) => list.appendChild(treeItem(operation.source_name || folderName(operation.source), fmtSize(operation.size))));
    if (state.plan.length > entries.length) list.appendChild(treeItem(`… e mais ${number.format(state.plan.length - entries.length)} operações`));
    return;
  }
  $('#previewTreeTitle').textContent = 'DEPOIS';
  $('#previewTreeCount').textContent = `${number.format(state.plan.length)} operações planejadas`;
  state.groups.forEach((group) => {
    list.appendChild(treeItem(group.name, number.format(group.count), 'tree-folder'));
    group.files.slice(0, 4).forEach((operation) => list.appendChild(treeItem(operation.destination_name || operation.source_name || '', fmtSize(operation.size))));
  });
}

function renderScatter() {
  const scatter = $('#beforeScatter');
  const count = Math.min(280, Math.max(24, Number(state.scanData?.counts?.analisados || 0)));
  let seed = 1847;
  const random = () => ((seed = (seed * 48271) % 2147483647) - 1) / 2147483646;
  scatter.innerHTML = Array.from({ length: count }, (_, index) => {
    const color = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    return `<i class="file-cat" style="left:${(3 + random() * 94).toFixed(2)}%;top:${(5 + random() * 90).toFixed(2)}%;--cat-color:${color};--i:${index}"></i>`;
  }).join('');
}

function renderPreview() {
  const before = state.previewMode === 'before';
  $('#beforeButton').classList.toggle('active', before);
  $('#afterButton').classList.toggle('active', !before);
  $('#previewMap').classList.toggle('before', before);
  $('#previewMap').dataset.folder = folderName(state.target);
  $('#previewMap').dataset.count = number.format(state.scanData?.counts?.analisados || 0);
  $('#beforeScatter').hidden = !before;
  $('#previewGrid').style.display = before ? 'none' : 'grid';
  if (before) renderScatter();
  else renderCatGrid('#previewGrid', state.groups);
  renderPreviewTree(state.previewMode);
  const counts = state.scanData?.counts || {};
  $('#previewFacts').innerHTML = `<span class="summary-pill">${number.format(counts.operacoes || 0)} operações</span><span class="summary-pill">${fmtSize(counts.bytes || 0)}</span>`;
  $('#applyButton').disabled = state.plan.length === 0;
}

function renderApplyPlan() {
  renderCatGrid('#applyGrid', state.groups);
  $('#applyStatus').replaceChildren();
  state.groups.forEach((group) => {
    const row = document.createElement('div');
    row.className = 'apply-status';
    const label = document.createElement('span');
    label.textContent = group.name;
    const count = document.createElement('strong');
    count.textContent = number.format(group.count);
    row.append(label, count);
    $('#applyStatus').appendChild(row);
  });
}

function openConfirm() {
  if (!state.plan.length) return;
  $('#confirmText').textContent = `${number.format(state.plan.length)} operações serão aplicadas em ${folderName(state.target)}. Você poderá consultar o journal e desfazer a execução.`;
  $('#confirmModal').classList.add('show');
}

function renderApplied() {
  const result = state.result || {};
  const counts = result.counts || {};
  const movedBytes = (result.operations || []).filter((operation) => operation.status === 'concluida').reduce((total, operation) => total + (Number(operation.size) || 0), 0);
  $('#applyEyebrow').textContent = result.error ? 'Atenção' : 'Pronto';
  $('#applyTitle').textContent = result.error ? 'Não foi possível concluir' : `${folderName(state.target)} arrumada`;
  $('#applyPercent').textContent = result.error ? '—' : '100%';
  $('#applyTrack').classList.remove('running');
  $('#applyBar').style.width = result.error ? '0' : '100%';
  $('#applySideTitle').textContent = result.error ? 'Erro' : 'Resumo';
  $('#applyError').textContent = result.error || '';
  if (!result.error) {
    $('#applyStatus').innerHTML = `<div class="apply-status"><span>Operações concluídas</span><strong>${number.format(result.moved || 0)}</strong></div><div class="apply-status"><span>Falhas</span><strong>${number.format(result.failed || 0)}</strong></div>`;
    $('#doneStats').innerHTML = `<div><b>${number.format(result.moved || 0)}</b><span>arquivos organizados</span></div><div><b>${number.format(state.groups.length)}</b><span>categorias</span></div><div><b>${fmtSize(movedBytes || counts.bytes || state.scanData?.counts?.bytes || 0)}</b><span>tamanho movido</span></div>`;
    $('#undoButton').hidden = !(result.moved || 0);
  } else {
    $('#applyStatus').innerHTML = '<div class="apply-status"><span>Nenhum arquivo foi alterado</span></div>';
    $('#doneStats').replaceChildren();
    $('#undoButton').hidden = true;
  }
  $('#anotherButton').hidden = false;
  setStage(5, !result.error);
}

async function applyOrg() {
  if (state.applying || !state.plan.length) return;
  $('#confirmModal').classList.remove('show');
  state.applying = true;
  state.applied = false;
  setStage(5);
  $('#applyEyebrow').textContent = 'Aplicando';
  $('#applyTitle').textContent = `Organizando ${folderName(state.target)}…`;
  $('#applyPercent').textContent = '…';
  $('#applyTrack').classList.add('running');
  $('#applyBar').style.width = '35%';
  $('#applySideTitle').textContent = 'Movendo arquivos';
  $('#applyError').textContent = '';
  $('#doneStats').replaceChildren();
  $('#undoButton').hidden = true;
  $('#anotherButton').hidden = true;
  renderApplyPlan();
  try {
    const response = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: state.target, apply: true }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Falha ao aplicar a organização.');
    state.result = data;
    state.applied = true;
    renderApplied();
  } catch (error) {
    state.result = { error: error.message || String(error) };
    renderApplied();
  } finally {
    state.applying = false;
  }
}

async function undoLast() {
  $('#undoButton').disabled = true;
  try {
    const response = await fetch('/api/undo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latest: true }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Não foi possível desfazer.');
    $('#applyEyebrow').textContent = 'Desfeito';
    $('#applyTitle').textContent = 'Tudo voltou ao lugar';
    $('#applyStatus').innerHTML = `<div class="apply-status"><span>Arquivos restaurados</span><strong>${number.format(data.undone || 0)}</strong></div><div class="apply-status"><span>Falhas ao desfazer</span><strong>${number.format(data.undo_failed || 0)}</strong></div>`;
    $('#undoButton').hidden = true;
  } catch (error) {
    $('#applyError').textContent = error.message || String(error);
  } finally {
    $('#undoButton').disabled = false;
  }
}

function resetToPick() {
  state.plan = [];
  state.scanData = null;
  state.result = null;
  state.groups = [];
  state.scanned = false;
  state.applied = false;
  state.previewMode = 'after';
  setStage(1);
}

function shortcutPath(shortcut) {
  const path = `~/${shortcut}`;
  setTarget(path, shortcut);
}

function setTarget(path, shortcut = null) {
  state.target = path;
  $('#targetPath').value = path;
  $('#folderName').textContent = folderName(path);
  $('#pickError').textContent = '';
  $$('#folderChips [data-shortcut]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.shortcut === shortcut)));
  state.plan = [];
  state.scanData = null;
  state.groups = [];
  state.scanned = false;
  state.applied = false;
}

async function pickFolder() {
  let path = null;
  if (window.pywebview?.api?.pick_folder) {
    try { path = await window.pywebview.api.pick_folder(); } catch (error) { $('#pickError').textContent = error.message || String(error); }
  } else {
    path = prompt('Informe o caminho da pasta:', state.target);
  }
  if (path) setTarget(path);
}

function triggerPick() { $('#fileInput').click(); }

function handleDrop(files) {
  if (!files?.length) return;
  const first = files[0];
  const path = first.path || first.webkitRelativePath;
  if (path) {
    const parts = path.split(/[\\/]/).filter(Boolean);
    setTarget(first.path || `./${parts[0]}`);
    goStep(2);
  } else {
    $('#pickError').textContent = 'Use “Escolher pasta” para selecionar uma pasta.';
  }
}

function seedCatSky() {
  const sky = $('#catSky');
  if (!sky) return;
  const colors = ['#e6d3a9', '#f5a49a', '#bfdc5a', '#dbe2d4', '#7cc3c3', '#e3b76e', '#c6d5cf'];
  let seed = 7319;
  const random = () => ((seed = (seed * 48271) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 140; i++) {
    const band = i % 10;
    let x = random() * 100;
    let y;
    if (band < 4) y = 3 + random() * 29;
    else if (band < 8) y = 68 + random() * 29;
    else { x = random() < .5 ? random() * 14 : 86 + random() * 14; y = 30 + random() * 38; }
    const cat = document.createElement('i');
    cat.className = 'sky-cat';
    cat.style.left = `${x}%`;
    cat.style.top = `${y}%`;
    cat.style.setProperty('--cat-color', colors[i % colors.length]);
    cat.style.setProperty('--cat-scale', (.75 + random() * .6).toFixed(2));
    cat.style.setProperty('--cat-opacity', (.25 + random() * .22).toFixed(2));
    cat.style.setProperty('--cat-delay', `-${(random() * 7).toFixed(2)}s`);
    sky.appendChild(cat);
  }
}

function bindEvents() {
  $$('.flow-stepper [data-step]').forEach((button) => button.addEventListener('click', () => goStep(Number(button.dataset.step))));
  $$('#folderChips [data-shortcut]').forEach((button) => button.addEventListener('click', () => shortcutPath(button.dataset.shortcut)));
  $$('[data-pickfolder]').forEach((button) => button.addEventListener('click', pickFolder));
  $('#analyzeButton').addEventListener('click', () => goStep(2));
  $('#toMap').addEventListener('click', () => goStep(3));
  $('#toPreview').addEventListener('click', () => goStep(4));
  $('#applyButton').addEventListener('click', openConfirm);
  $('#dropPick').addEventListener('click', triggerPick);
  $('#beforeButton').addEventListener('click', () => { state.previewMode = 'before'; renderPreview(); });
  $('#afterButton').addEventListener('click', () => { state.previewMode = 'after'; renderPreview(); });
  $('#btnConfirmApply').addEventListener('click', applyOrg);
  $('#btnCancelApply').addEventListener('click', () => $('#confirmModal').classList.remove('show'));
  $('#undoButton').addEventListener('click', undoLast);
  $('#anotherButton').addEventListener('click', resetToPick);
  const dropzone = $('#step1');
  const input = $('#fileInput');
  dropzone.addEventListener('dragover', (event) => { event.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', (event) => { if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove('dragover'); });
  dropzone.addEventListener('drop', (event) => { event.preventDefault(); dropzone.classList.remove('dragover'); handleDrop(event.dataTransfer.files); });
  input.addEventListener('change', (event) => { handleDrop(event.target.files); input.value = ''; });
}

setTarget('~/Downloads', 'Downloads');
seedCatSky();
bindEvents();
