<template>
  <div class="login">
    <div class="login-input">
      <nut-input v-model="loginName" clearable placeholder="请输入用户名">
        <template #left> <nut-icon name="my2" /> </template
      ></nut-input>
    </div>
    <div class="password-input">
      <nut-input
        v-model="loginPassword"
        type="password"
        placeholder="请输入密码"
      >
        <template #left> <nut-icon name="ask" /> </template
      ></nut-input>
    </div>
    <div class="login-btn">
      <nut-button block type="primary" @click="loginFunc" :disabled="isDisabled"
        >登录</nut-button
      >

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { wxappLoginN, wxappMyCompany } from "@/api/api";
const loginName = ref("");
const loginPassword = ref("");
const showBasic = ref(false);
const getCompanyList = async () => {
  const res = await wxappMyCompany();
  showBasic.value = true
  console.log("res:", res);
};
const wxLoginFun = async (params) => {
  try {
    const res = await wxappLoginN(params);
    uni.setStorage({
      key: "accessToken",
      data: res,
      success() {
        getCompanyList();
      },
    });
  } catch (err) {
    console.error("登录失败:", err);
  }
};
const loginFunc = () => {
  uni.login({
    provider: "weixin",
    success: function (loginRes) {
      const params = {
        code: loginRes.code,
        loginName: loginName.value,
        password: loginPassword.value,
      };
      wxLoginFun(params);
    },
  });
};
const isDisabled = computed(() => {
  return !(loginName.value.length && loginPassword.value.length);
});
</script>
<style>
page {
  background: #f2f2f2;
  color: #333;
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 300rpx 36rpx 0 36rpx;
  .login-input {
    width: 100%;
  }
  .password-input {
    margin-top: 30rpx;
    width: 100%;
  }
  .login-btn {
    margin-top: 50rpx;
    width: 100%;
  }
}
</style>
