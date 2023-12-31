import type { ExtractPropTypes, PropType } from 'vue'
import { popupProps } from '../popup/popup'
import { isBoolean } from '../_utils'

export interface ActionSheetOption {
  disable: boolean
  loading: boolean
  color: string
  name: string
  subname: string
  [x: string]: string | boolean
}
export const actionsheetProps = {
  ...popupProps,
  cancelTxt: {
    type: String,
    default: '',
  },
  optionTag: {
    type: String,
    default: 'name',
  },
  optionSubTag: {
    type: String,
    default: 'subname',
  },
  chooseTagValue: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  customColor: {
    type: String,
    default: '#ee0a24',
  },
  description: {
    type: String,
    default: '',
  },
  menuItems: {
    type: Array as PropType<ActionSheetOption[]>,
    default: () => [],
  },
  closeAbled: {
    type: Boolean,
    default: true,
  },
}

export type ActionsheetProps = ExtractPropTypes<typeof actionsheetProps>

export const actionsheetEmits = {
  'close': () => true,
  'update:visible': (val: boolean) => isBoolean(val),
  'cancel': () => true,
  'choose': (item: { disable: boolean; loading: boolean }, index: any) => {
    return {
      item, index,
    }
  },

}

export type ActionsheetEmits = typeof actionsheetEmits
