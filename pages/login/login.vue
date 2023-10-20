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
    <nut-popup
      :custom-style="{ width: '80%' }"
      round
      v-model:visible="showBasic"
    >
      <div class="company">
        <div class="company-title">
          <div class="company-title-txt">选择企业</div>
          <div class="company-title-del" @click="showBasic = false">
            <nut-icon name="close" size="12" custom-color="#999"></nut-icon>
          </div>
        </div>
        <div class="company-div">
          <div
            class="company-sub-div"
            @click="checkCompany(item)"
            v-for="(item, index) in companyList"
            :key="index"
          >
            {{ item.value || "-" }}
          </div>
        </div>
      </div>
    </nut-popup>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  wxappLoginN,
  wxappMyCompany,
  autoLogin,
  wxappLoginN2,
} from "@/api/api";
import { onLoad } from "@dcloudio/uni-app";

const loginName = ref("");
const loginPassword = ref("");
const showBasic = ref(false);
const userInfo = ref({});
const companyList = ref([]);

const toIndexFun = () => {
  uni.reLaunch({
    url: "../index/index",
  });
};
const wxappLogin = async (params) => {
  try {
    const res = await wxappLoginN2(params);
    toIndexFun();
  } catch (err) {
    console.error("公司登录失败:", err);
  }
};
const checkCompany = (item) => {
  uni.login({
    provider: "weixin",
    success: function (loginRes) {
      let params = {
        companyId: item.code,
        code: loginRes.code,
      };
      wxappLogin(params);
    },
  });
};
const getCompanyList = async () => {
  const res = await wxappMyCompany();
  companyList.value = res;
  if (res.length > 1) {
    showBasic.value = true;
  } else {
    checkCompany(res[0]);
  }
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
const autoLoginFunc = async (data, code) => {
  let params = { code, data: data.encryptedData, iv: data.iv };
  try {
    const res = await autoLogin(params);
    uni.setStorage({
      key: "accessToken",
      data: res,
      success() {
        toIndexFun();
      },
    });
  } catch (err) {
    console.error(err);
  }
};
const preLogin = (loginRes) => {
  if (loginRes.code) {
    uni.getUserInfo({
      success: (res) => {
        userInfo.value = res.userInfo;
        autoLoginFunc(res, loginRes.code);
      },
    });
  }
};

const autoLoginFun = () => {
  uni.login({
    provider: "weixin",
    success: function (loginRes) {
      preLogin(loginRes);
    },
    fail: (err) => {
      console.error(err);
    },
  });
};

onLoad(() => {
  autoLoginFun();
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
  .company {
    max-height: 400rpx;
    .company-title {
      display: flex;

      font-size: 28rpx;
      color: #333;
      line-height: 80rpx;
      .company-title-txt {
        text-align: center;
        flex: 10;
      }
      .company-title-del {
        flex: 1;
      }
    }
    .company-div {
      max-height: 400rpx;
      overflow-y: auto;
      .company-sub-div {
        border-top: 1rpx solid #f0f0f0;
        font-size: 28rpx;
        color: #333;
        text-align: center;
        line-height: 80rpx;
      }
    }
  }
}
</style>
