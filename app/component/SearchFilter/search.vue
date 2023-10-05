<template>
    <div class="search-bg">
        <div class="search-container">
            <Input class="nb-input"
                   v-model:value="search_query_product"
                   placeholder="Search by product name"

                   @input="searchProduct">
                <template #suffix>
                    <SearchOutlined/>
                </template>
            </Input>
            <svg @click="closeSearchPenal" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
        </div>

<!--        <div class="product_list" v-if="product_list !== []" style="display: grid;grid-template-columns: repeat(3, 1fr)">-->
<!--            <div v-for="product in product_list">-->
<!--                <img>-->
<!--            </div>-->
<!--        </div>-->
    </div>

</template>
<script setup>

import {Input} from "ant-design-vue";
import {SearchOutlined} from "@ant-design/icons-vue";
import ProductGrid from "./product_grid.vue";
</script>
<script>


import _ from "lodash";
import axios from "axios";

export default {
    name: "Search",
    components: {},
    emits: [],
    props: {},
    data() {
        return {
            search_query_product: null,
            product_list:[]
        }
    },
    watch: {},
    methods: {
        searchProduct() {
            this.getProductLink()
        },
        closeSearchPenal(){
            document.getElementById('nsd-search-panel').style.height ="0"
        },
        getProductLink: _.debounce(
            function () {
                var self = this

                axios.post('/apps/nestbundle/products_search', {
                    jsonrpc: "2.0",
                    params: {
                        store_url:Shopify.shop,
                        limit: 20,
                        query: this.search_query_product
                    }
                }).then(response => {
                    self.product_list = JSON.parse(response.data.result)
                    console.log(self.product_list)
                }).catch(function (error) {

                    console.log(error)
                });
            }, 500
        ),
    },

    mounted() {

    }
}
</script>
<style>
.search-bg {

}
.nb-input{
    width: 65% !important;
}
.search-container {
    display: flex;
    height: 66px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #ECECEC;
    background: #FFF;
}
</style>
