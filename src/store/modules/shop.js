import {
  getProductList,
  getCartList,
  getProductByIds,
  delCart,
  getOrderList,
  delOrder
} from "@/api/api";
import router from "../../router/index";
import { getToken } from "../../libs/token";

export default {
  state: {
    // 商品查询条件
    condition: {
      productType: null,
      pageSize: 20,
      page: 1,
      productName: null,
      minProductPrice: null,
      maxProductPrice: null,
      productPrice: null,
      viewNum: null
    },

    // 商品列表和总数
    productList: [],
    productListTotal: 0,

    // 商品分类
    classify: [],

    // 购物车列表数据
    products: [],

    // 生成订单确认时的列表
    orderGenerate: [],

    // 订单列表和总数
    orderList: [],
    orderListTotal: 0,

    // 订单查询条件
    orderCon: {
      pageSize: 5,
      page: 1,
      productName: null,
      code: null,
      status: null
    }
  },

  getters: {
    // 购物车里商品总数
    cartLength: state => {
      if (!state.products.length) return 0;
      return state.products.reduce((res, curr) => {
        return res + curr.num;
      }, 0);
    }
  },

  mutations: {
    // 商品查询条件
    CHANGE_CONDITION: (state, data) => (state.condition = data),

    // 订单查询条件
    CHANGE_ORDER_CON: (state, data) => (state.orderCon = data),

    // 商品列表和总数
    CHANGE_PRODUCT_LIST: (state, { list, total }) => {
      state.productList = list;
      state.productListTotal = total;
    },

    // 商品分类
    CHANGE_CLASSIFY: (state, data) => (state.classify = data),

    // 购物车列表数据
    CHANGE_PRODUCTS: (state, data) => (state.products = data),

    // 生成订单确认时的商品列表
    CHANGE_ORDERGENERATE: (state, data) => (state.orderGenerate = data),

    // 订单列表修改
    CHANGE_ORDERS: (state, { list, total }) => {
      state.orderList = list;
      state.orderListTotal = total;
    }
  },

  actions: {
    // 获取产品列表api
    getProductList: async ({ state, commit }) => {
      let res = await getProductList(state.condition);
      if (res.data.res) {
        let { list, total } = res.data.data;
        commit("CHANGE_PRODUCT_LIST", { list, total });
      }
    },

    // 获取购物车列表api
    getCartList: async ({ commit }) => {
      if (getToken()) {
        let res = await getCartList();
        if (res.data.res) {
          commit("CHANGE_PRODUCTS", res.data.data);
        }
      } else {
        if (
          sessionStorage["X-website-cart"] &&
          sessionStorage["X-website-cart"] !== "{}"
        ) {
          let obj = JSON.parse(sessionStorage["X-website-cart"]);
          let ids = Object.keys(obj);
          let res = await getProductByIds(ids);
          if (res.data.res) {
            let data = res.data.data.map(item => {
              item.num = obj[item.id];
              return item;
            });
            commit("CHANGE_PRODUCTS", data);
          }
        } else {
          sessionStorage.removeItem("X-website-cart");
          commit("CHANGE_PRODUCTS", []);
        }
      }
    },
    // 删除购物车列表api
    delCartList: async ({ dispatch }, params) => {
      let { ids, callback } = params;
      if (getToken()) {
        let res = await delCart(ids);
        if (res.data.res) {
          callback && callback(res.data.msg);
          dispatch("getCartList");
        }
      } else {
        let obj = JSON.parse(sessionStorage["X-website-cart"]);
        Object.keys(obj).forEach(key => {
          if (ids.includes(Number(key))) {
            delete obj[key];
          }
        });
        callback && callback("操作成功！");
        sessionStorage["X-website-cart"] = JSON.stringify(obj);
        dispatch("getCartList");
      }
    },

    // 生成订单确认时的列表
    getOrderGenerateList: async ({ commit }) => {
      if (
        sessionStorage["X-website-orderGenerate"] &&
        sessionStorage["X-website-orderGenerate"] !== "{}"
      ) {
        let obj = JSON.parse(sessionStorage["X-website-orderGenerate"]);
        let ids = Object.keys(obj);
        let res = await getProductByIds(ids);
        if (res.data.res) {
          let data = res.data.data.map(item => {
            item.num = obj[item.id];
            return item;
          });
          commit("CHANGE_ORDERGENERATE", data);
        }
      } else {
        sessionStorage.removeItem("X-website-orderGenerate");
        commit("CHANGE_ORDERGENERATE", []);
        router.push({ name: "product-cart" });
      }
    },

    // 订单列表
    getOrderList: async ({ state, commit }) => {
      let res = await getOrderList(state.orderCon);
      if (res.data.res) {
        let { list, total } = res.data.data;
        commit("CHANGE_ORDERS", { list, total });
      }
    },
    // 删除订单列表
    delOrder: async ({ dispatch }, { ids, callback }) => {
      let res = await delOrder(ids);
      if (res.data.res) {
        callback && callback(res.data.msg);
        dispatch("getOrderList");
      }
    }
  }
};
