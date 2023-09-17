<template>
  <div style="font-family: 'Be Vietnam Pro', sans-serif !important" class="main-container">
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
      <Pagination :total="50" :current="pagnition_data.current_page"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

import {Input , Pagination} from "ant-design-vue"
import {SearchOutlined} from "@ant-design/icons-vue";
import _ from "lodash";
import Dropdown from "./component/SearchFilter/dropdown.vue";
import ProductGrid from "./component/SearchFilter/product_grid.vue";

export default {
  name: "ShopifyCollection",
  components: {ProductGrid, Dropdown, SearchOutlined, Input,Pagination},

  data() {
    return {
      search_query_product: '',
      filter_options: null,
      product_list: null,
      pagnition_data:{
        last_page:1,
        current_page:1
      },
      query: {
        option: '',
        value: '',
        pagnition: 0
      }
    }
  },
  methods: {

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


              if (data.is_mounted) {
                self.filter_options = JSON.parse(data.filter_options)
              }

              console.log(data.pagnition)
              console.log(JSON.parse(data.product_list))
              self.pagnition_data = data.pagnition
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
    this.query = 1
    this.getProductList(is_mounted)
  }
}
</script>
<style src="./css/frontend.css"/>