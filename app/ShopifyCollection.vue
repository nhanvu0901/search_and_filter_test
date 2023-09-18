<template>
    <div style="font-family: 'Be Vietnam Pro', sans-serif !important" id="main-container">
        <div class="filter-tree" style="">
            <Dropdown :filter_options="filter_options" @setChooseFilter="setChooseFilter"/>
        </div>
        <div class="main-grid">
            <Input class="nb-input" v-model:value="search_query_product"
                   placeholder="Search by product name"
                   style="margin-bottom: 14px;" @input="searchProduct">
                <template #prefix>
                    <SearchOutlined/>
                </template>
            </Input>
            <ProductGrid :product_list="product_list"/>
            <Pagination :total="pagination_data.total" v-model:pageSize="pagination_data.per_page"
                        v-model:current="pagination_data.current_page" :showSizeChanger="false" size="small"
                        @change="paginationChange"/>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

import {Input, Pagination} from "ant-design-vue"
import {SearchOutlined} from "@ant-design/icons-vue";
import _ from "lodash";
import Dropdown from "./component/SearchFilter/dropdown.vue";
import ProductGrid from "./component/SearchFilter/product_grid.vue";
import {ref} from "vue";

export default {
    name: "ShopifyCollection",
    components: {ProductGrid, Dropdown, SearchOutlined, Input, Pagination},

    data() {
        return {
            search_query_product: '',
            filter_options: null,
            product_list: null,
            pagination_data: {
                last_page: ref(1),
                current_page: ref(1)
            },
            query: {
                option: '',
                value: '',
                pagination: 0
            }
        }
    },
    methods: {
        paginationChange(page) {
            this.query.pagination = page
            this.getProductList(false)
            document.getElementById('MainContent').scrollIntoView({
                behavior: "smooth"
            });
        },
        setChooseFilter: function (selectedFilter) {
            this.query = selectedFilter
            this.getProductList(false)
        },
        searchProduct() {
            this.getProductList(false)
        },
        getProductList: _.debounce(
            function (is_mounted) {
                let self = this
                axios.post('/apps/nestbundle/get_product', {
                    jsonrpc: '2.0',
                    params: {
                        store_url: window.location.hostname,
                        search_query_product: this.search_query_product,
                        query: this.query,
                        is_mounted: is_mounted
                    }
                }).then(res => {
                    if (res.data.result.code === 0) {
                        let data = res.data.result

                        let state = {authorize_url:window.location.origin};
                        let filter_name =  self.query.value.label !== undefined ? self.query.value.label.split(" ").join("+") : ''
                        history.pushState(state, '', window.location.origin+'/collections/all/?search='+filter_name+"&page="+self.query.pagination);
                        if (data.is_mounted) {
                            self.filter_options = JSON.parse(data.filter_options)
                        }
                        console.log(data.pagination)
                        console.log(JSON.parse(data.product_list))
                        self.pagination_data = data.pagination
                        self.product_list = JSON.parse(data.product_list)

                    } else {
                    }
                }).catch(error => {
                })
            }, 500
        ),
    },
    mounted() {
        let is_mounted = true
        this.query = {
            option: '',
            value: '',
            pagination: 1
        }
        this.getProductList(is_mounted)
    }
}
</script>
<style src="./css/frontend.css"/>