import Main from "../Main.vue";

export default [
  {
    path: "/",
    component: Main,
    children: [
      // 首页
      {
        path: "",
        name: "home",
        component: () => import("../views/Home.vue")
      },
      // 企业  企业简介 && 企业风光 && 企业印象 && 企业印象详情 && 企业成果详情
      {
        path: "company",
        component: () => import("../views/company/Company.vue"),
        children: [
          // 企业简介
          {
            path: "profile",
            name: "company-profile",
            component: () => import("../views/company/CompanyProfile.vue")
          },
          // 企业风光
          {
            path: "scenery",
            name: "company-scenery",
            component: () => import("../views/company/CompanyScenery.vue")
          },
          // 企业印象
          {
            path: "impression",
            name: "company-impression",
            component: () => import("../views/company/CompanyImpression.vue")
          },
          // 企业印象详情
          {
            path: "impression/:id",
            name: "company-impression-detail",
            component: () =>
              import("../views/company/CompanyImpressionDetail.vue")
          },
          // 企业成果详情
          {
            path: "achievement/:id",
            name: "company-achievement-detail",
            component: () =>
              import("../views/company/CompanyAchievementDetail.vue")
          }
        ]
      },
      // 机构 组织机构 && 主要成员 && 成员详情
      {
        path: "mechanism",
        component: () => import("../views/mechanism/Mechanism.vue"),
        children: [
          // 组织机构
          {
            path: "organization",
            name: "mechanism-organization",
            component: () =>
              import("../views/mechanism/MechanismOrganization.vue")
          },
          // 主要成员
          {
            path: "member",
            name: "mechanism-member",
            component: () => import("../views/mechanism/MechanismMember.vue")
          },
          // 成员详情
          {
            path: "member/:id",
            name: "mechanism-member-detail",
            component: () =>
              import("../views/mechanism/MechanismMemberDetail.vue")
          }
        ]
      },
      // 新增自定义模块
      {
        path: "template",
        component: () => import("../views/template/Template.vue"),
        children: [
          // 模块列表
          {
            path: "list/:id",
            name: "template-list",
            component: () => import("../views/template/TemplateList.vue")
          },
          // 模块详情
          {
            path: "list/:id/detail/:_id",
            name: "template-detail",
            component: () => import("../views/template/TemplateDetail.vue")
          }
        ]
      },
      // 商城 商品列表
      {
        path: "shop",
        component: () => import("../views/shop/Shop.vue"),
        children: [
          // 商品列表
          {
            path: "list",
            name: "product-list",
            component: () => import("../views/shop/ProductList.vue")
          },
          // 商品详情
          {
            path: "detail/:id",
            name: "product-detail",
            component: () => import("../views/shop/ProductDetail.vue")
          },
          // 购物车
          {
            path: "cart",
            name: "product-cart",
            component: () => import("../views/shop/ProductCart.vue")
          },
          // 提交订单
          {
            path: "order/generate",
            name: "order-generate",
            component: () => import("../views/shop/OrderGenerate.vue")
          },
          // 付款页面
          {
            path: "order/pay",
            name: "order-pay",
            component: () => import("../views/shop/OrderPay.vue")
          },
          // 订单列表
          {
            path: "order",
            name: "product-order",
            component: () => import("../views/shop/ProductOrder.vue")
          },
          // 订单详情
          {
            path: "order/detail/:id",
            name: "product-order-detail",
            component: () => import("../views/shop/ProductOrderDetail.vue")
          }
        ]
      }
    ]
  }
];
