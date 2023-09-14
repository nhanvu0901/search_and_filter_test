<template>
    <div class="nb-navbar nb-center-align nb-right-justify ">

        <div class="nb-header-management">
            <Tooltip>
                <template #title>Visit Help Center</template>
                <a href="#" target="_blank" style="display: flex;">

                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.71121 9.12508C8.93652 8.4846 9.38123 7.94452 9.96658 7.6005C10.5519 7.25648 11.2402 7.13073 11.9093 7.24551C12.5785 7.3603 13.1855 7.70821 13.6227 8.22763C14.06 8.74705 14.2993 9.40446 14.2983 10.0834C14.2983 12.0001 11.4233 12.9584 11.4233 12.9584M11.5 16.7917H11.5095M21.0833 12.0001C21.0833 17.2928 16.7927 21.5834 11.5 21.5834C6.20723 21.5834 1.91663 17.2928 1.91663 12.0001C1.91663 6.70735 6.20723 2.41675 11.5 2.41675C16.7927 2.41675 21.0833 6.70735 21.0833 12.0001Z"
                            stroke="#939393" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>


                </a>
            </Tooltip>
            <div class="nb-header-avatar">

                <Avatar size="34">
                    <template #icon>
                        <UserOutlined/>
                    </template>
                </Avatar>


            </div>
        </div>
    </div>

</template>

<script>
import {Tooltip, Avatar} from "ant-design-vue";
import {UserOutlined} from '@ant-design/icons-vue';

export default {
    name: "navbar",
    components: {
        Tooltip, Avatar, UserOutlined
    },
    props: {},

    data() {
        return {}
    },
    watch: {},
    methods: {},
    async mounted() {

    }
}
</script>

<style scoped>

</style>