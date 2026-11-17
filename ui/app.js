/*
 * Adaptador do aplicativo real sobre a interface de demonstração.
 *
 * O arquivo app.html é uma cópia exata da demonstração (index.html), para que
 * o aplicativo baixável mantenha o mesmo design. Este script apenas troca os
 * dados fictícios pelos dados reais vindos da API local (/api/scan,
 * /api/apply, /api/undo) e conecta a escolha de pasta ao seletor nativo.
 * Nenhuma regra visual é alterada aqui.
 */
(function () {
  'use strict';

  var REAL_TARGET = null;
  var scanReady = false;
  var FOLDER_PATHS = {};

  /* Mapa das categorias do backend para os ids visuais da demonstração. */
  var BY_CATEGORY = {
    imagens: 'img', img: 'img', fotos: 'img',
    documentos: 'doc', doc: 'doc',
    videos: 'vid', vídeos: 'vid', vid: 'vid',
    musicas: 'aud', músicas: 'aud', musica: 'aud', áudio: 'aud', audio: 'aud', aud: 'aud',
    compactados: 'zip', zip: 'zip',
    instaladores: 'app', app: 'app',
    planilhas: 'xls', xls: 'xls',
    outros: 'oth', oth: 'oth',
  };
  var BY_EXT = {
    jpg: 'img', jpeg: 'img', png: 'img', gif: 'img', bmp: 'img', svg: 'img', webp: 'img', heic: 'img',
    pdf: 'doc', doc: 'doc', docx: 'doc', txt: 'doc', rtf: 'doc', odt: 'doc', md: 'doc', epub: 'doc',
    mp4: 'vid', mkv: 'vid', avi: 'vid', mov: 'vid', wmv: 'vid', webm: 'vid',
    mp3: 'aud', wav: 'aud', flac: 'aud', aac: 'aud', ogg: 'aud', m4a: 'aud',
    zip: 'zip', rar: 'zip', '7z': 'zip', tar: 'zip', tgz: 'zip', gz: 'zip',
    exe: 'app', msi: 'app', deb: 'app', rpm: 'app', appimage: 'app', apk: 'app', dmg: 'app',
    xls: 'xls', xlsx: 'xls', ods: 'xls', csv: 'xls', tsv: 'xls',
  };

  function categoryId(operation) {
    var key = String(operation.category || '').toLowerCase().trim();
    if (BY_CATEGORY[key]) return BY_CATEGORY[key];
    var name = String(operation.source_name || '');
    var ext = name.indexOf('.') >= 0 ? name.split('.').pop().toLowerCase() : '';
    return BY_EXT[ext] || 'oth';
  }

  function targetPath() {
    return REAL_TARGET || '~/Downloads';
  }

  function basename(path) {
    var parts = String(path || '').replace(/[\\/]+$/, '').split(/[\\/]/);
    return parts.filter(Boolean).pop() || path || 'Pasta';
  }

  function showError(message) {
    var note = document.getElementById('meow-error');
    if (!note) {
      note = document.createElement('div');
      note.id = 'meow-error';
      note.setAttribute('role', 'alert');
      note.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;' +
        'max-width:min(560px,calc(100vw - 32px));padding:12px 18px;border-radius:12px;' +
        'background:#c8423f;color:#fff;font:13px/1.4 -apple-system,system-ui,sans-serif;' +
        'box-shadow:0 12px 32px rgba(0,0,0,.35)';
      document.body.appendChild(note);
    }
    note.textContent = message;
    clearTimeout(showError._timer);
    showError._timer = setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 6000);
  }

  /* Sem backend (ex.: aberto direto como file://), mantém a demonstração visual. */
  function hasBackend() {
    return location.protocol !== 'file:';
  }

  async function api(path, body) {
    var response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    var data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || ('HTTP ' + response.status));
    return data;
  }

  /* Carrega as operações reais dentro do modelo de dados da demonstração. */
  function hydrate(plan) {
    var operations = plan.operations || [];
    var rnd = seeded(31);
    FILES.length = 0;
    operations.forEach(function (operation, index) {
      var cat = categoryId(operation);
      var mb = (Number(operation.size) || 0) / (1024 * 1024);
      FILES.push({
        id: index,
        cat: cat,
        name: operation.source_name || basename(operation.source),
        mb: mb,
        status: 'ok',
        sx: 5 + rnd() * 90,
        sy: 8 + rnd() * 78,
        age: 0,
      });
    });
    SCAN_ORDER.length = 0;
    FILES.forEach(function (file) { SCAN_ORDER.push(file); });

    CATEGORIES.forEach(function (category) {
      var stats = STATS[category.id];
      stats.count = stats.mb = stats.dupN = stats.dupMb = stats.corN = stats.corMb = 0;
    });
    FILES.forEach(function (file) {
      var stats = STATS[file.cat];
      stats.count++;
      stats.mb += file.mb;
    });
    ['mb', 'dupN', 'dupMb', 'corN', 'corMb'].forEach(function (key) {
      TOTAL[key] = CATEGORIES.reduce(function (total, category) { return total + STATS[category.id][key]; }, 0);
    });
    TOTAL.n = FILES.length;
    document.title = 'MeOwganiza · ' + basename(plan.target || REAL_TARGET);
  }

  async function realScan() {
    if (!hasBackend()) return false;
    try {
      var plan = await api('/api/scan', { target: targetPath() });
      hydrate(plan);
      return true;
    } catch (error) {
      showError('Não foi possível analisar a pasta: ' + (error.message || error));
      return false;
    }
  }

  async function realApply() {
    if (!hasBackend()) return;
    try {
      await api('/api/apply', { target: targetPath(), apply: true });
    } catch (error) {
      showError('Não foi possível aplicar a organização: ' + (error.message || error));
    }
  }

  async function realUndo() {
    if (!hasBackend()) return true;
    try {
      var result = await api('/api/undo', { latest: true });
      if (result.undone) showError('Organização desfeita: ' + result.undone + ' arquivo(s) restaurado(s).');
      return true;
    } catch (error) {
      showError('Não foi possível desfazer: ' + (error.message || error));
      return false;
    }
  }

  async function pickRealFolder() {
    var path = null;
    try {
      if (window.pywebview && window.pywebview.api && window.pywebview.api.pick_folder) {
        path = await window.pywebview.api.pick_folder();
      }
    } catch (error) {
      showError('Não foi possível abrir o seletor: ' + (error.message || error));
    }
    if (!path) path = prompt('Informe o caminho da pasta:', targetPath());
    if (!path) return;
    REAL_TARGET = path;
    scanReady = false;
    state.folder = basename(path);
    document.querySelectorAll('[data-pick-label]').forEach(function (node) { node.textContent = state.folder; });
    var chips = document.getElementById('folder-chips');
    if (chips) chips.innerHTML = folderChips();
    document.querySelectorAll('[data-folder]').forEach(function (node) { node.setAttribute('aria-pressed', 'false'); });
    wireFolderPick();
  }

  /* Liga o fluxo da demonstração à API real sem mudar a aparência. */
  var originalGo = window.go;
  window.go = async function (step) {
    if (step === 1 && !scanReady) {
      var ok = await realScan();
      scanReady = ok || true; // em fallback, mantém os dados ilustrativos
    }
    if (step === 4) await realApply();
    return originalGo(step);
  };

  var originalResetState = window.resetState;
  window.resetState = function () {
    scanReady = false;
    return originalResetState();
  };

  var originalScanTick = window.scanTick;
  window.scanTick = function (percent) {
    if (!FILES.length) {
      document.querySelectorAll('[data-scan="pct"]').forEach(function (node) { node.textContent = Math.floor(percent) + '%'; });
      document.querySelectorAll('[data-scan="bar"]').forEach(function (node) { node.style.width = percent + '%'; });
      var file = document.querySelector('[data-scan="file"]');
      if (file) file.textContent = 'Nenhum arquivo para organizar.';
      return;
    }
    return originalScanTick(percent);
  };

  var originalFolder = CLICK_HANDLERS.folder;
  CLICK_HANDLERS.folder = function (button) {
    var name = button.dataset.folder;
    REAL_TARGET = FOLDER_PATHS[name] || ('~/' + name);
    scanReady = false;
    originalFolder(button);
  };

  CLICK_HANDLERS.pickfolder = pickRealFolder;

  /* Carrega as pastas reais do usuário para que os atalhos funcionem no Windows. */
  if (hasBackend()) {
    fetch('/api/folders').then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.folders) {
          FOLDER_PATHS = data.folders;
          if (!REAL_TARGET) REAL_TARGET = data.folders.Downloads;
        }
      })
      .catch(function () { /* sem backend: mantém os caminhos padrão */ });
  }

  CLICK_HANDLERS.undo = async function () {
    var ok = await realUndo();
    if (!ok) return;
    var sky = document.getElementById('sky');
    if (sky) placeSky('mess');
    later(1000, function () { state.undone = true; go(5); });
  };

  /* "Ver na pasta": abre a pasta real no explorador de arquivos do sistema.
     No demo (sem backend) mantém apenas a animação de texto original. */
  var originalFlash = CLICK_HANDLERS.flash;
  CLICK_HANDLERS.flash = async function (button) {
    originalFlash(button);
    if (!hasBackend()) return;
    var label = String(button.dataset.flash || '');
    if (label.indexOf('pasta') < 0 && label.indexOf('Finder') < 0) return;
    try {
      var response = await fetch('/api/open-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: targetPath() }),
      });
      var data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || 'Não foi possível abrir a pasta');
    } catch (error) {
      showError('Não foi possível abrir a pasta: ' + (error.message || error));
    }
  };
})();
