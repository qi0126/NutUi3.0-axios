import http from "./http.js";

// 获取token，自动登录
export function autoLogin(params) {
  return http.post("/wxapp/autoLogin", params);
}
// 验证用户名\密码，这里指的是使用POST方法请求Login接口，并携带params对象作为参数。
export function wxappLoginN(params) {
  return http.post("/wxapp/loginN", params);
}

//我的公司
export function wxappMyCompany(params) {
  return http.get("/wxapp/myCompany", params);
}

// 退出登录
export function wxappAutoLogin(params) {
  return http.post("/wxapp/autoLogin", params);
}

// 公司Code登录
export function wxappLoginN2(params) {
  return http.post("/wxapp/loginN2", params);
}

// 退出登录
export function wxappLogout(params) {
  return http.post("/wxapp/logout", params);
}

// 用户信息
export function wxappMyInfo(params) {
  return http.get("/wxapp/myInfo", params);
}

//列表
export function material_appletGetList(params) {
  return http.postJson("/material_applet/getList", params);
}
