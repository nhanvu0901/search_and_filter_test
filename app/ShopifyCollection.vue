<template>
    <div class="collection page-width gf-left">
        <div id="gf-tree">
            <Dropdown :filter_options="filter_options" @setChooseFilter="setChooseFilter"/>
        </div>
        <div id="gf-grid">
            <form class="gf-controls-search-form">
                <input :value="search_query_product" value="" @input="searchProduct"
                       placeholder="Search products" aria-label="Search products" autocomplete="off"
                       class="gf-controls-search-input">
                <button type="button" class="gf-controls-clear-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path
                            d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                            fill="#5C5F62"></path>
                    </svg>
                </button>
                <button type="button" class="gf-controls-search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path
                            d="M2 8c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm17.707 10.293l-5.395-5.396A7.946 7.946 0 0016 8c0-4.411-3.589-8-8-8S0 3.589 0 8s3.589 8 8 8a7.954 7.954 0 004.897-1.688l5.396 5.395A.998.998 0 0020 19a1 1 0 00-.293-.707z"
                            fill="#3d4246"></path>
                    </svg>
                </button>
            </form>
            <!--            <Input class="nb-input" -->
            <!--                   placeholder="Search by product name"-->
            <!--                   style="margin-bottom: 14px;" @input="searchProduct">-->
            <!--                <template #prefix>-->
            <!--                    <SearchOutlined/>-->
            <!--                </template>-->
            <!--            </Input>-->
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
            query: [],
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
            this.get_product_list(false)
        },
        searchProduct() {
            this.getProductList(false)
        },
        get_product_list(is_mounted) {
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

                    let state = {authorize_url: window.location.origin};
                    let filter_name = ''


                    if (data.is_mounted) {
                        self.filter_options = JSON.parse(data.filter_options)
                        console.log(JSON.parse(data.filter_options))

                    } else {
                        self.query['selected_filter'].forEach(option => {
                            filter_name += option.option + ":" + (option.value.label !== undefined ? option.value.label.split(" ").join("+") : '') + (option === self.query['selected_filter'].lastElementChild ? '' : '&')
                        })
                        history.pushState(state, '', window.location.origin + '/collections/all/?search=' + filter_name + "&page=" + self.query.pagination);
                    }
                    console.log(data.pagination)
                    console.log(JSON.parse(data.product_list))
                    self.pagination_data = data.pagination
                    self.product_list = JSON.parse(data.product_list)


                } else {
                }
            }).catch(error => {
            })
        },
        getProductList: _.debounce(
            function (is_mounted) {
                this.get_product_list(is_mounted)
            }, 500
        ),
    },
    mounted() {
        let is_mounted = true

        this.get_product_list(is_mounted)
    }
}
</script>
<style src="./css/globo.css"/>

<style src="./css/globo_slider.css"/>
