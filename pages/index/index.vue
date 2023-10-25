<template>
  <div class="page">
    <nut-loading-page :loading="pageLoading" />
    <nut-navbar>
      <template #content>
        <nut-input v-model="searchTxt" placeholder="请输入报料对象查询">
          <template #left> <nut-icon name="search2" /> </template
        ></nut-input>
      </template>
      <template #right>
        <nut-button type="primary" size="small">报料</nut-button>
      </template>
    </nut-navbar>

    <div>
      <div class="data-div">
        <div class="data-div-left">查询结果 {{ dataS.rowSize || 0 }} 条</div>
        <div class="data-div-right" @click="openSwitch">
          {{ showDataTxt }}
        </div>
        <nut-calendar
          v-model:visible="isVisible"
          :default-value="dateStart"
          type="range"
          :start-date="startDate"
          :end-date="endDate"
          @select="selectDate"
          @close="closeSwitch('isVisible')"
          @choose="setChooseValue"
          @returnFunc="returnFunc"
        >
        </nut-calendar>
      </div>
      <div>
        <nut-list
          v-if="dataS.data && dataS.data.length"
          :height="200"
          :listData="dataS.data || []"
          @scroll="handleScroll"
        >
          <template v-slot="{ item, index }">
            <div class="list-item" @click="toDetail(item)">
              <div
                class="list-item-title"
                :style="{ color: statusObj[item.status].color }"
              >
                {{ statusObj[item.status].label }}
              </div>
              <div>
                <nut-cell-group>
                  <nut-cell
                    title="报料对象"
                    icon="my"
                    :desc="item.receiveCompany"
                    is-link
                  ></nut-cell>
                  <nut-cell
                    title="报料总重"
                    :desc="getWeight(item.totalGramWeight)"
                  ></nut-cell>
                  <nut-cell
                    title="交货时间"
                    :desc="getTime(item.billDate)"
                  ></nut-cell>
                </nut-cell-group>
              </div>
            </div>
          </template>
        </nut-list>
        <div v-else>
          <nut-empty image="empty" description="无内容"></nut-empty>
        </div>
      </div>
    </div>
    <nut-tabbar
      v-if="!isVisible"
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
import moment from "moment";
import { onLoad } from "@dcloudio/uni-app";
import { ref, computed, watch } from "vue";
import { material_appletGetList } from "@/api/api";
import utils from "@/utils/index";
import { menuList } from "@/utils/publicData";
const active = ref(0);
const menuIndex = 0;
const searchTxt = ref("");
const dataS = ref({});
const pageLoading = ref(false);
const statusObj = {
  0: { label: "待确认", color: "#ee0a24" },
  1: { label: "已确认", color: "#33333" },
};
const startDate = ref(
  moment()
    .month(moment().month() - 3)
    .format("YYYY-MM-DD")
);
const endDate = ref(
  moment()
    .month(moment().month() + 3)
    .format("YYYY-MM-DD")
);
const dateStart = ref([
  moment().format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
]);
const isVisible = ref(false);
const dateTimeList = ref([]);
const showDataTxt = computed(() => {
  return dateTimeList.value.length === 2
    ? `${dateTimeList.value[0]}至${dateTimeList.value[1]}`
    : `筛选`;
});
const openSwitch = () => {
  if (dateTimeList.value.length === 2) {
    dateStart.value = [dateTimeList.value[0], dateTimeList.value[1]];
  } else {
    dateStart.value = [
      moment().format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
  }
  isVisible.value = true;
};
const closeSwitch = () => {
  isVisible.value = false;
};

const getData = async () => {
  pageLoading.value = true;
  try {
    let params = { keyWord: searchTxt.value, pageIndex: 1, rows: 9999 };
    if (dateTimeList.value.length === 2) {
      params.createDateStart = dateTimeList.value[0];
      params.createDateEnd = dateTimeList.value[1];
    }
    const res = await material_appletGetList(params);
    dataS.value = res;
  } catch (err) {
    console.error(err);
  } finally {
    pageLoading.value = false;
  }
};
const tabSwitch = (item, index) => {
  if (index != menuIndex) {
    //不是当前菜单才跳转
    uni.navigateTo({
      url: menuList[index].path,
    });
  }
};
const getTime = (time) => {
  return moment(time).format("YYYY-MM-DD");
};
const getWeight = (weight) => {
  if (!weight) return "0 kg";
  return utils.moneyFormat(weight) + " kg";
};
const selectDate = (param) => {
  if (param.length === 2) {
    dateTimeList.value = [param[0][3], param[1][3]];
  } else {
    dateTimeList.value = [];
  }
  getData();
};
const setChooseValue = () => {
  getData();
};
watch(searchTxt, () => {
  getData();
});
const toDetail = (e) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${e.id}`,
  });
};
const returnFunc = () => {
  dateTimeList.value = [];
  isVisible.value = false;
  getData();
};

onLoad(() => {
  getData();
});
</script>
<style>
page {
  background: #f2f2f2;
  color: #333;
  font-weight: 400;
}
:root,
page {
  --nut-cell-box-shadow: 0;
  --nut-cell-group-desc-color: #000;
}
</style>
<style lang="scss" scoped>
.page {
  width: 100%;
  .data-div {
    line-height: 80rpx;
    margin-top: -32rpx;
    display: flex;
    padding: 0 20rpx;
    .data-div-left {
      width: 50%;
    }
    .data-div-right {
      width: 50%;
      text-align: right;
    }
  }
  .list-item {
    background: #fff;
    padding: 0 32rpx 18rpx 32rpx;
    .list-item-title {
      border-bottom: 1rpx solid #f0f0f0;
      line-height: 72rpx;
      text-align: right;
    }
  }
}
</style>
