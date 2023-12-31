<!-- eslint-disable padded-blocks -->
<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { PREFIX, pxCheck } from '../_utils'
import NutIcon from '../icon/icon.vue'
import { inputnumberEmits, inputnumberProps } from './inputnumber'

const props = defineProps(inputnumberProps)
const emit = defineEmits(inputnumberEmits)
const classes = computed(() => {
  const prefixCls = componentName
  return {
    [prefixCls]: true,
    [`${prefixCls}--disabled`]: props.disabled,
  }
})
function fixedDecimalPlaces(v: string | number): string {
  return Number(v).toFixed(Number(props.decimalPlaces))
}
function change(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value, event)
}
function emitChange(value: string | number, event: Event) {
  const output_value: number | string = fixedDecimalPlaces(value)
  emit('update:modelValue', output_value, event)
  emit('change', output_value, event)
}
function addAllow(value = Number(props.modelValue)): boolean {
  return value < Number(props.max) && !props.disabled
}
function reduceAllow(value = Number(props.modelValue)): boolean {
  return value > Number(props.min) && !props.disabled
}
function reduce(event: Event) {
  emit('reduce', event)
  if (reduceAllow()) {
    const output_value = Number(props.modelValue) - Number(props.step)
    emitChange(output_value, event)
  }
  else {
    emit('overlimit', event, 'reduce')
  }
}
function add(event: Event) {
  emit('add', event)
  if (addAllow()) {
    const output_value = Number(props.modelValue) + Number(props.step)
    emitChange(output_value, event)
  }
  else {
    emit('overlimit', event, 'add')
  }
}
function blur(event: Event) {
  if (props.disabled)
    return
  if (props.readonly)
    return
  const input = event.target as HTMLInputElement
  let value = +input.value
  if (value < Number(props.min))
    value = Number(props.min)
  else if (value > Number(props.max))
    value = Number(props.max)

  emitChange(value, event)
  emit('blur', event)
}
function focus(event: Event) {
  if (props.disabled)
    return
  if (props.readonly) {
    blur(event)
    return
  }
  emit('focus', event)
}
</script>

<script lang="ts">
const componentName = `${PREFIX}-input-number`

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
  <view :class="classes">
    <view
      class="nut-input-number__icon nut-input-number__left"
      :class="{ 'nut-input-number__icon--disabled': !reduceAllow() }"
      @click="reduce"
    >
      <slot name="left-icon">
        <NutIcon name="minus" :size="pxCheck(buttonSize)" />
      </slot>
    </view>
    <view v-if="readonly" class="nut-input-number__text--readonly">
      {{ modelValue }}
    </view>
    <input
      v-else
      class="nut-input-number__text--input"
      type="number"
      :min="min"
      :max="max"
      :style="{ width: pxCheck(inputWidth), height: pxCheck(buttonSize) }"
      :disabled="disabled"
      :readonly="readonly"
      :value="String(modelValue)"
      @input="(change as any)"
      @blur="(blur as any)"
      @focus="(focus as any)"
    >
    <view
      class="nut-input-number__icon nut-input-number__right"
      :class="{ 'nut-input-number__icon--disabled': !addAllow() }"
      @click="add"
    >
      <slot name="right-icon">
        <NutIcon name="plus" :size="pxCheck(buttonSize)" />
      </slot>
    </view>
  </view>
</template>

<style lang="scss">
@import './index';
</style>
