import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const source = readFileSync(new URL('../src/lib/theme.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

function browser({ stored = null, readError = false, writeError = false, denied = false } = {}) {
  const classes = new Set()
  const root = {
    style: {},
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name)
        else classes.delete(name)
      },
      contains: (name) => classes.has(name),
    },
  }
  const themeColor = {
    content: html.match(/<meta name="theme-color" content="([^"]+)"/)[1],
    setAttribute(name, value) { this[name] = value },
  }
  const values = new Map(stored === null ? [] : [['lueyu:theme', stored]])
  const storage = {
    getItem(key) {
      if (readError) throw new Error('Storage read unavailable')
      return values.get(key) ?? null
    },
    setItem(key, value) {
      if (writeError) throw new Error('Storage quota exceeded')
      values.set(key, value)
    },
  }
  const context = vm.createContext({
    exports: {},
    document: {
      documentElement: root,
      querySelector: (selector) => selector === 'meta[name="theme-color"]' ? themeColor : null,
    },
    Date: class extends Date { getHours() { return 12 } },
  })
  Object.defineProperty(context, 'localStorage', {
    get() {
      if (denied) throw new Error('Storage access denied')
      return storage
    },
  })
  return { context, root, themeColor, values }
}

function loadModule(env) {
  vm.runInContext(compiled, env.context)
  return env.context.exports
}

function assertAppearance(env, theme) {
  const night = theme === 'night'
  assert.equal(env.root.classList.contains('night'), night)
  assert.equal(env.root.style.colorScheme, night ? 'dark' : 'light')
  assert.equal(env.root.style.backgroundColor, night ? '#17212c' : '#f4f0e6')
  assert.equal(env.themeColor.content, night ? '#17212c' : '#f4f0e6')
}

const initialCases = [
  ['no preference during daylight', {}, 'night'],
  ['saved day preference', { stored: 'day' }, 'day'],
  ['saved night preference', { stored: 'night' }, 'night'],
  ['invalid saved preference', { stored: 'automatic' }, 'night'],
  ['storage read failure', { readError: true }, 'night'],
  ['storage access denied', { denied: true }, 'night'],
]

for (const [label, options, expected] of initialCases) {
  test(`initial theme respects ${label}`, () => {
    const env = browser(options)
    const theme = loadModule(env)
    theme.initTheme()
    assert.equal(theme.isNightTheme(), expected === 'night')
    assertAppearance(env, expected)
  })
}

test('theme toggles persist an explicit choice and notify after applying it', () => {
  const env = browser({ stored: 'night' })
  const theme = loadModule(env)
  theme.initTheme()
  const observations = []
  const unsubscribe = theme.subscribeTheme(() => observations.push(env.root.classList.contains('night')))
  theme.toggleTheme()
  assertAppearance(env, 'day')
  assert.equal(env.values.get('lueyu:theme'), 'day')
  theme.toggleTheme()
  assertAppearance(env, 'night')
  assert.equal(env.values.get('lueyu:theme'), 'night')
  assert.deepEqual(observations, [false, true])
  unsubscribe()
  theme.setTheme('day')
  assert.deepEqual(observations, [false, true])
})

for (const options of [{ writeError: true }, { denied: true }]) {
  test(`theme changes still apply and notify with ${options.denied ? 'denied storage' : 'a failed write'}`, () => {
    const env = browser({ stored: 'night', ...options })
    const theme = loadModule(env)
    theme.initTheme()
    const observations = []
    theme.subscribeTheme(() => observations.push(env.root.classList.contains('night')))
    theme.toggleTheme()
    assert.equal(theme.isNightTheme(), false)
    assert.equal(env.root.classList.contains('night'), false)
    assert.deepEqual(observations, [false])
    assertAppearance(env, 'day')
    theme.setTheme('night')
    assert.equal(theme.isNightTheme(), true)
    assertAppearance(env, 'night')
    assert.deepEqual(observations, [false, true])
  })
}

test('first-paint initialization runs in the head and agrees with module initialization', () => {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  const bootstrap = head.match(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/)
  assert.ok(bootstrap, 'A synchronous head script must set the theme before the app loads')
  assert.doesNotMatch(bootstrap[0], /\b(?:async|defer)\b|type=["']module/)
  for (const [label, options, expected] of initialCases) {
    const env = browser(options)
    vm.runInContext(bootstrap[1], env.context)
    assertAppearance(env, expected)
    const theme = loadModule(env)
    theme.initTheme()
    assert.equal(theme.isNightTheme(), expected === 'night', label)
    assertAppearance(env, expected)
  }
})

test('the HTML document provides a dark canvas before any script runs', () => {
  const root = html.match(/<html\b[^>]*>/)[0]
  assert.match(root, /class="[^"]*\bnight\b/)
  assert.match(root, /color-scheme:\s*dark/)
  assert.match(root, /background-color:\s*#17212c/)
  assert.match(html, /<meta name="theme-color" content="#17212c"/)
})
