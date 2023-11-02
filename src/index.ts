import { createUnplugin } from 'unplugin'
import { consoleConvert } from './core'
import { type BaseOptions, createFilter, detectVueVersion, MarkRequired } from '@vue-macros/common'

export type Options = BaseOptions
export type OptionsResolved = MarkRequired<Options, 'include' | 'version'>

function resolveOption(options: Options): OptionsResolved {
  const version = options.version || detectVueVersion()
  return {
    include: [],
    version,
    ...options,
  }
}

export default createUnplugin<BaseOptions | undefined, false>(
  (userOptions = {}) => {
    const options = resolveOption(userOptions)
    const filter = createFilter(options)
    const name = 'unplugin-console'
    return {
      name,
      enforce: 'post',

      transformInclude(id) {
        return filter(id)
      },

      transform(code, id) {
        return consoleConvert(code, id)
      },
    }
  })
