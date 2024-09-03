type BlockAlign = 'left' | 'center' | 'right'

type BlockBackColors = keyof typeof _backColorHex

type BlockFrontColors = keyof typeof _frontColorHex

type HeadingLevel = 1 | 2 | 3 | 5

type InlineTitleType = 'text' | 'link' | 'bi_link' | 'comment' | 'equation' | 'mention' | 'note' | 'footnote'

type NumberFormats = 'yen' | 'vnd' | 'hkd' | 'euro' | 'yuan' | 'float' | 'pound' | 'dollar' | 'number' | 'percent' | 'integer' | 'progress' | 'thousandth'

type PropertyType = string

type TextAlign = 'center' | undefined

// https://www.wolai.com/wolai/o2v1vrLkP2qUuZTH6iDZY9
const _frontColorHex = {
  gray: '#8C8C8C',
  dark_gray: '#5C5C5C',
  brown: '#A3431F',
  orange: '#F06B05',
  yellow: '#DFAB01',
  green: '#038766',
  blue: '#0575C5',
  indigo: '#4A52C7',
  purple: '#8831CC',
  pink: '#C815B6',
  red: '#E91E2C',
  default: '#000000',
}

// https://www.wolai.com/wolai/fNb4SHWY1bV2s8Xg5JYUE4
const _backColorHex = {
  cultured_background: '#F3F3F3',
  light_gray_background: '#E3E3E3',
  apricot_background: '#EFDFDB',
  vivid_tangerine_background: '#FCE5D7',
  blond_background: '#FCF5D6',
  aero_blue_background: '#D7EAE5',
  uranian_blue_background: '#D7E7F4',
  lavender_blue_background: '#E0E2F5',
  pale_purple_background: '#EADDF6',
  pink_lavender_background: '#F5D9F2',
  light_pink_background: '#FBDADC',
  fluorescent_yellow_background: '#FFF784',
  fluorescent_green_background: '#CDF7AD',
  fluorescent_green2_background: '#A6F9CB',
  fluorescent_blue_background: '#A8FFFF',
  fluorescent_purple_background: '#FDB7FF',
  fluorescent_purple2_background: '#CCC4FF',
  default: '#FFFFFF',
}

export interface BaseBlock {
  content: RichText[]
  block_front_color?: BlockFrontColors
  block_back_color?: BlockBackColors
  text_alignment?: TextAlign
  block_alignment?: BlockAlign
}

export interface TextBlock extends BaseBlock {
  type: 'text'
}

export interface CodeBlock extends BaseBlock {
  type: 'code'
  language: string
  caption: string
}

export interface PageBlock extends BaseBlock {
  type: 'page'
  page_cover: LinkCover
  page_setting: PageSetting
  icon: string
}

export interface MediaBlock extends BaseBlock {
  type: 'image' | 'audio' | 'video'
  media: BlockMedia
  dimensions: BlockMediaDimensions
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed'
  embed_link: string
  original_link: string
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  level: HeadingLevel
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout'
  icon: string
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote'
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  table_setting: TableSetting
  table_content: RichText[][]
}

export interface TodoListBlock extends BaseBlock {
  type: 'todo_list'
  checked: boolean
}

export interface EnumListBlock extends BaseBlock {
  type: 'enum_list'
}

export interface BulletListBlock extends BaseBlock {
  type: 'bull_list'
}

export interface EquationBlock extends BaseBlock {
  type: 'block_equation'
}

export type Block = CodeBlock | PageBlock | MediaBlock | DividerBlock | EmbedBlock | HeadingBlock | CalloutBlock | QuoteBlock | TableBlock | TodoListBlock | EnumListBlock | BulletListBlock | EquationBlock | TextBlock
export type BlockTypes = Block['type']

export type BlockApiResponse = Block & {
  id: string
  parent_id: string
  page_id?: string
  parent_type: BlockTypes
  children: {
    ids: string[]
    api_url?: string
  }
  version: number
  created_by: string
  created_at: number
  edited_by: string
  edited_at: number
}

export interface BlockMedia {
  type: 'image' | 'audio' | 'video'
  download_url?: string
  expires_in?: number
  url?: string
}

export interface BlockMediaDimensions {
  width?: number
  height?: number
  original_width?: number
  original_height?: number
}

export interface CodeSetting {
  line_number: boolean
  line_break: boolean
  ligatures: boolean
  preview_format: string
}

export interface CreateTokenResponse {
  app_token: string
  app_id: string
  create_time: number
  expire_time: number
  update_time: number
}

export interface DatabaseRowData {
  data: { [key: string]: PropertyValue }
  page_id: string
}

export interface GetDatabaseResponse {
  columns_order: string[]
  rows: DatabaseRowData[]
}

export interface LinkCover {
  type: string
  url: string
}

export interface PageIcon {
  type: string
  icon: string
}

export interface PageSetting {
  is_full_width: boolean
  is_small_text: boolean
  has_floating_catalog: boolean
  font_family: string
  line_leading: string
}

export interface PropertyFileInfo {
  download_url: string
  expires_in: number
  is_image: boolean
}

export interface PropertyValue {
  type: PropertyType
  value: string
  number_format?: NumberFormats
  file_info?: PropertyFileInfo[]
}

export interface RichText {
  type: InlineTitleType
  title: string
  bold: boolean
  italic: boolean
  underline: boolean
  highlight: boolean
  strikethrough: boolean
  inline_code: boolean
  front_color: BlockFrontColors
  back_color: BlockBackColors
  link?: string
  content?: RichText[]
  ref_id?: string
  block_id?: string
  discuss_id?: number
  comment_id?: number
  user_id?: string
}

export interface TableSetting {
  has_header: boolean
  column_widths: number[]
}

export interface WolaiApiResponse {
  data: BlockApiResponse[]
  next_cursor: string | null
  has_more: boolean
  request_id: string
  message?: string
  error_code?: 17003 | 17011 | 17007
  status_code?: number
}
