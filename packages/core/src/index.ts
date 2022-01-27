import type { Plugin } from 'vite'
import { supportScriptName } from './lib'

export interface ExtendOptions {
  /**
   * Turn on name extension
   * @default true
   */
  name?: boolean
}

export default (options: ExtendOptions = {}): Plugin => {
  return {
    name: 'vite:setup-name-support',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.vue$/.test(id)) {
        return null
      }
      const { name = true } = options
      if (name) {
        return supportScriptName.call(this, code, id)
      }
      return null
    },
  }
}
