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
              {{ selectedCompanyObj.company || "请选择（必填）" }}
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
          prop="createTime"
          required
          :rules="[{ required: true, message: '请填写交货时间' }]"
        >
          <div class="nut-input-text" @click="openTime">
            <div style="flex: 10">
              {{ orderDetailObj.createTime || "请选择日期（必填）" }}
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
              @confirm="confirm"
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
            <nut-cell :title="`明细${index + 1}`"></nut-cell>
            <nut-cell
              title="品类"
              size="large"
              is-link
              @click="openFineness(item)"
            >
              <template #desc>
                {{ item.category || "请选择品类" }}
              </template>
            </nut-cell>
            <nut-cell title="成色" size="large" is-link>
              <template #desc>
                {{ item.fineness || "请选择成色" }}
              </template></nut-cell
            >
            <nut-cell title="重量(kg)" size="large">
              <template #desc>
                <input
                  v-model="item.gramWeight"
                  clearable
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
} from "@/api/api";

const orderDetailObj = ref({
  billDateDay: moment().format("YYYY-MM-DD"),
  detailList: [{}],
});
const isShow = ref(false);
const showTime = ref(false);
const companyList = ref([]);
const currentDate = ref(new Date());
const selectedCompanyObj = ref({});
const cateList = ref([]);

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
const openFineness = async (e) => {};
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
const popupConfirm = (e) => {
  if (e.selectedValue && e.selectedValue.length) {
    let companyObj = {};
    companyList.value.forEach((item) => {
      companyObj[item.value] = item.text;
    });
    selectedCompanyObj.value.company = companyObj[e.selectedValue[0]];
    selectedCompanyObj.value.code = e.selectedValue[0];
  } else {
    selectedCompanyObj.value.company = "";
    selectedCompanyObj.value.code = null;
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
      item.conditiList = item.conditi.split(",")
      item.text = item.name
      item.value = item.id
    })
    cateList.value = resCate;
    console.log("品类列表:", cateList.value);
  } catch (err) {
    console.error("err:", err);
  }
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
  }
  .nut-input-text {
    display: flex;
  }
  .cell-item {
    display: flex;
  }
}
</style>
