import { toc } from 'mdast-util-toc'
import { List } from 'mdast-util-toc/lib'

export default (depth: 1 | 2 | 3 | 4 | 5 | 6) => {
  return () => (tree: any, file: any) => {

    // 查找 [toc] 或 [TOC] 标记
    const tocNode = tree.children.find(
      (node: any) =>
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        /^(?:\[?\[[Tt][Oo][Cc]\]\]?|目录|[Cc]ontents?)$/.test(node.children[0].value)
    )

    if (tocNode) {

      const hasHeadings = tree.children.some((node: any) => /^heading/.test(node.type))

      const generatedToc = toc(tree, { maxDepth: depth }).map as List

      const ulNode = {
        type: 'list',
        ordered: false,
        start: null,
        loose: false,
        children: hasHeadings ? generatedToc.children : [],
      }

      const index = tree.children.indexOf(tocNode)
      tree.children.splice(index, 1, ulNode)
    }
  }
}

