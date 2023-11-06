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
            {{ orderDetailObj.receiveCompany || "-" }}
          </div>
          <nut-popup position="bottom" v-model:visible="isShow">
            <nut-picker
              v-model="orderDetailObj.receiveCompanyList"
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
          prop="createTime"
          required
          :rules="[{ required: true, message: '请填写交货时间' }]"
        >
          <div class="nut-input-text" @click="openTime">
            {{ orderDetailObj.createTime || "-" }}
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
              @confirm="confirm"
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
            v-model="categoryChecked"
            :columns="cateList"
            title="请选择品类"
            @confirm="confirmCate"
            @cancel="isShowCate = false"
          >
          </nut-picker>
        </nut-popup>
        <nut-popup position="bottom" v-model:visible="isShowFineness">
          <nut-picker
            v-model="finenessChecked"
            :columns="finenessList"
            title="请选择成色"
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
          <div v-if="orderDetailObj.detailList">
            总计报料:{{ orderDetailObj.detailList.length || 0 }}项
          </div>
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
  material_appletGetMaterialInfo,
  material_appletGetReceiveCompanyList,
  material_appletGetCategoryList,
  material_appletEdit,
} from "@/api/api";

const orderDetailObj = ref({});
const showTime = ref(false);
const isShow = ref(false);
const isShowCate = ref(false);
const editItemIndex = ref(null);
const finenessList = ref([]);
const cateList = ref([]);
const companyList = ref([]);
const isShowFineness = ref(false);
const currentDate = ref(new Date());
const orderId = ref(null);
const categoryChecked = ref([]); //品类picker回填index
const finenessChecked = ref([]); //成色picker回填index
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
  return options;
};
const isShowFooter = computed(() => {
  return !(
    isShowFineness.value ||
    isShowCate.value ||
    showTime.value ||
    isShow.value
  );
});
const confirm = ({ selectedValue, selectedOptions }) => {
  if (selectedOptions && selectedOptions.length >= 3) {
    let timeTxt = `${selectedOptions[0].value || "2023"}-${
      selectedOptions[1].value || "00"
    }-${selectedOptions[2].value || "00"} ${selectedOptions[3].value || "00"}:${
      selectedOptions[4].value || "00"
    }:00`;
    currentDate.value = new Date(timeTxt);
    orderDetailObj.value.createTime = timeTxt;
  }
  showTime.value = false;
};
const openTime = () => {
  showTime.value = true;
};
const openCompany = () => {
  orderDetailObj.value.receiveCompanyList = [
    orderDetailObj.value.receiveCompanyId,
  ];
  isShow.value = true;
};
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
  } finally {
    orderDetailObj.value.detailList.forEach((ielem) => {
      ielem.finenessList =
        cateList.value.find((jelem) => jelem.text === ielem.category)
          .conditiList || [];
    });
  }
};
const getData = async (e) => {
  try {
    const res = await material_appletGetMaterialInfo({ id: e.id });
    let resTemp = JSON.parse(JSON.stringify(res));
    resTemp.billDateDay = moment(resTemp.billDate).format("YYYY-MM-DD");
    resTemp.detailList = JSON.parse(resTemp.detailJson);
    resTemp.detailList.forEach((ielem) => {
      ielem.gramWeightTxt = utils.moneyFormat(ielem.gramWeight);
    });
    currentDate.value = new Date(resTemp.createTime);
    orderDetailObj.value = resTemp;
  } catch (err) {
    console.error("err:", err);
  } finally {
    getCompany();
  }
};
const openCate = (e, index) => {
  editItemIndex.value = index;
  categoryChecked.value = [
    cateList.value.find((item) => item.text === e.category)?.value,
  ];
  isShowCate.value = true;
};
//品类确认
const confirmCate = (e) => {
  let editItem = orderDetailObj.value.detailList[editItemIndex.value];
  if (editItem.category != e.selectedOptions[0].name) {
    //品类不一致才执行赋值
    if (e.selectedOptions.length && e.selectedOptions[0].conditiList) {
      editItem.cateObj = e.selectedOptions[0];
      editItem.finenessList = e.selectedOptions[0].conditiList;
    }

    editItem.category = e.selectedOptions[0].name || null;
    editItem.fineness = null;
    finenessChecked.value = [];
  }

  isShowCate.value = false;
};
const openFineness = async (e, index) => {
  editItemIndex.value = index;
  finenessChecked.value = [e.fineness];
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
  let editItem = orderDetailObj.value.detailList[editItemIndex.value];
  editItem.fineness = e.selectedValue[0] || editItem.finenessList[0].value;
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
  if (
    orderDetailObj.value &&
    orderDetailObj.value.detailList &&
    orderDetailObj.value.detailList.length
  ) {
    orderDetailObj.value.detailList.forEach((item) => {
      weightNum += item.gramWeight ? Number(item.gramWeight) : 0;
    });
  }

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
  return isVerify;
};
const editOrder = async (e) => {
  if (!verifyOrder(e)) {
    return;
  }
  try {
    await material_appletEdit(e);
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
    id: orderId.value,
    billMark,
    receiveCompany,
    receiveCompanyId,
    deliveryDate,
    detailJson: newArr,
  };
  editOrder(params); //新增报料
};
onLoad((e) => {
  orderId.value = e.id;

  getData(e);
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
