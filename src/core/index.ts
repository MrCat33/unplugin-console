import { babelParse, walkAST, getLang, MagicString, generateTransform, DEFINE_RENDER } from '@vue-macros/common'
import type * as t from '@babel/types'
export function consoleConvert(code: string, id: string) {

  const lang = getLang(id)
  const program = babelParse(code, lang === 'vue' ? 'js' : lang)

  const nodes: {
    parent: t.ExpressionStatement
    node: t.CallExpression
    arg: t.Node
  }[] = []

  walkAST<t.Node>(program, {
    enter(node, parent) {
      if (
        node.type !== 'CallExpression' ||
        parent?.type !== 'ExpressionStatement' ||
        node.callee.type !== 'MemberExpression' ||
        node.callee.object.type !== 'Identifier' ||
        node.callee.object.name !== 'console' ||
        node.callee.property.type !== 'Identifier' ||
        node.arguments.length !== 1
      )
        return

      nodes.push({
        parent,
        node,
        arg: node.arguments[0]
      })
    },
  })

  if (nodes.length === 0) return

  const s = new MagicString(code)

  for (const { node } of nodes) {
    s.remove(node.start!, node.end!)
  }

  return generateTransform(s, id)
}
