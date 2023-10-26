import _ from "lodash-es";
const utils = {
  // 重量千分数
  moneyFormat(value) {
    if (value) {
      return `${Number(value).toFixed(2)}`.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
    } else {
      return "0";
    }
  },

  // 件数千分数
  numberFormat(value) {
    if (value) {
      return `${Number(value)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0";
    }
    // return value
  },
  // 对象数组去重
  unique(arr) {
    let unique = {};
    arr.forEach((item) => {
      unique[JSON.stringify(item)] = item;
    });
    arr = Object.keys(unique).map(function (u) {
      return JSON.parse(u);
    });
    return arr;
  },
  // picker数组格式化
  pickerArrayFormat(arr){
    let newArr = _.cloneDeepWith(arr)
    return newArr
  }
};

export default utils
