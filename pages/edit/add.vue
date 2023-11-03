<template>
  <div class="page">
    <div class="order-head">
      <nut-form>
        <nut-form-item label="出账日期">
          {{ orderDetailObj.billDateDay || "-" }}
        </nut-form-item>
        <nut-form-item
          label="报料对象"
          prop="receiveCompany"
          required
          :rules="[{ required: true, message: '请填写报料对象' }]"
        >
          <div class="nut-input-text" @click="openCompany">
            <div style="flex: 10">
              {{ orderDetailObj.receiveCompany || "请选择（必填）" }}
            </div>
            <div style="flex: 1">
              <nut-icon
                name="right"
                size="16"
                custom-color="#606266"
              ></nut-icon>
            </div>
          </div>
          <nut-popup position="bottom" v-model:visible="isShow">
            <nut-picker
              v-model="orderDetailObj.receiveCompanyObj"
              :columns="companyList"
              title="选择报料对象"
              @confirm="popupConfirm"
              @cancel="isShow = false"
            >
            </nut-picker>
          </nut-popup>
        </nut-form-item>
        <nut-form-item
          label="交货时间"
          prop="deliveryDate"
          required
          :rules="[{ required: true, message: '请填写交货时间' }]"
        >
          <div class="nut-input-text" @click="openTime">
            <div style="flex: 10">
              {{ orderDetailObj.deliveryDate || "请选择日期（必填）" }}
            </div>
            <div style="flex: 1">
              <nut-icon
                name="right"
                size="16"
                custom-color="#606266"
              ></nut-icon>
            </div>
          </div>
          <nut-popup position="bottom" v-model:visible="showTime">
            <nut-date-picker
              v-model="currentDate"
              title="时间选择"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              :filter="filter"
              :formatter="formatter"
              @confirm="confirmTime"
              @cancel="showTime = false"
            ></nut-date-picker>
          </nut-popup>
        </nut-form-item>
        <nut-form-item
          label="单据备注"
          required
          :rules="[{ required: true, message: '请填写单据备注' }]"
        >
          <nut-input
            v-model="orderDetailObj.billMark"
            clearable
            max-length="50"
            placeholder="请输入"
            type="text"
          />
        </nut-form-item>
      </nut-form>
    </div>
    <div class="order-detail">
      <div class="order-detail-title">报料明细</div>
      <div class="order-detail-list">
        <div v-for="(item, index) in orderDetailObj.detailList" :key="index">
          <nut-cell-group>
            <div class="order-detail-item">
              <div class="order-detail-item-left">明细{{ index + 1 }}</div>
              <div class="order-detail-item-right" @click="delItem(index)">
                移除
              </div>
            </div>

            <nut-cell
              title="品类"
              size="large"
              is-link
              @click="openCate(item, index)"
            >
              <template #desc>
                {{ item.category || "请选择品类" }}
              </template>
            </nut-cell>
            <nut-cell
              title="成色"
              size="large"
              is-link
              @click="openFineness(item, index)"
            >
              <template #desc>
                {{ item.fineness || "请选择成色" }}
              </template></nut-cell
            >
            <nut-cell title="重量(kg)" size="large">
              <template #desc>
                <input
                  v-model="item.gramWeight"
                  clearable
                  type="number"
                  size="small"
                  input-align="right"
                  placeholder="请输入重量"
                /> </template
            ></nut-cell>
            <nut-cell title="备注" size="large">
              <template #desc>
                <input
                  v-model="item.detailMark"
                  clearable
                  size="small"
                  input-align="right"
                  placeholder="请输入备注"
                />
              </template>
            </nut-cell>
          </nut-cell-group>
        </div>
        <nut-popup position="bottom" v-model:visible="isShowCate">
          <nut-picker
            :columns="cateList"
            title="请选择品类"
            @confirm="confirmCate"
            @cancel="isShowCate = false"
          >
          </nut-picker>
        </nut-popup>
        <nut-popup position="bottom" v-model:visible="isShowFineness">
          <nut-picker
            :columns="finenessList"
            title="请选择品类"
            @confirm="confirmFineness"
            @cancel="isShowFineness = false"
          >
          </nut-picker>
        </nut-popup>
      </div>
    </div>
    <div class="footer-height" v-show="isShowFooter"></div>
    <div class="footer" v-show="isShowFooter">
      <div class="footer-addBtn">
        <nut-button plain type="primary" block @click="addDetail">
          + 添加明细</nut-button
        >
      </div>
      <div class="footer-info">
        <div class="footer-info-left">
          <div>{{ sumWeight }}</div>
          <div>总计报料:{{ orderDetailObj.detailList.length || 0 }}项</div>
        </div>
        <div class="footer-info-right">
          <nut-button type="primary" @click="confirmOrder">
            确认信息</nut-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { onLoad } from "@dcloudio/uni-app";
import { ref, computed, watch } from "vue";
import utils from "@/utils/index";
import {
  material_appletGetReceiveCompanyList,
  material_appletGetCategoryList,
  material_appletAdd,
} from "@/api/api";

const orderDetailObj = ref({
  billDateDay: moment().format("YYYY-MM-DD"),
  detailList: [{}],
});
const isShow = ref(false);
const showTime = ref(false);
const companyList = ref([]);
const currentDate = ref(new Date());
const cateList = ref([]);

const isShowCate = ref(false);
const editItemIndex = ref(null);
const editItem = ref({});

const finenessList = ref([]);
const isShowFineness = ref(false);

const verifyOrderOneList = [
  { value: "receiveCompany", text: "报料对象" },
  { value: "deliveryDate", text: "交货日期" },
  { value: "billMark", text: "单据备注" },
];

const formatter = (type, option) => {
  switch (type) {
    case "year":
      option.text += "年";
      break;
    case "month":
      option.text += "月";
      break;
    case "day":
      option.text += "月";
      break;
    case "hour":
      option.text += "时";
      break;
    default:
      option.text += "分";
  }
  return option;
};

const filter = (type, options) => {
  // if (type == "hour") {
  //   return options.filter((option) => Number(option.value) % 1 === 0);
  // }
  return options;
};
const confirmTime = ({ selectedValue, selectedOptions }) => {
  if (selectedOptions && selectedOptions.length >= 3) {
    let timeTxt = `${selectedOptions[0].value || "2023"}-${
      selectedOptions[1].value || "00"
    }-${selectedOptions[2].value || "00"} ${selectedOptions[3].value || "00"}:${
      selectedOptions[4].value || "00"
    }:00`;
    currentDate.value = new Date(timeTxt);
    orderDetailObj.value.deliveryDate = timeTxt;
  }
  showTime.value = false;
};

const getWeight = (weight) => {
  if (!weight) return "0 kg";
  return utils.moneyFormat(weight) + " kg";
};
const openTime = () => {
  showTime.value = true;
};
const openCompany = () => {
  isShow.value = true;
};
const isShowFooter = computed(() => {
  return !(
    isShowFineness.value ||
    isShowCate.value ||
    showTime.value ||
    isShow.value
  );
});
const popupConfirm = (e) => {
  if (e.selectedValue && e.selectedValue.length) {
    let companyObj = {};
    companyList.value.forEach((item) => {
      companyObj[item.value] = item.text;
    });
    orderDetailObj.value.receiveCompany = companyObj[e.selectedValue[0]];
    orderDetailObj.value.receiveCompanyId = e.selectedValue[0];
  } else {
    orderDetailObj.value.receiveCompany = "";
    orderDetailObj.value.receiveCompanyId = null;
  }

  isShow.value = false;
};
const getCompany = async () => {
  try {
    const res = await material_appletGetReceiveCompanyList();
    companyList.value = utils.pickerArrayFormat(
      res,
      "receiveCompany",
      "receiveCompanyId"
    );
    const resCate = await material_appletGetCategoryList();
    resCate.forEach((item) => {
      let conditiList = [];
      item.conditi.split(",").forEach((ielem) => {
        conditiList.push({ text: ielem, value: ielem });
      });
      item.conditiList = conditiList;
      item.text = item.name;
      item.value = item.id;
    });
    cateList.value = resCate;
  } catch (err) {
    console.error("err:", err);
  }
};
const openCate = (e, index) => {
  editItemIndex.value = index;
  isShowCate.value = true;
};
//品类确认
const confirmCate = (e) => {
  if (e.selectedOptions.length && e.selectedOptions[0].conditiList) {
    orderDetailObj.value.detailList[editItemIndex.value].cateObj =
      e.selectedOptions[0];
    orderDetailObj.value.detailList[editItemIndex.value].finenessList =
      e.selectedOptions[0].conditiList;
  }

  orderDetailObj.value.detailList[editItemIndex.value].category =
    e.selectedOptions[0].name || null;

  isShowCate.value = false;
};
const openFineness = async (e) => {
  finenessList.value = e.finenessList || [];
  if (!finenessList.value.length) {
    uni.showToast({
      title: "品类未选择",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  isShowFineness.value = true;
};
const confirmFineness = (e) => {
  if (e.selectedOptions.length) {
    orderDetailObj.value.detailList[editItemIndex.value].fineness =
      e.selectedOptions[0].text || null;
    orderDetailObj.value.detailList[editItemIndex.value].finenessObj =
      e.selectedOptions[0];
  }
  isShowFineness.value = false;
};
const addDetail = () => {
  orderDetailObj.value.detailList.push({});
};
const delItem = (index) => {
  if (orderDetailObj.value.detailList.length <= 1) {
    uni.showToast({
      title: "只有一条明细，不能被删除！",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  orderDetailObj.value.detailList.splice(index, 1);
};
const sumWeight = computed(() => {
  let weightNum = 0;
  orderDetailObj.value.detailList.forEach((item) => {
    weightNum += item.gramWeight ? Number(item.gramWeight) : 0;
  });
  return utils.moneyFormat(weightNum) + "kg";
});
const verifyOrder = (e) => {
  let isVerify = true;
  verifyOrderOneList.forEach((item) => {
    if (!e[item.value]) {
      uni.showToast({
        title: item.text + "不能为空！",
        icon: "none",
        duration: 2000,
      });
      isVerify = false;
    }
  });

  if (e.detailJson.length && isVerify) {
    e.detailJson.forEach((ielem) => {
      if (!ielem.category) {
        uni.showToast({
          title: "品类不能为空！",
          icon: "none",
          duration: 2000,
        });
        isVerify = false;
      } else if (!ielem.fineness) {
        uni.showToast({
          title: "成色不能为空！",
          icon: "none",
          duration: 2000,
        });
        isVerify = false;
      } else if (!ielem.gramWeight) {
        uni.showToast({
          title: "报料重量不能为空！",
          icon: "none",
          duration: 2000,
        });
        isVerify = false;
      }
    });
  }
  console.log("校验:", e);
  return isVerify;
};
const addOrder = async (e) => {
  if (!verifyOrder(e)) {
    return;
  }
  try {
    await material_appletAdd(e);
    uni.showToast({
      title: "添加成功,正在返回列表页！",
      icon: "none",
      duration: 2000,
      success: (res) => {
        uni.navigateTo({
          url: `/pages/index/index`,
        });
      },
    });
  } catch (err) {
    console.error("新增失败:", err);
  }
};
const confirmOrder = () => {
  const {
    billMark,
    receiveCompany,
    receiveCompanyId,
    deliveryDate,
    detailList,
  } = orderDetailObj.value;
  let newArr = [];
  detailList.forEach((ielem) => {
    const { category, fineness, gramWeight, detailMark } = ielem;
    newArr.push({
      category,
      fineness,
      gramWeight,
      detailMark,
    });
  });
  let params = {
    billMark,
    receiveCompany,
    receiveCompanyId,
    deliveryDate,
    detailJson: newArr,
  };
  addOrder(params); //新增报料
};
onLoad((e) => {
  getCompany();
});
</script>
<style>
page {
  background: #fff;
  color: #333;
  font-weight: 400;
}
:root,
page {
  --nut-cell-background: #f9f9f9;
  --nut-cell-group-background-color: #ccc;
  --nut-cell-group-desc-color: #000;
  --nut-cell-group-title-color: #000;
}
</style>
<style lang="scss" scoped>
.page {
  .order-head {
    background: #fff;
  }
  .order-detail {
    background-color: #fff;
    padding: 0rpx 24rpx 24rpx 24rpx;
    .order-detail-title {
      font-size: 30rpx;
      font-weight: bold;
      line-height: 80rpx;
      border-bottom: 1rpx solid #f0f0f0;
    }
    &-item {
      display: flex;
      line-height: 80rpx;
      background: var(--nut-cell-background, var(--nut-white, #fff));
      padding: 0 20rpx;
      &-left {
        flex: 1;
      }
      &-right {
        flex: 1;
        text-align: right;
        color: red;
      }
    }
  }
  .nut-input-text {
    display: flex;
  }
  .cell-item {
    display: flex;
  }
  .footer-height {
    height: 200rpx;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 200rpx;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
    padding-top: 24rpx;
    z-index: 999;
    background: #fff;
    &-addBtn {
      padding: 0 20rpx;
      height: 90rpx;
      line-height: 90rpx;
      border-bottom: 1rpx solid #f0f0f0;
    }
    &-info {
      display: flex;
      &-left {
        flex: 1;
      }
      &-right {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
