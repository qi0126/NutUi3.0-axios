<template>
  <div class="mine">
    <div class="mine-detail flex">
      <div class="per flex">
        <image class="user-face" :src="userImg" />
        <div class="user-info">
          <div class="name">{{ userInfoData.account || "-" }}</div>
          <div>
            <nut-tag plain>{{ userInfoData.companyName || "-" }}</nut-tag>
            <span class="change-company-span" @click="openCompany"
              >切换公司</span
            >
          </div>
        </div>
      </div>
      <div class="setup" @click="isShowLogout = true">
        <nut-icon name="setting" size="28rpx"></nut-icon>
      </div>
      <nut-dialog
        title="退出账号"
        content="确定退出当前账号"
        v-model:visible="isShowLogout"
        @cancel="isShowLogout = false"
        @ok="onOk"
      />
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
    <div class="mine-order">
      <div class="operation-list flex">
        <div
          v-for="(item, index) in operationOrder"
          class="operation-item"
          :key="index"
        >
          <nut-badge
            class="badge"
            right="10"
            :value="item.badge"
            v-if="item.badge"
          >
            <image class="icon" :src="'/static/mine/' + item.icon + '.png'" />
            <div>{{ item.name }}</div>
          </nut-badge>
          <div v-else>
            <image class="icon" :src="'/static/mine/' + item.icon + '.png'" />
            <div>{{ item.name }}</div>
          </div>
        </div>
        <div class="operation-item">
          <image class="icon" src="/static/mine/order.png" />
          <div>我的订单</div>
          <div class="tips">查看发票</div>
        </div>
      </div>

      <div class="order-message flex">
        <div>
          <image
            class="goods-image"
            src="https://m.360buyimg.com/n2/jfs/t1/201010/7/13094/133768/61694f3fE609d4f5e/5cbe7975e8f135f1.jpg"
          />
        </div>
        <div class="order-into">
          <div>等待上传资料</div>
          <div class="tips">您已提交订单，请等待系统确认</div>
        </div>
      </div>
    </div>

    <div class="mine-pin flex">
      <div class="pin-item" v-for="(item, index) in pinList" :key="index">
        <div class="pin-item-value">{{ item.value }}</div>
        <div class="pin-item-label">{{ item.label }}</div>
      </div>
    </div>
    <div class="mine-tools flex">
      <div class="entry-item" v-for="(item, index) in entryList" :key="index">
        <image class="entry-item-icon" :src="item.icon" />
        <div class="entry-item-label">{{ item.label }}</div>
      </div>
    </div>

    <nut-divider dashed>商品推荐</nut-divider>

    <div class="min-recommend">
      <nut-card
        v-for="(item, index) in goodsList"
        :key="index"
        :img-url="item.imgUrl"
        :title="item.title"
        class="goods-item"
        :price="item.price"
        :vipPrice="item.vipPrice"
        :shopDesc="item.shopDesc"
        :delivery="item.delivery"
        :shopName="item.shopName"
      ></nut-card>
    </div>
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
import { ref } from "vue";
import {
  wxappMyInfo,
  wxappLogout,
  wxappLoginN2,
  wxappMyCompany,
} from "@/api/api";
import { menuList } from "@/utils/publicData";
import { onLoad } from "@dcloudio/uni-app";
const active = ref(2);
const menuIndex = 2;

const operationOrder = ref([
  {
    name: "待付款",
    icon: "pay",
  },
  {
    name: "待收货",
    icon: "list",
  },
  {
    name: "待评价",
    icon: "evaluate",
    badge: 12,
  },
  {
    name: "退款/售后",
    icon: "refund",
    badge: 2,
  },
]);
const pinList = ref([
  {
    label: "银子",
    key: "money",
    value: "121",
  },
  {
    label: "优惠券",
    key: "coupon",
    value: "3",
  },
  {
    label: "商品收藏",
    key: "collect",
    value: "0",
  },
  {
    label: "店铺关注",
    key: "favorite",
    value: "10",
  },
  {
    label: "浏览记录",
    key: "log",
    value: "107",
  },
]);
const entryList = ref([
  {
    label: "五折专区",
    icon: "https://img10.360buyimg.com/imagetools/s100x100_jfs/t1/171408/20/5251/89724/601919feE621f66a5/79fd92576b72cfd4.gif",
  },
  {
    label: "手机通讯",
    icon: "https://img12.360buyimg.com/imagetools/s100x100_jfs/t1/135346/37/5276/9667/5f1a50a3E51cf1d21/2831b07712127aaa.png",
  },
  {
    label: "米面粮油",
    icon: "https://img30.360buyimg.com/imagetools/s100x100_jfs/t1/112915/31/1239/9586/5e9586eaE549f1ecb/75ee4f10fdb43a1d.png",
  },
  {
    label: "时令生鲜",
    icon: "https://img12.360buyimg.com/imagetools/s100x100_jfs/t1/128638/35/7916/14107/5f1a50a3E316b5020/e25dd3e7d15c835d.png",
  },
  {
    label: "酒水饮料",
    icon: "https://img11.360buyimg.com/imagetools/s100x100_jfs/t1/126267/19/7965/10474/5f1a50a3E9dbf8c1e/1ccdc3b1f6f14fe7.png",
  },
  {
    label: "烹饪厨具",
    icon: "https://img20.360buyimg.com/imagetools/s100x100_jfs/t1/136473/9/5269/10071/5f1a50a3E211837ab/88345f88c8242cd3.png",
  },
  {
    label: "美妆护肤",
    icon: "https://img10.360buyimg.com/imagetools/s100x100_jfs/t1/142203/8/3785/10276/5f1a50a3E7b0efbc5/b156c58c52dc734d.png",
  },
  {
    label: "清洁纸品",
    icon: "https://img11.360buyimg.com/imagetools/s100x100_jfs/t1/138185/13/3701/9381/5f1a50a3Ea36e2578/ad39b6bd9007c009.png",
  },
  {
    label: "床上用品",
    icon: "https://img11.360buyimg.com/imagetools/s100x100_jfs/t1/122764/9/7920/11265/5f1a50a3Ea5580ddb/7dd7b2b5fc497e4b.png",
  },
  {
    label: "钟表奢品",
    icon: "https://img13.360buyimg.com/imagetools/s100x100_jfs/t1/122338/17/8034/12430/5f1a50a3Ec3d71123/84f59b915f232b5b.png",
  },
]);
const goodsList = ref([
  {
    imgUrl:
      "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
    title:
      "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
    price: "388",
    vipPrice: "378",
    shopDesc: "自营",
    delivery: "厂商配送",
    shopName: "阳澄湖大闸蟹自营店>",
  },
  {
    imgUrl:
      "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
    title:
      "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
    price: "388",
    vipPrice: "378",
    shopDesc: "自营",
    delivery: "厂商配送",
    shopName: "阳澄湖大闸蟹自营店>",
  },
  {
    imgUrl:
      "//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg",
    title:
      "活蟹】湖塘煙雨 阳澄湖大闸蟹公4.5两 母3.5两 4对8只 鲜活生鲜螃蟹现货水产礼盒海鲜水",
    price: "388",
    vipPrice: "378",
    shopDesc: "自营",
    delivery: "厂商配送",
    shopName: "阳澄湖大闸蟹自营店>",
  },
]);
const userInfoData = ref({});
const isShowLogout = ref(false);
const userImg = ref("");
const showBasic = ref(false);
const companyList = ref([]);
const tabSwitch = (item, index) => {
  if (index != menuIndex) {
    //不是当前菜单才跳转
    uni.navigateTo({
      url: menuList[index].path,
    });
  }
};
const getMyInfo = async () => {
  try {
    uni.getUserInfo({
      success: (res) => {
        userImg.value = res?.userInfo?.avatarUrl;
      },
    });
    const res = await wxappMyInfo();
    userInfoData.value = {
      account: res?.user?.account,
      companyName: res?.currentCompany?.companyName,
    };
  } catch (err) {
    console.err("err:", err);
  }
};
const toLoginFun = () => {
  uni.reLaunch({
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
    console.error(err);
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
const wxappLogin = async (params) => {
  try {
    await wxappLoginN2(params);
    uni.showToast({
      title: "切换公司成功，正在刷新！",
      icon: "none",
      duration: 2000,
    });
    showBasic.value = false;
    getMyInfo();
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
  showBasic.value = true;
};
const openCompany = () => {
  getCompanyList();
  showBasic.value = true;
};
onLoad(() => {
  getMyInfo();
});
</script>
<style>
page {
  background: #f2f2f2;
  color: #333;
  font-weight: 400;
}
:root {
  --nut-card-left-background-color: #fff;
}
</style>
<style lang="scss" scoped>
.mine-detail {
  margin: 10rpx 0;
  justify-content: space-between;

  > .per {
    > .user-face {
      width: 100rpx;
      height: 100rpx;
    }

    > .user-info {
      font-weight: bold;
      margin-left: 20rpx;
      .change-company-span {
        font-size: 24rpx;
        margin-left: 20rpx;
      }
    }
  }
}

.mine {
  padding: 32rpx 16rpx;
}
.min-recommend {
  background: #fff;
  padding: 16rpx;
  > .goods-item {
    margin: 10rpx 0;
  }
}
.icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 15rpx;
}

.flex {
  display: flex;
}

.mine-order,
.mine-pin,
.mine-tools {
  background: #fff;
  box-shadow: 6rpx 10rpx 24rpx rgba(126, 126, 126, 0.1);
  margin: 20rpx 0;
  border-radius: 24rpx;
  padding: 32rpx 16rpx;
}

.mine-order {
  > .order-message {
    padding: 16rpx;
    border-radius: 20rpx;
    background: #f3f5f7;
    align-items: center;
    margin-top: 20rpx;
  }

  > .operation-list {
    > .operation-item {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 24rpx;
      font-weight: 400;
      flex-direction: column;
    }
  }
}

.goods-image {
  border-radius: 20rpx;
  width: 100rpx;
  height: 100rpx;
}

.order-into {
  margin-left: 10rpx;
  font-size: 24rpx;
}

.tips {
  font-size: 24rpx;
  color: #999;
  letter-spacing: 2rpx;
  margin-top: 10rpx;
}

.mine-tools {
  flex-wrap: wrap;
}

.entry-item {
  gap: 0rpx 20rpx;
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150rpx;

  > .entry-item-icon {
    width: 68rpx;
    height: 68rpx;
    margin-bottom: 20rpx;
  }

  > .entry-item-label {
    font-size: 24rpx;
  }
}

.pin-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .pin-item-value {
    font-size: 32rpx;
    margin-bottom: 20rpx;
    font-weight: 600;
  }

  > .pin-item-label {
    font-size: 24rpx;
    font-weight: 600;
  }
}

.badge {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
