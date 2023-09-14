<template>
    <div class="flex-column nb-preview-container" style="min-width: 400px; max-width: 450px; height: 100%">
        <div class="flex-column nb-frame-block preview-bundle">
            <div class="nb-bundle-heading" style="width: 100% !important; min-width: 400px">
                <span class="nb-bundle-title">Preview</span>
            </div>
            <div v-if="change_preview_status" style="width: 100%; min-width: 400px">
                <div class="nb-preview-title">
                    <div class="nb-bundle-title"
                         :style="{'color': `${bundle_setting.bundle_display_name_color} !important`}">
                        Bundle title
                    </div>
                    <div class="nb-dashboard-title-text"
                         :style="{'color': `${bundle_setting.bundle_description_color} !important`}">
                        Bundle description goes here
                    </div>
                </div>
                <div class="flex-column" style="width: 100%; min-width: 400px">
                    <div class="flex-column" v-if="bundle_type == 'product'">
                        <div class="nb-line-item">
                            <img src="/nestbundle/static/img/Crystal_Medusa_Greca_Hoop_Earrings.png" alt="">
                            <div class="flex-column">
                                <div class="nb-product-name"
                                     :style="{'color': `${bundle_setting.product_name_color} !important`}">
                                    Crystal Medusa Greca Hoop Earrings
                                </div>
                                <div class="flex-align-center">
                                    <div style="padding-right: 4px"
                                         :style="{'color': bundle_setting.discounted_price_color}"
                                         class="nb-product-name">390 {{ store_currency }}
                                    </div>
                                    <del :style="{'color': bundle_setting.compare_at_price_color}"
                                         style="font-size: 13px">390 {{ store_currency }}
                                    </del>
                                </div>
                            </div>
                        </div>
                        <div class="nb-line-item">
                            <img src="/nestbundle/static/img/Crystal_Medusa_Greca_Hoop_Earrings.png" alt="">
                            <div class="flex-column">
                                <div class="nb-product-name"
                                     :style="{'color': `${bundle_setting.product_name_color} !important`}">
                                    Crystal Medusa Greca Hoop Earrings
                                </div>
                                <div class="flex-align-center">
                                    <div style="padding-right: 4px"
                                         :style="{'color': bundle_setting.discounted_price_color}"
                                         class="nb-product-name">390 {{ store_currency }}
                                    </div>
                                    <del :style="{'color': bundle_setting.compare_at_price_color}"
                                         style="font-size: 13px">390 {{ store_currency }}
                                    </del>
                                </div>
                            </div>
                        </div>
                        <div class="nb-line-item">
                            <img src="/nestbundle/static/img/Crystal_Medusa_Greca_Hoop_Earrings.png" alt="">
                            <div class="flex-column">
                                <div class="nb-product-name"
                                     :style="{'color': `${bundle_setting.product_name_color} !important`}">
                                    Crystal Medusa Greca Hoop Earrings
                                </div>
                                <div class="flex-align-center">
                                    <div style="padding-right: 4px"
                                         :style="{'color': bundle_setting.discounted_price_color}"
                                         class="nb-product-name">390 {{ store_currency }}
                                    </div>
                                    <del :style="{'color': bundle_setting.compare_at_price_color}"
                                         style="font-size: 13px">390 {{ store_currency }}
                                    </del>
                                </div>
                            </div>
                        </div>
                        <div class="nb-preview-footer" style="padding-top: 24px">
                            <div class="flex-column" style="gap: 12px">
                                <div class="flex-align-center">
                                    <div style="padding-right: 4px" class="nb-price nb-price-design-review">Bundle total:</div>
                                    <div style="padding-right: 4px" class="nb-price-design-review">
                                        390 {{ store_currency }}
                                    </div>
                                    <del class="nb-compare-price">390 {{ store_currency }}</del>
                                </div>
                                <div class="nb-dashboard-title-text">You will save 90 {{ store_currency }}!</div>
                            </div>
                            <button class="nb-primary-btn"
                                    style="min-width: fit-content"
                                    @click="change_preview_status = false"
                                    :style="{'background': `${bundle_setting.btn_color} !important`, 'color':`${bundle_setting.btn_text_color} !important`}">
                                {{ bundle_setting.btn_text }}
                            </button>
                        </div>
                    </div>
                    <div class="flex-column" v-if="bundle_type == 'volume'" style="gap: 16px">
                        <div style="display: flex; gap: 12px; padding-top: 16px">
                            <img src="/nestbundle/static/img/AeroPress-Go-Brewer.png" alt=""
                                 class="nb-img-volume_discount_bundle">
                            <div class="flex-column" style="gap: 6px">
                                <div class="nb-product-name" :style="{'color': bundle_setting.product_name_color}">
                                    AeroPress Go Brewer
                                </div>
                                <div class="nb-product-type">Blue/S</div>
                            </div>
                        </div>
                        <a-radio-group class="nb-radio-btn" v-model:value="volume_discount_bundle_data">
                            <div class="nb-volume_discount_bundle_item"
                                 :class="{'nb-volume_discount_bundle_item_selected': volume_discount_bundle_data == 0}"
                                 @click="volume_discount_bundle_data = 0">
                                <div style="width: 100%" class="flex-align-center">
                                    <a-radio :value="0" style="align-self: flex-start;"/>
                                    <div class="nb-line-clamp" style="width: 100%">
                                        <div class="nb-bundle-detail" style="justify-content: space-between">
                                            <div>Buy 4 get 3 {{ store_currency }} discount</div>
                                            <div class="flex-align-center" style="gap: 4px">
                                                <div :style="{'color': bundle_setting.discounted_price_color}">
                                                    390 {{ store_currency }}
                                                </div>
                                                <div class="nb-price-line-through"
                                                     style="font-size: 13px"
                                                     :style="{'color': bundle_setting.compare_at_price_color}">
                                                    390 {{ store_currency }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-column"
                                             v-if="volume_discount_bundle_data === 0"
                                             style="gap: 12px;margin-top:12px ">
                                            <div v-for="x in [0,1,2,3]">
                                                <div class="nb-flex-center-alight"
                                                     style="gap: 12px; align-items: center !important;">
                                                    <Select
                                                        v-model:value="value1[x]"
                                                        style="width: 100%"
                                                        :options="variants"
                                                    />
                                                    <img style="width: 44px; height: 44px;order: -1"
                                                         class="nb-product-info-img" alt=""
                                                         src="/nestbundle/static/img/AeroPress-Go-Brewer.png">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="nb-volume_discount_bundle_item"
                                 :class="{'nb-volume_discount_bundle_item_selected': volume_discount_bundle_data == 1}"
                                 @click="volume_discount_bundle_data = 1">
                                <div style="width: 100%" class="flex-align-center">
                                    <a-radio :value="1" style="align-self: flex-start;"/>
                                    <div class="nb-line-clamp" style="width: 100%">
                                        <div class="nb-bundle-detail" style="justify-content: space-between">
                                            <div>Buy 5 get 3% discount</div>
                                            <div class="flex-align-center" style="gap: 4px">
                                                <div :style="{'color': bundle_setting.discounted_price_color}">
                                                    390 {{ store_currency }}
                                                </div>
                                                <div class="nb-price-line-through"
                                                     :style="{'color': bundle_setting.compare_at_price_color}"
                                                     style="font-size: 14px">
                                                    390 {{ store_currency }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex-column"
                                             v-if="volume_discount_bundle_data === 1"
                                             style="gap: 12px;margin-top:12px ">
                                            <div v-for="x in [0,1,2,3,4]">
                                                <div class="nb-flex-center-alight"
                                                     style="gap: 12px; align-items: center !important;">
                                                    <Select
                                                        v-model:value="value2[x]"
                                                        style="width: 100%"
                                                        :options="variants"
                                                    />
                                                    <img style="width: 44px; height: 44px;order: -1"
                                                         class="nb-product-info-img" alt=""
                                                         src="/nestbundle/static/img/AeroPress-Go-Brewer.png">
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </a-radio-group>
                        <div class="nb-preview-footer">
                            <div class="flex-column" style="gap: 12px">
                                <div style="display: flex">
                                    <div class="nb-price-design-review" style="padding-right: 4px">Bundle total:</div>
                                    <div style="display: flex; align-items: center">
                                        <div style="padding-right: 4px" class="nb-price-design-review">
                                            390 {{ store_currency }}
                                        </div>
                                        <del class="nb-compare-price">390 {{ store_currency }}</del>
                                    </div>
                                </div>
                                <div class="nb-dashboard-title-text">You will save 90 {{ store_currency }}!</div>
                            </div>
                            <button class="nb-primary-btn"
                                    @click="change_preview_status = false"
                                    style="min-width: fit-content"
                                    :style="{'background': `${bundle_setting.btn_color} !important`, 'color':`${bundle_setting.btn_text_color} !important`}">
                                {{ bundle_setting.btn_text }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else style="width: 100%; display: flex; justify-content: center">
                <div class="nb-preview-notification-success">
                    <img src="/nestbundle/static/icon/checked.png" alt=""
                         style="width: 17px; height: 17px; object-fit: cover">
                    <div class="nb-bundle-title" style="font-weight: 500 !important">
                        {{ bundle_setting.message_text }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-column"
             style="padding: 12px 16px; margin-top: 20px; gap: 7px; border-radius: 8px; background: #E6E6E6">
            <div style="display:flex; gap: 6px">
                <img src="/nestbundle/static/icon/exclamation-mark.png" alt="" style="width: 18px; height: 18px">
                <div class="nb-bundle-position">Bundle position</div>
            </div>
            <div class="nb-bundle-position-detail">
                Default bundle position is below Add to Cart form. To customize your bundle position, you can add
                NestScale Bundle <a :href="'https://' + shop_url + '/admin/themes/current/editor'" target="_blank">app
                block</a> to your theme.
            </div>
        </div>
    </div>
</template>
<script>
import {Select, SelectOption, Radio, RadioGroup, notification} from "ant-design-vue"

export default {
    watch:{
        volume_discount_bundle_data(newone){
            this.default_set_variant(newone)
        }
    },
    props: {
        bundle_setting: Object,
        design_is_change: Boolean,
        shop_url: String,
        store_currency: String,
        bundle_type: String
    },
    components: {
        Select,
        ASelectOption: SelectOption,
        ARadio: Radio,
        ARadioGroup: RadioGroup
    },
    data() {
        return {
            volume_discount_bundle_data: 0,
            change_preview_status: true,
            value1: [],
            value2: [],
            variants: [
                {
                    label: 'Size S',
                    url: '/nestbundle/static/img/AeroPress-Go-Brewer.png',
                    value: 's'
                },
                {
                    label: 'Size M',
                    url: '/nestbundle/static/img/AeroPress-Go-Brewer.png',
                    value: 'm'
                },
                {
                    label: 'Size L',
                    url: '/nestbundle/static/img/AeroPress-Go-Brewer.png',
                    value: "l"
                },
                {
                    label: 'Size XL',
                    url: '/nestbundle/static/img/AeroPress-Go-Brewer.png',
                    value: 'xl'
                },
            ],

        }
    },
    methods: {
        show_toast: function (type, message, duration = 3) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        default_set_variant: function(newone){
             if(newone === 0){
                for (let x in [0,1,2,3]){
                    this.value1[x] = this.variants[0]
                }
            }
            else{
                for (let x in [0,1,2,3,4]){
                    this.value2[x] = this.variants[0]
                }
            }
        },
    },
    mounted() {
        this.default_set_variant(this.volume_discount_bundle_data)
    }
}
</script>
<style scoped>
</style>