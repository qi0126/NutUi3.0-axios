const apiUrlMap = {
  dev: "http://192.168.16.25:31001", //开发环境
  test: "http://192.168.16.25:31003", //测试环境
  build: "https://wx.batar.cn", //生产环境
};

const imgUrlMap = {
  dev: "http://192.168.16.8:30029",
  test: "http://192.168.16.25:30009",
  build: "http://image.batar.cn",
};

const env = "test";

const baseApiUrl = apiUrlMap[env];
const baseImgUrl = imgUrlMap[env];

const defaultHeader = {
  "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
  appName: "BATAR_SUPPLY_SCM",
};

function request(url, data, method = "GET", options = {}) {
  const { header = {}, timeout = 30000, loading } = options;
  return new Promise((resolve, reject) => {
    if (loading) {
      uni.showLoading({
        title: "加载中",
      });
    }
    uni.request({
      url: `${baseApiUrl + url}`,
      method,
      data: data || {},
      header: {
        accessToken: uni.getStorageSync("accessToken"),
        ...defaultHeader,
        ...header,
      },
      timeout,
      success: (res) => {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          if (res.statusCode == 403) {
            const { keys } = uni.getStorageInfoSync();
            keys.forEach((key) => {
              /**
               * 保留需要的缓存
               */
              !["userName"].includes(key) && uni.removeStorageSync(key);
            });
            uni.reLaunch({
              url: "/pages/index/index",
            });
          } else {
            uni.showToast({
              title: res.data,
              icon: "none",
              duration: 2000,
            });
            reject(res.data);
          }
        }
      },
      fail: (error) => {
        const data = error.response?.data;
        uni.showToast({
          title: data?.message || "网络开小差了",
          icon: "none",
          duration: 2000,
        });
        reject(data);
      },
      complete() {
        if (loading) {
          uni.hideLoading();
        }
      },
    });
  });
}

request.imgUrl = baseImgUrl;
export default request;
