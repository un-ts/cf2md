import type { Content, Element } from 'hast'
import { isElement } from 'hast-util-is-element'
import { all } from 'hast-util-to-mdast'
import { code } from 'hast-util-to-mdast/lib/handlers/code.js'
import type { BlockContent, ContainerDirective } from 'mdast-util-directive'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

const getClassList = (node: Element) =>
  node.properties?.className as string[] | undefined

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(remarkDirective)
  .use(remarkGfm)
  .use(rehypeRemark, {
    handlers: {
      br(h, node: Content) {
        return h(node, 'html', '<br>')
      },
      div(h, node: Element) {
        const classList = getClassList(node)

        if (
          // ignore toc
          classList?.includes('toc-macro') ||
          // ignore code block header
          classList?.includes('codeHeader')
        ) {
          return
        }

        const nodes = all(h, node)

        if (classList?.includes('confluence-information-macro')) {
          let type: string | undefined
          for (const className of classList) {
            const matched = /confluence-information-macro-(.*)/.exec(className)
            if (matched) {
              type = matched[1]
              break
            }
          }
          if (type) {
            const containerDirective: ContainerDirective = {
              type: 'containerDirective',
              name: 'alert',
              attributes: {
                type,
              },
              children: nodes as BlockContent[],
            }
            return containerDirective
          }
        }

        return nodes
      },
      pre(h, node: Element, parent) {
        const params = node.properties?.dataSyntaxhighlighterParams ?? ''
        const matched = /brush:\s*([^;]+);/.exec(params as string)
        const lang = matched?.[1]
        const classList = getClassList(node)

        const properties = {
          className: lang && [...(classList ?? []), 'language-' + lang],
        }

        let expandable = false

        if (isElement(parent)) {
          const parentClassList = getClassList(parent as Element)
          if (parentClassList?.includes('hide-toolbar')) {
            expandable = true
          }
        }

        // `h.handlers.code` is actually `inlineCode`
        const codeNode = code(h, {
          ...node,
          children: node.children.map(child =>
            child.type === 'text'
              ? {
                  type: 'element',
                  tagName: 'code',
                  children: [child],
                  properties,
                }
              : {
                  ...child,
                  properties: {
                    ...('properties' in child && child.properties),
                    ...properties,
                  },
                },
          ),
        })

        return codeNode && expandable
          ? {
              ...codeNode,
              meta: 'expandable',
            }
          : codeNode
      },
    },
  })
  .use(remarkStringify, {
    fences: true,
  })
  .freeze()

export const cf2md = (input: string, encoding?: BufferEncoding | undefined) =>
  processor.process(input).then(vfile =>
    vfile.toString(
      // @ts-expect-error - https://github.com/vfile/vfile/pull/66
      encoding,
    ),
  )
