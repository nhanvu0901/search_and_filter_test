<template>
    <div class="search-bg">
        <div class="search-container">
            <Input class="nb-input"
                   v-model:value="search_query_product"
                   placeholder="Search by product name"

                   @input="searchProduct"
            >
                <template #prefix>
                    <SearchOutlined/>
                </template>
            </Input>
            <svg @click="closeSearchPenal" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>

        </div>
    </div>

</template>
<script setup>

import {Input} from "ant-design-vue";
import {SearchOutlined} from "@ant-design/icons-vue";
</script>
<script>


export default {
    name: "Search",
    components: {},
    emits: [],
    props: {},
    data() {
        return {
            search_query_product: null
        }
    },
    watch: {},
    methods: {
        searchProduct() {
            console.log("Nhan gioi")
        },
        closeSearchPenal(){
            document.getElementById('nsd-search-panel').style.height ="0"
        }
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
