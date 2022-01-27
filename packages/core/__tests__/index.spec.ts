import plugin from '../src/index'
import { supportScriptName } from '../src/lib'
import { describe, test, expect } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'

const createVitePlugin = () => {
  const { name, transform } = plugin()
  return { name, transform: transform as any }
}

describe('plugin test.', () => {
  test('make sure name.', async () => {
    const { name } = await createVitePlugin()
    expect(name).toEqual('vite:setup-name-support')
  })

  test('not a vue file.', async () => {
    const { transform } = await createVitePlugin()
    const ret = await transform('code', 'index.html')
    expect(ret).toBe(null)
  })

  test('disable name.', async () => {
    const { transform } = plugin({ name: false })
    const ret = await (transform as any)('code', 'index.vue')
    expect(ret).toBe(null)
  })

  test('correct conversion name.', async () => {
    const content = await fs.readFile(
      path.resolve(__dirname, './fixtures/test.vue'),
    )
    const injectedContent = await fs.readFile(
      path.resolve(__dirname, './fixtures/test-injected.vue'),
    )
    const ret = supportScriptName(content.toString(), 'test.vue')
    expect(ret?.code).toEqual(injectedContent.toString())
  })

  test('No need to inject.', async () => {
    const content = await fs.readFile(
      path.resolve(__dirname, './fixtures/test-non-inject.vue'),
    )
    const ret = supportScriptName(content.toString(), 'test-non-inject.vue')
    expect(ret).toBe(null)
  })
})
