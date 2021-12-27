import type { Plugin } from 'vite';
import { parse, compileScript } from '@vue/compiler-sfc';
import MagicString from 'magic-string';

export interface Options {
  /**
   * Turn on name extension
   * @default true
   */
  name?: boolean;
}

export default (options: Options = {}): Plugin[] => {
  return [
    {
      name: 'vite:setup-name-support',
      enforce: 'pre',
      async transform(code, id) {
        if (!/\.vue$/.test(id)) {
          return null;
        }
        const { name = true } = options;
        if (name) {
          return supportScriptName.call(this, code, id);
        }
      },
    },
  ];
};

function supportScriptName(code: string, id: string) {
  let s: MagicString | undefined;
  const str = () => s || (s = new MagicString(code));
  const { descriptor } = parse(code);
  if (!descriptor.script && descriptor.scriptSetup) {
    const result = compileScript(descriptor, { id });
    const name = result.attrs.name;
    const lang = result.attrs.lang;
    if (name) {
      str().appendLeft(
        0,
        `
<script ${lang ? `lang="${lang}"` : ''}>
  import { defineComponent } from 'vue'
  export default defineComponent({
  name: '${name}',
})
</script>\n`
      );
    }
    return {
      map: str().generateMap(),
      code: str().toString(),
    };
  } else {
    return null;
  }
}
