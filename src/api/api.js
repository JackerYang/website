import axios from "./axios";

/**
 * @description 登录
 * @param {String} loginName
 * @param {String} loginPwd
 * @return {String} token
 */
export const login = params => {
  return axios.post("/login", params);
};

/**
 * @description 登出接口
 */
export const logout = () => {
  return axios.get("/logout");
};

/**
 * @description 获取登录用户
 * @return {Object}
 */
export const getLoginUser = () => {
  return axios.get("/loginUser");
};

/**
 * @description 修改密码
 * @param {String} oldLoginPwd
 * @param {String} newLoginPwd
 * @return {null}
 */
export const changePwd = params => {
  return axios.post("/updatePassword", params);
};

/**
 * @description 获取新增板块
 * @return {Array}
 */
export const getPlate = () => {
  return axios.get("/plates/all");
};

/**
 * @description 获取板块的信息
 * @param {Number} plate 板块id
 * @param {Number} page 页码
 * @param {Number} pageSize 每页条数
 * @return {Array}
 */
export const getPlateInfo = params => {
  return axios.get("/plateInfos", {
    params
  });
};

/**
 * @description 获取板块的单个信息
 * @param {Number} id 信息id
 * @return {Object}
 */
export const getPlateInfoDetail = id => {
  return axios.get(`/plateInfos/${id}`);
};

/**
 * @description 获取每个板块的前3条信息
 * @return {Array}
 */
export const getPlateInfoFor3 = () => {
  return axios.get("/plateInfos/firstThreeEveryPlate");
};

/**
 * @description 获取企业成果
 * @return {Array}
 */
export const getOrgAchievement = () => {
  return axios.get("/orgAchievements/all");
};

/**
 * @description 获取企业成果详情
 * @param {Number} id
 * @return {Array}
 */
export const getOrgAchievementDetail = id => {
  return axios.get(`/orgAchievements/${id}`);
};

/**
 * @description 获取有企业印象的年份
 * @return {Array}
 */
export const getOrgImpressionYear = () => {
  return axios.get("/orgImpressions/years");
};

/**
 * @description 获取企业印象
 * @param {String} year
 * @return {Array}
 */
export const getOrgImpression = year => {
  return axios.get("/orgImpressions/all", {
    params: {
      year
    }
  });
};

/**
 * @description 获取企业印象轮播
 * @return {Array}
 */
export const getOrgImpressionCarousel = () => {
  return axios.get("/orgImpressions/all");
};

/**
 * @description 获取一个企业印象详情
 * @param {Number} id
 * @return {Object}
 */
export const getOrgImpressionDetail = id => {
  return axios.get(`/orgImpressions/${id}`);
};

/**
 * @description 获取企业简介
 * @return {String}
 */
export const getOrgProfile = () => {
  return axios.get(`/orgProfiles`);
};

/**
 * @description 获取企业风光
 * @return {Array}
 */
export const getOrgScenery = () => {
  return axios.get(`/orgScenerys/web`);
};

/**
 * @description 获取组织机构
 * @return {Array}
 */
export const getSysOrg = () => {
  return axios.get(`/sysOrgs/tree`);
};

/**
 * @description 获取主要成员
 * @return {Array}
 */
export const getMember = () => {
  return axios.get(`/primaryMembers`);
};

/**
 * @description 获取一个主要成员
 * @param {Number} id
 * @return {Array}
 */
export const getMemberDetail = id => {
  return axios.get(`/primaryMembers/${id}`);
};

/**
 * =======================================================================================
 * 商城
 */

/**
 * @description 获取商品分类
 */
export const getShopClassify = () => {
  return axios.get(`/productTypes/tree`);
};

/**
 * @description 获取商品列表
 * @param {Number} page 页码
 * @param {Number} pageSize 每页多少条
 * @param {String} productName 名称搜索
 * @param {String} productPrice 价格排序
 * @param {String} productStock 库存排序
 * @param {String} viewNum 浏览数量排序
 * @param {String} minProductPrice 最小价格
 * @param {String} maxProductPrice 最大价格
 * @return {Array}
 */
export const getProductList = params => {
  return axios.get(`/products`, {
    params
  });
};

/**
 * @description 获取一个商品详情
 * @param {Number} id 商品id
 * @return {Object}
 */
export const getProduct = id => {
  return axios.get(`/products/${id}`);
};

/**
 * @description 根据id数组获取商品详情
 * @param {Number} ids 商品id
 * @return {Array}
 */
export const getProductByIds = id => {
  return axios.get(`/products/details/${id.toString()}`);
};

/**
 * @description 获取购物车列表
 * @param {Number} productName 商品名称
 * @return {Array}
 */
export const getCartList = productName => {
  return axios.get("/userShoppingCarts", {
    params: {
      productName
    }
  });
};

/**
 * @description 添加至购物车（单个添加，已登录情况）
 * @param {Number} productId 商品id
 * @param {Number} num 商品数量
 * @return {null}
 */
export const addCartSingle = params => {
  return axios.post("/userShoppingCarts", params);
};

/**
 * @description 添加至购物车（多个添加，由未登录到登录情况）
 * @param {Array} params productId num
 * @return {null}
 */
export const addCartMultiple = params => {
  return axios.post("/userShoppingCarts/session", params);
};

/**
 * @description 删除购物车商品
 * @param {Array} productIds 商品id
 * @return {Array}
 */
export const delCart = productIds => {
  return axios.delete(`/userShoppingCarts/${productIds.toString()}`);
};

/**
 * @description 改变商品数量
 * @param {Array} productId 商品id
 * @param {Array} num 商品数量
 * @return {null}
 */
export const changeCartNum = ({ productId, num }) => {
  return axios.get(`/userShoppingCarts/productNum/${productId}`, {
    params: {
      num
    }
  });
};

/**
 * @description 获取地理信息
 * @param {Number} pId 有则查询父级，没有查询根节点
 * @return {Array}
 */
export const getArea = pId => {
  return axios.get("/sysAreas", {
    params: {
      pId
    }
  });
};

/**
 * @description 根据id获取地理信息的消息
 * @param {Number} id
 * @return {Array}
 */
export const getAreaDetail = id => {
  return axios.get(`/sysAreas/${id}`);
};

/**
 * @description 获取收货地址
 * @return {Array}
 */
export const getAddress = () => {
  return axios.get(`/userAddresss`);
};

/**
 * @description 根据id获取一个收货地址详情
 * @param {Number} id
 * @return {Array}
 */
export const getAddressDetail = id => {
  return axios.get(`/userAddresss/${id}`);
};

/**
 * @description 添加或编辑收货地址
 * @param {Number} id 有编辑 无添加
 * @param {Number} province 省 id
 * @param {Number} city 市 id
 * @param {Number} area 区 id
 * @param {String} street 详细地址
 * @param {String} consigneeName 收货人
 * @param {String} consigneePhone 手机号码
 * @param {Number} isDefaultAddress 是否设为默认收货地址
 * @return {Array}
 */
export const editAddress = params => {
  return axios.post(`/userAddresss`, params);
};

/**
 * @description 根据id删除收货地址
 * @param {Number} id
 * @return {Array}
 */
export const delAddress = id => {
  return axios.delete(`/userAddresss/${id}`);
};

/**
 * @description 获取订单列表
 * @param {String} amountTotal 订单价格升降序 升：asc 降：desc
 * @param {String} code 订单号
 * @param {Number} maxAmountTotal 最大订单价格
 * @param {Number} minAmountTotal 最小订单价格
 * @param {Number} page 页码
 * @param {Number} pageSize 每页多少条
 * @param {String} productName 商品名称
 * @param {Number} status 订单状态
 * @return {Array}
 */
export const getOrderList = params => {
  return axios.get("/userOrders", {
    params
  });
};

/**
 * @description 获取一个订单详情
 * @param {Number} id 订单id
 * @return {Object}
 */
export const getOrder = id => {
  return axios.get(`/userOrders/${id}`);
};

/**
 * @description 提交订单
 * @param {Number} addressId 用户地址列表的id
 * @param {Array} userOrderProductList 产品列表 num productId
 * @return {Array}
 */
export const addOrder = params => {
  return axios.post("/userOrders", params);
};

/**
 * @description 删除订单
 * @param {Array} ids 订单id
 * @return {null}
 */
export const delOrder = ids => {
  return axios.delete(`/userOrders/${ids.toString()}`);
};

/**
 * @description 订单付款
 * @param {String} code 订单编号
 * @param {Number} id 订单ID
 * @return {Object}
 */
export const payOrder = params => {
  return axios.post(`/userOrders/pay`, params);
};
