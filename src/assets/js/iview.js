/**
 * @desc 按需引入iview组件
 */

import {
  Carousel,
  CarouselItem,
  Tooltip,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Affix,
  Input,
  Modal,
  Button,
  Form,
  FormItem,
  Icon,
  Message,
  Breadcrumb,
  BreadcrumbItem,
  Timeline,
  TimelineItem,
  Page,
  BackTop,
  Menu,
  MenuItem,
  InputNumber,
  Tag,
  Divider,
  Checkbox,
  CheckboxGroup,
  Badge,
  Steps,
  Step,
  Row,
  Col,
  Cascader,
  RadioGroup,
  Radio,
  Notice,
  Progress
} from "iview";

const iview = {
  install: Vue => {
    Vue.component("Carousel", Carousel);
    Vue.component("CarouselItem", CarouselItem);
    Vue.component("Tooltip", Tooltip);
    Vue.component("Dropdown", Dropdown);
    Vue.component("DropdownMenu", DropdownMenu);
    Vue.component("DropdownItem", DropdownItem);
    Vue.component("Affix", Affix);
    Vue.component("Input", Input);
    Vue.component("Modal", Modal);
    Vue.prototype.$Modal = Modal;
    Vue.component("Button", Button);
    Vue.component("Form", Form);
    Vue.component("FormItem", FormItem);
    Vue.component("Icon", Icon);
    Vue.prototype.$Message = Message;
    Vue.component("Breadcrumb", Breadcrumb);
    Vue.component("BreadcrumbItem", BreadcrumbItem);
    Vue.component("Timeline", Timeline);
    Vue.component("TimelineItem", TimelineItem);
    Vue.component("Page", Page);
    Vue.component("BackTop", BackTop);
    Vue.component("Menu", Menu);
    Vue.component("MenuItem", MenuItem);
    Vue.component("InputNumber", InputNumber);
    Vue.component("Tag", Tag);
    Vue.component("Divider", Divider);
    Vue.component("Checkbox", Checkbox);
    Vue.component("CheckboxGroup", CheckboxGroup);
    Vue.component("Badge", Badge);
    Vue.component("Steps", Steps);
    Vue.component("Step", Step);
    Vue.component("Row", Row);
    Vue.component("Col", Col);
    Vue.component("Cascader", Cascader);
    Vue.component("RadioGroup", RadioGroup);
    Vue.component("Radio", Radio);
    Vue.prototype.$Notice = Notice;
    Vue.component("Progress", Progress);
  }
};

export default iview;
