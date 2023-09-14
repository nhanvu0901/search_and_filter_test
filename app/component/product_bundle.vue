<template>
    <div class="nb-content-wrapper nb-create-bundle" style="gap: 32px">
        <div class="nb-bundle-heading">
            <div class="nb-button-group">
                <h1 class="nb-title">
                    {{ this.mode === 'edit' ? this.edit_bundle.bundle.bundleName : "New product bundle" }}
                </h1>
                <Switch v-model:checked="active_status" v-if="mode === 'edit' && this.edit_bundle.status !=='draft'"
                        checked-children="Active"
                        un-checked-children="Inactive"></Switch>
            </div>
            <div class=" nb-button-group">
                <div class="nb-create-bundle-btn"
                     style="color: #1C1C1E; background: #FDFDFD;border: 1px solid #D1D1D1"
                     size="large"
                     @click="leaveCreatePage">
                    Discard
                </div>

                <button v-if="mode === 'edit' && this.edit_bundle.status !=='draft'" class="nb-create-bundle-btn"
                        @click="saveBundle('')"
                        style="color: #FDFDFD !important;"
                        :disabled="checkNotNull">
                    Save changes
                </button>
                <!--                <Dropdown v-if="mode === 'edit' && this.edit_bundle.status !=='draft'"-->
                <!--                          class="nb-create-bundle-btn"-->
                <!--                          style=""-->
                <!--                          placement="bottom"-->
                <!--                          :trigger="['click']">-->
                <!--                    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center">-->
                <!--                        <span style="order: 1">Save changes</span>-->
                <!--                        <svg style="order: 2" width="16" height="16" viewBox="0 0 16 16" fill="none"-->
                <!--                             xmlns="http://www.w3.org/2000/svg">-->
                <!--                            <path d="M4 6L8 10L12 6" stroke="white" stroke-width="1.5" stroke-linecap="round"-->
                <!--                                  stroke-linejoin="round"/>-->
                <!--                        </svg>-->
                <!--                    </div>-->
                <!--                    <template #overlay>-->
                <!--                        <Menu>-->
                <!--                            <MenuItem class=""-->
                <!--                                      style="background: #FFFFFF; font-weight: 400 !important; font-size: 14px !important; line-height: 22px !important; color: rgba(0, 0, 0, 0.85) !important"-->
                <!--                                      @click="saveBundle('draft')">-->
                <!--                                Save as draft-->
                <!--                            </MenuItem>-->
                <!--                            <MenuItem :style="checkNotNull === true ? {cursor:'not-allowed'}:{cursor:'pointer'}"-->
                <!--                                      style="background: #FFFFFF; font-weight: 400 !important; font-size: 14px !important; line-height: 22px !important; color: rgba(0, 0, 0, 0.85) !important"-->
                <!--                                      @click="saveBundle('')">-->
                <!--                                Save Active or Inactive-->
                <!--                            </MenuItem>-->
                <!--                        </Menu>-->
                <!--                    </template>-->
                <!--                </Dropdown>-->


                <Dropdown v-else
                          class="nb-create-bundle-btn"
                          style=""
                          placement="bottom"
                          :trigger="['click']">
                    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center">
                        <span style="order: 1">Save</span>
                        <svg style="order: 2" width="16" height="16" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6L8 10L12 6" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <template #overlay>
                        <Menu>
                            <MenuItem class=""
                                      style="background: #FFFFFF; font-weight: 400 !important; font-size: 14px !important; line-height: 22px !important; color: rgba(0, 0, 0, 0.85) !important"
                                      @click="saveBundle('draft')">
                                Save as draft
                            </MenuItem>
                            <MenuItem
                                style="background: #FFFFFF; font-weight: 400 !important; font-size: 14px !important; line-height: 22px !important; color: rgba(0, 0, 0, 0.85) !important"
                                @click="checkNotNull === true ? this.show_toast('error', 'All field are required and cannot be left blank') : saveBundle('active') ">
                                Save & Active
                            </MenuItem>
                        </Menu>
                    </template>
                </Dropdown>
            </div>
        </div>
        <div class="nb-frame">
            <div class="nb-setting-frame" style="flex: 7 !important;">
                <div class="nb-frame-block" style="height: 120px; order: 0;gap: 6px !important;">
                    <span class="nb-frame-text">Bundle name</span>
                    <input class="nb-input-large nb-input-bundle-name"
                           placeholder="Enter bundle name"
                           v-model="bundle_name"
                           @input="checkInputNotNull">
                </div>
                <div v-if="productSelected.length === 0"
                     class="nb-frame-block nb-add-product"
                     style="height: 212px; order: 1">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M64.6667 20C66.3832 20 67.2415 20 67.6942 19.6456C68.0881 19.3372 68.3226 18.8681 68.333 18.368C68.3449 17.7932 67.8299 17.1066 66.8 15.7333L61.6 8.8C61.0133 8.01779 60.72 7.62668 60.3482 7.34459C60.019 7.09475 59.6461 6.90833 59.2487 6.79482C58.8 6.66667 58.3111 6.66667 57.3333 6.66667H22.6667C21.6889 6.66667 21.2 6.66667 20.7513 6.79482C20.3539 6.90833 19.981 7.09475 19.6517 7.34459C19.28 7.62668 18.9867 8.01778 18.4 8.8L13.2 15.7333C12.1701 17.1066 11.6551 17.7932 11.667 18.368C11.6774 18.8681 11.9119 19.3372 12.3058 19.6456C12.7585 20 13.6168 20 15.3333 20H64.6667Z"
                            fill="#DFE3EB"/>
                        <path
                            d="M59.3333 73.3333C63.067 73.3333 64.9339 73.3333 66.3599 72.6067C67.6143 71.9676 68.6342 70.9477 69.2734 69.6933C70 68.2672 70 66.4003 70 62.6667V23.5556C70 22.2363 70 21.5767 69.8762 20.9432C69.7663 20.3811 69.5844 19.8354 69.335 19.3198C69.054 18.7386 68.6582 18.2109 67.8667 17.1556L61.6 8.8C61.0133 8.01779 60.72 7.62668 60.3482 7.34459C60.019 7.09475 59.6461 6.90833 59.2487 6.79482C58.8 6.66667 58.3111 6.66667 57.3333 6.66667H22.6667C21.6889 6.66667 21.2 6.66667 20.7513 6.79482C20.3539 6.90833 19.981 7.09475 19.6517 7.34459C19.28 7.62668 18.9867 8.01778 18.4 8.8L12.1333 17.1556C11.3418 18.2109 10.946 18.7386 10.665 19.3197C10.4156 19.8354 10.2337 20.381 10.1238 20.9432C10 21.5767 10 22.2363 10 23.5556L10 62.6667C10 66.4003 10 68.2672 10.7266 69.6933C11.3658 70.9477 12.3856 71.9675 13.6401 72.6067C15.0661 73.3333 16.933 73.3333 20.6667 73.3333L59.3333 73.3333Z"
                            fill="#DFE3EB"/>
                        <path
                            d="M53.3333 33.3333C53.3333 36.8696 51.9286 40.2609 49.4281 42.7614C46.9276 45.2619 43.5362 46.6667 40 46.6667C36.4638 46.6667 33.0724 45.2619 30.5719 42.7614C28.0714 40.2609 26.6667 36.8696 26.6667 33.3333"
                            fill="#DFE3EB"/>
                        <path
                            d="M18.4 8.8L13.2 15.7333C12.1701 17.1066 11.6551 17.7932 11.667 18.368C11.6774 18.8681 11.9119 19.3372 12.3058 19.6456C12.7585 20 13.6168 20 15.3333 20H64.6667C66.3832 20 67.2415 20 67.6942 19.6456C68.0881 19.3372 68.3226 18.8681 68.333 18.368C68.3449 17.7932 67.8299 17.1066 66.8 15.7333L61.6 8.8M18.4 8.8C18.9867 8.01778 19.28 7.62668 19.6517 7.34459C19.981 7.09475 20.3539 6.90833 20.7513 6.79482C21.2 6.66667 21.6889 6.66667 22.6667 6.66667H57.3333C58.3111 6.66667 58.8 6.66667 59.2487 6.79482C59.6461 6.90833 60.019 7.09475 60.3482 7.34459C60.72 7.62668 61.0133 8.01779 61.6 8.8M18.4 8.8L12.1333 17.1556C11.3418 18.2109 10.946 18.7386 10.665 19.3197C10.4156 19.8354 10.2337 20.381 10.1238 20.9432C10 21.5767 10 22.2363 10 23.5556L10 62.6667C10 66.4003 10 68.2672 10.7266 69.6933C11.3658 70.9477 12.3856 71.9675 13.6401 72.6067C15.0661 73.3333 16.933 73.3333 20.6667 73.3333L59.3333 73.3333C63.067 73.3333 64.9339 73.3333 66.3599 72.6067C67.6143 71.9676 68.6342 70.9477 69.2734 69.6933C70 68.2672 70 66.4003 70 62.6667V23.5556C70 22.2363 70 21.5767 69.8762 20.9432C69.7663 20.3811 69.5844 19.8354 69.335 19.3198C69.054 18.7386 68.6582 18.2109 67.8667 17.1556L61.6 8.8M53.3333 33.3333C53.3333 36.8696 51.9286 40.2609 49.4281 42.7614C46.9276 45.2619 43.5362 46.6667 40 46.6667C36.4638 46.6667 33.0724 45.2619 30.5719 42.7614C28.0714 40.2609 26.6667 36.8696 26.6667 33.3333"
                            stroke="#FDFDFD" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>No product selected</span>
                    <Button type="primary" size="large" @click="openAddProduct"
                            style="display: flex; justify-content: center; align-items: center; gap: 9.33px">
                        <template #icon>
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.49998 5.33333V10.6667M5.83331 8H11.1666M15.1666 8C15.1666 11.6819 12.1819 14.6667 8.49998 14.6667C4.81808 14.6667 1.83331 11.6819 1.83331 8C1.83331 4.3181 4.81808 1.33333 8.49998 1.33333C12.1819 1.33333 15.1666 4.3181 15.1666 8Z"
                                    stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </svg>
                        </template>
                        Add products to bundle
                    </Button>
                </div>
                <div v-else class="nb-frame-block">
                    <div class="nb-flex-space-around">
                        <span class="nb-frame-text">Selected products</span>
                        <div @click="openAddProduct"
                             style="cursor: pointer; font-weight: 500; font-size: 14px; line-height: 18px; color: #3199FF">
                            Edit products
                        </div>
                    </div>
                    <div class="nb-bundle-table">
                        <Table v-if="productSelected.length > 0"
                               :columns="bundles_columns"
                               :width="'100%'"
                               :pagination="false"
                               :data-source="productSelected">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'image'">
                                    <img alt="" class="nb-product-info-img" :src="record.img_src"/>
                                </template>
                                <template v-if="column.key === 'products'">
                                    <span>{{ record.name }}</span>
                                </template>
                                <template v-if="column.key === 'variant'">
                                    <span v-if="record.selected_label !== undefined">
                                        {{ record.selected_label }}
                                    </span>
                                </template>
                                <template v-if="column.key === 'items'">
                                    <span>{{ record.items }}</span>
                                </template>
                                <template v-if="column.key === 'discountType'">
                                    <span v-if="record.bundle.bundleType === 'volume'"
                                          v-for="discount in record.discountType">{{ discount.discountType }}</span>
                                    <span v-else>{{ record.discountType }}</span>
                                </template>
                                <template v-if="column.key === 'action'">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                         @click="deleteTableProduct(record)" style="cursor: pointer"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13.3333 4.99996V4.33329C13.3333 3.39987 13.3333 2.93316 13.1517 2.57664C12.9919 2.26304 12.7369 2.00807 12.4233 1.84828C12.0668 1.66663 11.6001 1.66663 10.6667 1.66663H9.33333C8.39991 1.66663 7.9332 1.66663 7.57668 1.84828C7.26308 2.00807 7.00811 2.26304 6.84832 2.57664C6.66667 2.93316 6.66667 3.39987 6.66667 4.33329V4.99996M8.33333 9.58329V13.75M11.6667 9.58329V13.75M2.5 4.99996H17.5M15.8333 4.99996V14.3333C15.8333 15.7334 15.8333 16.4335 15.5608 16.9683C15.3212 17.4387 14.9387 17.8211 14.4683 18.0608C13.9335 18.3333 13.2335 18.3333 11.8333 18.3333H8.16667C6.76654 18.3333 6.06647 18.3333 5.53169 18.0608C5.06129 17.8211 4.67883 17.4387 4.43915 16.9683C4.16667 16.4335 4.16667 15.7334 4.16667 14.3333V4.99996"
                                            stroke="#EB3D3D" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    </svg>
                                </template>
                            </template>
                        </Table>
                    </div>
                </div>
                <div class="nb-frame-block" style="order: 3">
                    <h1>Discount settings</h1>
                    <div style="display: flex; flex-direction: row; align-items: flex-end; gap: 10px;width: 100%">
                        <div style="width: 100%">
                            <div style="display: flex;gap: 20px;align-items: flex-end">
                                <div :style="{width: discount_type === '' ? '100%':'60%'}">
                                    <span class="nb-frame-text" style="margin-bottom: 6px">Discount type</span>
                                    <Select size="large"
                                            :style="{width: discount_type === '' ? '85%':'100%'}"
                                            placeholder="Select a discount type"
                                            v-model:value="discount_type"
                                            @change="checkInputNotNull">
                                        <SelectOption value="percentage">Percentage discount</SelectOption>
                                        <SelectOption value="free_gift">Free gift</SelectOption>
                                        <SelectOption value="fixed_amount">Fixed discount amount</SelectOption>
                                        <SelectOption value="set_price">Set price</SelectOption>
                                    </Select>
                                </div>
                                <div v-if="discount_type !== ''" style="order: 1">
                                    <div v-if="discount_type === 'percentage'">
                                        <span class="nb-frame-text" style="margin-bottom: 6px">Discount value</span>
                                        <InputNumber addon-after="%" size="large" @input="checkInputNotNull"
                                                     v-model:value="amount_discount" :min="1" :max="99"/>
                                    </div>
                                    <div v-if="discount_type == 'fixed_amount' || discount_type == 'set_price'">
                                        <span class="nb-frame-text" style="margin-bottom: 6px">Discount value</span>
                                        <Tooltip placement="topLeft" v-if="productSelected.length == 0"
                                                 title='Please select at least 1 product before changing "Discount value".'>
                                            <div>
                                                <InputNumber v-model:value="amount_discount"
                                                             :addon-after="store_currency"
                                                             size="large"
                                                             disabled/>
                                            </div>
                                        </Tooltip>
                                        <InputNumber v-model:value="amount_discount"
                                                     @input="checkInputNotNull"
                                                     :min="1"
                                                     v-if="productSelected.length > 0"
                                                     :max="total_price"
                                                     :addon-after="store_currency"
                                                     size="large"/>
                                    </div>
                                    <div v-if="discount_type === 'free_gift'">
                                        <div v-if="'id' in selectedFreeGift"
                                             style="padding: 12px 16px; width: 100%; border: 1px solid #D1D1D1"
                                             class="nb-create-bundle-btn"
                                             @click="openFreeGift">
                                            Edit free gift
                                        </div>
                                        <Button type="primary"
                                                size="large"
                                                @click="openFreeGift"
                                                v-else
                                                style="display: flex; justify-content: center; align-items: center; gap: 9.33px">
                                            Select free gift
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nb-frame nb-free-gift-selected" v-if="'id' in selectedFreeGift">
                        <img style="width: 90px; height: 90px" class="nb-product-info-img"
                             :src="selectedFreeGift.img_src" alt=""/>
                        <div class="nb-free-gift-info" style="width: 100%">
                            <div class="nb-free-gift-contain">
                                <div class="nb-free-gift-title" style="justify-content: space-between">
                                    <span class="nb-frame-text">{{ selectedFreeGift.name }}</span>
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
                                <span>{{ selectedFreeGift.selected_label }}</span>
                                <span v-if="selectedFreeGift.selected_variant !== 'all'">{{
                                        findSelectedFreeGiftVariantPrice + ' ' + store_currency
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nb-frame-block" style="order: 4">
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Bundle display name</span>
                        <input class="nb-input-large nb-input-new-product-bundle nb-input-bundle-name"
                               placeholder="Enter bundle name"
                               v-model="bundle_display_name"
                               @input="checkInputNotNull">
                    </div>
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Bundle description</span>
                        <input class="nb-input-large nb-input-new-product-bundle nb-input-bundle-name"
                               placeholder="Enter bundle description"
                               v-model="bundle_description"
                               @input="checkInputNotNull">
                    </div>
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Priority</span>
                        <InputNumber style="display: flex; align-items: center; width: 350px"
                                     class="nb-input-large nb-input-new-product-bundle"
                                     :class="{'error_priority': list_priority.includes(priority)}"
                                     @input="checkInputNotNull"
                                     v-model:value="priority"
                                     placeholder="Enter value from 1"
                                     :min="1"/>
                    </div>
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Bundle active dates</span>
                        <a-space class="nb-date-input" direction="vertical">
                            <a-range-picker class="nb-input-large"
                                            v-model:value="active_dates"
                                            format="YYYY-MM-DD"
                                            :allowClear="false"
                                            @input="checkInputNotNull">
                                <template #separator>
                                    <MinusOutlined style="color: #B6B6B6"/>
                                </template>
                                <template #suffixIcon>
                                    <img style="width: 18px; height: 20px"
                                         src="/nestbundle/static/icon/icon_calendar.png"
                                         alt="">
                                </template>
                            </a-range-picker>
                        </a-space>
                    </div>
                </div>
            </div>
            <product_bundle_preview @getTotalPrice="getTotalPrice"
                                    :discount_type="discount_type"
                                    :productSelected="productSelected"
                                    :amount_discount="amount_discount"
                                    :bundle_description="bundle_description"
                                    :selectedFreeGift="selectedFreeGift"
                                    :displayPreview="displayPreview"
                                    :country_code="country_code"
                                    :locale="locale"
                                    :currencySymbol="currencySymbol"
                                    :store_currency="store_currency"
                                    :checkDiscountSetting="checkDiscountSetting"
                                    :bundle_display_name="bundle_display_name"
                                    :is_backend="true"/>
        </div>
    </div>
    <Modal title="Select Products"
           :maskClosable="isLoadingSearchProduct ? false : true"
           centered
           v-model:visible="modalProductSelect"
           @cancel="closeAddProduct"
           class="nb-modal nb-product-select"
           :closable="isLoadingSearchProduct ? false : true"
           style="width: 50%; min-width: 700px">
        <template #footer>
            <div class="nb-loading-tag-product" v-if="isLoadingSearchProduct">
                <LoadingOutlined/>
                <span>Processing</span>
            </div>
            <button class="ant-btn" @click="closeAddProduct" style="color:#1C1C1E !important;"
                    :style="isLoadingSearchProduct ? {cursor: 'not-allowed'}:{cursor: 'pointer'}">Cancel
            </button>
            <button class="ant-btn ant-btn-primary"

                    @click="selectProduct"
                    :style="isLoadingSearchProduct ? {cursor: 'not-allowed'} : {cursor: 'pointer'}"
                    style="background-color: #1C1C1E; color: #FDFDFD">
                Select
            </button>
        </template>
        <div style="display: flex">
            <div class="nb-product-select-wrapper">
                <Input class="nb-input"
                       v-model:value="search_query_product"
                       placeholder="Search by product name"
                       style="margin-bottom: 14px"
                       @input="searchProduct"
                       :disabled="isLoadingTagProduct">
                    <template #prefix>
                        <SearchOutlined/>
                    </template>
                </Input>
                <div class="nb-product-select-list" v-if="isLoadingSearchProduct">
                    <div class="nb-product-option disabled" v-for="x in [1,2,3,4,5,6]" style="width: 100%">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="16" height="16" rx="2" fill="#DEDEDE"/>
                            <path
                                d="M7.10497 12.6041L7.08735 12.6217L2.6875 8.22185L4.12018 6.78917L7.10502 9.77402L11.879 5L13.3117 6.43268L7.12264 12.6218L7.10497 12.6041Z"
                                fill="#DEDEDE"/>
                        </svg>
                        <div class="nb-product-info" style="width: calc(100% - 32px)">
                            <SkeletonInput style="width: 44px" :active="true"/>
                            <div style="width: calc(100% - 56px)">
                                <div class="nb-product-info-title">
                                    <SkeletonInput style="width: 100%" :active="true" size="small"/>
                                </div>
                                <div class="nb-product-info-variant">
                                    <SkeletonInput style="width: 100px" :active="true" size="small"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nb-product-select-list" v-else style="overflow-x: auto">
                    <div v-if="search_query_product && search_query_product!=='' && product_option.length===0"
                         class="nb-no-product">
                        <span style="font-weight: 600; font-size: 14px; line-height: 20px; color: #1C1C1E">
                            No matching products found
                        </span>
                        <span style="font-weight: 400; font-size: 12px; line-height: 18px; color: #636366">
                            Check spelling or try different keywords
                        </span>
                    </div>
                    <CheckboxGroup v-model:value="tempSelectedProductIds" style="min-width: 100%"  v-else>
                        <div v-for="product in product_option" class="nb-product-option"
                             :title="product.name"
                             @click="tagProduct(product)"

                             :style="{'cursor': getCursor(product.id)}"
                             :class="realSelectedProductIds.includes(product.id)?'selected':realSelectedProductIds.length >= 3 && !realSelectedProductIds.includes(product.id)?'disabled':''">
                            <Checkbox :value="product.id"
                                      @click.prevent="tagProductCheckBox(product)"
                                      :disabled="(realSelectedProductIds.length >= 3 && !realSelectedProductIds.includes(product.id)) || isLoadingTagProduct"/>
                            <div class="nb-product-info">
                                <img alt="" class="nb-product-info-img" :src="product.img_src"/>
                                <div>
                                    <div class="nb-product-info-title">{{ product.name }}</div>
                                    <div class="nb-product-info-variant" v-if="product.variants.length==1">
                                        1 variant
                                    </div>
                                    <div class="nb-product-info-variant" v-if="product.variants.length>1">
                                        {{ product.variant_num }} variants
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CheckboxGroup>
                </div>
            </div>
            <div style="flex: 11">
                <div class="nb-product-select-header">Selected Products</div>
                <div style="width: 100%">
                    <div v-for="product in tempSelectedProduct" class="nb-product-option nb-between-justify"  :title="product.name">
                        <div class="nb-product-info">
                            <img class="nb-product-info-img" :src="product.img_src"/>
                            <div>

                                <div class="nb-product-info-title" style="max-width: 260px">
                                    {{ product.name }}
                                </div>

                                <Select v-model:value="product.selected_variant"
                                        v-if="product.variants.length > 0 && product.selected_label !== 'Default Title'"
                                        style="width: 200px;"
                                        :options="product.variants"
                                        @change="selectVariant(product)">
                                </Select>
                                <!--                                <div v-else class="nb-product-info-variant">-->
                                <!--                                    {{ product.variant_num }} variants-->
                                <!--                                </div>-->
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </Modal>
    <Modal title="Selected free gift"
           centered
           v-model:visible="modalFreeGiftSelect"
           @cancel="closeFreeGift"
           class="nb-modal nb-product-select"
           :closable="isLoadingSearchFreeGift ? false : true"
           style="width: 50%; min-width: 700px">
        <template #footer>
            <div class="nb-loading-tag-product" v-if="isLoadingSearchFreeGift">
                <LoadingOutlined/>
                <span>Processing</span>
            </div>
            <button class="ant-btn" v-if="!isLoadingTagFreeGift" @click="closeFreeGift"
                    style="color:#1C1C1E !important;"
                    :style="isLoadingSearchFreeGift ? {cursor: 'not-allowed'} : {cursor: 'pointer'}">Cancel
            </button>
            <button class="ant-btn ant-btn-primary" v-if="!isLoadingTagFreeGift"
                    @click="selectFreeGift"

                    :style="isLoadingSearchFreeGift || tempSelectedFreeGift ===   null ? {cursor: 'not-allowed'}:{cursor: 'pointer'}"
                    style="background-color: #1C1C1E; color: #FDFDFD">
                Select
            </button>
        </template>
        <div style="display: flex">
            <div class="nb-product-select-wrapper">
                <Input class="nb-input" v-model:value="search_query_FreeGift"
                       placeholder="Search by product name"
                       style="margin-bottom: 14px"
                       @input="searchProduct"
                       :disabled="isLoadingTagFreeGift">
                    <template #prefix>
                        <SearchOutlined/>
                    </template>
                </Input>
                <div class="nb-product-select-list" v-if="isLoadingSearchFreeGift">
                    <div class="nb-product-option disabled" v-for="x in [1,2,3,4,5,6]" style="width: 100%">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="16" height="16" rx="2" fill="#DEDEDE"/>
                            <path
                                d="M7.10497 12.6041L7.08735 12.6217L2.6875 8.22185L4.12018 6.78917L7.10502 9.77402L11.879 5L13.3117 6.43268L7.12264 12.6218L7.10497 12.6041Z"
                                fill="#DEDEDE"/>
                        </svg>
                        <div class="nb-product-info" style="width: calc(100% - 32px)">
                            <SkeletonInput style="width: 44px" :active="true"/>
                            <div style="width: calc(100% - 56px)">
                                <div class="nb-product-info-title">
                                    <SkeletonInput style="width: 100%" :active="true" size="small"/>
                                </div>
                                <div class="nb-product-info-variant">
                                    <SkeletonInput style="width: 100px" :active="true" size="small"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nb-product-select-list" v-else style="overflow-x: auto ">
                    <div v-if="search_query_FreeGift && search_query_FreeGift!=='' && freeGift_option.length===0"
                         class="nb-no-product">
                        <span style="font-weight: 600; font-size: 14px; line-height: 20px; color: #1C1C1E">
                            No matching products found
                        </span>
                        <span style="font-weight: 400; font-size: 12px; line-height: 18px; color: #636366">
                            Check spelling or try different keywords
                        </span>
                    </div>
                    <RadioGroup class="nb-radio-btn" v-model:value="tempSelectedFreeGiftID" style="min-width: 100%" v-else>
                        <div v-for="product in freeGift_option"
                             @click="tagFreeGift(product)"
                             :class="tempSelectedFreeGiftID === product.id   ?'selected': '' "

                             class="nb-product-option"
                             :title="product.name"
                        >
                            <Radio :value="product.id"/>
                            <div class="nb-product-info">
                                <img alt="" class="nb-product-info-img" :src="product.img_src"/>
                                <div>
                                    <div class="nb-product-info-title">{{ product.name }}</div>
                                    <div class="nb-product-info-variant" v-if="product.variants.length ==1">
                                        1 variant
                                    </div>
                                    <div class="nb-product-info-variant" v-if="product.variants.length > 1">
                                        {{ product.variant_num }} variants
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div style="flex: 11">
                <div class="nb-product-select-header">Selected Free Gift</div>
                <div style="width: 100% ; padding: 0 16px;">

                    <div class="nb-product-info" :title="tempSelectedFreeGift.name"
                         v-if="tempSelectedFreeGift !== null && tempSelectedFreeGift.variants !== undefined">
                        <img class="nb-product-info-img" :src="tempSelectedFreeGift.img_src"/>
                        <div>

                            <div class="nb-product-info-title" style="max-width: 260px">
                                {{ tempSelectedFreeGift.name }}
                            </div>


                            <Select v-model:value="tempSelectedFreeGift.selected_variant"
                                    v-if="tempSelectedFreeGift.variants.length > 0 && tempSelectedFreeGift.selected_label !== 'Default Title'"
                                    style="width: 200px"
                                    :options="tempSelectedFreeGift.variants"
                                    @change="selectFreeGiftVariant(tempSelectedFreeGift)">
                            </Select>
                            <!--                            <div v-else class="nb-product-info-variant">-->
                            <!--                                {{ tempSelectedFreeGift.variant_num }} variants-->
                            <!--                            </div>-->

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </Modal>
</template>
<script>
import {
    Button,
    Dropdown,
    Menu,
    MenuItem,
    Select,
    SelectOption,
    RangePicker,
    InputNumber,
    notification,
    Table,
    Tag,
    Space,
    Tooltip,
    Input,
    Checkbox,
    Modal,
    SkeletonInput,
    CheckboxGroup,
    Switch,
    RadioGroup, Radio
} from "ant-design-vue"
import dayjs, {Dayjs} from 'dayjs'
import {
    LeftOutlined,
    RightOutlined,
    CloseOutlined,
    SearchOutlined,
    LoadingOutlined,
    MinusOutlined
} from '@ant-design/icons-vue'
import _ from 'lodash'
import axios from 'axios'
import product_bundle_preview from "./product_bundle_preview.vue"
import Volume_bundle_preview from "./volume_bundle_preview.vue";

export default {
    name: "product_bundle",
    components: {
        Volume_bundle_preview,
        Radio,
        RadioGroup,
        Switch,
        MinusOutlined,
        product_bundle_preview,
        CheckboxGroup,
        SkeletonInput,
        Modal,
        LoadingOutlined,
        Checkbox,
        Input,
        Tooltip,
        SearchOutlined,
        Tag,
        Table,
        InputNumber,
        MenuItem,
        Menu,
        Button,
        Dropdown,
        Select,
        SelectOption,
        ARangePicker: RangePicker,
        LeftOutlined,
        RightOutlined,
        CloseOutlined,
        ASpace: Space
    },
    emits: [
        'setIsLoadingData',
        'addBundle',
        "setState",
        'confirmNotSaveCreate',
        "setNeedSave"
    ],
    props: {
        bundles_data: Array,
        needSave: Boolean,
        edit_bundle: {type: Object, default: {}},
        store_currency: String,
        mode: String,
        list_priority_edit: Array,
        country_code: {type: String, default: ''},
        locale: {type: String, default: ''},
        currencySymbol: {type: String, default: ''}
    },

    data() {
        return {
            list_priority: [],
            active_dates: [dayjs(new Date()), dayjs().add(30, 'day')],
            bundle_name: "",
            discount_type: '',
            amount_discount: 1,
            bundle_display_name: '',
            bundle_description: '',
            priority: null,
            // productSelected: [],
            checkDiscountSetting: false,
            checkNotNull: true,

            modalProductSelect: false,
            bundles_columns: [{
                title: '',
                key: 'image',
                width: "78px",
                align: 'center'
            }, {
                title: 'Products',
                key: 'products',
                width: '290px'
            }, {
                title: 'Variant',
                key: 'variant',
                width: "160px"
            }, {
                title: '',
                key: 'action',
                width: "44px"
            }],


            //Product Modal
            isLoadingTagProduct: false,
            search_query_product: null,
            isLoadingSearchProduct: false,
            product_option: [],
            tempSelectedProduct: [],
            tempSelectedProductIds: [],
            productSelected: [], //chon product la thang nay


            //Free gift Modal
            modalFreeGiftSelect: false,
            isLoadingTagFreeGift: false,
            tempSelectedFreeGiftID: null,
            search_query_FreeGift: null,
            isLoadingSearchFreeGift: false,
            freeGift_option: [],
            tempSelectedFreeGift: null,
            // tempSelectedFreeGift: null,//selected free gift go here
            selectedFreeGift: {},//an select moi ghi nhan chon
            //edit screen
            active_status: false,
            backend_domain: window.location.origin,
            total_price: 2
        }
    },
    watch: {
        modalProductSelect: function (newone) {
            if (newone === true) {
                this.getProductLink()

            }
        },
        modalFreeGiftSelect: function (newone) {
            if (newone === true) {
                this.getProductLink()
            }
        },
        productSelected() {
            if (this.productSelected.length == 0) {
                this.amount_discount = 1
            }
        },
        discount_type() {
            if (this.discount_type != 'free_gift' && this.amount_discount == 0) {
                this.amount_discount = 1
            }
        }

    },

    methods: {
        getCursor(product_id) {
            if (this.realSelectedProductIds.length < 3 && this.realSelectedProductIds.includes(product_id)) {
                return 'pointer'
            }
            if (this.realSelectedProductIds.length >= 3 && !this.realSelectedProductIds.includes(product_id)) {
                return 'not-allowed'
            }
        },
        getTotalPrice(totalPrice) {
            this.total_price = totalPrice
        },
        selectProduct() {
            if (this.isLoadingSearchProduct === false) {
                if (this.tempSelectedProduct.length > 0) {
                    this.productSelected = this.tempSelectedProduct.map(object => ({...object}))
                } else {
                    this.productSelected = []
                }
                this.closeAddProduct()
            }
            this.checkInputNotNull()
        },
        selectFreeGift() {
            if (this.isLoadingSearchFreeGift === false) {
                if (this.tempSelectedFreeGift !== null) {
                    this.selectedFreeGift = JSON.parse(JSON.stringify(this.tempSelectedFreeGift))
                    this.closeFreeGift()
                    this.checkInputNotNull()
                }
            }
        },
        selectFreeGiftVariant() {
            let indexOfLabel = this.tempSelectedFreeGift.variants.findIndex(item => item.value === this.tempSelectedFreeGift.selected_variant)
            this.tempSelectedFreeGift['selected_label'] = this.tempSelectedFreeGift.variants[indexOfLabel].label
            if (this.tempSelectedFreeGift.variants[indexOfLabel].value !== 'all') {
                this.tempSelectedFreeGift['preview_price'] = this.tempSelectedFreeGift.variants[indexOfLabel].price
                this.tempSelectedFreeGift['img_src'] = this.tempSelectedFreeGift.variants[indexOfLabel].url !== null ? this.tempSelectedFreeGift.variants[indexOfLabel].url : this.tempSelectedFreeGift.img_product
            } else {
                this.tempSelectedFreeGift['preview_price'] = this.tempSelectedFreeGift.variants[1].price
                this.tempSelectedFreeGift['img_src'] = this.tempSelectedFreeGift.img_product
            }

        },
        selectVariant(product) {
            let indexOfProduct = this.tempSelectedProduct.findIndex(item => item.id === product.id)
            if (indexOfProduct !== -1) {

                let indexOfLabel = product.variants.findIndex(item => item.value === product.selected_variant)


                if (product.variants[indexOfLabel].value !== 'all') {
                    product['customer_select_variant'] = product.variants[indexOfLabel].value
                    product['selected_label'] = product.variants[indexOfLabel].label
                    product['preview_price'] = product.variants[indexOfLabel].price
                    product['img_src'] = product.variants[indexOfLabel].url !== null ? product.variants[indexOfLabel].url : product.img_product
                } else {
                    product['customer_select_variant'] = product.variants[1].value
                    product['selected_label'] = 'All variants'
                    product['preview_price'] = product.variants[1].price
                    product['img_src'] = product.img_product
                }


            }
        },

        removeProduct: function (product) {
            if (!this.isLoadingTagProduct) {
                this.tempSelectedProductIds = this.tempSelectedProductIds.filter(i => i !== product.id)
                this.tempSelectedProduct = this.tempSelectedProduct.filter(i => i.id !== product.id)
                // this.productSelected = this.productSelected.filter(i => i.id !== product.id)
                this.checkInputNotNull()
            }
        },
        deleteTableProduct(product) {
            if (!this.isLoadingTagProduct) {
                this.tempSelectedProductIds = this.tempSelectedProductIds.filter(i => i !== product.id)
                this.tempSelectedProduct = this.tempSelectedProduct.filter(i => i.id !== product.id)
                this.productSelected = this.productSelected.filter(i => i.id !== product.id)
                this.checkInputNotNull()
            }
        },
        initTempProduct: function () {
            this.tempSelectedProduct = []
            this.tempSelectedProductIds = []
            for (let item of this.productSelected) {
                this.tempSelectedProductIds.push(item.id)
                this.tempSelectedProduct.push({
                    "customer_select_variant": item.customer_select_variant,
                    'id': item.id,
                    'name': item.name,
                    'handle': item.handle,
                    'img_product': item.img_product,
                    'img_src': item.img_src,
                    'variant_num': item.variant_num,
                    'product_url': item.product_url,
                    'preview_price': item.preview_price,

                    'price_range': item.price_range,
                    'selected_label': item.selected_label,
                    'selected_variant': item.selected_variant,
                    'variants': item.variants
                })
            }
        },
        tagProduct: function (product) {
            let product_select_variant_default
            let preview_price, img_src
            let count = 0
            let selected_label
            if (product.selected_variant === 'all') {
                product_select_variant_default = product.variants[1].value
                preview_price = product.variants[1].price
                img_src = product.img_src
                selected_label = product.variants[0].label
            } else {
                product_select_variant_default = product.selected_variant
                for (let variant of product.variants) {
                    if (variant.value === product_select_variant_default) {
                        preview_price = variant.price
                        img_src = variant.url !== null ? variant.url : product.img_src
                        selected_label = variant.label
                        break;
                    }

                }
            }


            let product_data = {
                id: product.id,
                name: product.name,
                handle: product.handle,
                img_product: product.img_src,
                img_src: img_src,
                variant_num: product.variant_num,
                product_url: product.product_url,
                price_range: product.price_range,
                variants: product.variants,
                selected_variant: product.selected_variant,
                selected_label: selected_label,
                customer_select_variant: product_select_variant_default,
                preview_price: preview_price,

            }
            if (this.tempSelectedProduct.length > 0) {
                for (let temp_product of this.tempSelectedProduct) {
                    if (product.id == temp_product.id) {
                        count += 1
                    }
                }
            }
            if (count == 0 && this.tempSelectedProduct.length < 3) {
                this.tempSelectedProduct.push(product_data)
                this.tempSelectedProductIds.push(product_data.id)
            }
            if (count != 0) {
                this.tempSelectedProduct = this.tempSelectedProduct.filter(i => i.id !== product.id)
                this.tempSelectedProductIds = this.tempSelectedProductIds.filter(i => i !== product.id)
            }

            // this.productSelected.push(product)


            this.checkInputNotNull()
        },
        tagFreeGift(product) {
            let product_select_variant_default
            let preview_price, img_src
            let selected_label
            let count = 0
            if (product.selected_variant === 'all') {
                product_select_variant_default = product.variants[1].value
                preview_price = product.variants[1].price
                img_src = product.img_src
                selected_label = product.variants[0].label
            } else {
                product_select_variant_default = product.selected_variant
                for (let variant of product.variants) {
                    if (variant.value === product_select_variant_default) {
                        preview_price = variant.price
                        img_src = variant.url !== null ? variant.url : product.img_src
                        selected_label = variant.label
                        break;
                    }
                }
            }


            this.tempSelectedFreeGift = {
                id: product.id,
                name: product.name,
                handle: product.handle,
                img_product: product.img_src,
                img_src: img_src,
                variant_num: product.variant_num,
                product_url: product.product_url,
                price_range: product.price_range,
                variants: product.variants,
                selected_variant: product.selected_variant,
                selected_label: selected_label,
                customer_select_variant: product_select_variant_default,
                preview_price: preview_price,
            }
            // let selected_label
            // let count = 0
            // for (let variant of product.variants) {
            //     if (variant.value == product.selected_variant) {
            //         selected_label = variant.label
            //     }
            // }
            //
            // let product_data = {
            //     id: product.id,
            //     name: product.name,
            //     handle: product.handle,
            //     img_src: product.img_src,
            //     variant_num: product.variant_num,
            //     product_url: product.product_url,
            //     price_range: product.price_range,
            //     variants: product.variants,
            //     selected_variant: product.selected_variant,
            //     selected_label: selected_label
            // }
            // if ("id" in this.tempSelectedFreeGift) {
            //     if (product.id == this.tempSelectedFreeGift.id) {
            //         count += 1
            //     }
            // } else {
            //     this.tempSelectedFreeGift = product_data
            // }
            // if (count != 0) {
            //     this.tempSelectedFreeGift = {}
            // }

            this.tempSelectedFreeGiftID = product.id
            this.checkInputNotNull()
        },
        searchProduct: function () {
            this.getProductLink()
        },
        getProductLink: _.debounce(
            function () {
                var self = this
                var search_query_product = this.search_query_product
                var search_query_FreeGift = this.search_query_FreeGift
                let store_url = window.nb_settings.domain

                this.product_option = []
                this.freeGift_option = []
                if (!this.search_query_product) {
                    search_query_product = ''
                }
                if (!this.search_query_FreeGift) {
                    search_query_FreeGift = ''
                }
                if (this.productSelected.length > 0) {
                    // this.tempSelectedProduct = []
                    this.tempSelectedProductIds = []
                    // this.tempSelectedProduct = this.productSelected.map(object => ({...object}))
                    this.tempSelectedProductIds = this.tempSelectedProduct.map(item => item.id)
                }
                this.isLoadingSearchProduct = true
                this.isLoadingSearchFreeGift = true
                axios.post('/nb/products_search/product', {
                    jsonrpc: "2.0",
                    params: {
                        store_url: store_url,
                        limit: 20,
                        query: this.modalProductSelect ? search_query_product : search_query_FreeGift
                    }
                }).then(response => {
                    var data = response.data.result
                    if (data.code === 0) {
                        if (self.modalProductSelect) {
                            self.product_option = data.product_options
                        }
                        if (self.modalFreeGiftSelect) {
                            self.freeGift_option = data.product_options
                        }
                    } else if (data.code === -1) {
                        if (data.error == "Time out!") {
                            self.show_toast('error', "Please login again!")
                        } else {
                            self.show_toast('error', data.error)
                        }
                    }
                    self.isLoadingSearchProduct = false
                    self.isLoadingSearchFreeGift = false
                }).catch(function (error) {
                    self.isLoadingSearchProduct = false
                    self.isLoadingSearchFreeGift = false
                    self.show_toast('error', error.message)
                    console.log(error)
                });
            }, 500
        ),
        leaveCreatePage() {
            this.$emit('setState', 'table')
        },
        openAddProduct() {
            this.modalProductSelect = true
            this.isLoadingSearchProduct = true
            this.initTempProduct()
        },
        openFreeGift() {
            this.modalFreeGiftSelect = true
            this.isLoadingSearchFreeGift = true
            if (this.selectedFreeGift !== null) {
                this.tempSelectedFreeGiftID = this.selectedFreeGift.id

                this.tempSelectedFreeGift = JSON.parse(JSON.stringify(this.selectedFreeGift))
            }
        },
        closeAddProduct() {

            if (this.isLoadingSearchProduct === false) {
                this.modalProductSelect = false
                this.search_query_product = null
                // this.tempSelectedProduct = [...this.productSelected]
            }

        },
        closeFreeGift() {
            if (this.isLoadingSearchFreeGift === false) {
                this.modalFreeGiftSelect = false
                this.search_query_FreeGift = null
                this.tempSelectedFreeGiftID = null
                this.tempSelectedFreeGift = null
            }

        },
        saveBundle(status) {
            if (this.checkNotNull !== true || status === 'draft') {
                let status_edit = this.active_status === true ? 'active' : 'inactive'
                let flag = true

                if (status === 'draft') {
                    if (this.priority === null) {
                        this.priority = -1
                    }

                    if (this.bundle_name === "") {
                        this.bundle_name = "Draft order " + Date.now()
                    }
                    status_edit = 'draft'
                } else if ((status_edit === 'active' || status_edit === 'inactive') && this.priority === null) {
                    this.show_toast('error', 'Priority empty!')
                    flag = false
                }
                let startDate = this.formatDate(this.active_dates[0], 'start')
                let endDate = this.formatDate(this.active_dates[1], 'end')

                let selectedFreeGift = []

                let utcStartDate = this.toUTCDate(startDate)
                let utcEndDate = this.toUTCDate(endDate)
                if (this.priority !== null && flag === true) {
                    let amount_discount = 0
                    if (this.discount_type == 'free_gift') {
                        if ("id" in this.selectedFreeGift) {
                            selectedFreeGift.push(this.selectedFreeGift)
                        } else {
                            selectedFreeGift = null
                        }
                    } else {
                        amount_discount = this.amount_discount
                    }

                    this.$emit('setIsLoadingData', true)
                    let bundle_data = {
                        priority: this.priority,
                        bundle_ids: this.edit_bundle.bundle_ids,
                        bundle: {
                            bundleName: this.bundle_name,
                            bundleType: "product",
                            bundleDisplayName: this.bundle_display_name,
                            bundleDescription: this.bundle_description
                        },
                        status: this.mode === 'edit' && this.edit_bundle.status !== 'draft' ? status_edit : status,
                        discountType: this.discount_type,
                        amount_discount: amount_discount,
                        items: this.productSelected.length,
                        productSelected: this.productSelected,
                        selectedFreeGift: selectedFreeGift,
                        data_range: [utcStartDate, utcEndDate]
                    }
                    this.$emit('addBundle', bundle_data)
                }

            }
        },
        show_toast: function (type, message, duration = 2.0) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        checkInputNotNull() {

            if (this.discount_type !== 'free_gift') {
                this.selectedFreeGift = {}
                this.tempSelectedFreeGift = {}
                // this.amount_discount = 1

            } else {
                // this.selectedFreeGift = this.tempSelectedFreeGift
                this.amount_discount = 0
            }
            if (this.discount_type !== null && this.discount_type !== '') {
                if (this.amount_discount !== 0 && this.amount_discount !== null) {
                    this.checkDiscountSetting = true
                } else if ("id" in this.selectedFreeGift) {
                    this.checkDiscountSetting = true
                } else {
                    this.checkDiscountSetting = false
                }
            }
            if (this.bundle_name !== "" && this.discount_type !== null
                && this.bundle_display_name !== "" && this.bundle_description !== ""
                && this.priority !== null
                && this.productSelected.length > 0 && this.active_dates !== null && this.checkDiscountSetting === true
            ) {
                this.checkNotNull = false
            } else {
                this.checkNotNull = true
            }

        },
        formatDate(date, kindOfDate) {
            let formattedDate = new Date(date)
            if (kindOfDate === 'start') {
                formattedDate.setHours(0, 0, 0, 0)
            } else {
                formattedDate.setHours(23, 59, 59, 999)
            }
            return formattedDate
        },
        toUTCDate(date) {
            let utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            return utcDate.toISOString()
        },
        tagProductCheckBox(product) {

            event.preventDefault()

        }
    },
    async mounted() {


        if (this.mode === 'edit' && this.edit_bundle !== {}) {
            this.list_priority = this.list_priority_edit.filter(i => i != this.edit_bundle.priority)

            //format the active_dates

            this.active_dates = [dayjs(this.edit_bundle.start_active_date), dayjs(this.edit_bundle.end_active_date)]

            this.bundle_name = this.edit_bundle.bundle.bundleName
            this.bundleType = this.edit_bundle.bundle.bundleType
            this.bundle_display_name = this.edit_bundle.bundle.bundleDisplayName
            this.bundle_description = this.edit_bundle.bundle.bundleDescription
            this.priority = this.edit_bundle.priority === -1 ? null : this.edit_bundle.priority
            this.productSelected = JSON.parse(this.edit_bundle.bundle_json)

            if (this.edit_bundle.discountType === 'free_gift') {
                if (JSON.parse(this.edit_bundle.free_gift) !== null && JSON.parse(this.edit_bundle.free_gift) !== false) {
                    this.selectedFreeGift = JSON.parse(this.edit_bundle.free_gift)[0]
                }
                // this.tempSelectedFreeGiftIds.push(JSON.parse(this.edit_bundle.free_gift)[0].id)
            }

            this.discount_type = this.edit_bundle.discountType
            this.active_status = this.edit_bundle.status === 'active'
            this.amount_discount = this.edit_bundle.amount_discount
            this.checkInputNotNull()
        }
        if (this.mode == 'create') {
            this.list_priority = this.list_priority_edit
        }
    },
    computed: {
        findSelectedFreeGiftVariantPrice() {
            for (let item of this.selectedFreeGift.variants) {
                if (item.value === this.selectedFreeGift.selected_variant) {
                    if (item.value !== 'all') {
                        return item.price
                    }
                }
            }
        },
        realSelectedProductIds: function () {
            var id = []
            for (let item of this.tempSelectedProduct) {
                id.push(item.id)
            }
            return id
        },

        displayPreview: function () {
            return this.discount_type == 'free_gift' && 'id' in this.selectedFreeGift && this.productSelected.length > 0
        }
    }
}
</script>
<style scoped>
</style>