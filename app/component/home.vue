<template>
    <div class="nb-content-wrapper" style="gap: 24px">
        <div class="nb-heading">
            <h1 class="nb-title">Welcome {{ this.current_store }},</h1>
            <span class="nb-dashboard-title-text">What would you like to do today?</span>
        </div>

        <div class="nb-dashboard-block" style="height: 277px; padding: 24px">
            <div class="nb-dashboard-block-heading">
                <span class="nb-dashboard-embed-notify-heading">Monthly performance statistics</span>
                <span class="nb-dashboard-embed-notify-text">Performance statistics are reset at the beginning of every month</span>
            </div>
            <div class="nb-dashboard-grid" style="margin-top: 20px">
                <div class="nb-dashboard-statistic-data-block">
                    <div style="display: flex; flex-direction: column">
                        <span class="nb-dashboard-statistic-data-number">{{ this.total_view }}</span>
                        <span class="nb-dashboard-statistic-data-text">Bundle views</span>
                    </div>
                </div>
                <div class="nb-dashboard-statistic-data-block">
                    <div style="display: flex; flex-direction: column">
                        <span class="nb-dashboard-statistic-data-number">{{ this.total_click }}</span>
                        <span class="nb-dashboard-statistic-data-text">Bundle clicks</span>
                    </div>
                </div>
                <div class="nb-dashboard-statistic-data-block">
                    <div style="display: flex; flex-direction: column">
                        <span class="nb-dashboard-statistic-data-number">{{ this.computed_click_rate }}%</span>
                        <span class="nb-dashboard-statistic-data-text" style="text-align: center">Click rate</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="nb-dashboard-tab-block" >

                <div class="nb-dashboard-tab">
                    <div style="display: flex; flex-direction: column; text-align: center; gap: 8px">
                        <span class="nb-dashboard-tab-block-title">Create new product bundle</span>
                        <span
                            class="nb-dashboard-tab-block-description">Combine different products into one bundle</span>
                    </div>
                    <button @click="createBundle('product_bundle')" class="nb-btn nb-center-block">
                        Create product bundle
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14 14.25V2.25M2 8.25H11.3333M11.3333 8.25L6.66667 3.58333M11.3333 8.25L6.66667 12.9167"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="nb-dashboard-tab">
                    <div style="display: flex; flex-direction: column; text-align: center; gap: 8px">
                        <span class="nb-dashboard-tab-block-title">Create volume discount bundle</span>
                        <span class="nb-dashboard-tab-block-description">Discount based on purchased quantity of a product</span>
                    </div>
                    <button @click="createBundle('volume_bundle')" class="nb-btn nb-center-block">
                        Create volume discount bundle
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14 14.25V2.25M2 8.25H11.3333M11.3333 8.25L6.66667 3.58333M11.3333 8.25L6.66667 12.9167"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="nb-dashboard-tab">
                    <div style="display: flex; flex-direction: column; text-align: center; gap: 8px">
                        <span class="nb-dashboard-tab-block-title">Customize bundle design</span>
                        <span
                            class="nb-dashboard-tab-block-description">Set color scheme, button action and so on</span>

                    </div>
                    <button @click="$event =>changeMenu('design')" class="nb-btn nb-center-block">
                        Customize bundle
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14 14.25V2.25M2 8.25H11.3333M11.3333 8.25L6.66667 3.58333M11.3333 8.25L6.66667 12.9167"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>

        </div>
        <div class="nb-dashboard-embed-notify">
            <div style="display: flex; align-items: flex-start; gap: 6px; flex: 1 0 0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3179_5404)">
                        <path
                            d="M10.0001 18.3332C14.6025 18.3332 18.3334 14.6022 18.3334 9.99984C18.3334 5.39746 14.6025 1.6665 10.0001 1.6665C5.39771 1.6665 1.66675 5.39746 1.66675 9.99984C1.66675 14.6022 5.39771 18.3332 10.0001 18.3332Z"
                            fill="#636366"/>
                        <path
                            d="M10.0001 6.6665V9.99984M10.0001 13.3332H10.0084M18.3334 9.99984C18.3334 14.6022 14.6025 18.3332 10.0001 18.3332C5.39771 18.3332 1.66675 14.6022 1.66675 9.99984C1.66675 5.39746 5.39771 1.6665 10.0001 1.6665C14.6025 1.6665 18.3334 5.39746 18.3334 9.99984Z"
                            stroke="#E6E6E6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_3179_5404">
                            <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <div
                    style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 12px; flex: 1 0 0">
                    <span class="nb-dashboard-embed-notify-heading">Make sure NestScale Bundle is activated on your theme</span>
                    <span class="nb-dashboard-embed-notify-text">For the bundles to be displayed properly on your store, please activate NestScale Bundle app embed on your theme.</span>
                    <span class="nb-dashboard-embed-notify-text">1. &nbspGo to
                        <a style="text-decoration: underline" target="_blank"
                           :href="'https://' + store_url + '/admin/themes/current/editor?previewPath=%2Fcollections%2Fall&context=apps/app-embed'">Link theme section</a> and select product to add 'Nestscale bundle product' block into
                    </span>
                    <span class="nb-dashboard-embed-notify-text">2. Go to
                        <a style="text-decoration: underline" target="_blank"
                           :href="'https://' + store_url + '/admin/themes/current/editor?previewPath=%2Fcart'">Cart theme section</a>, add 'NestScale bundle cart' block and hide 'subtotal price' and 'checkout button'
                    </span>
                    <span class="nb-dashboard-embed-notify-text">3. Go to
                        <a style="text-decoration: underline" target="_blank"
                           :href="'https://' + store_url + '/admin/themes/current/editor?previewPath=%2Fcart'">Cart theme section</a>, select 'Header' go to 'Cart type' and select 'Page'
                    </span>
                </div>
            </div>
        </div>
        <div class="nb-dashboard-block" style="padding: 16px 20px 24px">
            <span style="font-weight: 600; font-size: 16px; line-height: 20px; padding-bottom: 16px; color: #000000">More resources</span>
            <div class="nb-dashboard-link-container">
                <div class="nb-dashboard-link-tab">
                    <a target="_blank"
                       href="https://support.nestscale.com/nestads?utm_source=in_app&utm_medium=recommend&utm_campaign=nestads"
                       class="nb-dashboard-link-tab-link">
                        <span class="nb-blue-color">Visit Help Center</span>
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5 4.75L10.5 1.75M10.5 1.75H7.5M10.5 1.75L6.5 5.75M5 2.75H3.9C3.05992 2.75 2.63988 2.75 2.31901 2.91349C2.03677 3.0573 1.8073 3.28677 1.66349 3.56901C1.5 3.88988 1.5 4.30992 1.5 5.15V8.35C1.5 9.19008 1.5 9.61012 1.66349 9.93099C1.8073 10.2132 2.03677 10.4427 2.31901 10.5865C2.63988 10.75 3.05992 10.75 3.9 10.75H7.1C7.94008 10.75 8.36012 10.75 8.68099 10.5865C8.96323 10.4427 9.1927 10.2132 9.33651 9.93099C9.5 9.61012 9.5 9.19008 9.5 8.35V7.25"
                                stroke="#1890FF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                    <span>All answers, tutorials and help articles for the app.</span>
                </div>
                <div class="nb-dashboard-link-tab">
                    <a href="#" class="nb-dashboard-link-tab-link">
                        <span class="nb-blue-color">E-commerce blog</span>
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5 4.75L10.5 1.75M10.5 1.75H7.5M10.5 1.75L6.5 5.75M5 2.75H3.9C3.05992 2.75 2.63988 2.75 2.31901 2.91349C2.03677 3.0573 1.8073 3.28677 1.66349 3.56901C1.5 3.88988 1.5 4.30992 1.5 5.15V8.35C1.5 9.19008 1.5 9.61012 1.66349 9.93099C1.8073 10.2132 2.03677 10.4427 2.31901 10.5865C2.63988 10.75 3.05992 10.75 3.9 10.75H7.1C7.94008 10.75 8.36012 10.75 8.68099 10.5865C8.96323 10.4427 9.1927 10.2132 9.33651 9.93099C9.5 9.61012 9.5 9.19008 9.5 8.35V7.25"
                                stroke="#1890FF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                    <span>One-stop learning source for ecommerce business owners who work daily on attracting, converting and retaining customers.</span>
                </div>
                <div class="nb-dashboard-link-tab">
                    <a target="_blank" href="https://www.youtube.com/@nestscale1851" class="nb-dashboard-link-tab-link">
                        <span class="nb-blue-color">NestScale YouTube channel</span>
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5 4.75L10.5 1.75M10.5 1.75H7.5M10.5 1.75L6.5 5.75M5 2.75H3.9C3.05992 2.75 2.63988 2.75 2.31901 2.91349C2.03677 3.0573 1.8073 3.28677 1.66349 3.56901C1.5 3.88988 1.5 4.30992 1.5 5.15V8.35C1.5 9.19008 1.5 9.61012 1.66349 9.93099C1.8073 10.2132 2.03677 10.4427 2.31901 10.5865C2.63988 10.75 3.05992 10.75 3.9 10.75H7.1C7.94008 10.75 8.36012 10.75 8.68099 10.5865C8.96323 10.4427 9.1927 10.2132 9.33651 9.93099C9.5 9.61012 9.5 9.19008 9.5 8.35V7.25"
                                stroke="#1890FF" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                    <span>Leatest online courses, actionable tutorials, best tips and tricks to grow and scale your business.</span>
                </div>
            </div>
        </div>
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
        createBundle(bundle_type) {
            this.$emit('setState', bundle_type)
            this.$emit('setNeedSave', true)
            this.$emit('setMode', 'create')
        },
        changeMenu: function (key) {
            this.$emit('onChangeMenu', key)
        },
        show_toast: function (type, message, duration = 2.0) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
    },
    computed: {
        computed_click_rate() {
            if (this.total_click !== 0 && this.total_view !== 0) {
                return ((this.total_click / this.total_view) * 100).toFixed(2)
            } else {
                return 0
            }

        }
    },
    mounted() {
        let self = this
        this.current_store = window.nb_settings.current_store
        this.store_url = window.nb_settings.domain
        this.$emit("setIsLoadingData", true)
        axios.post('/nb/get_dashboard_data', {
            jsonrpc: "2.0",
            params: {
                store_url: this.store_url,
            }
        }).then(response => {
            if ("error" in response.data.result) {
                if (response.data.result.error == "Time out!") {
                    this.show_toast('error', "Please login again!")
                } else {
                    this.show_toast('error', response.data.result.error)
                }
            } else {
                var data = response.data.result
                if (response.status === 200) {
                    this.total_click = data.bundle_analytic.click
                    this.total_view = data.bundle_analytic.view
                } else if (data.code === -1) {
                    this.show_toast('error', data.error)
                }
            }
            this.$emit("setIsLoadingData", false)
        }).catch(function (error) {
            self.$emit("setIsLoadingData", false)
            self.show_toast('error', error.message)

        });
    }
}
</script>
<style scoped>
</style>