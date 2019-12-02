<template>
  <div class="order-generate">
    <!-- 头部信息 -->
    <div class="info">
      <div class="title clearfloat">
        <p class="title-all">提交订单</p>
        <p class="title-price">
          <Steps :current="1" size="small">
            <Step title="拍下商品"></Step>
            <Step title="提交订单"></Step>
            <Step title="完成付款"></Step>
          </Steps>
        </p>
      </div>
      <Divider />
    </div>

    <!-- 收货人信息 -->
    <div class="receipt">
      <div class="item-title clearfloat">
        <span class="title">收货人信息</span>
        <span class="extra">
          <Button size="small" @click="editAddress(null)">新增收货地址</Button>
        </span>
      </div>
      <div :class="['items', showMore ? 'big' : '']">
        <!-- item -->
        <div class="item" v-for="address in addresss" :key="address.id">
          <div
            @click="selectAddress(address.id)"
            :class="['selector', currentAddressId === address.id ? 'active' : '']"
          >{{ address.consigneeName }}</div>
          <div class="detail">
            <span class="base" :title="address.detail">
              {{ address.consigneeName }}&emsp;
              {{ address.provinceObj.areaName }}
              {{ address.cityObj.areaName }}
              {{ address.areaObj.areaName }}
              {{ address.street }}
              &emsp;{{ address.consigneePhone }}&emsp;
              <span
                v-if="address.isDefaultAddress"
              >默认地址</span>
            </span>
            <span class="btn">
              <Button size="small" type="primary" @click="editAddress(address.id)">编辑</Button>
              <Button size="small" type="error" @click="delAddress(address.id)">删除</Button>
            </span>
          </div>
        </div>
      </div>
      <div class="more" v-if="addresss.length > 1">
        <Button @click="showMore = !showMore" size="small">
          <span>{{ showMore ? "收起地址 " : "更多地址 " }}</span>
          <Icon :type="showMore ? 'ios-arrow-up' : 'ios-arrow-down'" />
        </Button>
      </div>
    </div>

    <!-- 商品清单 -->
    <div class="list">
      <div class="item-title clearfloat">
        <span class="title">商品清单</span>
        <span class="extra">
          <Button size="small" @click="toCart">返回购物车</Button>
        </span>
      </div>
      <div class="items">
        <div class="item title">
          <div class="attr">商品信息</div>
          <div class="settlement">
            <div class="price">单价</div>
            <div class="number">数量</div>
            <div class="total">小计</div>
          </div>
        </div>
        <div class="item" v-for="product in orderGenerate" :key="product.id">
          <div class="attr">
            <div class="img">
              <img @click.prevent="viewDetail(product.id)" :src="product.firstProductImgPath" />
            </div>
            <div @click.prevent="viewDetail(product.id)" class="name">{{ product.productName }}</div>
          </div>
          <div class="settlement">
            <div class="price">￥{{ product.productPrice }}</div>
            <div class="number">X {{ product.num}}</div>
            <div class="total">￥{{ product.productPrice * product.num }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认信息 -->
    <div class="confirm">
      <p class="pro">
        <span class="num">
          <span>{{ total.num }}</span> 件商品
        </span>
        <span>应付总额：</span>
        <span class="price">￥{{ total.price }}</span>
      </p>
      <p class="person">
        <span>寄送至： {{ currentAddress.area + currentAddress.street }}</span>
        <span>收货人： {{ currentAddress.consigneeName }} {{ currentAddress.consigneePhone }}</span>
      </p>
    </div>

    <div class="submit">
      <Button size="large" type="primary" @click="generateOrder">提交订单</Button>
    </div>

    <!-- 收货人添加编辑框 -->
    <Modal
      v-model="show"
      :mask-closable="false"
      :closable="false"
      :title="currentAddress.id ? '编辑' : '添加'"
    >
      <Form ref="tempAddress" :model="tempAddress" :rules="ruleValidate" :label-width="80">
        <FormItem label="所在地区" prop="area">
          <Cascader v-model="tempAddress.area" change-on-select :data="areas" :load-data="loadData"></Cascader>
        </FormItem>
        <FormItem label="详细地址" prop="street">
          <Input v-model="tempAddress.street" placeholder="请输入详细地址"></Input>
        </FormItem>
        <FormItem label="收货人" prop="consigneeName">
          <Input v-model="tempAddress.consigneeName" placeholder="请输入收货人"></Input>
        </FormItem>
        <FormItem label="手机号码" prop="consigneePhone">
          <Input v-model="tempAddress.consigneePhone" placeholder="请输入手机号码"></Input>
        </FormItem>
        <FormItem label prop="isDefaultAddress">
          <Checkbox
            size="large"
            v-model="tempAddress.isDefaultAddress"
            :true-value="1"
            :false-value="0"
            label="设置为默认收货地址"
          >设置为默认收货地址</Checkbox>
        </FormItem>
      </Form>
      <div class="clearfloat" slot="footer">
        <todo-button space="20px" @on-save="save" @on-cancel="cancel"></todo-button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TodoButton from "../../components/common/TodoButton.vue";
import {
  getArea,
  getAreaDetail,
  getAddress,
  getAddressDetail,
  editAddress,
  delAddress,
  addOrder
} from "@/api/api";
export default {
  name: "order-generate",
  components: {
    TodoButton
  },
  computed: {
    orderGenerate() {
      return this.$store.state.shop.orderGenerate;
    },
    total() {
      let num = 0;
      let price = 0;
      this.orderGenerate.forEach(item => {
        num = num + item.num;
        price = price + item.num * item.productPrice;
      });
      return { num, price };
    }
  },
  data() {
    return {
      // 收货地址
      addresss: [],
      // 当前选中地址的id
      currentAddressId: 1,
      // 当前选中的地址
      currentAddress: {
        area: "",
        street: "",
        consigneeName: "",
        consigneePhone: ""
      },

      // 临时变量，存储添加编辑的数据
      tempAddress: {
        area: [],
        street: "",
        consigneeName: "",
        consigneePhone: "",
        isDefaultAddress: 0
      },

      // 表单验证规则
      ruleValidate: {
        area: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一项所在地区",
            trigger: "change"
          },
          {
            type: "array",
            max: 3,
            message: "最多选择三项所在地区",
            trigger: "change"
          }
        ],
        street: [
          {
            required: true,
            message: "详细地址不能为空",
            trigger: "change"
          }
        ],
        consigneeName: [
          {
            required: true,
            message: "收货人不能为空",
            trigger: "change"
          }
        ],
        consigneePhone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback("手机号码不能为空");
              } else if (!/^1[34578]\d{9}$/.test(value)) {
                callback("手机号码格式不正确");
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      // 显示更多收货地址
      showMore: false,
      // 显示添加或修改收货地址的模态框
      show: false,
      // 所有地区
      areas: [],
      // 选中地区的id数组
      area: []
    };
  },
  methods: {
    // 根据id获取地址详情，会拼接地理信息
    // 主要用于展示当前选中的地址
    addressFn(id) {
      getAddressDetail(id).then(res => {
        if (res.data.res) {
          let {
            checkedCityList,
            checkedAreaList,
            province,
            city,
            area,
            street,
            consigneeName,
            consigneePhone
          } = res.data.data;

          let provinceName = this.areas.filter(i => i.id === province)[0]
            .areaName;
          let cityName = checkedCityList.filter(i => i.id === city)[0].areaName;
          let areaName = checkedAreaList.filter(i => i.id === area)[0].areaName;

          this.currentAddress = {
            area: provinceName + " " + cityName + " " + areaName,
            street,
            consigneeName,
            consigneePhone
          };
        }
      });
    },

    // 根据id获取地址详情，会组装地理信息，在懒加载的情况下可以提前渲染出需要的数据 && 可优化
    // 只有修改数据时，先获取数据的情况使用此函数，此函数夹杂了变量赋值和弹出框显示的逻辑
    addressPreFn(id) {
      getAddressDetail(id).then(res => {
        if (res.data.res) {
          let {
            id,
            checkedCityList,
            checkedAreaList,
            province,
            city,
            area,
            street,
            consigneeName,
            consigneePhone,
            isDefaultAddress
          } = res.data.data;

          this.areas.forEach((item, _index) => {
            if (item.id === province) {
              // 将省下面的市放在其children
              this.areas[_index].children = checkedCityList.map(item => {
                item.label = item.areaName;
                item.value = item.id;
                return item;
              });
              // 将市下面的区放在其children
              this.areas[_index].children.forEach((item, __index) => {
                if (item.id === city) {
                  this.areas[_index].children[
                    __index
                  ].children = checkedAreaList.map(i => {
                    i.label = i.areaName;
                    i.value = i.id;
                    return i;
                  });
                }
              });
            }
          });

          this.tempAddress = {
            id,
            street,
            consigneeName,
            consigneePhone,
            isDefaultAddress,
            area: [province, city, area]
          };
          this.show = true;
        }
      });
    },

    // 添加或编辑收货地址
    // 编辑收货地址时，使用 addressPreFn 函数
    editAddress(id) {
      if (id) {
        this.addressPreFn(id);
      } else {
        this.tempAddress = {
          area: [],
          street: "",
          consigneeName: "",
          consigneePhone: "",
          isDefaultAddress: 0
        };
        this.show = true;
      }
    },

    // 选择收货地址
    // 使用 addressFn 函数
    selectAddress(id) {
      if (id === this.currentAddressId) {
        return;
      }
      this.currentAddressId = id;
      this.addressFn(this.currentAddressId);
    },

    // 查看商品详情
    viewDetail(id) {
      this.$router.push({
        name: "product-detail",
        params: {
          id
        }
      });
    },

    // 返往购物车
    toCart() {
      this.$router.push({
        name: "product-cart"
      });
    },

    // 获取收货地址
    // 使用 addressFn 函数
    getAddress() {
      getAddress().then(res => {
        if (res.data.res) {
          this.addresss = res.data.data;
          this.currentAddressId =
            this.addresss.filter(address => address.isDefaultAddress === 1)[0]
              .id || null;
          this.addressFn(this.currentAddressId);
        }
      });
    },

    // 获取地理信息
    // 只获取省级的地理信息 因为没有传入id
    getData() {
      getArea().then(res => {
        if (res.data.res) {
          this.areas = res.data.data.map(item => {
            item.label = item.areaName;
            item.value = item.id;
            item.loading = false;
            item.children = [];
            return item;
          });
        }
      });
    },
    // 根据上级id获取其下级的地理信息
    // 传入上级id， 比如传入某个省的id，则查询这个省下面的市
    getDataFilter(item, cb) {
      getArea(item.value).then(res => {
        if (res.data.res) {
          if (item.areaType === 2) {
            item.children = res.data.data.map(i => {
              i.label = i.areaName;
              i.value = i.id;
              return i;
            });
          } else {
            item.children = res.data.data.map(i => {
              i.label = i.areaName;
              i.value = i.id;
              i.loading = false;
              i.children = [];
              return i;
            });
          }
          cb && cb();
        }
      });
    },

    // 选择地址时级联动态加载数据
    // 使用 getDataFilter 函数
    loadData(item, callback) {
      item.loading = true;
      this.getDataFilter(item, () => {
        item.loading = false;
        callback();
      });
    },

    // 删除收货地址
    delAddress(id) {
      this.$Modal.confirm({
        title: "删除确认",
        content: "<p>确定删除收货地址？</p>",
        onOk: () => {
          delAddress(id).then(res => {
            if (res.data.res) {
              this.$Message.success(res.data.msg);
              this.getAddress();
            }
          });
        }
      });
    },
    // 添加或修改地址保存
    save() {
      this.$refs["tempAddress"].validate(res => {
        if (res) {
          let obj = {
            ...this.tempAddress,
            province: this.tempAddress.area[0],
            city: this.tempAddress.area[1],
            area: this.tempAddress.area[2]
          };
          editAddress(obj).then(res => {
            if (res.data.res) {
              this.$Message.success(res.data.msg);
              this.getAddress();
              this.show = false;
            }
          });
        }
      });
    },
    // 添加或修改地址取消
    cancel() {
      this.show = false;
    },

    // 提交订单
    generateOrder() {
      addOrder({
        addressId: this.currentAddressId,
        userOrderProductList: this.orderGenerate.map(i => ({
          num: i.num,
          productId: i.id
        }))
      }).then(res => {
        if (res.data.res) {
          // 订单生成后，刷新购物车列表和订单列表
          this.$store.dispatch("getCartList");
          this.$store.dispatch("getOrderList");
          sessionStorage.removeItem("X-website-orderGenerate");
          sessionStorage["X-website-order"] = JSON.stringify(res.data.data);
          this.$router.push({ name: "order-pay" });
        }
      });
    }
  },
  created() {
    this.$emit("set-bread", [
      {
        name: "商城",
        router: {
          name: "product-list"
        }
      },
      {
        name: "提交订单"
      }
    ]);
    this.getData();
    this.getAddress();
    this.$store.dispatch("getOrderGenerateList");
  }
};
</script>

<style lang="less">
@import url("../../assets/less/common.less");
.order-generate {
  .info {
    .title {
      height: 50px;
      line-height: 50px;
      transition: all 0.3s;
      &-all {
        font-size: 16px;
        float: left;
        font-weight: bolder;
      }
      &-price {
        width: 400px;
        float: right;
        margin-top: 20px;
        .ivu-icon {
          position: relative;
          top: -2px !important;
        }
      }
    }
    .ivu-divider {
      margin: 10px 0;
    }
  }
  .item-title {
    font-size: 15px;
    width: 100%;
    .title {
      float: left;
      font-weight: bold;
    }
    .extra {
      float: right;
    }
  }
  .receipt {
    width: 100%;
    border: 1px solid #efefef;
    padding: 20px;
    margin-top: 20px;
    .items {
      width: 100%;
      padding: 10px 20px;
      max-height: 60px;
      overflow: hidden;
      transition: all 0.3s;
      .item {
        width: 100%;
        font-size: 14px;
        margin: 0 0 10px;
        & > div {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          vertical-align: top;
        }
        .selector {
          border: 2px solid #efefef;
          width: 144px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          &.active {
            border: 2px solid @main-color;
          }
        }
        .detail {
          width: ~"calc(100% - 144px)";
          background: #fff;
          transition: all 0.3s;
          & > span {
            margin: 0 10px;
          }
          .base {
            display: inline-block;
            max-width: ~"calc(100% - 140px)";
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              padding: 2px 6px;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 5px;
              color: #fff;
              font-size: 12px;
            }
          }
          .btn {
            float: right;
            display: none;
            .ivu-btn {
              margin-left: 10px;
            }
          }
        }
        &:hover {
          .detail {
            background: #dcf5f2;
            .btn {
              display: inline-block;
            }
          }
        }
      }
      &.big {
        max-height: 500px;
        overflow: auto;
      }
    }
    .more {
      padding-left: 20px;
    }
  }
  .list {
    width: 100%;
    border: 1px solid #efefef;
    padding: 20px;
    margin-top: 20px;
    .items {
      width: 100%;
      padding: 10px 20px;
      .item {
        width: 100%;
        height: 120px;
        border: 1px solid #e7e7e7;
        border-bottom: none;
        position: relative;
        padding: 15px 40px;
        background: #fcfcfc;
        &:last-child {
          border-bottom: 1px solid #e7e7e7;
        }
        .attr {
          float: left;
          width: 45%;
          font-size: 14px;
          & > div {
            float: left;
            margin-left: 20px;
            &.img {
              width: 88px;
              height: 88px;
              border: 1px solid #ccc;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
            &.name {
              width: ~"calc(100% - 130px)";
              min-width: 150px;
              cursor: pointer;
              margin-top: 23px;
              &:hover {
                color: @main-color;
                text-decoration: underline;
              }
            }
          }
        }
        .settlement {
          float: right;
          width: 50%;
          min-width: 350px;
          text-align: center;
          font-size: 14px;
          & > div {
            float: left;
            height: 88px;
            line-height: 88px;
            &.price {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
              font-weight: bold;
            }
            &.number {
              width: 80px;
            }
            &.total {
              width: ~"calc(50% - 60px)";
              min-width: 80px;
              font-weight: bold;
              color: @main-color;
            }
          }
        }
      }
      .item.title {
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        padding: 0 40px;
        .attr {
          text-align: center;
        }
        .settlement {
          vertical-align: top;
          div {
            height: 50px;
            line-height: 50px;
          }
        }
      }
    }
  }
  .confirm {
    width: 100%;
    background: #efefef;
    border-top: 1px solid #dedede;
    margin-top: 40px;
    padding: 15px 20px;
    text-align: right;
    .pro {
      font-size: 14px;
      .num {
        margin-right: 30px;
        span {
          color: @main-color;
        }
      }
      .price {
        color: @main-color;
        font-size: 20px;
        font-weight: bolder;
      }
    }
    .person {
      margin-top: 10px;
      color: #888;
      span {
        margin-left: 30px;
      }
    }
  }
  .submit {
    text-align: right;
    margin: 50px 0;
    .ivu-btn {
      width: 120px;
    }
  }
}
// 弹出框
.ivu-checkbox-wrapper {
  .ivu-checkbox {
    margin-right: 10px;
  }
}
</style>