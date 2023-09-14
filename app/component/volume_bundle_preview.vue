<template>
    <div :class="is_backend ? 'nb-preview-container' : ''">
        <div v-if="is_backend" class="flex-column nb-frame-block preview-bundle">
            <div class="nb-bundle-heading" style="width: 100% !important; min-width: 400px">
                <span class="nb-bundle-title">Preview</span>
            </div>
            <div style="width: 100%; min-width: 400px"
                 :class="checkNullDiscountPrev === true ? 'nb-prev-visible':'nb-prev-invisible'">
                <div class="nb-preview-title">
                    <div class="nb-bundle-title">{{ bundle_display_name }}</div>
                    <div class="nb-dashboard-title-text">{{ bundle_description }}</div>
                </div>
                <div class="flex-column" style="width: 100%; min-width: 400px"
                     v-if="this.productSelected !== null">
                    <div class="flex-column" style="gap: 16px">
                        <div style="display: flex; gap: 12px; padding-top: 16px">
                            <img :src="productSelected.img_src"
                                 alt="product picture"
                                 style="width: 60px; height: 60px"
                                 class="nb-product-info-img">
                            <div class="flex-column" style="gap: 6px">
                                <div class="nb-product-name">{{ productSelected.name }}</div>
                                <div class="nb-product-info-variant" v-if="productSelected.variants.length >1">
                                    {{ productSelected.variant_num }} variants
                                </div>
                                <div class="nb-product-info-variant" v-if="productSelected.variants.length == 1">
                                    1 variant
                                </div>
                            </div>
                        </div>
                        <RadioGroup class="nb-radio-btn" v-model:value="select_volume_discount_data">
                            <div v-if="productSelected.variants.length > 1"
                                 v-for="discount in list_discount_setting">
                                <div class="nb-volume_discount_bundle_item nb-volume_discount_bundle_item_2"
                                     v-if="discount.discountType !== null && discount.amount !== null && discount.quantity !== null"
                                     style="flex-direction: column"
                                     @click="choose_volume_discount_bundle_data(discount)"
                                     :class="{'nb-volume_discount_bundle_item_selected': select_volume_discount_data == discount}">
                                    <div style="width: 100%" class="flex-align-center">
                                        <Radio :value="discount" @change="selectDiscount"
                                               style="align-self: flex-start;"/>
                                        <div class="nb-line-clamp">
                                            <div class="nb-bundle-detail">
                                                <div
                                                        v-if="discount.discountType === 'percentage' && discount.amount !== null">
                                                    {{
                                                        "Buy " + discount.quantity.toString() + " get " + discount.amount + "% discount "
                                                    }}
                                                </div>
                                                <div
                                                        v-if="discount.discountType === 'fixed_amount' && discount.amount !== null">
                                                    {{
                                                        "Buy " + discount.quantity.toString() + " get " + discount.amount + " " + store_currency + " discount "
                                                    }}
                                                </div>
                                                <div style="display: flex; gap: 4px; align-items: center"
                                                     v-if="total_price_after_discount(discount) !== undefined && total_price(discount) !== undefined && select_volume_discount_data == discount">
                                                    <div>
                                                        {{
                                                            convert_money(total_price_after_discount(discount).toFixed(2))
                                                        }}
                                                    </div>
                                                    <del>{{ convert_money(total_price(discount).toFixed(2)) }}</del>
                                                </div>
                                                <div v-if="select_volume_discount_data != discount"
                                                     style="display: flex; gap: 4px; align-items: center">
                                                    <div v-if="discount.discountType == 'percentage'">
                                                        {{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity * (1 - discount.amount / 100)).toFixed(2))
                                                        }}
                                                    </div>
                                                    <div v-if="discount.discountType == 'fixed_amount'">
                                                        {{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity - discount.amount).toFixed(2))
                                                        }}
                                                    </div>
                                                    <del v-if="discount.quantity !== null">
                                                        {{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity).toFixed(2))
                                                        }}
                                                    </del>
                                                </div>
                                            </div>
                                            <div class="flex-column"
                                                 v-if="this.productSelected.variant_num > 0 && select_volume_discount_data === discount"
                                                 style="gap: 12px;margin-top:12px ">
                                                <div v-for="bundle_variant_index in discount.quantity">
                                                    <div class="nb-flex-center-alight" style="gap: 12px">
                                                        <Select v-model:value="selected_variant[bundle_variant_index]"
                                                                v-if="productSelected.variant_num >= 0"
                                                                style="width: 100%"
                                                                :options="productSelected.variants"
                                                                @change="setImageVariant(bundle_variant_index,discount)"/>
                                                        <img style="width: 44px; height: 44px; order: -1"
                                                             class="nb-product-info-img" alt=""
                                                             :src="selected_variant[bundle_variant_index] ? setImage[bundle_variant_index] :this.productSelected.img_src">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="productSelected.variants.length == 1"
                                 v-for="discount in list_discount_setting">
                                <div class="nb-volume_discount_bundle_item nb-volume_discount_bundle_item_1"
                                     v-if="discount.discountType !== null && discount.amount !== null && discount.quantity !== null"
                                     style="flex-direction: column"
                                     @click="choose_volume_discount_bundle_data(discount)"
                                     :class="{'nb-volume_discount_bundle_item_selected': select_volume_discount_data == discount}">
                                    <div style="width: 100%; align-items: unset" class="flex-align-center">
                                        <Radio :value="discount" @change="selectDiscount"
                                               style="align-self: flex-start; margin-top: -2px"/>
                                        <div class="nb-line-clamp">
                                            <div class="nb-bundle-detail" style="display: flex; flex-wrap: wrap">
                                                <div style="white-space: nowrap"
                                                     v-if="discount.discountType === 'percentage' && discount.amount !== null">
                                                    {{
                                                        "Buy " + discount.quantity.toString() + " get " + discount.amount + "% discount "
                                                    }}
                                                </div>
                                                <div
                                                        v-if="discount.discountType === 'fixed_amount' && discount.amount !== null">
                                                    {{
                                                        "Buy " + discount.quantity.toString() + " get " + discount.amount + " " + store_currency + " discount "
                                                    }}
                                                </div>
                                                <div style="display: flex; gap: 4px; align-items: center"
                                                     v-if="total_price_after_discount(discount) !== undefined && total_price(discount) !== undefined && select_volume_discount_data == discount">
                                                    <div>
                                                        {{
                                                            convert_money(total_price_after_discount(discount).toFixed(2))
                                                        }}
                                                    </div>
                                                    <del>{{ convert_money(total_price(discount).toFixed(2)) }}</del>
                                                </div>
                                                <div v-if="select_volume_discount_data != discount"
                                                     style="display: flex; gap: 4px; align-items: center">
                                                    <div v-if="discount.discountType == 'percentage'">
                                                        {{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity * (1 - discount.amount / 100)).toFixed(2))
                                                        }}
                                                    </div>
                                                    <div v-if="discount.discountType == 'fixed_amount'">
                                                        {{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity - discount.amount).toFixed(2))
                                                        }}
                                                    </div>
                                                    <del>{{
                                                            convert_money((parseFloat(productSelected.price_range.split('-')[0]) * discount.quantity).toFixed(2))
                                                        }}
                                                    </del>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                        <div class="nb-preview-footer" style="align-items: unset; padding-top: 24px">
                            <div class="flex-column nb-line-clamp">
                                <div class="flex-align-center" style="flex-wrap: wrap; margin-bottom: 10px; gap: 5px">
                                    <div class="nb-price nb-total-price" style="padding-right: 4px">Bundle total:</div>
                                    <div style="display: flex; gap: 4px; align-items: center">
                                        <div class="nb-total-price" style="white-space: nowrap">
                                            {{
                                                convert_money(total_price_after_discount(select_volume_discount_data).toFixed(2))
                                            }}
                                        </div>
                                        <del class="nb-compare-price" style="white-space: nowrap">
                                            {{
                                                convert_money(total_price(select_volume_discount_data).toFixed(2))
                                            }}
                                        </del>
                                    </div>
                                </div>
                                <div class="nb-dashboard-title-text"
                                     v-if="total_price(select_volume_discount_data) > 0 && total_price_after_discount(select_volume_discount_data) > 0">
                                    You will save {{
                                        convert_money((total_price(select_volume_discount_data) - total_price_after_discount(select_volume_discount_data)).toFixed(2))
                                    }}!
                                </div>
                            </div>
                            <div class="nb-primary-btn" style="width: 145px !important">Add to Cart</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!is_backend" class="flex-column nb-frame-block preview-bundle nb-store-front-end"
             style="padding: 10px; margin-top: 10px;width: max-content">
            <div v-if="bundle_shopify.bundle.bundleType == 'volume'">
                <div v-if="!change_preview_status">
                    <div style="width: 100%"
                         :style="{'maxWidth': maxWidth + 'px','minWidth': maxWidth + 'px'}">
                        <div class="nb-preview-title">
                            <div class="nb-bundle-title"
                                 :style="{'color': bundle_design_volume.bundle_display_name_color}">
                                {{ bundle_shopify.bundle.bundleDisplayName }}
                            </div>
                            <div class="nb-dashboard-title-text"
                                 :style="{'color': bundle_design_volume.bundle_description_color}">
                                {{ bundle_shopify.bundle.bundleDescription }}
                            </div>
                        </div>
                        <div class="flex-column" style="width: 100%"
                             :style="{'maxWidth': maxWidth + 'px', 'minWidth': maxWidth + 'px'}">
                            <div class="flex-column" style="gap: 16px">
                                <div style="display: flex; gap: 12px; padding-top: 16px">
                                    <img :src="JSON.parse(bundle_shopify.volume_json).productSelected.img_src"
                                         alt="product picture"
                                         style="width: 60px; height: 60px"
                                         class="nb-product-info-img">
                                    <div class="flex-column" style="gap: 6px">
                                        <div class="nb-product-name"
                                             :style="bundle_design_volume.product_name_color">
                                            {{ JSON.parse(bundle_shopify.volume_json).productSelected.name }}
                                        </div>
                                        <div class="nb-product-info-variant"
                                             v-if="JSON.parse(bundle_shopify.volume_json).productSelected.variant_num > 1">
                                            {{ JSON.parse(bundle_shopify.volume_json).productSelected.variant_num }}
                                            variants
                                        </div>
                                        <div class="nb-product-info-variant"
                                             v-if="JSON.parse(bundle_shopify.volume_json).productSelected.variants.length== 1">
                                            1 variant
                                        </div>
                                    </div>
                                </div>
                                <RadioGroup class="nb-radio-btn"
                                            v-model:value="select_volume_discount_data"
                                            style="gap: 12px; display: flex; flex-direction: column">
                                    <div v-if="productSelected.variants.length > 1"
                                         class="nb-volume_discount_bundle_item nb-volume_discount_bundle_item_2"
                                         :class="{'nb-volume_discount_bundle_item_selected': select_volume_discount_data == discount, 'nb-volume_discount_bundle_item_not_selected': select_volume_discount_data != discount}"
                                         v-for="discount in bundle_shopify.discountType"
                                         @click="choose_volume_discount_bundle_data(discount, bundle_shopify)">
                                        <div style="width: 100%" class="flex-align-center"
                                             :class="{'not-selected': select_volume_discount_data != discount}">
                                            <Radio :value="discount" @change="selectDiscount"/>
                                            <div class="nb-line-clamp" style="width: 100%">
                                                <div class="nb-bundle-detail"
                                                     style="align-items: center; justify-content: space-between;grid-template-columns:unset">
                                                    <div
                                                            v-if="discount.discountType == 'percentage' && discount.amount != null"
                                                            style="font-weight: 500; font-size: 14px; line-height: 18px">
                                                        {{
                                                            "Buy " + discount.quantity.toString() + " get " + discount.amount + "% discount "
                                                        }}
                                                    </div>
                                                    <div
                                                            v-if="discount.discountType == 'fixed_amount' && discount.amount != null"
                                                            style="font-weight: 500; font-size: 14px; line-height: 18px">
                                                        {{
                                                            "Buy " + discount.quantity.toString() + " get " + (discount.amount * currency_rate).toFixed(2) + " " + store_currency + " discount "
                                                        }}
                                                    </div>
                                                    <div style="display: flex; gap: 4px"
                                                         v-if="total_price_after_discount(discount, JSON.parse(bundle_shopify.volume_json).productSelected) != undefined && total_price(discount, JSON.parse(bundle_shopify.volume_json).productSelected) != undefined && select_volume_discount_data == discount">
                                                        <div style="font-size: 14px"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}">
                                                            {{
                                                                convert_money(total_price_after_discount(discount, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                            }}
                                                        </div>
                                                        <del style="font-size: 13px" class="nb-output"
                                                             :style="{'color': bundle_design_volume.compare_at_price_color}">
                                                            {{
                                                                convert_money(total_price(discount, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                            }}
                                                        </del>
                                                    </div>
                                                    <div style="display: flex; gap: 4px"
                                                         v-if="select_volume_discount_data != discount">
                                                        <div style="font-size: 14px"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}"
                                                             v-if="discount.discountType=='percentage'">
                                                            {{
                                                                convert_money((parseFloat(JSON.parse(bundle_shopify.volume_json).productSelected.price_range.split('-')[0]) * discount.quantity * (1 - discount.amount / 100)).toFixed(2))
                                                            }}
                                                        </div>
                                                        <div style="font-size: 14px"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}"
                                                             v-if="discount.discountType=='fixed_amount'">
                                                            {{
                                                                convert_money((parseFloat(JSON.parse(bundle_shopify.volume_json).productSelected.price_range.split('-')[0]) * discount.quantity - discount.amount).toFixed(2))
                                                            }}
                                                        </div>
                                                        <del style="font-size: 13px" class="nb-output"
                                                             :style="{'color': bundle_design_volume.compare_at_price_color}">
                                                            {{
                                                                convert_money((parseFloat(JSON.parse(bundle_shopify.volume_json).productSelected.price_range.split('-')[0]) * discount.quantity).toFixed(2))
                                                            }}
                                                        </del>
                                                    </div>
                                                </div>
                                                <div class="flex-column"
                                                     v-if="select_volume_discount_data === discount"
                                                     style="gap: 12px;margin-top:12px ">
                                                    <div v-for="bundle_variant_index in discount.quantity">
                                                        <div class="nb-flex-center-alight"
                                                             style="gap: 12px; align-items: center !important;">
                                                            <Select v-model:value="selected_variant[bundle_variant_index]"
                                                                    style="width: 100%"
                                                                    :options="productSelected.variants"
                                                                    @change="setImageVariant(bundle_variant_index,discount)"/>
                                                            <img style="width: 44px; height: 44px; order: -1"
                                                                 class="nb-product-info-img" alt=""
                                                                 :src="selected_variant[bundle_variant_index] ? setImage[bundle_variant_index] :this.productSelected.img_src">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="productSelected.variants.length == 1"
                                         class="nb-volume_discount_bundle_item nb-volume_discount_bundle_item_1"
                                         :class="{'nb-volume_discount_bundle_item_selected': select_volume_discount_data == discount}"
                                         v-for="discount in bundle_shopify.discountType"
                                         @click="choose_volume_discount_bundle_data(discount, bundle_shopify)">
                                        <div style="width: 100%; align-items: unset" class="flex-align-center">
                                            <Radio :value="discount" @change="selectDiscount" style="margin-top: -2px"/>
                                            <div class="nb-line-clamp" style="width: 100%">
                                                <div class="nb-bundle-detail"
                                                     style="align-items: center; justify-content: space-between; grid-template-columns:unset">
                                                    <div v-if="discount.discountType == 'percentage' && discount.amount != null"
                                                         style="font-weight: 500; font-size: 14px; line-height: 18px">
                                                        {{
                                                            "Buy " + discount.quantity.toString() + " get " + discount.amount + "% discount "
                                                        }}
                                                    </div>
                                                    <div v-if="discount.discountType == 'fixed_amount' && discount.amount != null"
                                                         style="font-weight: 500; font-size: 14px; line-height: 18px">
                                                        {{
                                                            "Buy " + discount.quantity.toString() + " get " + (discount.amount * currency_rate).toFixed(2) + " " + store_currency + " discount "
                                                        }}
                                                    </div>
                                                    <div style="display: flex; gap: 4px"
                                                         v-if="total_price_after_discount(discount, JSON.parse(bundle_shopify.volume_json).productSelected) != undefined && total_price(discount, JSON.parse(bundle_shopify.volume_json).productSelected) != undefined && select_volume_discount_data == discount">
                                                        <div style="font-size: 14px"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}">
                                                            {{
                                                                convert_money(total_price_after_discount(discount, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                            }}
                                                        </div>
                                                        <del style="font-size: 13px" class="nb-output"
                                                             :style="{'color': bundle_design_volume.compare_at_price_color}">
                                                            {{
                                                                convert_money(total_price(discount, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                            }}
                                                        </del>
                                                    </div>
                                                    <div style="display: flex; gap: 4px"
                                                         v-if="select_volume_discount_data != discount">
                                                        <div style="font-size: 14px"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}">
                                                            {{
                                                                convert_money((parseFloat(productSelected.price_range.split('-')[1]) * discount.quantity * (1 - discount.amount / 100)).toFixed(2))
                                                            }}
                                                        </div>
                                                        <div style="font-size: 14px"
                                                             v-if="discount.discountType=='fixed_amount'"
                                                             class="nb-output"
                                                             :style="{'color': bundle_design_volume.discounted_price_color}">
                                                            {{
                                                                convert_money((parseFloat(productSelected.price_range.split('-')[1]) * discount.quantity - discount.amount).toFixed(2))
                                                            }}
                                                        </div>
                                                        <del style="font-size: 13px" class="nb-output"
                                                             :style="{'color': bundle_design_volume.compare_at_price_color}">
                                                            {{
                                                                convert_money((parseFloat(productSelected.price_range.split('-')[1]) * discount.quantity).toFixed(2))
                                                            }}
                                                        </del>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </RadioGroup>

                                <div class="nb-preview-footer" style="padding-top: 24px; align-items: unset">
                                    <div class="flex-column nb-line-clamp">
                                        <div class="flex-align-center" style="flex-wrap: wrap; margin-bottom: 10px">
                                            <div class="nb-price nb-total-price"
                                                 style="margin-bottom: 5px; margin-right: 5px">
                                                Bundle total:
                                            </div>
                                            <div style="display: flex; gap: 4px; align-items: center">
                                                <div class="nb-output nb-total-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money(total_price_after_discount(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                    }}
                                                </div>
                                                <del class="nb-output nb-compare-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money(total_price(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected).toFixed(2))
                                                    }}
                                                </del>
                                            </div>
                                        </div>
                                        <div class="nb-dashboard-title-text nb-output"
                                             v-if="total_price(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected) > 0 && total_price_after_discount(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected) > 0">
                                            You will save {{
                                                convert_money((total_price(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected) - total_price_after_discount(select_volume_discount_data, JSON.parse(bundle_shopify.volume_json).productSelected)).toFixed(2))
                                            }}!
                                        </div>
                                    </div>
                                    <div class="nb-primary-btn"
                                         @click="addVolumeBundleToCart(bundle_shopify)"
                                         :style="{'color': `${bundle_design_volume.btn_text_color} !important`, 'background': `${bundle_design_volume.btn_color} !important`}"
                                         style="min-width: fit-content; cursor: pointer; padding: 12px">
                                        {{ bundle_design_volume.btn_text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="width: 100%; display: flex; justify-content: center"
                     :style="{'maxWidth': maxWidth + 'px', 'minWidth': maxWidth + 'px'}">
                    <div class="nb-preview-notification-success">
                        <img src="/apps/nestbundle/nestbundle/static/icon/checked.png" alt=""
                             style="width: 17px; height: 17px; object-fit: cover">
                        <div class="nb-bundle-title" style="font-weight: 500 !important">
                            {{ bundle_design_volume.message_text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Button, notification, Radio, RadioGroup, Select, SelectOption} from "ant-design-vue"
import * as events from "events";

export default {
    name: "volume_bundle_preview",
    components: {Select, SelectOption, Button, Radio, RadioGroup},
    props: {
        checkNullDiscountPrev: Boolean,
        bundle_display_name: String,
        bundle_description: String,
        volume_discount_bundle_data: Object,
        list_discount_setting: Object,
        is_backend: Boolean, productSelected: Object,
        bundle_shopify: {type: Object, default: {}},
        store_currency: String,
        bundle_design_volume: {type: Object, default: {}},
        currency_rate: {type: Number, default: 1},
        country_code: {type: String, default: ''},
        locale: {type: String, default: ''},
        maxWidth: {type: Number, default: 400},
        currencySymbol: {type: String, default: ''},
        mode: String
    },
    data() {
        return {
            select_volume_discount_data: !this.is_backend ? this.bundle_shopify.discountType[0] : null,
            change_preview_status: false,
            isClick: false,
            selected_variant: {},
            setImage: []
        }
    },
    computed: {},
    watch: {
        volume_discount_bundle_data(newone) {
            this.select_volume_discount_data = newone
        },
        productSelected() {
            this.selected_variant = {}
            this.setImage = []
            this.default_pick_variant()
        },
        select_volume_discount_data(newone) {
            if (newone) {
                this.selected_variant = {}
                this.default_pick_variant()
            }
        },
        list_discount_setting(newone) {
            if (this.mode === 'edit') {
                if (this.list_discount_setting[0].quantity !== null && this.list_discount_setting[0].amount !== null && this.list_discount_setting[0].discountType !== null) {
                    this.select_volume_discount_data = newone[0]
                }
            }
        }
    },
    methods: {
        setImageVariant(bundle_variant_index, discount) {
            let variant_url = null
            for (let item of this.productSelected.variants) {
                if (item.value === this.selected_variant[bundle_variant_index]) {
                    if (item.url !== null) {
                        variant_url = item.url
                        break;
                    } else {
                        variant_url = this.productSelected.img_src
                    }
                } else {
                    variant_url = this.productSelected.img_src
                }
            }
            this.setImage[bundle_variant_index] = variant_url
        },
        show_toast: function (type, message, duration = 3) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        addVolumeBundleToCart(bundle_shopify) {
            let self = this
            if (self.select_volume_discount_data != null) {
                let formData = {'items': []}
                // if (JSON.parse(bundle_shopify.volume_json).productSelected.selected_label == "All variants") {
                //     formData = {
                //         'items': [{
                //             'quantity': this.select_volume_discount_data.quantity,
                //             "id": JSON.parse(bundle_shopify.volume_json).productSelected.variants[JSON.parse(bundle_shopify.volume_json).productSelected.variants.length - 1].value
                //         }]
                //     }
                // }
                // else {
                for (let i = 1; i <= this.select_volume_discount_data.quantity; i++) {
                    formData.items.push({
                        'id': this.selected_variant[i],
                        'quantity': 1
                    })
                }
                fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).then(response => {
                    if (this.bundle_design_volume.btn_action == "add_to_cart") {
                        self.change_preview_status = true
                        setTimeout(() => {
                            this.change_preview_status = false
                        }, 2000)
                    }
                    if (this.bundle_design_volume.btn_action == "redirect") {
                        window.location.href = window.location.origin + "/cart"
                    }
                }).catch(error => {
                    console.error('Error:', error)
                })
                if (!this.isClick && bundle_shopify) {
                    if (this.$emit('tracking_click', bundle_shopify)) {
                        this.isClick = true
                    }
                }
            } else {
                self.show_toast("error", 'Please select 1 option before add bundle to cart!')
            }
        },
        choose_volume_discount_bundle_data(discount) {
            this.select_volume_discount_data = discount
        },
        total_price(discount, productSelected) {
            let total_price = 0
            if (discount !== "" && discount !== undefined && discount !== null) {
                if (discount.quantity !== null) {
                    if (this.is_backend) {
                        for (let key in this.selected_variant) {
                            if (this.selected_variant.hasOwnProperty(key)) {
                                let value = this.selected_variant[key]
                                for (let variant of this.productSelected.variants) {
                                    if (value == variant.value) {
                                        total_price += variant.price
                                    }
                                }
                            }
                        }
                    } else {
                        for (let key in this.selected_variant) {
                            if (this.selected_variant.hasOwnProperty(key)) {
                                let value = this.selected_variant[key]
                                for (let variant of productSelected.variants) {
                                    if (value == variant.value) {
                                        total_price += variant.price
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return total_price
        },
        total_price_after_discount(discount, productSelected) {
            let total_price_after_discount = 0
            if (this.is_backend) {
                if (discount !== "" && discount !== undefined && discount !== null) {
                    if (discount.discountType === "percentage") {
                        total_price_after_discount = this.total_price(discount) * (1 - discount.amount / 100)
                    }
                    if (discount.discountType === "fixed_amount") {
                        total_price_after_discount = (this.total_price(discount) - discount.amount)
                    }
                }
            } else {
                if (discount !== "" && discount !== undefined && discount !== null) {
                    if (discount.discountType === "percentage") {
                        total_price_after_discount = this.total_price(discount, productSelected) * (1 - discount.amount / 100)
                    }
                    if (discount.discountType === "fixed_amount") {
                        total_price_after_discount = this.total_price(discount, productSelected) - discount.amount
                    }
                }
            }
            return total_price_after_discount
        },
        selectDiscount(event) {
            this.$emit("selectDiscount", event)
        },
        convert_money(money) {
            let self = this
            let localeString
            if (self.store_currency == 'EUR') {
                localeString = 'de-' + self.country_code
            } else {
                localeString = self.locale + '-' + self.country_code
            }
            let option = {style: 'currency', currency: self.store_currency}
            let covert_money_string
            if (parseFloat(money).toLocaleString(localeString, option).includes(self.currencySymbol + '.')) {
                covert_money_string = (self.currency_rate * parseFloat(money)).toLocaleString(localeString, option).replace(self.currencySymbol + ".", ' ') + self.store_currency
            } else {
                covert_money_string = (self.currency_rate * parseFloat(money)).toLocaleString(localeString, option).replace(self.currencySymbol, '') + ' ' + self.store_currency
            }
            if (covert_money_string.split(self.store_currency).length - 1 == 2) {
                covert_money_string = covert_money_string.replace(self.store_currency, '')
            }
            return covert_money_string
        },
        default_pick_variant() {
            if (this.productSelected !== null) {
                if (!this.is_backend) {
                    if (this.bundle_shopify.bundle.bundleType === 'volume') {
                        for (let i = 1; i <= this.select_volume_discount_data.quantity; i++) {
                            this.selected_variant[i] = this.productSelected.variants[0].value
                            if (this.productSelected.variants[0].url !== null) {
                                this.setImage[i] = this.productSelected.variants[0].url
                            } else {
                                this.setImage[i] = this.productSelected.img_src
                            }
                        }
                    }
                } else {
                    if (this.select_volume_discount_data !== null && this.select_volume_discount_data !== undefined) {
                        for (let i = 1; i <= this.select_volume_discount_data.quantity; i++) {
                            this.selected_variant[i] = this.productSelected.variants[0].value
                            if (this.productSelected.variants[0].url !== null) {
                                this.setImage[i] = this.productSelected.variants[0].url
                            } else {
                                this.setImage[i] = this.productSelected.img_src
                            }
                        }
                    }
                }
            }
        }
    },
    async mounted() {
        if (!this.is_backend) {
            this.default_pick_variant()
        }
    }
}
</script>
<style scoped>
</style>