<template>
  <div class="page">
    <nut-navbar @on-click-back="back" @on-click-title="title" title="订单详情">
      <template #left>
        <div>返回</div>
      </template>
      <template #right>
        <nut-icon name="share-n" share-n width="16px" />
      </template>
    </nut-navbar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { autoLogin } from "@/api/api";
</script>
<style>
page {
  background: #f2f2f2;
  color: #333;
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
.page{
	width:100%
}</style>
