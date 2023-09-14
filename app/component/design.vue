<template>
    <div class="flex-column nb-content-design">
        <div class="nb-bundle-heading">
            <h1 class="nb-title">Bundle design</h1>
            <div style="display: flex; gap: 12px">
                <button @click="undoBundleDesign"
                        class="nb-btn"
                        v-if="design_is_change"
                        style="background: #FDFDFD !important; color: #1C1C1e; padding-right: 12px">
                    Undo changes
                </button>
                <button @click="saveBundleDesign" class="nb-btn" v-if="design_is_change">Save changes</button>
                <button @click="saveBundleDesign" class="nb-btn" v-if="!design_is_change" style="cursor: not-allowed">
                    Save changes
                </button>
            </div>
        </div>
        <div style="margin-bottom: -6px; margin-top: 14px">
            <a-tooltip placement="topLeft" v-if="design_is_change"
                       title='Please save your changes before switching bundle type'>
                <a-select v-model:value="bundle_type"
                          class="nb-choose-design-bundle-type"
                          placeholder="Choose bundle type"
                          :disabled="design_is_change">
                    <a-select-option value="product">Bundle type: Product bundle</a-select-option>
                    <a-select-option value="volume">Bundle type: Volume bundle</a-select-option>
                </a-select>
            </a-tooltip>
            <a-select v-model:value="bundle_type"
                      v-else
                      class="nb-choose-design-bundle-type"
                      placeholder="Choose bundle type"
                      :disabled="design_is_change">
                <a-select-option value="product">Bundle type: Product bundle</a-select-option>
                <a-select-option value="volume">Bundle type: Volume bundle</a-select-option>
            </a-select>
        </div>
        <div v-if="isLoadingData && !is_bundle_design_data"
             style="margin: 80px 0 120px 0; display: flex; width: 100%; justify-content: center">
            <svg width="79" height="78" viewBox="0 0 79 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5532 41.6641L48.2911 32.1735L49.9461 34.046L39.2082 43.5366L37.5532 41.6641Z"
                      fill="black"/>
                <path d="M23.8442 42.8828L24.5792 40.4928L32.5415 42.9415L31.8065 45.3315L23.8442 42.8828Z"
                      fill="black"/>
                <path d="M35.75 50.25C32.9925 50.25 30.75 48.0075 30.75 45.25C30.75 42.4925 32.9925 40.25 35.75 40.25C38.5075 40.25 40.75 42.4925 40.75 45.25C40.75 48.0075 38.5075 50.25 35.75 50.25Z"
                      fill="#39D857"/>
                <path d="M5.75 14H20.75V19H5.75V14Z" fill="#39D857"/>
                <path d="M5.75 12.75H20.75V15.25H5.75V12.75Z" fill="black"/>
                <path d="M5.75 17.75H20.75V20.25H5.75V17.75Z" fill="black"/>
                <path d="M38.3238 62.7106L38.1776 60.2156C37.7876 60.2381 37.3951 60.2506 37.0001 60.2506C31.7988 60.2506 26.9638 58.1694 23.3826 54.3906L21.5688 56.1094C25.6251 60.3919 31.1051 62.7506 37.0001 62.7506C37.4438 62.7506 37.8851 62.7356 38.3238 62.7106Z"
                      fill="black"/>
                <path d="M19.4287 53.4517L21.4937 52.043C20.9875 51.2992 20.53 50.5105 20.1325 49.6992L17.8862 50.7955C18.335 51.7167 18.8537 52.6092 19.4287 53.4517Z"
                      fill="black"/>
                <path d="M74.6825 37.75C74.1725 37.75 73.6963 37.8862 73.25 38.0838V35.5987L70.0175 34.5212C69.9538 34.2237 69.8875 33.9288 69.8162 33.6338L67.385 34.2188C67.5037 34.7112 67.6125 35.2062 67.705 35.7075L67.84 36.4312L70.75 37.4013V41.205L69.0725 44.56C68.86 44.985 68.4325 45.25 67.955 45.25H62.9513C63.1288 44.0112 63.25 42.76 63.25 41.5C63.25 39.7025 63.0638 37.895 62.695 36.1263L60.2487 36.6362C60.5812 38.2375 60.75 39.8737 60.75 41.5C60.75 42.7612 60.6213 44.0137 60.425 45.25H47C43.5537 45.25 40.75 48.0537 40.75 51.5V64.9263C39.5137 65.1225 38.26 65.25 37 65.25C26.9738 65.25 18.3988 58.9963 14.92 50.1925L18.99 43.3388L16.8412 42.0625L13.9163 46.99C13.4963 45.2237 13.25 43.3913 13.25 41.5C13.25 35.4137 15.5487 29.67 19.705 25.25H22C24.0675 25.25 25.75 23.5675 25.75 21.5V20.6038C30.6187 17.9825 36.3887 17.1125 41.8637 18.2525L42.3737 15.805C36.7663 14.6375 30.8713 15.3713 25.75 17.7925V12.355C27.5163 11.675 29.3463 11.1437 31.2088 10.795L31.9312 10.66L32.9013 7.75H41.1L42.0687 10.6587L42.7912 10.795C43.2938 10.89 43.7912 10.9988 44.2837 11.115L44.8625 8.68375C44.57 8.61375 44.2738 8.5475 43.9788 8.48375L42.9013 5.25H31.1L30.0238 8.48125C28.4325 8.81625 26.865 9.27 25.3413 9.83C24.7238 8.6025 23.465 7.75 22 7.75H4.5C2.4325 7.75 0.75 9.4325 0.75 11.5V21.5C0.75 23.5675 2.4325 25.25 4.5 25.25H7.44875C5.845 28.1588 4.66625 31.2587 3.9825 34.5212L0.75 35.5987V47.4L3.9825 48.4762C4.72375 52.005 6.01875 55.3688 7.835 58.4863L8.9175 57.855L9.99125 58.4938L13.3562 52.8263C17.595 61.6375 26.5863 67.75 37 67.75C38.285 67.75 39.5613 67.625 40.8263 67.44C41.1263 69.385 42.3338 71.0263 43.9963 71.9475C43.595 72.0387 43.195 72.13 42.79 72.2062L42.0675 72.34L41.0987 75.25H32.9L31.9312 72.34L31.2088 72.2062C26.94 71.405 22.96 69.7588 19.38 67.3088L18.7738 66.8937L16.0338 68.2637L11.3837 63.6138L9.61625 65.3812L15.54 71.305L18.585 69.7825C22.0863 72.0687 25.9275 73.66 30.0225 74.5175L31.0987 77.75H42.9L43.9762 74.5175C45.9488 74.1025 47.88 73.5075 49.7362 72.75H72C75.4463 72.75 78.25 69.9463 78.25 66.5V41.3175C78.25 39.3512 76.65 37.75 74.6825 37.75ZM3.25 21.5V11.5C3.25 10.8113 3.81 10.25 4.5 10.25H22C22.69 10.25 23.25 10.8113 23.25 11.5V21.5C23.25 22.1887 22.69 22.75 22 22.75H4.5C3.81 22.75 3.25 22.1887 3.25 21.5ZM8.98 55.3013C7.73 52.7663 6.81875 50.0863 6.29375 47.2912L6.15875 46.5687L3.25 45.5987V37.4L6.16 36.4312L6.295 35.7075C6.9925 31.9837 8.365 28.4762 10.335 25.25H16.3938C12.7425 29.8663 10.75 35.535 10.75 41.5C10.75 44.4538 11.2625 47.2838 12.1663 49.935L8.98 55.3013ZM75.75 66.5C75.75 68.5675 74.0675 70.25 72 70.25H47C44.9325 70.25 43.25 68.5675 43.25 66.5V51.5C43.25 49.4325 44.9325 47.75 47 47.75H67.955C69.385 47.75 70.67 46.955 71.31 45.6775L73.7288 40.8412C73.9088 40.4775 74.275 40.25 74.6825 40.25C75.27 40.25 75.75 40.73 75.75 41.3175V66.5Z"
                      fill="black"/>
                <path d="M65.75 65.25H63.25V55.25H55.75V65.25H53.25V57.75H45.75V67.75H73.25V50.25H65.75V65.25ZM50.75 65.25H48.25V60.25H50.75V65.25ZM60.75 65.25H58.25V57.75H60.75V65.25ZM68.25 52.75H70.75V65.25H68.25V52.75Z"
                      fill="black"/>
                <path d="M45.75 50.25H48.25V52.75H45.75V50.25Z" fill="black"/>
                <path d="M50.75 50.25H53.25V52.75H50.75V50.25Z" fill="black"/>
                <path d="M55.75 50.25H58.25V52.75H55.75V50.25Z" fill="black"/>
                <path d="M59.5 17.75C58.81 17.75 58.25 17.1887 58.25 16.5V15.25H59.5C60.19 15.25 60.75 15.8113 60.75 16.5H63.25C63.25 14.8725 62.2013 13.4975 60.75 12.98V10.25H58.25V12.75H55.75V16.5C55.75 18.5675 57.4325 20.25 59.5 20.25C60.19 20.25 60.75 20.8112 60.75 21.5V22.75H59.5C58.81 22.75 58.25 22.1888 58.25 21.5H55.75C55.75 23.1275 56.7987 24.5025 58.25 25.02V27.75H60.75V25.25H63.25V21.5C63.25 19.4325 61.5675 17.75 59.5 17.75Z"
                      fill="black"/>
                <path d="M59.5 37.75C49.1613 37.75 40.75 29.3387 40.75 19C40.75 8.66125 49.1613 0.25 59.5 0.25C69.8387 0.25 78.25 8.66125 78.25 19C78.25 29.3387 69.8387 37.75 59.5 37.75ZM59.5 6.5C52.6075 6.5 47 12.1075 47 19C47 25.8925 52.6075 31.5 59.5 31.5C66.3925 31.5 72 25.8925 72 19C72 12.1075 66.3925 6.5 59.5 6.5Z"
                      fill="#39D857"/>
                <path d="M59.5 32.75C51.9187 32.75 45.75 26.5812 45.75 19C45.75 11.4187 51.9187 5.25 59.5 5.25C67.0812 5.25 73.25 11.4187 73.25 19C73.25 26.5812 67.0812 32.75 59.5 32.75ZM59.5 7.75C53.2963 7.75 48.25 12.7975 48.25 19C48.25 25.2025 53.2963 30.25 59.5 30.25C65.7038 30.25 70.75 25.2025 70.75 19C70.75 12.7975 65.7038 7.75 59.5 7.75Z"
                      fill="black"/>
                <path d="M8.25 66.5C5.4925 66.5 3.25 64.2575 3.25 61.5C3.25 58.7425 5.4925 56.5 8.25 56.5C11.0075 56.5 13.25 58.7425 13.25 61.5C13.25 64.2575 11.0075 66.5 8.25 66.5Z"
                      fill="#39D857"/>
                <path d="M20.75 45.25C17.9925 45.25 15.75 43.0075 15.75 40.25C15.75 37.4925 17.9925 35.25 20.75 35.25C23.5075 35.25 25.75 37.4925 25.75 40.25C25.75 43.0075 23.5075 45.25 20.75 45.25Z"
                      fill="#39D857"/>
            </svg>
        </div>
        <div class="nb-loading-blur" v-if="isLoadingData" style="z-index: 9999;position: fixed">
            <Loading :active="isLoadingData" loader="spinner" color="#6D41E9" v-if="isLoadingData" :height="200"
                     :is-full-page="false" style="text-align: center"/>
        </div>
        <div style="display: flex" class="nb-bundle-design" v-if="is_bundle_design_data">
            <div class="flex-column nb-container">
                <div class="flex-column nb-frame-block">
                    <span class="title_block">Add to cart button</span>
                    <div class="flex-column" style="gap:6px">
                        <span class="item_text">Button text</span>
                        <input maxlength="15" type="text" v-model="bundle_setting.btn_text"
                               class="nb-input-large nb-input-bundle-name">
                        <span class="nb-max-character">Maximum 15 characters for button text</span>
                    </div>
                    <div style="display: flex">
                        <div class="flex-column block-input-color-left">
                            <div class="item_text">Button text color</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.btn_text_color"
                                           class="nb-input-large nb-input-color"
                                           type="color"
                                           style="width: 60px !important">
                                </div>
                                <input v-model="bundle_setting.btn_text_color"
                                       class="nb-input-mini nb-input-bundle-name"
                                       type="text">
                            </div>
                        </div>
                        <div class="flex-column">
                            <div class="item_text">Button color</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.btn_color"
                                           style="width: 60px !important"
                                           class="nb-input-large nb-input-color"
                                           type="color">
                                </div>
                                <input v-model="bundle_setting.btn_color" type="text"
                                       class="nb-input-bundle-name nb-input-mini">
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="item_text">Button action</div>
                        <div class="radio-item" @click="bundle_setting.btn_action = 'add_to_cart'">
                            <input type="radio" value="add_to_cart" name="btn_action"
                                   :checked="bundle_setting.btn_action == 'add_to_cart'">
                            <label>Add to cart only</label>
                        </div>
                        <div class="radio-item" @click="bundle_setting.btn_action = 'redirect'">
                            <input :checked="bundle_setting.btn_action == 'redirect'"
                                   type="radio" value="redirect" name="btn_action">
                            <label>Redirect to Cart page</label>
                        </div>
                    </div>
                </div>
                <div class="flex-column nb-frame-block">
                    <span class="title_block">Text color</span>
                    <div style="display: flex">
                        <div class="flex-column block-input-color-left">
                            <div class="item_text">Bundle display name</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input class="nb-input-large nb-input-color"
                                           style="width: 60px !important"
                                           type="color"
                                           v-model="bundle_setting.bundle_display_name_color">
                                </div>
                                <input v-model="bundle_setting.bundle_display_name_color"
                                       type="text"
                                       class="nb-input-mini nb-input-bundle-name">
                            </div>
                        </div>
                        <div class="flex-column">
                            <div class="item_text">Bundle description</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.bundle_description_color"
                                           style="width: 60px !important"
                                           class="nb-input-large nb-input-color"
                                           type="color">
                                </div>
                                <input v-model="bundle_setting.bundle_description_color"
                                       class="nb-input-mini nb-input-bundle-name"
                                       type="text">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex">
                        <div class="flex-column block-input-color-left">
                            <div class="item_text">Discounted price</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.discounted_price_color"
                                           style="width: 60px !important"
                                           class="nb-input-large nb-input-color"
                                           type="color">
                                </div>
                                <input v-model="bundle_setting.discounted_price_color"
                                       class="nb-input-mini nb-input-bundle-name"
                                       type="text">
                            </div>
                        </div>
                        <div class="flex-column">
                            <div class="item_text">Compare-at price</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.compare_at_price_color"
                                           class="nb-input-large nb-input-color"
                                           style="width: 60px !important"
                                           type="color">
                                </div>
                                <input v-model="bundle_setting.compare_at_price_color"
                                       class="nb-input-mini nb-input-bundle-name"
                                       type="text">
                            </div>
                        </div>
                    </div>
                    <div style="display: flex">
                        <div class="flex-column">
                            <div class="item_text">Product name</div>
                            <div style="display: flex">
                                <div class="wrap-input-color">
                                    <input v-model="bundle_setting.product_name_color"
                                           class="nb-input-large nb-input-color"
                                           style="width: 60px !important"
                                           type="color">
                                </div>
                                <input v-model="bundle_setting.product_name_color" type="text"
                                       class="nb-input-mini nb-input-bundle-name">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-column nb-frame-block">
                    <div>
                        <div class="title_block">Confirmation message</div>
                        <div class="nb-dashboard-title-text" style="padding-top: 8px">
                            This message only shows if button action is set as Add to cart only.
                            Please click on Add to Cart button on the preview.
                        </div>
                    </div>
                    <div class="nb-message-text">Message text</div>
                    <input type="text" v-model="bundle_setting.message_text"
                           class="nb-input-bundle-name nb-input-large">
                </div>
                <div class="flex-column nb-frame-block">
                    <span class="title_block">Maximum number of bundles on product page</span>
                    <div style="width: 100%">
                        <InputNumber style="width: 100%; display: flex !important; align-items: center"
                                     v-model:value="max_number"
                                     class="nb-input-large"
                                     :min="1" :max="3"/>
                        <div class="nb-recent-text nb-design-max-number">Maximum number is 3</div>
                    </div>
                </div>
            </div>
            <design_preview @changeBundleType="changeBundleType"
                            :bundle_design_data="bundle_design_data"
                            :design_is_change="design_is_change"
                            :store_currency="store_currency"
                            :bundle_setting="bundle_setting"
                            :bundle_type="bundle_type"
                            :shop_url="shop_url"/>
        </div>
    </div>
</template>
<script>
import design_preview from './design_preview.vue'
import {InputNumber, notification, Select, SelectOption, Tooltip} from "ant-design-vue"
import axios from "axios"
import Loading from "vue-loading-overlay"

export default {
    name: "design",
    components: {
        Loading,
        design_preview,
        InputNumber,
        ASelect: Select,
        ASelectOption: SelectOption,
        ATooltip: Tooltip
    },
    props: {
        store_currency: {type: String, default: ''}
    },
    data() {
        return {
            shop_url: '',
            is_bundle_design_data: false,
            isLoadingData: false,
            bundle_design_data: null,
            max_number: 3,
            original_max_number: 3,
            bundle_setting: {
                btn_color: '#000000',
                btn_action: 'add_to_cart',
                btn_text_color: '#ffffff',
                btn_text: 'Add to Cart',
                bundle_display_name_color: '#000000',
                bundle_description_color: '#000000',
                compare_at_price_color: "#a8a8a8",
                discounted_price_color: '#000000',
                product_name_color: "#000000",
                message_text: 'Bundle added to cart'
            },
            bundle_setting_string: '',
            bundle_type: 'product',
        }
    },
    watch: {
        bundle_type: function () {
            if (this.bundle_type == 'product') {
                this.bundle_setting = this.bundle_design_data.bundle_design_product
                this.bundle_setting_string = JSON.stringify(this.bundle_setting)
            } else {
                this.bundle_setting = this.bundle_design_data.bundle_design_volume
                this.bundle_setting_string = JSON.stringify(this.bundle_setting)
            }
        },
        design_is_change: function () {
            if (this.design_is_change) {
                this.$emit("setNeedSave", true)
            } else {
                this.$emit("setNeedSave", false)
            }
        }
    },
    methods: {
        undoBundleDesign() {
            this.bundle_setting = JSON.parse(this.bundle_setting_string)
            this.max_number = this.original_max_number
        },
        show_toast: function (type, message, duration = 3) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        saveBundleDesign() {
            let self = this
            if (self.design_is_change) {
                self.isLoadingData = true
                axios.post('/nb/create_bundle_design', {
                    jsonrpc: '2.0',
                    params: {
                        bundle_setting: self.bundle_setting,
                        bundle_type: self.bundle_type,
                        max_number: self.max_number,
                        shop_url: window.nb_settings.domain
                    }
                }).then(res => {
                    if (res.data.result.bundle_design_data != 0) {
                        self.is_bundle_design_data = true
                        self.bundle_design_data = res.data.result.bundle_design_data
                        self.show_toast("success", 'Saved!')
                        self.original_max_number = self.max_number

                        self.$emit("setNeedSave", false)
                        self.bundle_setting_string = JSON.stringify(self.bundle_setting)

                    } else {
                        self.show_toast("error", 'Something went wrong. Please contact the customer support!')
                        console.log(res.data.result.bundle_design_data_error)
                    }
                    self.isLoadingData = false
                }).catch(error => {
                    self.isLoadingData = false
                    self.is_bundle_design_data = true
                    console.log(error)
                })
            }
        },
        changeBundleType(bundle_type) {
            this.bundle_type = bundle_type
            this.bundle_setting_string = JSON.stringify(this.bundle_setting)
        }
    },
    mounted() {
        let self = this
        self.$emit("setNeedSave", false)
        self.isLoadingData = true
        axios.post('/nb/get_bundle_design', {
            jsonrpc: '2.0',
            params: {
                shop_url: window.nb_settings.domain
            }
        }).then(res => {
            if (res.data.result.bundle_design_data != 0) {
                self.bundle_design_data = res.data.result.bundle_design_data
                self.bundle_setting = self.bundle_design_data.bundle_design_product
                self.bundle_setting_string = JSON.stringify(self.bundle_setting)
                self.max_number = self.bundle_design_data.max_number
                self.original_max_number = res.data.result.bundle_design_data.max_number
                self.shop_url = res.data.result.shop_url
            } else {
                if(res.data.result.bundle_design_data_error == "Time out!"){
                    self.show_toast("error", 'Please login again!')
                }else {
                    self.show_toast("error", 'Something went wrong. Please contact the customer support!')
                console.log(res.data.result.bundle_design_data_error)
                }
            }
            self.isLoadingData = false
            self.is_bundle_design_data = true
        }).catch(error => {
            self.isLoadingData = false
            console.log(error)
            self.is_bundle_design_data = true
        })
    },
    computed: {
        design_is_change() {
            let self = this
            return JSON.stringify(self.bundle_setting) != self.bundle_setting_string || self.original_max_number != self.max_number
        }
    },
    emits: ['setNeedSave']
}
</script>
<style scoped>
</style>