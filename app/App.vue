<template>
    <Layout class="nb-body">
        <LayoutSider v-model:collapsed="collapsed" :trigger="null" collapsible  breakpoint="xxl"
        collapsedWidth="0">
            <div class="nb-logo">
                <a v-if="collapsed"><img height="48" src="/nestbundle/static/img/logo-nestbundle.png" alt=""></a>
                <a v-else style="display: flex;gap: 10px;align-items: center;">
                    <img height="35" src="/nestbundle/static/img/logo-nestbundle.png" alt="">
                    <svg width="126" height="19" viewBox="0 0 126 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.0439923 18.5V1.112H3.76999L11.168 11.507V1.112H15.542V18.5H11.789L4.39099 8.132V18.5H0.0439923ZM23.8251 18.77C22.6731 18.77 21.5931 18.68 20.5851 18.5C19.5951 18.338 18.7401 18.095 18.0201 17.771V14.072C18.8121 14.414 19.6851 14.693 20.6391 14.909C21.6111 15.125 22.5291 15.233 23.3931 15.233C24.4731 15.233 25.2741 15.134 25.7961 14.936C26.3361 14.738 26.6061 14.306 26.6061 13.64C26.6061 13.19 26.4711 12.83 26.2011 12.56C25.9491 12.29 25.5261 12.056 24.9321 11.858C24.3561 11.642 23.5641 11.39 22.5561 11.102C21.3681 10.742 20.4231 10.346 19.7211 9.914C19.0191 9.464 18.5151 8.924 18.2091 8.294C17.9031 7.664 17.7501 6.89 17.7501 5.972C17.7501 4.316 18.3441 3.047 19.5321 2.165C20.7201 1.283 22.4751 0.841999 24.7971 0.841999C25.8051 0.841999 26.7861 0.922999 27.7401 1.085C28.6941 1.229 29.4681 1.4 30.0621 1.598V5.324C29.2881 5.018 28.5051 4.793 27.7131 4.649C26.9391 4.505 26.1831 4.433 25.4451 4.433C24.4731 4.433 23.6811 4.523 23.0691 4.703C22.4751 4.883 22.1781 5.297 22.1781 5.945C22.1781 6.323 22.2861 6.629 22.5021 6.863C22.7181 7.079 23.0871 7.277 23.6091 7.457C24.1491 7.637 24.8781 7.853 25.7961 8.105C27.2181 8.483 28.3071 8.942 29.0631 9.482C29.8191 10.004 30.3411 10.616 30.6291 11.318C30.9171 12.002 31.0611 12.776 31.0611 13.64C31.0611 15.17 30.4671 16.412 29.2791 17.366C28.0911 18.302 26.2731 18.77 23.8251 18.77ZM39.0674 18.5V1.112H48.2474C49.9934 1.112 51.3074 1.526 52.1894 2.354C53.0894 3.182 53.5394 4.352 53.5394 5.864C53.5394 6.782 53.3594 7.556 52.9994 8.186C52.6574 8.798 52.1984 9.275 51.6224 9.617C52.4144 9.905 53.0354 10.328 53.4854 10.886C53.9354 11.444 54.1604 12.281 54.1604 13.397C54.1604 15.053 53.6744 16.322 52.7024 17.204C51.7304 18.068 50.3354 18.5 48.5174 18.5H39.0674ZM43.4144 8.186H46.9514C47.7074 8.186 48.2564 8.015 48.5984 7.673C48.9404 7.331 49.1114 6.854 49.1114 6.242C49.1114 5.576 48.9404 5.081 48.5984 4.757C48.2564 4.415 47.6354 4.244 46.7354 4.244H43.4144V8.186ZM43.4144 15.395H47.3834C48.1754 15.395 48.7604 15.233 49.1384 14.909C49.5344 14.585 49.7324 14.009 49.7324 13.181C49.7324 12.515 49.5434 12.02 49.1654 11.696C48.7874 11.354 48.1394 11.183 47.2214 11.183H43.4144V15.395ZM60.7653 18.77C59.2533 18.77 58.0743 18.347 57.2283 17.501C56.3823 16.637 55.9593 15.386 55.9593 13.748V5.702H60.3063V13.505C60.3063 14.225 60.4773 14.756 60.8193 15.098C61.1793 15.422 61.7103 15.584 62.4123 15.584C62.9343 15.584 63.4293 15.476 63.8973 15.26C64.3653 15.044 64.7523 14.774 65.0583 14.45V5.702H69.4053V18.5H65.3553L65.2203 17.42C64.6983 17.816 64.0683 18.14 63.3303 18.392C62.5923 18.644 61.7373 18.77 60.7653 18.77ZM72.1583 18.5V5.702H76.2083L76.3433 6.809C76.8653 6.449 77.5223 6.134 78.3143 5.864C79.1063 5.576 79.9523 5.432 80.8523 5.432C82.5083 5.432 83.7143 5.828 84.4703 6.62C85.2263 7.412 85.6043 8.636 85.6043 10.292V18.5H81.2573V10.643C81.2573 9.923 81.1043 9.41 80.7983 9.104C80.4923 8.798 79.9433 8.645 79.1513 8.645C78.6833 8.645 78.2063 8.753 77.7202 8.969C77.2343 9.185 76.8293 9.455 76.5053 9.779V18.5H72.1583ZM93.4307 18.77C92.1887 18.77 91.1267 18.572 90.2447 18.176C89.3627 17.78 88.6877 17.132 88.2197 16.232C87.7517 15.314 87.5177 14.09 87.5177 12.56C87.5177 11.012 87.7877 9.716 88.3277 8.672C88.8677 7.61 89.6057 6.809 90.5417 6.269C91.4957 5.711 92.5847 5.432 93.8087 5.432C94.4747 5.432 95.0687 5.504 95.5907 5.648C96.1307 5.792 96.6347 6.008 97.1027 6.296V0.301999H101.45V18.5H97.6967L97.4537 17.42C96.9317 17.87 96.3467 18.212 95.6987 18.446C95.0507 18.662 94.2947 18.77 93.4307 18.77ZM94.6727 15.611C95.6267 15.611 96.4367 15.287 97.1027 14.639V9.455C96.4907 8.897 95.7077 8.618 94.7537 8.618C93.8357 8.618 93.1337 8.969 92.6477 9.671C92.1797 10.355 91.9457 11.327 91.9457 12.587C91.9457 13.811 92.1707 14.621 92.6207 15.017C93.0887 15.413 93.7727 15.611 94.6727 15.611ZM108.136 18.77C106.732 18.77 105.724 18.464 105.112 17.852C104.5 17.24 104.194 16.259 104.194 14.909V0.301999H108.541V14.477C108.541 14.891 108.622 15.179 108.784 15.341C108.964 15.485 109.225 15.557 109.567 15.557C110.053 15.557 110.485 15.494 110.863 15.368V18.311C110.449 18.473 110.035 18.59 109.621 18.662C109.225 18.734 108.73 18.77 108.136 18.77ZM119.358 18.77C117.126 18.77 115.335 18.221 113.985 17.123C112.635 16.007 111.96 14.333 111.96 12.101C111.96 10.067 112.518 8.447 113.634 7.241C114.75 6.035 116.424 5.432 118.656 5.432C120.69 5.432 122.265 5.954 123.381 6.998C124.497 8.042 125.055 9.446 125.055 11.21V13.505H115.983C116.181 14.351 116.64 14.945 117.36 15.287C118.098 15.611 119.097 15.773 120.357 15.773C121.059 15.773 121.77 15.71 122.49 15.584C123.228 15.458 123.84 15.296 124.326 15.098V17.933C123.714 18.221 122.985 18.428 122.139 18.554C121.293 18.698 120.366 18.77 119.358 18.77ZM115.983 10.994H121.275V10.427C121.275 9.797 121.086 9.302 120.708 8.942C120.33 8.564 119.691 8.375 118.791 8.375C117.747 8.375 117.018 8.591 116.604 9.023C116.19 9.437 115.983 10.094 115.983 10.994Z"
                            fill="#17181A"/>
                    </svg>
                </a>
                <div @click="collapsed = !collapsed" class="nb-menu-trigger">
                    <svg v-if="collapsed" width="16" height="16" viewBox="0 0 16 16" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 11.3337L7.33333 8.00033L4 4.66699M8.66667 11.3337L12 8.00033L8.66667 4.66699"
                              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 11.3337L8.66667 8.00033L12 4.66699M7.33333 11.3337L4 8.00033L7.33333 4.66699"
                              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <Menu v-model:selectedKeys="tempSelectedKeys" v-model:openKeys="openKeys" mode="inline"
                  @click="beforeMenuChanged" class="nb-main-menu">
                <MenuItem key="home">
                    <div class="nb-menu-item" :class="selectedKeys.toString()==='home' ? 'selected' : ''">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="8" fill="none"/>
                            <path
                                d="M21 33V25.6C21 25.0399 21 24.7599 21.109 24.546C21.2049 24.3578 21.3578 24.2049 21.546 24.109C21.7599 24 22.0399 24 22.6 24H25.4C25.9601 24 26.2401 24 26.454 24.109C26.6422 24.2049 26.7951 24.3578 26.891 24.546C27 24.7599 27 25.0399 27 25.6V33M23.0177 14.764L16.2354 20.0391C15.782 20.3917 15.5553 20.5681 15.392 20.7889C15.2474 20.9844 15.1396 21.2048 15.074 21.4391C15 21.7035 15 21.9907 15 22.5651V29.8C15 30.9201 15 31.4801 15.218 31.908C15.4097 32.2843 15.7157 32.5903 16.092 32.782C16.5198 33 17.0799 33 18.2 33H29.8C30.9201 33 31.4802 33 31.908 32.782C32.2843 32.5903 32.5903 32.2843 32.782 31.908C33 31.4801 33 30.9201 33 29.8V22.5651C33 21.9907 33 21.7035 32.926 21.4391C32.8604 21.2048 32.7526 20.9844 32.608 20.7889C32.4447 20.5681 32.218 20.3917 31.7646 20.0391L24.9823 14.764C24.631 14.4907 24.4553 14.3541 24.2613 14.3016C24.0902 14.2553 23.9098 14.2553 23.7387 14.3016C23.5447 14.3541 23.369 14.4907 23.0177 14.764Z"
                                stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span v-if="!collapsed">Home</span>
                    </div>
                </MenuItem>
                <MenuItem key="bundles">
                    <div class="nb-menu-item"
                         :class="selectedKeys.toString()==='bundles' || selectedKeys.toString()==='product_bundle'||selectedKeys.toString()==='volume_bundle'? 'selected' : ''">
                        <svg width="48" height="48" viewBox="-12 -12 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.667 5.00008V18.3334M10.667 5.00008H7.72057C7.28643 5.00008 6.87008 4.82449 6.5631 4.51193C6.25612 4.19937 6.08366 3.77544 6.08366 3.33341C6.08366 2.89139 6.25612 2.46746 6.5631 2.1549C6.87008 1.84234 7.28643 1.66675 7.72057 1.66675C10.0122 1.66675 10.667 5.00008 10.667 5.00008ZM10.667 5.00008H13.6134C14.0476 5.00008 14.4639 4.82449 14.7709 4.51193C15.0779 4.19937 15.2503 3.77544 15.2503 3.33341C15.2503 2.89139 15.0779 2.46746 14.7709 2.1549C14.4639 1.84234 14.0476 1.66675 13.6134 1.66675C11.3218 1.66675 10.667 5.00008 10.667 5.00008ZM17.3337 9.16675V15.6667C17.3337 16.6002 17.3337 17.0669 17.152 17.4234C16.9922 17.737 16.7372 17.992 16.4236 18.1518C16.0671 18.3334 15.6004 18.3334 14.667 18.3334L6.66699 18.3334C5.73357 18.3334 5.26686 18.3334 4.91034 18.1518C4.59674 17.992 4.34177 17.737 4.18198 17.4234C4.00033 17.0669 4.00033 16.6002 4.00033 15.6667V9.16675M2.33366 6.33341L2.33366 7.83341C2.33366 8.30013 2.33366 8.53348 2.42449 8.71174C2.50438 8.86854 2.63187 8.99603 2.78867 9.07592C2.96693 9.16675 3.20028 9.16675 3.66699 9.16675L17.667 9.16675C18.1337 9.16675 18.3671 9.16675 18.5453 9.07592C18.7021 8.99603 18.8296 8.86854 18.9095 8.71174C19.0003 8.53348 19.0003 8.30013 19.0003 7.83342V6.33342C19.0003 5.8667 19.0003 5.63335 18.9095 5.45509C18.8296 5.29829 18.7021 5.1708 18.5453 5.09091C18.3671 5.00008 18.1337 5.00008 17.667 5.00008L3.66699 5.00008C3.20028 5.00008 2.96693 5.00008 2.78867 5.09091C2.63187 5.1708 2.50438 5.29829 2.42449 5.45509C2.33366 5.63335 2.33366 5.8667 2.33366 6.33341Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"/>
                        </svg>
                        <span v-if="!collapsed">Bundles</span>
                    </div>
                </MenuItem>
                <MenuItem key="design">
                    <div class="nb-menu-item" :class="selectedKeys.toString()==='design' ? 'selected' : ''">
                        <svg width="48" height="48" viewBox="-12 -12 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.0001 9.16675L2.33341 9.16675M9.00007 3.33341L7.33341 1.66675M12.3334 18.3334L2.33341 18.3334M19.0001 13.3334C19.0001 14.2539 18.2539 15.0001 17.3334 15.0001C16.4129 15.0001 15.6667 14.2539 15.6667 13.3334C15.6667 12.4129 17.3334 10.8334 17.3334 10.8334C17.3334 10.8334 19.0001 12.4129 19.0001 13.3334ZM8.16674 2.50008L13.8906 8.22394C14.2206 8.55395 14.3856 8.71896 14.4474 8.90923C14.5018 9.0766 14.5018 9.25689 14.4474 9.42426C14.3856 9.61454 14.2206 9.77954 13.8906 10.1096L10.0524 13.9478C9.39233 14.6078 9.06232 14.9378 8.68177 15.0615C8.34703 15.1702 7.98645 15.1702 7.65171 15.0615C7.27116 14.9378 6.94115 14.6078 6.28112 13.9478L3.38569 11.0524C2.72566 10.3923 2.39565 10.0623 2.272 9.68178C2.16324 9.34704 2.16324 8.98646 2.272 8.65172C2.39565 8.27117 2.72566 7.94116 3.38569 7.28113L8.16674 2.50008Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"/>
                        </svg>
                        <span v-if="!collapsed">Design</span>
                    </div>
                </MenuItem>
                <MenuItem key="analytics">
                    <div class="nb-menu-item" :class="selectedKeys.toString()==='analytics' ? 'selected' : ''">
                        <svg width="48" height="48" viewBox="-12 -12 48 48" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.16699 10H4.50033C4.03362 10 3.80026 10 3.622 10.0908C3.4652 10.1707 3.33771 10.2982 3.25782 10.455C3.16699 10.6333 3.16699 10.8666 3.16699 11.3333V16.1667C3.16699 16.6334 3.16699 16.8667 3.25782 17.045C3.33771 17.2018 3.4652 17.3293 3.622 17.4092C3.80026 17.5 4.03361 17.5 4.50033 17.5H8.16699M8.16699 17.5H13.167M8.16699 17.5L8.16699 7.16667C8.16699 6.69996 8.16699 6.4666 8.25782 6.28834C8.33771 6.13154 8.4652 6.00406 8.622 5.92416C8.80026 5.83333 9.03361 5.83333 9.50033 5.83333H11.8337C12.3004 5.83333 12.5337 5.83333 12.712 5.92416C12.8688 6.00406 12.9963 6.13154 13.0762 6.28834C13.167 6.4666 13.167 6.69996 13.167 7.16667V17.5M13.167 17.5H16.8337C17.3004 17.5 17.5337 17.5 17.712 17.4092C17.8688 17.3293 17.9963 17.2018 18.0762 17.045C18.167 16.8667 18.167 16.6334 18.167 16.1667V3.83333C18.167 3.36662 18.167 3.13327 18.0762 2.95501C17.9963 2.79821 17.8688 2.67072 17.712 2.59083C17.5337 2.5 17.3004 2.5 16.8337 2.5H14.5003C14.0336 2.5 13.8003 2.5 13.622 2.59083C13.4652 2.67072 13.3377 2.79821 13.2578 2.95501C13.167 3.13327 13.167 3.36662 13.167 3.83333V6.66667"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"/>
                        </svg>
                        <span v-if="!collapsed">Analytics</span>
                    </div>
                </MenuItem>
            </Menu>
        </LayoutSider>
        <Layout style="background-color: #F4F4F4">
            <!--            <LayoutHeader class="nb-header">-->
            <!--                <Navbar/>-->
            <!--            </LayoutHeader>-->
            <LayoutContent class="nb-content">
                <Home v-if="selectedKeys.toString()==='home'"
                      @setState="setState"
                      @setMode="setMode"
                      @onChangeMenu="onChangeMenu"
                      @setIsLoadingData="setIsLoadingData"
                      @setNeedSave="setNeedSave"/>
                <Bundles v-if="selectedKeys.toString()==='bundles'"
                         @setNeedSave="setNeedSave"
                         @setRealState='setRealState'
                         @setIsLoadingData="setIsLoadingData"
                         :needSave="needSave"
                         :state="state"
                         :country="country"
                          :currency_symbol="currency_symbol"
                         :locale="locale"
                         :mode="mode" @setMode="setMode"
                         :isLoadingData="isLoadingData"
                         :store_currency="store_currency"/>
                <Design v-if="selectedKeys.toString()==='design'"
                        @setNeedSave="setNeedSave"
                        :current_store="current_store"
                        :store_currency="store_currency"
                        :needSave="needSave"/>
                <Analytic v-if="selectedKeys.toString()==='analytics'"
                          :store_currency="store_currency"
                          :country="country"
                          :currency_symbol="currency_symbol"
                          :locale="locale"/>
                <div v-else></div>
            </LayoutContent>
        </Layout>
        <Modal class="nb-loading-blur nb-modal nb-modal-confirm"
               v-model:visible="modal.confirmNotSave"
               title="Your changes have not been saved"
               centered
               style="height: 140px"
               @cancel="confirmChangeMenu(false)"
               @ok="confirmChangeMenu(true)"
               okText="Leave page">
            <div style="color: #6B6B6B; margin: 0 24px">Leaving page will discard all of your changes.</div>
        </Modal>
    </Layout>
    <div class="nb-loading-blur" v-if="isLoadingData " style="z-index: 9999;position: fixed">
        <Loading :active="isLoadingData" loader="spinner" color="#6D41E9" v-if="isLoadingData"
                 :is-full-page="false" :height="200" style="text-align: center"/>
    </div>
</template>
<script>
import {h} from 'vue'
import {
    Layout,
    LayoutHeader,
    LayoutSider,
    LayoutContent,
    Menu,
    SubMenu,
    MenuItem,
    Modal,
    notification
} from "ant-design-vue"
import Loading from "vue-loading-overlay"
import Home from "./component/home.vue"
import Navbar from "./component/navbar.vue"
import Bundles from "./component/bundles.vue"
import Product_bundle from "./component/product_bundle.vue"
import Volume_bundle from "./component/volume_bundle.vue"
import Analytic from "./component/analytic.vue"
import Design from "./component/design.vue"

export default {
    name: "App",
    components: {
        Design,
        Analytic,
        Volume_bundle,
        Product_bundle,
        Bundles,
        Home,
        Layout,
        LayoutHeader,
        LayoutSider,
        LayoutContent,
        Menu,
        SubMenu,
        MenuItem,
        Modal,
        Navbar,
        Loading
    },
    data() {
        return {
            isLoadingData: null,
            collapsed: false,
            tempSelectedKeys: ['home'],
            selectedKeys: ['home'],
            openKeys: [],
            // settings_data: window.nb_settings,
            current_store: '',
            store_currency: '',
            isLoadingPage: false,
            needSave: false,
            modal: {confirmNotSave: false},
            forceReload: 0,
            state: 'table',
            mode: 'view',
            locale: '',
            country: '',
            currency_symbol: ""
        }
    },
    methods: {
        setIsLoadingData(flag) {
            this.isLoadingData = flag
        },
        setMode: function (mode) {
            this.mode = mode
        },
        setState: function (key) {
            this.beforeMenuChanged({key: 'bundles', bundle_state: key})
        },
        beforeMenuChanged: function ({item, key, keyPath, bundle_state}) {
            this.tempSelectedKeys = [key]
            if (this.needSave) {
                this.modal.confirmNotSave = true
            } else {
                if (bundle_state) {
                    this.state = bundle_state
                } else {
                    this.state = 'table'
                    this.setMode('view')
                }
                this.menuChanged()
            }
        },
        setRealState(state) {
            this.state = state
        },
        menuChanged: function (event) {
            if (this.selectedKeys.toString() !== this.tempSelectedKeys.toString()) {
                this.selectedKeys = this.tempSelectedKeys
            }
        },
        onChangeMenu: function (key) {
            this.needSave = false
            this.tempSelectedKeys = [key]
            this.menuChanged()
        },
        show_toast: function (type, message, duration = 3.0) {
            notification[type]({
                message: message,
                duration: duration
            });
        },
        setNeedSave: function (value) {
            this.needSave = value
        },
        confirmChangeMenu: function (value) {
            this.modal.confirmNotSave = false
            if (value) {
                this.needSave = false
                this.beforeMenuChanged({
                    item: null,
                    key: this.tempSelectedKeys.toString(),
                    keyPath: null
                })
            } else {
                this.tempSelectedKeys = this.selectedKeys
            }
        },
    },
    async mounted() {
        
        this.store_currency = window.nb_settings.store_currency
        this.country = window.nb_settings.country
        this.locale = window.nb_settings.primary_locale
        this.currency_symbol = window.nb_settings.currency_symbol
        addEventListener('popstate', (event) => {})
    }
}
</script>
<style src="./css/main.css"/>