import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function loadTypeScript(url) {
  let source
  try {
    source = readFileSync(url, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const context = vm.createContext({
    exports: {},
    require: (path) => loadTypeScript(new URL(`${path}.ts`, url)),
  })
  vm.runInContext(compiled, context)
  return context.exports
}

const search = loadTypeScript(new URL('../src/lib/siteSearch.ts', import.meta.url))

function find(query, items) {
  assert.equal(typeof search.searchSite, 'function', 'Search must expose the filtering function')
  return search.searchSite(query, items)
}

function entry(id, title, description = '', tags = []) {
  return { id, title, description, tags, kind: 'project', href: `/projects/${id}` }
}

test('title matches outrank tags and description while exact titles rank first', () => {
  const items = [
    entry('description', 'Storage', 'React components'),
    entry('tags', 'Frontend', '', ['React']),
    entry('contains', 'Learn React'),
    entry('prefix', 'React Patterns'),
    entry('exact', 'React'),
  ]
  assert.deepEqual(Array.from(find('react', items), (item) => item.id), [
    'exact', 'prefix', 'contains', 'tags', 'description',
  ])
})

test('all query terms must match, including terms spread across title and tags', () => {
  const items = [entry('both', 'Agent tools', '', ['Python']), entry('one', 'Agent tools')]
  assert.deepEqual(Array.from(find('  AGENT   python  ', items), (item) => item.id), ['both'])
  assert.equal(find('agent absent', items).length, 0)
})

test('search supports Chinese descriptions, full-width text and punctuation in tags', () => {
  assert.equal(find('智能体')[0].href, '/projects/aidr')
  assert.equal(find('ＡＩＤＲ')[0].href, '/projects/aidr')
  assert.equal(find('C++')[0].href, '/resume#engineering')
})

test('empty searches preserve source order without mutating the input', () => {
  const items = [entry('first', 'Zebra'), entry('second', 'Apple')]
  const original = structuredClone(items)
  assert.deepEqual(Array.from(find('   ', items), (item) => item.id), ['first', 'second'])
  find('apple', items)
  assert.deepEqual(items, original)
})

test('the index includes every existing project and experience with valid destinations', () => {
  const profile = loadTypeScript(new URL('../src/lib/siteProfile.ts', import.meta.url))
  const results = find('')
  for (const project of profile.FEATURED_PROJECTS) {
    const result = results.find((item) => item.href === `/projects/${project.slug}`)
    assert.equal(result?.title, project.title)
    assert.deepEqual(Array.from(result.tags), Array.from(project.tags))
  }
  for (const experience of profile.OTHER_EXPERIENCE) {
    const result = results.find((item) => item.title.includes(experience.company))
    assert.equal(result?.href, '/resume#engineering')
  }
  assert.ok(results.some((item) => item.href === '/blog'))
  assert.ok(results.some((item) => item.href === '/#contact'))
  assert.equal(new Set(results.map((item) => item.id)).size, results.length)
})

test('an unmatched query has no results and section names are searchable', () => {
  assert.equal(find('zzznothingmatcheszzz').length, 0)
  assert.equal(find('博客')[0].href, '/blog')
  assert.equal(find('简历')[0].href, '/resume')
  assert.equal(find('联系')[0].href, '/#contact')
})
