<script setup lang="ts">
import type { ComponentInternalInstance } from 'vue'
import { computed, defineComponent, provide, reactive } from 'vue'
import { PREFIX } from '../_utils'
import { stepsEmits, stepsProps } from './steps'

const props = defineProps(stepsProps)
const emit = defineEmits(stepsEmits)

const state = reactive({
  children: [] as ComponentInternalInstance[],
})

const classes = computed(() => {
  const prefixCls = componentName
  return {
    [prefixCls]: true,
    [`${prefixCls}-${props.direction}`]: true,
    [`${prefixCls}-dot`]: !!props.progressDot,
  }
})

function relation(child: ComponentInternalInstance) {
  child && state.children.push(child as any)
}

function onEmit(index: number) {
  emit('clickStep', index)
}

provide('parent', {
  relation,
  state,
  props,
  onEmit,
})
</script>

<script lang="ts">
const componentName = `${PREFIX}-steps`

export default defineComponent({
  name: componentName,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
</script>

<template>
  <view :class="[classes]">
    <slot />
  </view>
</template>

<style lang="scss">
@import './index';
</style>
