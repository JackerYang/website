<template>
  <div class="main-nav">
    <Dropdown v-if="collapse" trigger="click" placement="bottom-end">
      <Icon class="show" type="md-menu" />
      <DropdownMenu slot="list">
        <template v-for="nav in navs">
          <DropdownItem
            v-if="!nav.children || !nav.children.length"
            @click.native="jump(nav.pathname, nav.id)"
          >{{ nav.plateName }}</DropdownItem>
          <Dropdown trigger="hover" placement="left-start" v-else>
            <DropdownItem>
              {{ nav.plateName }}
              <Icon type="ios-arrow-forward"></Icon>
            </DropdownItem>
            <DropdownMenu slot="list">
              <DropdownItem
                @click.native="jump(item.pathname, nav.id)"
                v-for="item in nav.children"
                :key="item.plateName"
              >{{ item.plateName }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </DropdownMenu>
    </Dropdown>

    <ul v-else>
      <li v-for="nav in navs" :key="nav.plateName" @click="jump(nav.pathname, nav.id)">
        <!-- 单菜单 -->
        <template v-if="!nav.children || !nav.children.length">{{ nav.plateName }}</template>
        <!-- 二级菜单 -->
        <template v-else>
          <Dropdown>
            <p>{{ nav.plateName }}</p>
            <DropdownMenu slot="list">
              <DropdownItem
                @click.native="jump(item.pathname, nav.id)"
                v-for="item in nav.children"
                :key="item.plateName"
              >{{ item.plateName }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "main-nav",
  computed: {
    navs() {
      const fixedNavs = [
        {
          plateName: "首页",
          pathname: "home"
        },
        {
          plateName: "企业概况",
          children: [
            {
              plateName: "企业简介",
              pathname: "company-profile"
            },
            {
              plateName: "企业风光",
              pathname: "company-scenery"
            }
          ]
        },
        {
          plateName: "机构设置",
          children: [
            {
              plateName: "组织机构",
              pathname: "mechanism-organization"
            },
            {
              plateName: "主要成员",
              pathname: "mechanism-member"
            }
          ]
        },
        {
          plateName: "企业印象",
          pathname: "company-impression"
        }
      ];
      const shop = {
        plateName: "企业商城",
        pathname: "product-list"
      };
      let addNavs = JSON.parse(
        JSON.stringify(this.$store.state.common.plates)
      ).map(item => {
        item.pathname = "template-list";
        return item;
      });
      return [...fixedNavs, ...addNavs, shop];
    }
  },
  data() {
    return {
      collapse: false,
      needWidth: 0
    };
  },
  methods: {
    jump(pathname, id) {
      pathname &&
        this.$router.push({
          name: pathname,
          params: {
            id
          }
        });
    }
  },
  updated() {
    let wrap = document.querySelector(".wrap");
    let nav = document.querySelector(".main-nav");
    if (nav.children[0].tagName === "UL") {
      this.needWidth = parseInt(nav.offsetWidth);
    }
    if (180 + this.needWidth > parseInt(wrap.offsetWidth)) {
      this.collapse = true;
    }
  },
  mounted() {
    window.onresize = () => {
      let wrap = document.querySelector(".wrap");
      if (180 + this.needWidth > parseInt(wrap.offsetWidth)) {
        this.collapse = true;
      } else {
        this.collapse = false;
      }
    };
  },
  created() {
    this.$store.dispatch("getPlate");
  }
};
</script>

<style lang="less">
@import "../../assets/less/common.less";
.main-nav {
  position: absolute;
  top: 100px;
  right: 0;
  color: #fff;
  letter-spacing: 0.2em;
  & > ul {
    float: right;
    height: 27px;
    overflow: hidden;
    & > li {
      float: left;
      margin-left: 30px;
      font-size: 18px;
      font-weight: bold;
      list-style: none;
      cursor: pointer;
      .ivu-dropdown {
        .ivu-select-dropdown {
          background: rgba(0, 0, 0, 0.1);
          box-shadow: none;
          .ivu-dropdown-menu {
            .ivu-dropdown-item {
              color: #fff;
              font-size: 16px !important;
              &:hover {
                background: rgba(255, 255, 255, 0.1);
              }
            }
          }
        }
      }
    }
  }

  & > .ivu-dropdown {
    .show {
      cursor: pointer;
      font-size: 32px;
    }
    & > .ivu-select-dropdown {
      .ivu-dropdown-menu {
        .ivu-dropdown-item {
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>
