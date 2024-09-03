#!/usr/bin/env node

import process from 'node:process'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { toMarkdown } from 'mdast-util-to-markdown'
import type { FootnoteDefinition, PhrasingContent, RootContent } from 'mdast'
import { mathToMarkdown } from 'mdast-util-math'
import { gfmToMarkdown } from 'mdast-util-gfm'
import { u } from 'unist-builder'
import type { Block, RichText, WolaiApiResponse } from './types.js'

const footnotes: FootnoteDefinition[] = []

function richTextStyleToMarkdown(richText: RichText): PhrasingContent {
  let ret: PhrasingContent = { type: 'text', value: richText.title }

  if (richText.bold) {
    ret = u('strong', [ret])
  }
  if (richText.italic) {
    ret = u('emphasis', [ret])
  }
  // if (richText.underline) { } // TODO: mdast doesn't support underline
  if (richText.strikethrough) {
    ret = u('delete', [ret])
  }
  if (richText.inline_code) {
    ret = u('inlineCode', richText.title)
  }
  // if (richText.front_color) { } // TODO: mdast doesn't support front color
  // if (richText.back_color) { } // TODO: mdast doesn't support back color

  return ret
}

function richTextToMarkdown(richText: RichText): PhrasingContent {
  switch (richText.type) {
    case 'text':
    { let ret = richTextStyleToMarkdown(richText)
      if (richText.link) {
        ret = u('link', { url: richText.link }, [ret])
      }
      return ret }

    case 'equation':
      return u('inlineMath', richText.title)
    case 'footnote':
      footnotes.push(u('footnoteDefinition', { identifier: (footnotes.length + 1).toString() }, [u('paragraph', [u('text', richText.title)])]))

      return u('footnoteReference', { identifier: (footnotes.length).toString() })
    case 'bi_link': // TODO: mdast doesn't support bi_link
    case 'comment': // TODO: mdast doesn't support comment
    case 'mention': // TODO: mdast doesn't support mention
    default:
      return { type: 'text', value: richText.title }
  }
}

function blockToMarkdown(block: Block): RootContent {
  switch (block.type) {
    case 'code':
      return u('code', { language: block.language }, block.content[0].title)
    case 'text':
      return u('paragraph', block.content.map(richTextToMarkdown))
    case 'image':
    {
      const url = block.media.url ?? block.media.download_url ?? ''
      return u('paragraph', [u('image', { url })])
    }
    case 'todo_list':
      return u('list', u('listItem', { checked: block.checked }, [u('paragraph', block.content.map(richTextToMarkdown))]))
    case 'enum_list': // TODO: better resolution for enum_list
      return u('list', { ordered: true }, [u('listItem', [u('paragraph', block.content.map(richTextToMarkdown))])])
    case 'bull_list': // TODO: better resolution for bullet_list
      return u('list', { ordered: false }, [u('listItem', [u('paragraph', block.content.map(richTextToMarkdown))])])
      // case 'embed':
      //     return u('html', block.content[0].title)
    case 'quote':
      return u('blockquote', [u('paragraph', block.content.map(richTextToMarkdown))])
    case 'block_equation':
      return u('math', block.content[0].title)
    case 'heading':
      return u('heading', { depth: block.level }, block.content.map(richTextToMarkdown))
    default:
      return u('paragraph', [{ type: 'text', value: `` }])
  }
}

async function main() {
  if (!existsSync(process.argv[4])) {
    await mkdir(process.argv[4], { recursive: true })
  }

  const token = process.argv[2]
  const blockId = process.argv[3]
  const outputDir = process.argv[4]

  const resp = await fetch(`https://openapi.wolai.com/v1/blocks/${blockId}/children`, {
    headers: {
      Authorization: token,
    },
  })
  const json = await resp.json() as WolaiApiResponse

  const md = u('root', json.data.map(blockToMarkdown).concat(footnotes))
  await writeFile(`${outputDir}/index.md`, toMarkdown(md, { extensions: [mathToMarkdown(), gfmToMarkdown()] }))
}

main().then()
