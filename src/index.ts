import type { Element } from 'hast'
import { isElement } from 'hast-util-is-element'
import type { Paragraph, Strong, Text } from 'mdast'
import type { BlockContent, ContainerDirective } from 'mdast-util-directive'
import rehypeParse from 'rehype-parse'
import rehypeRemark, { all, defaultHandlers } from 'rehype-remark'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import type { MinimalDuplex } from 'unified-stream'
import { stream } from 'unified-stream'

const getClassList = (node: Element) =>
  node.properties?.className as string[] | undefined

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(remarkDirective)
  .use(remarkGfm)
  .use(rehypeRemark, {
    handlers: {
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
            const alert: ContainerDirective = {
              type: 'containerDirective',
              name: 'alert',
              attributes: {
                type,
              },
              children: nodes as BlockContent[],
            }
            return alert
          }
        }

        if (classList?.includes('panel') && !classList.includes('code')) {
          const panel: ContainerDirective = {
            type: 'containerDirective',
            name: 'panel',
            attributes: {
              title: nodes
                .find((node): node is Strong => node.type === 'strong')!
                .children.find((node): node is Text => node.type === 'text')!
                .value,
            },
            children: nodes.filter(
              (node): node is Paragraph => node.type === 'paragraph',
            ),
          }
          return panel
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

        const codeNode = defaultHandlers.pre(h, {
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

export function cf2md(
  input: string,
  encoding?: BufferEncoding | undefined,
): Promise<string>
export function cf2md(input: NodeJS.ReadableStream): MinimalDuplex
export function cf2md(
  input: NodeJS.ReadableStream | string,
  encoding?: BufferEncoding | undefined,
) {
  if (typeof input === 'string') {
    return processor.process(input).then(vfile => vfile.toString(encoding))
  }

  return input.pipe(stream(processor()))
}
