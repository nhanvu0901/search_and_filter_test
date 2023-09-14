<template>
    <div class="" style="gap: 24px">

    </div>
</template>
<script>
import axios from "axios"
import {notification} from "ant-design-vue"

export default {
    name: "home",
    emits: [
        'onChangeMenu',
        "setState",
        "needSave",
        'setNeedSave',
        "setMode",
        "setIsLoadingData"
    ],
    props: {},
    data() {
        return {
            current_store: null,
            store_url: null,
            total_click: 0,
            total_view: 0,
        }
    },
    methods: {

    },
    computed: {

    },
    mounted() {

    }
}
</script>
<style scoped>
</style>