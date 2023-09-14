<template>
    <div :class="is_backend ? 'nb-preview-container' : ''">
        <div class="flex-column nb-frame-block preview-bundle" v-if="is_backend">
            <div class="nb-bundle-heading" style="width: 100% !important; min-width: 400px">
                <span class="nb-bundle-title">Preview</span>
            </div>
            <div style="width: 100%; min-width: 400px"
                 v-if="(checkDiscountSettingPreview || displayPreview)&&productSelected.length > 0">
                <div class="nb-preview-title">
                    <div class="nb-bundle-title">{{ bundle_display_name }}</div>
                    <div class="nb-dashboard-title-text">{{ bundle_description }}</div>
                </div>
                <div class="flex-column" style="width: 100%; min-width: 400px; padding-top: 5px">
                    <div class="flex-column" v-if="bundle_type === 'product'">
                        <div class="nb-line-item" v-for="product in productSelected">
                            <img class="nb-product-info-img" :src="product.preview_img_src" alt="">
                            <div class="flex-column flex-mini-gap">
                                <div class="nb-product-name">{{ product.name }}</div>
                                <div v-if="product.selected_variant === 'all'">
                                    <Select v-model:value="product.customer_select_variant"
                                            style="width: 70%; margin: 4px 0"
                                            :options="product.variants.filter(item => item.value !== 'all')"
                                            :defaultActiveFirstOption="true"
                                            :placeholder="'Select variant'"
                                            @change="select_variant_product(product)"/>
                                </div>
                                <div v-if="product.selected_label === 'Default Title'"></div>
                                <div
                                    v-if="product.selected_label !== 'Default Title' && product.selected_variant !=='all'">
                                    {{ product.selected_label }}
                                </div>


                                <div v-if="product.selected_variant === 'all'">
                                    <div v-if=" product.customer_select_variant !== undefined">
                                        <div class="nb-product-name"
                                             style="display: flex"
                                             v-if="discount_type !== '' && amount_discount > 0 && discount_type !== 'free_gift'">
                                            <div style="padding-right: 4px"
                                                 v-if="discounted_price(product.preview_price, product.customer_select_variant, product) > 0">
                                                {{
                                                    convert_money(discounted_price(product.preview_price, product.customer_select_variant, product).toFixed(2))
                                                }}
                                            </div>
                                            <del v-if="discount_type === 'percentage'">
                                                {{ convert_money(product.preview_price.toFixed(2)) }}
                                            </del>
                                        </div>
                                        <div class="nb-product-name"
                                             style="display: flex"
                                             v-if="discount_type === 'free_gift'">
                                            <div style="padding-right: 4px">
                                                {{ convert_money(product.preview_price.toFixed(2)) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else>
                                    <div class="nb-product-name"
                                         style="display: flex"
                                         v-if="discount_type !== '' && amount_discount > 0 && discount_type !== 'free_gift'">
                                        <div style="padding-right: 4px"
                                             v-if="discounted_price(returnVariantPrice(product), product.selected_variant, product) > 0">
                                            {{
                                                convert_money(discounted_price(returnVariantPrice(product), product.selected_variant, product).toFixed(2))
                                            }}
                                        </div>
                                        <del v-if="discount_type === 'percentage'">
                                            {{ convert_money(returnVariantPrice(product).toFixed(2)) }}
                                        </del>
                                    </div>
                                    <div class="nb-product-name"
                                         style="display: flex"
                                         v-if="discount_type === 'free_gift' ">
                                        <div style="padding-right: 4px">
                                            {{ convert_money(returnVariantPrice(product).toFixed(2)) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="discount_type == 'free_gift' && 'id' in selectedFreeGift" class="nb-line-item">
                            <img :src="selectedFreeGift.preview_img_src" alt="">
                            <div class="flex-column flex-mini-gap">
                                <div style="display: flex; justify-content: space-between">
                                    <div class="nb-product-name">{{ selectedFreeGift.name }}</div>
                                    <svg width="70" height="24" viewBox="0 0 70 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.5" y="0.5" width="69" height="23" rx="11.5" fill="#3199FF"
                                              fill-opacity="0.2"/>
                                        <path
                                            d="M8.988 17V7.38H15.462V8.706H10.509V11.657H14.864V12.97H10.509V17H8.988ZM16.5133 17V10.11H17.9953V11.02H18.0473C18.1773 10.7513 18.3809 10.513 18.6583 10.305C18.9443 10.0883 19.3559 9.98 19.8933 9.98C20.0579 9.98 20.1966 9.98867 20.3093 10.006C20.4306 10.0233 20.4913 10.032 20.4913 10.032V11.462C20.4913 11.462 20.4263 11.4533 20.2963 11.436C20.1663 11.4187 20.0189 11.41 19.8543 11.41C19.2476 11.41 18.7839 11.5833 18.4633 11.93C18.1513 12.268 17.9953 12.8183 17.9953 13.581V17H16.5133ZM24.5618 17.13C23.9811 17.13 23.4785 17.0303 23.0538 16.831C22.6378 16.623 22.2911 16.35 22.0138 16.012C21.7451 15.6653 21.5415 15.2797 21.4028 14.855C21.2728 14.4303 21.2078 13.997 21.2078 13.555C21.2078 13.1217 21.2728 12.6927 21.4028 12.268C21.5328 11.8433 21.7321 11.4577 22.0008 11.111C22.2695 10.7643 22.6118 10.4913 23.0278 10.292C23.4438 10.084 23.9335 9.98 24.4968 9.98C25.1035 9.98 25.6365 10.1187 26.0958 10.396C26.5638 10.6647 26.9278 11.0677 27.1878 11.605C27.4565 12.1337 27.5908 12.7923 27.5908 13.581V13.984H22.7028C22.7375 14.5127 22.9151 14.9677 23.2358 15.349C23.5565 15.7303 23.9985 15.921 24.5618 15.921C24.8825 15.921 25.1468 15.869 25.3548 15.765C25.5628 15.6523 25.7231 15.5267 25.8358 15.388C25.9485 15.2493 26.0265 15.128 26.0698 15.024C26.1218 14.92 26.1478 14.868 26.1478 14.868H27.5258C27.5258 14.868 27.5041 14.946 27.4608 15.102C27.4175 15.2493 27.3351 15.4357 27.2138 15.661C27.1011 15.8863 26.9365 16.1117 26.7198 16.337C26.5031 16.5623 26.2171 16.753 25.8618 16.909C25.5065 17.0563 25.0731 17.13 24.5618 17.13ZM22.7158 12.944H26.1608C26.1261 12.3373 25.9441 11.891 25.6148 11.605C25.2941 11.319 24.9171 11.176 24.4838 11.176C23.9985 11.176 23.5955 11.3363 23.2748 11.657C22.9541 11.969 22.7678 12.398 22.7158 12.944ZM32.3694 17.13C31.7887 17.13 31.2861 17.0303 30.8614 16.831C30.4454 16.623 30.0987 16.35 29.8214 16.012C29.5527 15.6653 29.3491 15.2797 29.2104 14.855C29.0804 14.4303 29.0154 13.997 29.0154 13.555C29.0154 13.1217 29.0804 12.6927 29.2104 12.268C29.3404 11.8433 29.5397 11.4577 29.8084 11.111C30.0771 10.7643 30.4194 10.4913 30.8354 10.292C31.2514 10.084 31.7411 9.98 32.3044 9.98C32.9111 9.98 33.4441 10.1187 33.9034 10.396C34.3714 10.6647 34.7354 11.0677 34.9954 11.605C35.2641 12.1337 35.3984 12.7923 35.3984 13.581V13.984H30.5104C30.5451 14.5127 30.7227 14.9677 31.0434 15.349C31.3641 15.7303 31.8061 15.921 32.3694 15.921C32.6901 15.921 32.9544 15.869 33.1624 15.765C33.3704 15.6523 33.5307 15.5267 33.6434 15.388C33.7561 15.2493 33.8341 15.128 33.8774 15.024C33.9294 14.92 33.9554 14.868 33.9554 14.868H35.3334C35.3334 14.868 35.3117 14.946 35.2684 15.102C35.2251 15.2493 35.1427 15.4357 35.0214 15.661C34.9087 15.8863 34.7441 16.1117 34.5274 16.337C34.3107 16.5623 34.0247 16.753 33.6694 16.909C33.3141 17.0563 32.8807 17.13 32.3694 17.13ZM30.5234 12.944H33.9684C33.9337 12.3373 33.7517 11.891 33.4224 11.605C33.1017 11.319 32.7247 11.176 32.2914 11.176C31.8061 11.176 31.4031 11.3363 31.0824 11.657C30.7617 11.969 30.5754 12.398 30.5234 12.944ZM43.3926 19.743C42.7946 19.743 42.3006 19.665 41.9106 19.509C41.5206 19.353 41.2086 19.158 40.9746 18.924C40.7406 18.6987 40.5673 18.469 40.4546 18.235C40.3419 18.0097 40.2683 17.819 40.2336 17.663C40.1989 17.507 40.1816 17.429 40.1816 17.429H41.6506C41.6506 17.429 41.6679 17.481 41.7026 17.585C41.7373 17.6977 41.8109 17.8233 41.9236 17.962C42.0449 18.1093 42.2226 18.235 42.4566 18.339C42.6906 18.4517 42.9983 18.508 43.3796 18.508C43.8303 18.508 44.1899 18.417 44.4586 18.235C44.7359 18.0617 44.9309 17.8277 45.0436 17.533C45.1649 17.247 45.2256 16.935 45.2256 16.597V15.817H45.1606C45.0653 15.9643 44.9266 16.129 44.7446 16.311C44.5713 16.4843 44.3373 16.636 44.0426 16.766C43.7479 16.896 43.3926 16.961 42.9766 16.961C42.4566 16.961 42.0016 16.8613 41.6116 16.662C41.2303 16.4627 40.9096 16.1983 40.6496 15.869C40.3983 15.531 40.2076 15.154 40.0776 14.738C39.9476 14.322 39.8826 13.8973 39.8826 13.464C39.8826 13.0307 39.9476 12.6103 40.0776 12.203C40.2076 11.787 40.3983 11.4143 40.6496 11.085C40.9096 10.747 41.2303 10.4783 41.6116 10.279C42.0016 10.0797 42.4566 9.98 42.9766 9.98C43.3926 9.98 43.7479 10.045 44.0426 10.175C44.3373 10.2963 44.5756 10.448 44.7576 10.63C44.9396 10.8033 45.0739 10.968 45.1606 11.124H45.2256V10.11H46.7076V16.584C46.7076 17.1993 46.5819 17.7453 46.3306 18.222C46.0793 18.6987 45.7066 19.0713 45.2126 19.34C44.7186 19.6087 44.1119 19.743 43.3926 19.743ZM43.3146 15.739C43.7393 15.739 44.0946 15.6307 44.3806 15.414C44.6666 15.1887 44.8789 14.9027 45.0176 14.556C45.1563 14.2093 45.2256 13.8453 45.2256 13.464C45.2256 13.0827 45.1563 12.7187 45.0176 12.372C44.8789 12.0253 44.6666 11.7437 44.3806 11.527C44.0946 11.3103 43.7393 11.202 43.3146 11.202C42.8813 11.202 42.5216 11.3103 42.2356 11.527C41.9496 11.7437 41.7373 12.0253 41.5986 12.372C41.4599 12.7187 41.3906 13.0827 41.3906 13.464C41.3906 13.8453 41.4599 14.2093 41.5986 14.556C41.7373 14.9027 41.9496 15.1887 42.2356 15.414C42.5216 15.6307 42.8813 15.739 43.3146 15.739ZM49.3523 8.927C49.0836 8.927 48.8626 8.836 48.6893 8.654C48.516 8.472 48.4293 8.25967 48.4293 8.017C48.4293 7.76567 48.516 7.55333 48.6893 7.38C48.8626 7.198 49.0836 7.107 49.3523 7.107C49.621 7.107 49.842 7.198 50.0153 7.38C50.1973 7.55333 50.2883 7.76567 50.2883 8.017C50.2883 8.26833 50.1973 8.485 50.0153 8.667C49.842 8.84033 49.621 8.927 49.3523 8.927ZM48.6243 17V10.11H50.1063V17H48.6243ZM52.8154 17V11.306H51.6974V10.11H52.8154V9.369C52.8154 9.10033 52.85 8.82733 52.9194 8.55C52.9887 8.27267 53.1057 8.017 53.2704 7.783C53.435 7.54033 53.6604 7.34967 53.9464 7.211C54.2324 7.06367 54.592 6.99 55.0254 6.99C55.2767 6.99 55.4847 7.01167 55.6494 7.055C55.814 7.08967 55.8964 7.107 55.8964 7.107V8.225C55.8964 8.225 55.8314 8.212 55.7014 8.186C55.58 8.16 55.4414 8.147 55.2854 8.147C54.904 8.147 54.644 8.264 54.5054 8.498C54.3667 8.72333 54.2974 9.01367 54.2974 9.369V10.11H55.8314V11.306H54.2974V17H52.8154ZM60.1289 17.13C59.5829 17.13 59.1452 17.0303 58.8159 16.831C58.4865 16.6317 58.2482 16.3673 58.1009 16.038C57.9622 15.7 57.8929 15.336 57.8929 14.946V11.306H56.6839V10.11H57.8929V8.394H59.3749V10.11H60.9869V11.306H59.3749V14.92C59.3749 15.57 59.7345 15.895 60.4539 15.895C60.6359 15.895 60.8049 15.882 60.9609 15.856C61.1169 15.83 61.1949 15.817 61.1949 15.817V17.026C61.1949 17.026 61.0865 17.0433 60.8699 17.078C60.6619 17.1127 60.4149 17.13 60.1289 17.13Z"
                                            fill="#3199FF"/>
                                        <rect x="0.5" y="0.5" width="69" height="23" rx="11.5" stroke="#3199FF"/>
                                    </svg>
                                </div>
                                <div v-if="selectedFreeGift.selected_variant === 'all'">
                                    <Select v-model:value="customer_free_gift_variant"
                                            style="width: 70%"
                                            :options="selectedFreeGift.variants.filter(item => item.value !== 'all')"
                                            :defaultActiveFirstOption="true"
                                            @change="select_variant_free_gift"
                                    />
                                </div>
                                <div v-if="selectedFreeGift.selected_label === 'Default Title'"></div>
                                <div
                                    v-if="selectedFreeGift.selected_label !== 'Default Title' && selectedFreeGift.selected_variant !=='all'">
                                    {{ selectedFreeGift.selected_label }}
                                </div>

                                <div class="flex-align-center" v-if="customer_free_gift_variant !== null">
                                    <del class="nb-product-name nb-output" style="color: #939393">
                                        {{ convert_money(price_customer_free_gift().toFixed(2)) }}
                                    </del>
                                </div>


                                <div class="flex-align-center" v-else>
                                    <del class="nb-product-name nb-output" style="color: #939393"
                                         v-if="selectedFreeGift.selected_variant !== 'all'">
                                        {{ convert_money(parseFloat(returnVariantPrice(selectedFreeGift)).toFixed(2)) }}
                                    </del>
                                    <del class="nb-product-name nb-output" style="color: #939393" v-else>
                                        {{ }}
                                    </del>
                                </div>


                            </div>
                        </div>
                        <div class="nb-preview-footer" style="align-items: unset; padding-top: 24px">
                            <div class="flex-column" style="gap: 12px"
                                 v-if="amount_discount > 0 && discount_type != '' && discount_type != 'free_gift'">
                                <div class="flex-align-center" style="flex-wrap: wrap; gap: 5px">
                                    <div class="nb-total-price">Bundle total:</div>
                                    <div style="display: flex; gap: 4px;align-items: center">
                                        <div class="nb-total-price" style="white-space: nowrap">
                                            {{ convert_money(total_price_after_discount().toFixed(2)) }}
                                        </div>
                                        <del class="nb-compare-price" style="white-space: nowrap">
                                            {{ convert_money(total_price().toFixed(2)) }}
                                        </del>
                                    </div>
                                </div>
                                <div class="nb-dashboard-title-text"
                                     v-if="total_price() > 0 && total_price_after_discount() > 0">
                                    You will save {{
                                        convert_money((total_price() - total_price_after_discount()).toFixed(2))
                                    }}!
                                </div>
                            </div>
                            <div class="flex-column" style="gap: 12px"
                                 v-if="discount_type == 'free_gift' && 'id' in selectedFreeGift">
                                <div class="flex-align-center" style="flex-wrap: wrap">
                                    <div class="nb-total-price" style="margin-right: 4px">Bundle total:</div>
                                    <div style="display: flex; gap: 4px; align-items: center">
                                        <div class="nb-total-price" style="white-space: nowrap">
                                            {{ convert_money(total_price_after_discount().toFixed(2)) }}
                                        </div>
                                        <del v-if="price_free_gift() > 0" class="nb-compare-price"
                                             style="white-space: nowrap">
                                            {{ convert_money((total_price() + price_free_gift()).toFixed(2)) }}
                                        </del>
                                    </div>
                                </div>
                                <div class="nb-dashboard-title-text"
                                     v-if="total_price() > 0 && total_price_after_discount() > 0 && discount_type != 'free_gift'">
                                    You will save
                                    {{ convert_money((total_price() - total_price_after_discount()).toFixed(2)) }}!
                                </div>
                                <div class="nb-dashboard-title-text"
                                     v-if="total_price() > 0 && total_price_after_discount() > 0 && discount_type != 'free_gift'">
                                    You will save
                                    {{ convert_money((total_price() - total_price_after_discount()).toFixed(2)) }}!
                                </div>
                                <div class="nb-dashboard-title-text"
                                     v-if="total_price() > 0 && total_price_after_discount() > 0 && price_free_gift() > 0">
                                    You will save {{ convert_money(price_free_gift().toFixed(2)) }} from free gift!
                                </div>
                            </div>
                            <button class="nb-primary-btn" style="min-width: fit-content">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-column nb-frame-block preview-bundle nb-store-front-end" v-if="!is_backend"
             style="padding: 10px; margin-top: 10px; width: max-content">
            <div v-if="bundle_shopify.bundle.bundleType == 'product' && bundle_shopify.status == 'active'">
                <div v-if="!change_preview_status">
                    <div style="width: 100%"
                         :style="{'maxWidth': maxWidth + 'px','minWidth': maxWidth + 'px'}">
                        <div class="nb-preview-title">
                            <div class="nb-bundle-title"
                                 :style="{'color': bundle_design_product.bundle_display_name_color}">
                                {{ bundle_shopify.bundle.bundleDisplayName }}
                            </div>
                            <div class="nb-dashboard-title-text"
                                 :style="{'color': bundle_design_product.bundle_description_color}">
                                {{ bundle_shopify.bundle.bundleDescription }}
                            </div>
                        </div>
                        <div class="flex-column" style="width: 100%"
                             :style="{'maxWidth': maxWidth + 'px','minWidth': maxWidth + 'px'}">
                            <div class="flex-column" v-if="bundle_shopify.bundle.bundleType === 'product'">
                                <div class="nb-line-item" v-for="product in JSON.parse(bundle_shopify.bundle_json)">
                                    <img class="nb-product-info-img" :src="product.img_src" alt="">
                                    <div class="flex-column flex-mini-gap">
                                        <div class="nb-product-name"
                                             :style="{'color': bundle_design_product.product_name_color}">
                                            {{ product.name }}
                                        </div>

                                        <div v-if="product.selected_variant === 'all'">
                                            <Select v-model:value="product.customer_select_variant"
                                                    style="margin: 4px 0"
                                                    :style="{ width: maxWidth >= 400 ? '70%' : '100%' }"
                                                    :options="product.variants.filter(item => item.value !== 'all')"
                                                    :defaultActiveFirstOption="true"
                                                    @change="select_variant_product(product)"/>
                                        </div>

                                        <div v-if="product.selected_label === 'Default Title'"></div>
                                        <div
                                            v-if="product.selected_label !== 'Default Title' && product.selected_variant !=='all'">
                                            {{ product.selected_label }}
                                        </div>


                                        <div v-if="product.selected_variant === 'all'">
                                            <div v-if=" product.customer_select_variant !== undefined">
                                                <div class="nb-product-name"
                                                     style="display: flex"
                                                     v-if="bundle_shopify.discountType != '' && bundle_shopify.amount_discount > 0 && bundle_shopify.discountType != 'free_gift'">
                                                    <div style="padding-right: 4px"
                                                         class="nb-output"
                                                         :style="{'color': bundle_design_product.discounted_price_color}"
                                                         v-if="discounted_price(product.preview_price, product.customer_select_variant,product, bundle_shopify) > 0">
                                                        {{
                                                            convert_money(discounted_price(product.preview_price, product.customer_select_variant, product, bundle_shopify).toFixed(2))
                                                        }}
                                                    </div>
                                                    <del v-if="bundle_shopify.discountType == 'percentage'"
                                                         class="nb-output"
                                                         :style="{'color':bundle_design_product.compare_at_price_color}">
                                                        {{
                                                            convert_money(parseFloat(product.preview_price).toFixed(2))
                                                        }}
                                                    </del>
                                                </div>
                                                <div class="nb-product-name"
                                                     style="display: flex"
                                                     v-if="bundle_shopify.discountType == 'free_gift'">
                                                    <div style="padding-right: 4px"
                                                         :style="{'color': bundle_design_product.discounted_price_color}"
                                                         class="nb-output">
                                                        {{
                                                            convert_money(parseFloat(product.preview_price).toFixed(2))
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else>
                                            <div class="nb-product-name nb-output"
                                                 style="display: flex"
                                                 v-if=" discounted_price(returnVariantPrice(product), product.selected_variant, product, bundle_shopify) > 0 && bundle_shopify.discount_type !== 'free_gift'">
                                                <div :style="{'color':bundle_design_product.discounted_price_color}"
                                                     style="padding-right: 4px">
                                                    {{
                                                        convert_money(discounted_price(returnVariantPrice(product), product.selected_variant, product, bundle_shopify).toFixed(2))
                                                    }}
                                                </div>
                                                <del v-if="bundle_shopify.discountType === 'percentage'"
                                                     :style="{'color':bundle_design_product.compare_at_price_color}"
                                                     class="nb-output">
                                                    {{
                                                        convert_money(parseFloat(returnVariantPrice(product)).toFixed(2))
                                                    }}
                                                </del>
                                            </div>
                                            <div class="nb-product-name nb-output"
                                                 style="display: flex"
                                                 :style="{'color': bundle_design_product.discounted_price_color}"
                                                 v-if="bundle_shopify.discountType === 'free_gift' ">
                                                <div style="padding-right: 4px">
                                                    {{
                                                        convert_money(parseFloat(returnVariantPrice(product)).toFixed(2))
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-if="bundle_shopify.discountType == 'free_gift' && JSON.parse(bundle_shopify.free_gift).length == 1"
                                    class="nb-line-item">
                                    <img :src='url_img_free_gift(bundle_shopify)' alt="" style="">
                                    <div class="flex-column flex-mini-gap">
                                        <div
                                            style="display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center">
                                            <div class="nb-product-name"
                                                 :style="{'color': bundle_design_product.product_name_color}">
                                                {{ JSON.parse(bundle_shopify.free_gift)[0].name }}
                                            </div>
                                            <svg width="70" height="24" viewBox="0 0 70 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="0.5" width="69" height="23" rx="11.5"
                                                      fill="#3199FF"
                                                      fill-opacity="0.2"/>
                                                <path
                                                    d="M8.988 17V7.38H15.462V8.706H10.509V11.657H14.864V12.97H10.509V17H8.988ZM16.5133 17V10.11H17.9953V11.02H18.0473C18.1773 10.7513 18.3809 10.513 18.6583 10.305C18.9443 10.0883 19.3559 9.98 19.8933 9.98C20.0579 9.98 20.1966 9.98867 20.3093 10.006C20.4306 10.0233 20.4913 10.032 20.4913 10.032V11.462C20.4913 11.462 20.4263 11.4533 20.2963 11.436C20.1663 11.4187 20.0189 11.41 19.8543 11.41C19.2476 11.41 18.7839 11.5833 18.4633 11.93C18.1513 12.268 17.9953 12.8183 17.9953 13.581V17H16.5133ZM24.5618 17.13C23.9811 17.13 23.4785 17.0303 23.0538 16.831C22.6378 16.623 22.2911 16.35 22.0138 16.012C21.7451 15.6653 21.5415 15.2797 21.4028 14.855C21.2728 14.4303 21.2078 13.997 21.2078 13.555C21.2078 13.1217 21.2728 12.6927 21.4028 12.268C21.5328 11.8433 21.7321 11.4577 22.0008 11.111C22.2695 10.7643 22.6118 10.4913 23.0278 10.292C23.4438 10.084 23.9335 9.98 24.4968 9.98C25.1035 9.98 25.6365 10.1187 26.0958 10.396C26.5638 10.6647 26.9278 11.0677 27.1878 11.605C27.4565 12.1337 27.5908 12.7923 27.5908 13.581V13.984H22.7028C22.7375 14.5127 22.9151 14.9677 23.2358 15.349C23.5565 15.7303 23.9985 15.921 24.5618 15.921C24.8825 15.921 25.1468 15.869 25.3548 15.765C25.5628 15.6523 25.7231 15.5267 25.8358 15.388C25.9485 15.2493 26.0265 15.128 26.0698 15.024C26.1218 14.92 26.1478 14.868 26.1478 14.868H27.5258C27.5258 14.868 27.5041 14.946 27.4608 15.102C27.4175 15.2493 27.3351 15.4357 27.2138 15.661C27.1011 15.8863 26.9365 16.1117 26.7198 16.337C26.5031 16.5623 26.2171 16.753 25.8618 16.909C25.5065 17.0563 25.0731 17.13 24.5618 17.13ZM22.7158 12.944H26.1608C26.1261 12.3373 25.9441 11.891 25.6148 11.605C25.2941 11.319 24.9171 11.176 24.4838 11.176C23.9985 11.176 23.5955 11.3363 23.2748 11.657C22.9541 11.969 22.7678 12.398 22.7158 12.944ZM32.3694 17.13C31.7887 17.13 31.2861 17.0303 30.8614 16.831C30.4454 16.623 30.0987 16.35 29.8214 16.012C29.5527 15.6653 29.3491 15.2797 29.2104 14.855C29.0804 14.4303 29.0154 13.997 29.0154 13.555C29.0154 13.1217 29.0804 12.6927 29.2104 12.268C29.3404 11.8433 29.5397 11.4577 29.8084 11.111C30.0771 10.7643 30.4194 10.4913 30.8354 10.292C31.2514 10.084 31.7411 9.98 32.3044 9.98C32.9111 9.98 33.4441 10.1187 33.9034 10.396C34.3714 10.6647 34.7354 11.0677 34.9954 11.605C35.2641 12.1337 35.3984 12.7923 35.3984 13.581V13.984H30.5104C30.5451 14.5127 30.7227 14.9677 31.0434 15.349C31.3641 15.7303 31.8061 15.921 32.3694 15.921C32.6901 15.921 32.9544 15.869 33.1624 15.765C33.3704 15.6523 33.5307 15.5267 33.6434 15.388C33.7561 15.2493 33.8341 15.128 33.8774 15.024C33.9294 14.92 33.9554 14.868 33.9554 14.868H35.3334C35.3334 14.868 35.3117 14.946 35.2684 15.102C35.2251 15.2493 35.1427 15.4357 35.0214 15.661C34.9087 15.8863 34.7441 16.1117 34.5274 16.337C34.3107 16.5623 34.0247 16.753 33.6694 16.909C33.3141 17.0563 32.8807 17.13 32.3694 17.13ZM30.5234 12.944H33.9684C33.9337 12.3373 33.7517 11.891 33.4224 11.605C33.1017 11.319 32.7247 11.176 32.2914 11.176C31.8061 11.176 31.4031 11.3363 31.0824 11.657C30.7617 11.969 30.5754 12.398 30.5234 12.944ZM43.3926 19.743C42.7946 19.743 42.3006 19.665 41.9106 19.509C41.5206 19.353 41.2086 19.158 40.9746 18.924C40.7406 18.6987 40.5673 18.469 40.4546 18.235C40.3419 18.0097 40.2683 17.819 40.2336 17.663C40.1989 17.507 40.1816 17.429 40.1816 17.429H41.6506C41.6506 17.429 41.6679 17.481 41.7026 17.585C41.7373 17.6977 41.8109 17.8233 41.9236 17.962C42.0449 18.1093 42.2226 18.235 42.4566 18.339C42.6906 18.4517 42.9983 18.508 43.3796 18.508C43.8303 18.508 44.1899 18.417 44.4586 18.235C44.7359 18.0617 44.9309 17.8277 45.0436 17.533C45.1649 17.247 45.2256 16.935 45.2256 16.597V15.817H45.1606C45.0653 15.9643 44.9266 16.129 44.7446 16.311C44.5713 16.4843 44.3373 16.636 44.0426 16.766C43.7479 16.896 43.3926 16.961 42.9766 16.961C42.4566 16.961 42.0016 16.8613 41.6116 16.662C41.2303 16.4627 40.9096 16.1983 40.6496 15.869C40.3983 15.531 40.2076 15.154 40.0776 14.738C39.9476 14.322 39.8826 13.8973 39.8826 13.464C39.8826 13.0307 39.9476 12.6103 40.0776 12.203C40.2076 11.787 40.3983 11.4143 40.6496 11.085C40.9096 10.747 41.2303 10.4783 41.6116 10.279C42.0016 10.0797 42.4566 9.98 42.9766 9.98C43.3926 9.98 43.7479 10.045 44.0426 10.175C44.3373 10.2963 44.5756 10.448 44.7576 10.63C44.9396 10.8033 45.0739 10.968 45.1606 11.124H45.2256V10.11H46.7076V16.584C46.7076 17.1993 46.5819 17.7453 46.3306 18.222C46.0793 18.6987 45.7066 19.0713 45.2126 19.34C44.7186 19.6087 44.1119 19.743 43.3926 19.743ZM43.3146 15.739C43.7393 15.739 44.0946 15.6307 44.3806 15.414C44.6666 15.1887 44.8789 14.9027 45.0176 14.556C45.1563 14.2093 45.2256 13.8453 45.2256 13.464C45.2256 13.0827 45.1563 12.7187 45.0176 12.372C44.8789 12.0253 44.6666 11.7437 44.3806 11.527C44.0946 11.3103 43.7393 11.202 43.3146 11.202C42.8813 11.202 42.5216 11.3103 42.2356 11.527C41.9496 11.7437 41.7373 12.0253 41.5986 12.372C41.4599 12.7187 41.3906 13.0827 41.3906 13.464C41.3906 13.8453 41.4599 14.2093 41.5986 14.556C41.7373 14.9027 41.9496 15.1887 42.2356 15.414C42.5216 15.6307 42.8813 15.739 43.3146 15.739ZM49.3523 8.927C49.0836 8.927 48.8626 8.836 48.6893 8.654C48.516 8.472 48.4293 8.25967 48.4293 8.017C48.4293 7.76567 48.516 7.55333 48.6893 7.38C48.8626 7.198 49.0836 7.107 49.3523 7.107C49.621 7.107 49.842 7.198 50.0153 7.38C50.1973 7.55333 50.2883 7.76567 50.2883 8.017C50.2883 8.26833 50.1973 8.485 50.0153 8.667C49.842 8.84033 49.621 8.927 49.3523 8.927ZM48.6243 17V10.11H50.1063V17H48.6243ZM52.8154 17V11.306H51.6974V10.11H52.8154V9.369C52.8154 9.10033 52.85 8.82733 52.9194 8.55C52.9887 8.27267 53.1057 8.017 53.2704 7.783C53.435 7.54033 53.6604 7.34967 53.9464 7.211C54.2324 7.06367 54.592 6.99 55.0254 6.99C55.2767 6.99 55.4847 7.01167 55.6494 7.055C55.814 7.08967 55.8964 7.107 55.8964 7.107V8.225C55.8964 8.225 55.8314 8.212 55.7014 8.186C55.58 8.16 55.4414 8.147 55.2854 8.147C54.904 8.147 54.644 8.264 54.5054 8.498C54.3667 8.72333 54.2974 9.01367 54.2974 9.369V10.11H55.8314V11.306H54.2974V17H52.8154ZM60.1289 17.13C59.5829 17.13 59.1452 17.0303 58.8159 16.831C58.4865 16.6317 58.2482 16.3673 58.1009 16.038C57.9622 15.7 57.8929 15.336 57.8929 14.946V11.306H56.6839V10.11H57.8929V8.394H59.3749V10.11H60.9869V11.306H59.3749V14.92C59.3749 15.57 59.7345 15.895 60.4539 15.895C60.6359 15.895 60.8049 15.882 60.9609 15.856C61.1169 15.83 61.1949 15.817 61.1949 15.817V17.026C61.1949 17.026 61.0865 17.0433 60.8699 17.078C60.6619 17.1127 60.4149 17.13 60.1289 17.13Z"
                                                    fill="#3199FF"/>
                                                <rect x="0.5" y="0.5" width="69" height="23" rx="11.5"
                                                      stroke="#3199FF"/>
                                            </svg>
                                        </div>
                                        <div v-if="JSON.parse(bundle_shopify.free_gift)[0].selected_variant === 'all'"
                                             style="margin-bottom: 8px">
                                            <Select v-model:value="customer_free_gift_variant"
                                                    :options="JSON.parse(bundle_shopify.free_gift)[0].variants.filter(e => e.value !== 'all')"
                                                    :style="{ width: maxWidth >= 400 ? '70%' : '100%' }"

                                            />
                                        </div>

                                        <div
                                            v-if="JSON.parse(bundle_shopify.free_gift)[0].selected_label === 'Default Title'"></div>
                                        <div
                                            v-if="JSON.parse(bundle_shopify.free_gift)[0].selected_label !== 'Default Title' && JSON.parse(bundle_shopify.free_gift)[0].selected_variant !=='all'">
                                            {{ JSON.parse(bundle_shopify.free_gift)[0].selected_label }}
                                        </div>
                                        <div class="flex-align-center"
                                             v-if="JSON.parse(bundle_shopify.free_gift)[0].selected_variant == 'all'">
                                            <del class="nb-product-name nb-output" style="color: #939393">
                                                {{ convert_money(price_customer_free_gift().toFixed(2)) }}
                                            </del>
                                        </div>
                                        <div class="flex-align-center"
                                             v-if="JSON.parse(bundle_shopify.free_gift)[0].selected_variant != 'all'">
                                            <del class="nb-product-name nb-output" style="color: #939393">
                                                {{ convert_money(price_customer_free_gift().toFixed(2)) }}
                                            </del>
                                        </div>
                                    </div>
                                </div>
                                <div class="nb-preview-footer" style="padding-top: 24px; align-items: unset">
                                    <div class="flex-column" style="gap: 12px"
                                         v-if="bundle_shopify.amount_discount > 0 && bundle_shopify.discountType != '' && bundle_shopify.discountType != 'free_gift'">
                                        <div class="flex-align-center" style="gap: 5px; width: 100%; flex-wrap: wrap">
                                            <div class="nb-price nb-total-price">Bundle total:</div>
                                            <div style="display: flex; gap: 4px; align-items: center">
                                                <div class="nb-output nb-total-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money(parseFloat(total_price_after_discount(bundle_shopify)).toFixed(2))
                                                    }}
                                                </div>
                                                <del class="nb-output nb-compare-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money(parseFloat(total_price(bundle_shopify)).toFixed(2))
                                                    }}
                                                </del>
                                            </div>
                                        </div>
                                        <div class="nb-dashboard-title-text nb-output"
                                             v-if="total_price(bundle_shopify) > 0 && total_price_after_discount(bundle_shopify) > 0">
                                            You will save {{
                                                convert_money((total_price(bundle_shopify) - total_price_after_discount(bundle_shopify)).toFixed(2))
                                            }}!
                                        </div>
                                    </div>
                                    <div class="flex-column" style="gap: 12px"
                                         v-if="bundle_shopify.discountType == 'free_gift' && JSON.parse(bundle_shopify.free_gift).length == 1">
                                        <div class="flex-align-center" style="flex-wrap: wrap; width: 100%">
                                            <div class="nb-price nb-total-price" style="margin-right: 5px">
                                                Bundle total:
                                            </div>
                                            <div style="display: flex; gap: 4px; align-items: center">
                                                <div class="nb-output nb-total-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money(total_price_after_discount(bundle_shopify).toFixed(2))
                                                    }}
                                                </div>
                                                <del class="nb-output nb-compare-price" style="white-space: nowrap">
                                                    {{
                                                        convert_money((total_price(bundle_shopify) + price_customer_free_gift()).toFixed(2))
                                                    }}
                                                </del>
                                            </div>
                                        </div>
                                        <div class="nb-dashboard-title-text nb-output"
                                             v-if="total_price(bundle_shopify) > 0 && price_customer_free_gift() > 0">
                                            You will save {{ convert_money(price_customer_free_gift().toFixed(2)) }}
                                            from free gift!
                                        </div>
                                    </div>
                                    <div class="nb-primary-btn"
                                         style="min-width: fit-content; cursor: pointer; padding: 12px"
                                         @click="addBundleShopify(bundle_shopify)"
                                         :style="{'background': bundle_design_product.btn_color, 'color': bundle_design_product.btn_text_color}">
                                        {{ bundle_design_product.btn_text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="width: 100%; display: flex; justify-content: center"
                     :style="{'maxWidth': maxWidth + 'px','minWidth': maxWidth + 'px'}">
                    <div class="nb-preview-notification-success">
                        <img src="/apps/nestbundle/nestbundle/static/icon/checked.png" alt=""
                             style="width: 17px; height: 17px; object-fit: cover">
                        <div class="nb-bundle-title" style="font-weight: 500 !important">
                            {{ bundle_design_product.message_text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {notification, Radio, RadioGroup, Select, SelectOption} from "ant-design-vue"

export default {
    created() {
        if (!this.is_backend) {
            if (this.bundle_shopify.discountType === 'free_gift') {
                this.customer_free_gift_variant = JSON.parse(this.bundle_shopify.free_gift)[0].variants[1].value
            }
        }
    },
    mounted() {
        if (!this.is_backend) {
            if (this.bundle_shopify.bundle.bundleType === 'product') {
                this.checkDiscountSettingPreview = this.checkDiscountSetting
                let tempObjProduct = JSON.parse(this.bundle_shopify.bundle_json);

                for (let item of tempObjProduct) {
                    if (item.selected_variant === 'all') {

                        // if (item.customer_select_variant === undefined) {
                        //
                        //     // item.img_src = item.variants[1].url
                        // }
                        item.customer_select_variant = item.variants[1].value
                        item.preview_price = item.variants[1].price
                        item.img_src = item.variants[1].url !== null ? item.variants[1].url : item.img_product
                    }

                }
                this.bundle_shopify.bundle_json = JSON.stringify(tempObjProduct);
            }
        }

    },
    watch: {
        productSelected(newone) {
            if (this.is_backend) {
                for (let product of newone) {
                    product.customer_select_variant = null
                    if (product.selected_variant === 'all') {
                        product['customer_select_variant'] = product.variants[1].value
                        product['preview_price'] = product.variants[1].price
                        product['preview_img_src'] = product.variants[1].url !== null ? product.variants[1].url : product.img_product
                    } else {
                        product['preview_img_src'] = product.img_src !== null ? product.img_src : product.img_product
                    }
                }
            }
        },
        checkDiscountSetting(newone) {
            this.checkDiscountSettingPreview = newone
        },
        selectedFreeGift(newone) {
            this.customer_free_gift_variant = null
            if (this.is_backend) {
                if (this.discount_type === 'free_gift') {
                    if (newone.selected_variant === 'all') {
                        newone['preview_img_src'] = newone.variants[1].url !== null ? newone.variants[1].url : newone.img_product
                    } else {
                        newone['preview_img_src'] = newone.img_src !== null ? newone.img_src : newone.img_product
                    }

                }
            }
        }
    },
    computed: {},
    props: {
        is_backend: Boolean,
        bundle_shopify: {type: Object, default: {}},
        bundle_design_product: {type: Object, default: {}},
        checkDiscountSetting: Boolean,
        store_currency: String,
        bundle_display_name: String,
        bundle_description: String,
        productSelected: Array,
        discount_type: {type: String, default: ''},
        amount_discount: {type: Number, default: 0},
        selectedFreeGift: {type: Object, default: {}},
        currency_rate: {type: Number, default: 1},
        country_code: {type: String, default: ''},
        locale: {type: String, default: ''},
        currencySymbol: {type: String, default: ''},
        maxWidth: {type: Number, default: 400},
        displayPreview: {type: Boolean, default: false}
    },
    emits: ['getTotalPrice', "tracking_click"],
    components: {
        Select,
        ASelect: Select,
        ASelectOption: SelectOption,
        ARadio: Radio,
        ARadioGroup: RadioGroup
    },
    data() {
        return {
            bundle_type: 'product',
            checkDiscountSettingPreview: false,
            change_preview_status: false,
            isClick: false,
            customer_free_gift_variant: null,
            custom: null
        }
    },

    methods: {
        returnVariantPrice(product) {
            for (let item of product.variants) {
                if (product.selected_variant === item.value) {
                    return item.price
                }
            }
        },
        select_variant_free_gift() {
            if (this.is_backend) {
                if (this.customer_free_gift_variant === '') {
                    return parseFloat('')
                } else {
                    for (let item of this.selectedFreeGift.variants) {
                        if (this.customer_free_gift_variant === item.value) {
                            this.selectedFreeGift['preview_price'] = item.price
                            this.selectedFreeGift['preview_img_src'] = item.url !== null ? item.url : this.selectedFreeGift.img_product;
                        }
                    }
                }
            }
        },
        select_variant_product(product) {
            if (this.is_backend) {
                if (product.customer_select_variant === '') {
                    return parseFloat('')
                } else {
                    for (let item of product.variants) {
                        if (product.customer_select_variant === item.value) {
                            product['preview_price'] = item.price;
                            product['preview_img_src'] = item.url !== null ? item.url : product.img_product;
                            break;
                        }
                    }
                }
            } else {
                if (product.customer_select_variant === '') {
                    return parseFloat('')
                } else {
                    let temp_obj_product = []
                    for (let product_object of JSON.parse(this.bundle_shopify.bundle_json)) {
                        let product_push = null
                        product_push = product_object
                        if (product_object.id === product.id) {
                            for (let item of product.variants) {
                                if (product.customer_select_variant === item.value) {
                                    product['preview_price'] = item.price;
                                    product['img_src'] = item.url !== null ? item.url : product.img_product;
                                    product_push = product
                                    break;
                                }
                            }
                        }
                        temp_obj_product.push(product_push)
                    }
                    this.bundle_shopify.bundle_json = JSON.stringify(temp_obj_product);
                    // let index = temp_obj_product.findIndex(item => item.id === product.id)
                    // if (index !== -1) {
                    //     temp_obj_product = temp_obj_product.filter(item => item.id !== product.id);
                    // }
                    //
                    // for (let item of product.variants) {
                    //     if (product.customer_select_variant === item.value) {
                    //         product['preview_price'] = item.price;
                    //         temp_obj_product.splice(index, 0,)
                    //         this.bundle_shopify.bundle_json = JSON.stringify(temp_obj_product);
                    //         break;
                    //
                    //     }
                    // }
                }
            }

        },
        price_customer_free_gift() {
            let self = this
            if (!self.is_backend) {
                if (JSON.parse(self.bundle_shopify.free_gift)[0].selected_variant == 'all') {
                    for (let variant_free_gift of JSON.parse(self.bundle_shopify.free_gift)[0].variants) {
                        if (self.customer_free_gift_variant == variant_free_gift.value) {
                            return parseFloat(variant_free_gift.price)
                        }
                    }
                } else {
                    for (let variant_free_gift of JSON.parse(self.bundle_shopify.free_gift)[0].variants) {
                        if (variant_free_gift.value == JSON.parse(self.bundle_shopify.free_gift)[0].selected_variant) {
                            return parseFloat(variant_free_gift.price)
                        }
                    }
                }
            } else {
                if (this.selectedFreeGift.selected_variant === 'all') {
                    if (this.customer_free_gift_variant !== null) {
                        for (let variant_free_gift of this.selectedFreeGift.variants) {
                            if (this.customer_free_gift_variant === variant_free_gift.value) {
                                return parseFloat(variant_free_gift.price)
                            }
                        }
                        return 0
                    }
                } else {
                    for (let variant_free_gift of this.selectedFreeGift.variants) {
                        if (this.selectedFreeGift.selected_variant === variant_free_gift.value) {
                            return parseFloat(variant_free_gift.price)
                        }
                    }
                }
            }

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
        total_price(bundle) {
            let total_price = 0
            let self = this
            if (self.is_backend) {
                for (let product of self.productSelected) {
                    if (product.variants.length > 0) {
                        if (product.selected_variant == 'all') {
                            for (let variant of product.variants) {
                                if (variant.value == product.customer_select_variant) {
                                    total_price += variant.price
                                }
                            }
                        } else {
                            for (let variant of product.variants) {
                                if (variant.value === product.selected_variant) {
                                    total_price += variant.price
                                }
                            }
                        }
                    } else {
                        total_price += parseFloat(product.price_range)
                    }
                }
                self.$emit('getTotalPrice', total_price)
            } else {
                for (let product of JSON.parse(bundle.bundle_json)) {
                    if (product.variants.length > 0) {
                        if (product.selected_variant == 'all') {
                            for (let variant of product.variants) {
                                if (variant.value == product.customer_select_variant) {
                                    total_price += variant.price
                                }
                            }
                        } else {
                            for (let variant of product.variants) {
                                if (variant.value == product.selected_variant) {
                                    total_price += variant.price
                                }
                            }
                        }
                    } else {
                        total_price += parseFloat(product.price_range)
                    }
                }
            }
            return total_price
        },
        total_price_after_discount(bundle) {
            let self = this
            if (self.is_backend) {
                if (self.discount_type === "percentage") {
                    return self.total_price() * (1 - self.amount_discount / 100)
                }
                if (self.discount_type === "fixed_amount") {
                    return self.total_price() - self.amount_discount
                }
                if (self.discount_type === 'set_price') {
                    return self.amount_discount
                }
                if (self.discount_type == 'free_gift') {
                    return self.total_price()
                }
            } else {
                if (bundle.discountType === "percentage") {
                    return self.total_price(bundle) * (1 - bundle.amount_discount / 100)
                }
                if (bundle.discountType === "fixed_amount") {
                    return self.total_price(bundle) - bundle.amount_discount
                }
                if (bundle.discountType === 'set_price') {
                    return bundle.amount_discount
                }
                if (bundle.discountType == 'free_gift') {
                    return self.total_price(bundle)
                }
            }
        },
        price_free_gift(bundle) {
            let self = this
            if (!self.is_backend) {
                if (bundle.discountType == 'free_gift' && JSON.parse(bundle.free_gift).length == 1) {
                    return parseFloat(JSON.parse(bundle.free_gift)[0].price_range.split('-')[1])
                } else {
                    return 0
                }
            } else {
                if (self.discount_type == 'free_gift' && 'id' in self.selectedFreeGift) {
                    if (self.customer_free_gift_variant == null) {
                        if (self.selectedFreeGift.variants.length > 1) {
                            self.customer_free_gift_variant = self.selectedFreeGift.variants[1].value
                            return self.selectedFreeGift.variants[1].price
                        } else {
                            return parseFloat(self.selectedFreeGift.price_range.split('-')[1])
                        }
                    } else {
                        for (let variant of self.selectedFreeGift.variants) {
                            if (self.customer_free_gift_variant == variant.value) {
                                return variant.price
                            }
                        }
                    }
                } else {
                    return 0
                }
            }
        },
        addBundleShopify(bundle) {
            let self = this
            let formData = {'items': []}
            for (let product of JSON.parse(bundle.bundle_json)) {
                if (product.selected_variant == 'all') {
                    formData.items.push({
                        'id': product.customer_select_variant,
                        'quantity': 1
                    })
                } else {
                    formData.items.push({
                        'id': product.selected_variant,
                        'quantity': 1
                    })
                }
            }

            fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (bundle.discountType == "free_gift") {
                    const existingData = localStorage.getItem('nbFreeGift')
                    let dataArray = existingData ? JSON.parse(existingData) : []
                    let freeGift
                    for (let variant of JSON.parse(bundle.free_gift)[0].variants) {
                        if (variant.value == this.customer_free_gift_variant) {
                            freeGift = {
                                bundle_id: bundle.bundle_ids,
                                variant_id: this.customer_free_gift_variant,
                                price: variant.price
                            }
                        }
                    }

                    dataArray.push(freeGift)
                    localStorage.setItem('nbFreeGift', JSON.stringify(dataArray))
                }
                if (self.bundle_design_product.btn_action == "redirect") {
                    window.location.href = window.location.origin + "/cart"
                } else {
                    self.change_preview_status = true
                    setTimeout(() => {
                        this.change_preview_status = false
                    }, 2000)
                }

            }).catch(error => {
                console.error('Error:', error)
            })

            if (!this.isClick && bundle) {
                if (this.$emit('tracking_click', bundle)) {
                    this.isClick = true
                }
            }
        },
        show_toast: (type, message, duration = 3) => {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        discounted_price(original_price, variant, product, bundle) {
            let self = this
            let discounted_price
            if (self.is_backend) {
                if (self.amount_discount === 0) {
                    return 0
                }
                if (self.discount_type === 'percentage') {
                    if (variant !== 'all') {
                        discounted_price = parseFloat(original_price) * (1 - self.amount_discount / 100)
                    } else {
                        discounted_price = parseFloat(product.price_range.split("-")[1]) * (1 - self.amount_discount / 100)
                    }
                } else {
                    if (variant !== 'all') {
                        discounted_price = parseFloat(original_price)
                    } else {
                        discounted_price = parseFloat(product.price_range.split("-")[1])
                    }
                }
            } else {
                if (bundle.amount_discount === 0) {
                    return 0
                }
                if (bundle.discountType === 'percentage') {
                    if (variant !== 'all') {
                        discounted_price = parseFloat(original_price) * (1 - bundle.amount_discount / 100)
                    } else {
                        discounted_price = parseFloat(product.price_range.split("-")[1]) * (1 - bundle.amount_discount / 100)
                    }
                } else {
                    if (variant !== 'all') {
                        discounted_price = parseFloat(original_price)
                    } else {
                        discounted_price = parseFloat(product.price_range.split("-")[1])
                    }
                }
            }
            return discounted_price
        },
        url_img_free_gift(bundle_shopify) {
            if (JSON.parse(bundle_shopify.free_gift)[0].selected_variant == 'all') {
                for (let variant_free_gift of JSON.parse(bundle_shopify.free_gift)[0].variants) {
                    if (variant_free_gift.value == this.customer_free_gift_variant) {
                        if (variant_free_gift.url) {
                            return variant_free_gift.url
                        } else {
                            return JSON.parse(bundle_shopify.free_gift)[0].img_product
                        }
                    }
                }
            } else {
                return JSON.parse(bundle_shopify.free_gift)[0].img_src
            }
        }
    }
}
</script>
<style scoped>
</style>
