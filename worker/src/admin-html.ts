export const ADMIN_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" />
<title>Agent 留言管理</title>
<style>
  :root {
    --paper: #f4f0e6;
    --paper-deep: #e8e0d1;
    --ink: #24241f;
    --muted: #757268;
    --red: #d6513c;
    --yellow: #e6b94c;
    --green: #4d7355;
    --blue: #4d6f8f;
    --pixel: 'Pixelify Sans', 'Courier New', monospace;
    --sans: system-ui, -apple-system, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    display: flex;
    justify-content: center;
    padding: 40px 16px;
  }
  .shell { width: 100%; max-width: 760px; }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 3px solid var(--ink);
    box-shadow: 6px 6px 0 var(--ink);
    background: var(--yellow);
    padding: 14px 18px;
    margin-bottom: 20px;
  }
  header h1 {
    margin: 0;
    font-family: var(--pixel);
    font-size: 20px;
    letter-spacing: 0.06em;
  }
  .toolbar { display: flex; gap: 8px; }
  button {
    border: 2px solid var(--ink);
    background: var(--paper);
    color: var(--ink);
    font-family: var(--pixel);
    font-weight: 700;
    font-size: 13px;
    padding: 8px 12px;
    cursor: pointer;
    transition: transform 100ms steps(2), box-shadow 100ms steps(2);
    box-shadow: 3px 3px 0 var(--ink);
  }
  button:hover { transform: translate(-1px, -2px); box-shadow: 4px 5px 0 var(--ink); }
  button:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
  button.danger { background: var(--red); color: #fffdf5; }
  button.primary { background: var(--green); color: #fffdf5; }
  .card {
    border: 3px solid var(--ink);
    box-shadow: 6px 6px 0 var(--ink);
    background: #fffdf5;
    padding: 16px 18px;
    margin-bottom: 14px;
  }
  .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; }
  .meta .time { font-family: var(--pixel); font-size: 12px; color: var(--muted); }
  .tag {
    border: 2px solid var(--ink);
    background: var(--paper-deep);
    font-size: 12px;
    padding: 3px 8px;
    font-weight: 700;
  }
  .tag.contact { background: color-mix(in srgb, var(--blue) 25%, var(--paper)); cursor: pointer; }
  .body { font-size: 14px; line-height: 1.8; white-space: pre-wrap; word-break: break-word; }
  .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
  .login { max-width: 420px; margin: 12vh auto 0; }
  .login label { display: block; font-family: var(--pixel); font-size: 12px; margin-bottom: 8px; }
  .login input {
    width: 100%;
    border: 3px solid var(--ink);
    background: var(--paper);
    padding: 12px 14px;
    font-size: 15px;
    margin-bottom: 14px;
  }
  .login button { width: 100%; }
  .hint { color: var(--muted); font-size: 12px; text-align: center; margin-top: 10px; }
  .empty { text-align: center; color: var(--muted); padding: 48px 0; font-size: 14px; }
  .error { color: var(--red); font-size: 13px; margin-top: 8px; min-height: 18px; }
  .hidden { display: none; }
</style>
</head>
<body>
<div class="shell">
  <header>
    <h1>AGENT 留言管理</h1>
    <div class="toolbar">
      <button id="refresh" type="button">刷新</button>
      <button id="logout" type="button">登出</button>
    </div>
  </header>

  <div id="login-view">
    <div class="card login">
      <label for="token">管理密钥</label>
      <input id="token" type="password" autocomplete="current-password" placeholder="ADMIN_TOKEN" />
      <button id="login" class="primary" type="button">进入</button>
      <p class="error" id="login-error"></p>
      <p class="hint">密钥保存在本浏览器 localStorage，登出即清除。</p>
    </div>
  </div>

  <div id="main-view" class="hidden">
    <div id="list"></div>
    <p class="error" id="main-error"></p>
  </div>
</div>

<script>
(function () {
  var STORAGE_KEY = 'lueyu-admin:token';
  var loginView = document.getElementById('login-view');
  var mainView = document.getElementById('main-view');
  var tokenInput = document.getElementById('token');
  var loginError = document.getElementById('login-error');
  var mainError = document.getElementById('main-error');
  var listEl = document.getElementById('list');

  function getToken() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (e) { return ''; }
  }

  function setToken(value) {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function showMain() {
    loginView.classList.add('hidden');
    mainView.classList.remove('hidden');
    load();
  }

  function showLogin() {
    mainView.classList.add('hidden');
    loginView.classList.remove('hidden');
    tokenInput.value = '';
    loginError.textContent = '';
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return d.toLocaleString('zh-CN', { hour12: false });
  }

  function load() {
    mainError.textContent = '';
    listEl.innerHTML = '<p class="empty">加载中…</p>';
    fetch('/api/messages', { headers: { 'x-admin-token': getToken() } })
      .then(function (res) {
        if (res.status === 401) { showLogin(); throw new Error('密钥不对'); }
        if (!res.ok) throw new Error('读取失败 ' + res.status);
        return res.json();
      })
      .then(function (data) {
        render(data.messages || []);
      })
      .catch(function (err) {
        listEl.innerHTML = '';
        mainError.textContent = err.message;
      });
  }

  function render(messages) {
    listEl.innerHTML = '';
    if (!messages.length) {
      listEl.innerHTML = '<p class="empty">还没有留言。</p>';
      return;
    }
    messages.forEach(function (msg) {
      var card = document.createElement('div');
      card.className = 'card';
      var meta = '<div class="meta"><span class="time">' + escapeHtml(formatTime(msg.ts)) + '</span>';
      if (msg.name) meta += '<span class="tag">' + escapeHtml(msg.name) + '</span>';
      if (msg.contact) meta += '<span class="tag contact" title="点击复制">' + escapeHtml(msg.contact) + '</span>';
      meta += '</div>';
      card.innerHTML = meta + '<div class="body">' + escapeHtml(msg.body) + '</div>';
      var actions = document.createElement('div');
      actions.className = 'actions';
      if (msg.contact) {
        var copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.textContent = '复制联系方式';
        copyBtn.addEventListener('click', function () {
          navigator.clipboard.writeText(msg.contact).then(function () {
            copyBtn.textContent = '已复制';
            setTimeout(function () { copyBtn.textContent = '复制联系方式'; }, 1200);
          });
        });
        actions.appendChild(copyBtn);
      }
      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'danger';
      delBtn.textContent = '删除';
      delBtn.addEventListener('click', function () {
        if (!window.confirm('删除这条留言？')) return;
        fetch('/api/messages/' + encodeURIComponent(msg.key), {
          method: 'DELETE',
          headers: { 'x-admin-token': getToken() }
        }).then(function (res) {
          if (res.ok) load();
          else mainError.textContent = '删除失败 ' + res.status;
        });
      });
      actions.appendChild(delBtn);
      card.appendChild(actions);
      listEl.appendChild(card);
    });
  }

  document.getElementById('login').addEventListener('click', function () {
    var value = tokenInput.value.trim();
    if (!value) { loginError.textContent = '先填密钥。'; return; }
    setToken(value);
    fetch('/api/messages', { headers: { 'x-admin-token': value } })
      .then(function (res) {
        if (res.status === 401) {
          setToken('');
          loginError.textContent = '密钥不对。';
        } else if (res.ok) {
          showMain();
        } else {
          loginError.textContent = '出错 ' + res.status;
        }
      });
  });

  tokenInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('login').click();
  });

  document.getElementById('refresh').addEventListener('click', load);
  document.getElementById('logout').addEventListener('click', function () {
    setToken('');
    showLogin();
  });

  if (getToken()) showMain();
  else showLogin();
})();
</script>
</body>
</html>`;
