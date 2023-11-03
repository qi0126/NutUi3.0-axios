<template>
  <div class="page">
    <div class="order-head">
      <nut-cell-group>
        <nut-cell
          title="出账日期"
          size="large"
          :desc="orderDetailObj.billDateDay || '-'"
        ></nut-cell>
        <nut-cell
          title="交货时间"
          size="large"
          :desc="orderDetailObj.deliveryDate || '-'"
        ></nut-cell>
        <nut-cell
          title="报料对象"
          size="large"
          :desc="orderDetailObj.receiveCompany || '-'"
        ></nut-cell>
        <nut-cell
          title="报料总重"
          size="large"
          :desc="getWeight(orderDetailObj.totalGramWeight)"
        ></nut-cell>
        <nut-cell
          title="提交时间"
          size="large"
          :desc="orderDetailObj.createTime || '-'"
        ></nut-cell>
        <nut-cell
          title="单据备注"
          size="large"
          :desc="orderDetailObj.billMark || '-'"
        ></nut-cell>
      </nut-cell-group>
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
        <div class="footer-div"></div>
      </div>
    </div>
    <div class="order-foot">
      <div class="edit-btn">
        <nut-button type="primary" @click="toEdit">编辑</nut-button>
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
const orderId = ref("");
const getWeight = (weight) => {
  if (!weight) return "0 kg";
  return utils.moneyFormat(weight) + " kg";
};
const getData = async (e) => {
  orderId.value = e.id;
  const res = await material_appletGetMaterialInfo({ id: e.id });
  let resTemp = JSON.parse(JSON.stringify(res));
  resTemp.billDateDay = moment(resTemp.billDate).format("YYYY-MM-DD");
  resTemp.detailList = JSON.parse(resTemp.detailJson);
  resTemp.detailList.forEach((ielem) => {
    ielem.gramWeightTxt = utils.moneyFormat(ielem.gramWeight);
  });
  orderDetailObj.value = resTemp;
};
const toEdit = () => {
  uni.navigateTo({
    url: `/pages/edit/edit?id=${orderId.value}`,
  });
};
onLoad((e) => {
  getData(e);
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
  .footer-div {
    height: 70rpx;
  }
  .order-foot {
    position: fixed;
    bottom: 0;
    height: 90rpx;
    line-height: 90rpx;
    background-color: #fff;
    text-align: right;
    width: 100%;
    padding-top: 14rpx;
    border-top: 1rpx solid #f0f0f0;
    .edit-btn {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
    }
  }
}
</style>
