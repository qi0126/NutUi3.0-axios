<template>
  <div class="page">
    <nut-navbar @on-click-back="back" @on-click-title="title" title="订单详情">
      <template #left>
        <div>返回</div>
      </template>
      <template #right>
        <nut-icon
          name="share-n"
          share-n
          width="16px"
          @click="isShowLogout = true"
        />
      </template>
    </nut-navbar>
    <nut-dialog
      title="退出账号"
      content="确定退出当前账号"
      v-model:visible="isShowLogout"
      @cancel="isShowLogout = false"
      @ok="onOk"
    />
    <nut-tabbar
      bottom
      safe-area-inset-bottom
      placeholder
      v-model="active"
      @tab-switch="tabSwitch"
    >
      <nut-tabbar-item
        v-for="(item, index) in menuList"
        :tab-title="item.title"
        :icon="item.icon"
      >
      </nut-tabbar-item>
    </nut-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { wxappLogout } from "@/api/api";
import { menuList } from "@/api/publicData";
const isShowLogout = ref(false);
const active = ref(0);
const menuIndex = 0

const tabSwitch = (item, index) => {
  if (index != menuIndex) {
    //不是当前菜单才跳转
    uni.navigateTo({
      url: menuList[index].path,
    });
  }
};

const toLoginFun = () => {
  uni.navigateTo({
    url: "../login/login",
  });
};
const logoutFunc = async (data, code) => {
  let params = { code, data: data.encryptedData, iv: data.iv };
  try {
    uni.showToast({
      title: "退出成功,请重新登录",
      icon: "none",
      duration: 2000,
    });
    const res = await wxappLogout(params);
    uni.clearStorageSync();
    toLoginFun();
  } catch (err) {
    console.log(err);
  }
};
const preLogout = async (loginRes) => {
  if (loginRes.code) {
    uni.getUserInfo({
      success: (res) => {
        logoutFunc(res, loginRes.code);
      },
    });
  }
};
const onOk = () => {
  uni.login({
    provider: "weixin",
    success: function (loginRes) {
      preLogout(loginRes);
    },
  });
};
</script>
<style>
page {
  background: #f2f2f2;
  color: #333;
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
.page {
  width: 100%;
}
</style>
