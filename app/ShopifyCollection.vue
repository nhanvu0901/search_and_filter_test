<template>
    <div style="font-family: 'Be Vietnam Pro', sans-serif !important" class="main-container">
        <div class="filter-tree">

        </div>
        <div class="main-grid">
            <Input class="nb-input" v-model:value="search_query_product"
                   placeholder="Search by product name"
                   style="margin-bottom: 14px;" @input="searchProduct">
                <template #prefix>
                    <SearchOutlined/>
                </template>
            </Input>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import product_bundle_preview from "./component/product_bundle_preview.vue"
import volume_bundle_preview from "./component/volume_bundle_preview.vue"
import {Input, notification} from "ant-design-vue"
import {SearchOutlined} from "@ant-design/icons-vue";
import _ from "lodash";

export default {
    name: "ShopifyCollection",
    components: {SearchOutlined, Input},

    data() {
        return {
            search_query_product: ''
        }
    },
    methods: {
        searchProduct() {
            console.log(search_query_product)
        },
        getProductList: _.debounce(
            function () {

                axios.post('/apps/nestbundle/get_product', {
                    jsonrpc: '2.0',
                    params: {

                        search_query_product: this.search_query_product
                    }
                }).then(res => {
                    if (res.data.result.code === 0) {
                    } else {
                    }
                }).catch(error => {
                })
            }, 500
        ),
    },
    mounted() {

        this.getProductList()
    }
}
</script>
<style>
@font-face {
    font-family: 'Be Vietnam Pro';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url("https://apps.nestscale.com/omnichat/static/font/BeVietnamPro-Regular.ttf") format("truetype");
}

@font-face {
    font-family: 'Be Vietnam Pro';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url("https://apps.nestscale.com/omnichat/static/font/BeVietnamPro-Medium.ttf") format("truetype");
}

@font-face {
    font-family: 'Be Vietnam Pro';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url("https://apps.nestscale.com/omnichat/static/font/BeVietnamPro-SemiBold.ttf") format("truetype");
}

@font-face {
    font-family: 'Be Vietnam Pro';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url("https://apps.nestscale.com/omnichat/static/font/BeVietnamPro-Bold.ttf") format("truetype");
}

body {
    width: 100% !important;
}

.flex-column {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.nb-store-front-end {
    background: transparent !important;
}

.nb-frame-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0;
    gap: 20px;
    background: #FFFFFF;
    border-radius: 10px;
    flex: none;
    align-self: stretch;
    flex-grow: 0;
}

.preview-bundle {
    height: fit-content;
    flex: 3;
    width: 100%;
}

.nb-bundle-heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.nb-bundle-title {
    font-family: "Be Vietnam Pro", sans-serif !important;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #1D1E21;
}

.nb-preview-title {
    gap: 4px;
    display: flex;
    flex-direction: column;
}

.nb-dashboard-title-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: #939393;
}

.nb-line-item {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    gap: 12px;
    isolation: isolate;
    height: 122px;
    border-bottom: 1px solid #DEDEDE;
}

.nb-product-info-img {
    border-radius: 4px;
    width: 44px;
    height: 44px;
    object-fit: cover;
}

.nb-product-info-variant {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: #636366;
}

.nb-volume_discount_bundle_item {
    cursor: pointer;
    border: 1px solid #DEDEDE;
    border-radius: 10px;
    align-items: flex-start;
    padding: 24px 16px;
    display: flex
}

.nb-volume_discount_bundle_item_2.nb-volume_discount_bundle_item_selected .ant-radio-wrapper-checked {
    margin-top: -2px;
}

.nb-volume_discount_bundle_item_2.nb-volume_discount_bundle_item_not_selected label {
    margin-top: -2px
}

.nb-volume_discount_bundle_item_selected {
    border: 1px solid #3199FF;
    box-shadow: 0 0 0 3px rgba(49, 153, 255, 0.2);
}

.nb-product-info-variant .ant-skeleton-element .ant-skeleton-input-sm {
    height: 20px;
    border-radius: 51px;
}

.nb-product-name {
    font-family: "Be Vietnam Pro", sans-serif !important;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #1C1C1E;
}

.nb-bundle-detail {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    gap: 19px;
}

.nb-line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

.flex-align-center {
    display: flex;
    align-items: flex-start;
}

.nb-preview-footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.nb-price-line-through {
    color: #939393;
    line-height: 16px !important;
    text-decoration-line: line-through
}

.nb-primary-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    background: #1C1C1E;
    border-radius: 6px;
    height: 44px;
    color: #FDFDFD;
    border: none;
}

del {
    color: #939393;
}

.nb-line-item img {
    width: 90px;
    height: 90px;
    border-radius: 6px;
    object-fit: cover;
}

.nb-preview-notification-success {
    align-items: center;
    padding: 20px 40px;
    display: flex;
    gap: 12px;
    background: #F4F4F4;
    border-radius: 8px
}

/*volume bundle*/
.flex-column {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.nb-flex-center-alight {
    display: flex;
    align-items: flex-start;
    /*justify-content: space-between;*/
}

.nb-product-info-img {
    border-radius: 4px;
    width: 44px;
    height: 44px;
    object-fit: cover;
}

.flex-column .ant-select-selector {
    border-radius: 6px !important;

}

.ant-radio-wrapper {
    margin-top: -3px;
}

.nb-total-price {
    color: #48484A;
    font-family: "Be Vietnam Pro", sans-serif !important;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.nb-compare-price {
    color: #939393;
    font-family: 'Be Vietnam Pro', sans-serif !important;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
</style>