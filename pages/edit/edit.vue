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
          <nut-popup position="bottom" v-model:visible="show">
            <nut-picker
              v-model="orderDetailObj.receiveCompany"
              :columns="columns"
              title="选择报料对象"
              @confirm="popupConfirm"
              @cancel="show = false"
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
              type="datehour"
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
            class="nut-input-text"
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
            <nut-cell :title="`明细${index + 1}`"></nut-cell>
            <nut-cell
              title="品类"
              size="large"
              :desc="item.category || '-'"
            ></nut-cell>
            <nut-cell
              title="成色"
              size="large"
              :desc="item.fineness || '-'"
            ></nut-cell>
            <nut-cell
              title="重量(kg)"
              size="large"
              :desc="getWeight(item.gramWeight)"
            ></nut-cell>
            <nut-cell
              title="备注"
              size="large"
              :desc="item.detailMark || '-'"
            ></nut-cell>
          </nut-cell-group>
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
import { material_appletGetMaterialInfo } from "@/api/api";

const orderDetailObj = ref({});
const show = ref(false);
const showTime = ref(false);
const columns = ref([
  { text: "南京市", value: "NanJing" },
  { text: "无锡市", value: "WuXi" },
  { text: "海北藏族自治区", value: "ZangZu" },
  { text: "北京市", value: "BeiJing" },
  { text: "亮仔销售1", value: "LianYunGang" },
  { text: "浙江市", value: "ZheJiang" },
  { text: "江苏市", value: "JiangSu" },
]);
const currentDate = ref(new Date());

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
      option.text += "";
  }
  return option;
};

const filter = (type, options) => {
  if (type == "hour") {
    return options.filter((option) => Number(option.value) % 6 === 0);
  }
  return options;
};
const confirm = ({ selectedValue, selectedOptions }) => {
  console.log("aaa:", selectedOptions);
  if (selectedOptions && selectedOptions.length >= 3) {
    let timeTxt = `${selectedOptions[0].value || "2023"}-${
      selectedOptions[1].value || "00"
    }-${selectedOptions[2].value || "00"} ${
      selectedOptions[3].value || "00"
    }:00:00`;
    currentDate.value = new Date(timeTxt);
    orderDetailObj.value.createTime = timeTxt;
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
  show.value = true;
};
const popupConfirm = (e, index) => {
  console.log("e:", e, index);
  // orderDetailObj.value.receiveCompany = e.selectedValue;
  show.value = true;
};
const getData = async (e) => {
  const res = await material_appletGetMaterialInfo({ id: e.id });
  let resTemp = JSON.parse(JSON.stringify(res));
  resTemp.billDateDay = moment(resTemp.billDate).format("YYYY-MM-DD");
  resTemp.detailList = JSON.parse(resTemp.detailJson);
  resTemp.detailList.forEach((ielem) => {
    ielem.gramWeightTxt = utils.moneyFormat(ielem.gramWeight);
  });
  currentDate.value = new Date(resTemp.createTime);
  orderDetailObj.value = resTemp;
  console.log("edit:", resTemp);
};
onLoad((e) => {
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
  }
}
</style>
