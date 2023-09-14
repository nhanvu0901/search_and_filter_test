<template>
    <div class="nb-content-wrapper nb-create-bundle" style="gap: 32px">
        <div class="nb-bundle-heading">
            <div class="nb-button-group">
                <h1 class="nb-title">
                    {{ this.mode === 'edit' ? this.edit_bundle.bundle.bundleName : "New volume discount bundle" }}
                </h1>
                <Switch v-model:checked="active_status"
                        v-if="mode === 'edit' && this.edit_bundle.status !=='draft'"
                        checked-children="Active"
                        un-checked-children="Inactive"/>
            </div>
            <div class=" nb-button-group">
                <div style="color: #1C1C1E; background: #FDFDFD; border: 1px solid #D1D1D1"
                     class="nb-create-bundle-btn"
                     @click="leaveCreatePage"
                     size="large">
                    Discard
                </div>


                <button v-if="mode === 'edit' && this.edit_bundle.status !=='draft'" class="nb-create-bundle-btn"
                        @click="saveBundle('')"
                        style="color: #FDFDFD !important;"
                        :disabled="checkNotNull">
                    Save changes
                </button>


                <Dropdown class="nb-create-bundle-btn"
                          style="" placement="bottom"
                          :trigger="['click']"
                          v-else>
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
            <div class="nb-setting-frame" style="flex: 7 !important">
                <div class="nb-frame-block" style="order: 0">
                    <div
                        style="display: flex; gap: 6px; flex-direction: column; align-items: flex-start; height: 72px; width: 100%">
                        <span class="nb-frame-text">Bundle name</span>
                        <input class="nb-input-large nb-input-bundle-name" placeholder="Enter bundle name"
                               v-model="bundle_name"
                               @input="checkInputNotNull">
                    </div>
                    <div style="display: flex; gap: 12px; flex-direction: column; align-items: flex-start; padding: 0">
                        <div>
                            <span class="nb-frame-text" style="padding-bottom: 4px">Product applicability</span>
                            <span
                                class="nb-light-text">Volume discount bundles are only displayed on product pages</span>
                        </div>
                        <button v-if="productSelected === null" class="nb-select-product-btn"
                                style="width: 167px; background: #ECECEC; gap: 8px; cursor: pointer"
                                @click="openProduct">
                            <svg style="order: 0" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2591_640)">
                                    <path
                                        d="M8.00001 5.3335V10.6668M5.33334 8.00016H10.6667M14.6667 8.00016C14.6667 11.6821 11.6819 14.6668 8.00001 14.6668C4.31811 14.6668 1.33334 11.6821 1.33334 8.00016C1.33334 4.31826 4.31811 1.3335 8.00001 1.3335C11.6819 1.3335 14.6667 4.31826 14.6667 8.00016Z"
                                        stroke="#3A3A3C" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_2591_640">
                                        <rect width="16" height="16" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <span style="order: 1">Select product</span>
                        </button>
                        <div class="nb-frame nb-free-gift-selected" v-else>
                            <img style="width: 44px; height: 44px" class="nb-product-info-img"
                                 :src="productSelected.img_src" alt=""/>
                            <div class="nb-free-gift-info">
                                <div class="nb-free-gift-contain">
                                    <div class="nb-free-gift-title">
                                        <span class="nb-frame-text">{{ productSelected.name }}</span>
                                        <svg style="cursor: pointer" width="90" height="18" viewBox="0 0 90 18"
                                             fill="none" @click="openProduct"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2228_5395)">
                                                <path
                                                    d="M2.15988 14.1036C2.27988 14.1036 2.30388 14.0916 2.41188 14.0676L4.57188 13.6356C4.79988 13.5756 5.02788 13.4676 5.20788 13.2876L10.4399 8.05558C11.2439 7.25158 11.2439 5.87158 10.4399 5.06758L9.99588 4.59958C9.19188 3.79558 7.79988 3.79558 6.99588 4.59958L1.76388 9.84358C1.59588 10.0116 1.47588 10.2516 1.41588 10.4796L0.95988 12.6636C0.89988 13.0716 1.01988 13.4676 1.30788 13.7556C1.53588 13.9836 1.87188 14.1036 2.15988 14.1036V14.1036ZM2.56788 10.7076L7.79988 5.46358C8.14788 5.11558 8.78388 5.11558 9.11988 5.46358L9.57588 5.91958C9.98388 6.32758 9.98388 6.90358 9.57588 7.29958L4.35588 12.5436L2.13588 12.9156L2.56788 10.7076Z"
                                                    fill="#1890FF"/>
                                                <path
                                                    d="M10.392 14.8481H1.53596C1.18796 14.8481 0.959961 15.0761 0.959961 15.4241C0.959961 15.7721 1.24796 16.0001 1.53596 16.0001H10.344C10.692 16.0001 10.98 15.7721 10.98 15.4241C10.968 15.0761 10.68 14.8481 10.392 14.8481Z"
                                                    fill="#1890FF"/>
                                            </g>
                                            <path
                                                d="M16.912 14.5V5.62H22.708V6.844H18.316V9.376H22.156V10.588H18.316V13.276H22.768V14.5H16.912ZM26.9463 14.62C26.4663 14.62 26.0463 14.528 25.6863 14.344C25.3343 14.152 25.0383 13.9 24.7983 13.588C24.5583 13.268 24.3783 12.912 24.2583 12.52C24.1463 12.128 24.0903 11.728 24.0903 11.32C24.0903 10.912 24.1463 10.512 24.2583 10.12C24.3783 9.728 24.5583 9.376 24.7983 9.064C25.0383 8.744 25.3343 8.492 25.6863 8.308C26.0463 8.116 26.4663 8.02 26.9463 8.02C27.3463 8.02 27.6783 8.084 27.9423 8.212C28.2143 8.34 28.4303 8.488 28.5903 8.656C28.7503 8.824 28.8663 8.968 28.9383 9.088H29.0103V5.38H30.3783V14.5H29.0103V13.552H28.9383C28.8663 13.672 28.7503 13.816 28.5903 13.984C28.4303 14.152 28.2143 14.3 27.9423 14.428C27.6783 14.556 27.3463 14.62 26.9463 14.62ZM27.2463 13.48C27.6383 13.48 27.9623 13.376 28.2183 13.168C28.4823 12.952 28.6783 12.68 28.8063 12.352C28.9423 12.024 29.0103 11.68 29.0103 11.32C29.0103 10.96 28.9423 10.616 28.8063 10.288C28.6783 9.96 28.4823 9.692 28.2183 9.484C27.9623 9.268 27.6383 9.16 27.2463 9.16C26.8543 9.16 26.5263 9.268 26.2623 9.484C25.9983 9.692 25.7983 9.96 25.6623 10.288C25.5343 10.616 25.4703 10.96 25.4703 11.32C25.4703 11.68 25.5343 12.024 25.6623 12.352C25.7983 12.68 25.9983 12.952 26.2623 13.168C26.5263 13.376 26.8543 13.48 27.2463 13.48ZM32.937 7.048C32.689 7.048 32.485 6.964 32.325 6.796C32.165 6.628 32.085 6.432 32.085 6.208C32.085 5.976 32.165 5.78 32.325 5.62C32.485 5.452 32.689 5.368 32.937 5.368C33.185 5.368 33.389 5.452 33.549 5.62C33.717 5.78 33.801 5.976 33.801 6.208C33.801 6.44 33.717 6.64 33.549 6.808C33.389 6.968 33.185 7.048 32.937 7.048ZM32.265 14.5V8.14H33.633V14.5H32.265ZM38.1737 14.62C37.6697 14.62 37.2657 14.528 36.9617 14.344C36.6577 14.16 36.4377 13.916 36.3017 13.612C36.1737 13.3 36.1097 12.964 36.1097 12.604V9.244H34.9937V8.14H36.1097V6.556H37.4777V8.14H38.9657V9.244H37.4777V12.58C37.4777 13.18 37.8097 13.48 38.4737 13.48C38.6417 13.48 38.7977 13.468 38.9417 13.444C39.0857 13.42 39.1577 13.408 39.1577 13.408V14.524C39.1577 14.524 39.0577 14.54 38.8577 14.572C38.6657 14.604 38.4377 14.62 38.1737 14.62ZM43.4433 16.852V8.14H44.8113V9.088H44.8833C44.9633 8.968 45.0793 8.824 45.2313 8.656C45.3913 8.488 45.6033 8.34 45.8673 8.212C46.1393 8.084 46.4793 8.02 46.8873 8.02C47.3593 8.02 47.7753 8.116 48.1353 8.308C48.4953 8.492 48.7913 8.744 49.0233 9.064C49.2633 9.376 49.4393 9.728 49.5513 10.12C49.6713 10.512 49.7313 10.912 49.7313 11.32C49.7313 11.728 49.6713 12.128 49.5513 12.52C49.4393 12.912 49.2633 13.268 49.0233 13.588C48.7913 13.9 48.4953 14.152 48.1353 14.344C47.7753 14.528 47.3593 14.62 46.8873 14.62C46.4793 14.62 46.1393 14.556 45.8673 14.428C45.6033 14.3 45.3913 14.152 45.2313 13.984C45.0793 13.816 44.9633 13.672 44.8833 13.552H44.8113V16.852H43.4433ZM44.8113 11.32C44.8113 11.68 44.8753 12.024 45.0033 12.352C45.1393 12.68 45.3353 12.952 45.5913 13.168C45.8553 13.376 46.1833 13.48 46.5753 13.48C46.9753 13.48 47.3033 13.376 47.5593 13.168C47.8233 12.952 48.0193 12.68 48.1473 12.352C48.2833 12.024 48.3513 11.68 48.3513 11.32C48.3513 10.96 48.2833 10.616 48.1473 10.288C48.0193 9.96 47.8233 9.692 47.5593 9.484C47.3033 9.268 46.9753 9.16 46.5753 9.16C46.1833 9.16 45.8553 9.268 45.5913 9.484C45.3353 9.692 45.1393 9.96 45.0033 10.288C44.8753 10.616 44.8113 10.96 44.8113 11.32ZM51.21 14.5V8.14H52.578V8.98H52.626C52.746 8.732 52.934 8.512 53.19 8.32C53.454 8.12 53.834 8.02 54.33 8.02C54.482 8.02 54.61 8.028 54.714 8.044C54.826 8.06 54.882 8.068 54.882 8.068V9.388C54.882 9.388 54.822 9.38 54.702 9.364C54.582 9.348 54.446 9.34 54.294 9.34C53.734 9.34 53.306 9.5 53.01 9.82C52.722 10.132 52.578 10.64 52.578 11.344V14.5H51.21ZM58.7474 14.62C58.0514 14.62 57.4634 14.464 56.9834 14.152C56.5114 13.84 56.1514 13.432 55.9034 12.928C55.6634 12.424 55.5434 11.888 55.5434 11.32C55.5434 10.752 55.6634 10.216 55.9034 9.712C56.1514 9.208 56.5114 8.8 56.9834 8.488C57.4634 8.176 58.0514 8.02 58.7474 8.02C59.4354 8.02 60.0154 8.176 60.4874 8.488C60.9674 8.8 61.3274 9.208 61.5674 9.712C61.8154 10.216 61.9394 10.752 61.9394 11.32C61.9394 11.888 61.8154 12.424 61.5674 12.928C61.3274 13.432 60.9674 13.84 60.4874 14.152C60.0154 14.464 59.4354 14.62 58.7474 14.62ZM58.7474 13.456C59.1394 13.456 59.4674 13.356 59.7314 13.156C60.0034 12.956 60.2074 12.692 60.3434 12.364C60.4874 12.036 60.5594 11.688 60.5594 11.32C60.5594 10.944 60.4874 10.596 60.3434 10.276C60.2074 9.948 60.0034 9.684 59.7314 9.484C59.4674 9.284 59.1394 9.184 58.7474 9.184C58.3554 9.184 58.0234 9.284 57.7514 9.484C57.4794 9.684 57.2754 9.948 57.1394 10.276C57.0034 10.596 56.9354 10.944 56.9354 11.32C56.9354 11.688 57.0034 12.036 57.1394 12.364C57.2754 12.692 57.4794 12.956 57.7514 13.156C58.0234 13.356 58.3554 13.456 58.7474 13.456ZM66.1103 14.62C65.6303 14.62 65.2103 14.528 64.8503 14.344C64.4983 14.152 64.2023 13.9 63.9623 13.588C63.7223 13.268 63.5423 12.912 63.4223 12.52C63.3103 12.128 63.2543 11.728 63.2543 11.32C63.2543 10.912 63.3103 10.512 63.4223 10.12C63.5423 9.728 63.7223 9.376 63.9623 9.064C64.2023 8.744 64.4983 8.492 64.8503 8.308C65.2103 8.116 65.6303 8.02 66.1103 8.02C66.5103 8.02 66.8423 8.084 67.1063 8.212C67.3783 8.34 67.5943 8.488 67.7543 8.656C67.9143 8.824 68.0303 8.968 68.1023 9.088H68.1743V5.38H69.5423V14.5H68.1743V13.552H68.1023C68.0303 13.672 67.9143 13.816 67.7543 13.984C67.5943 14.152 67.3783 14.3 67.1063 14.428C66.8423 14.556 66.5103 14.62 66.1103 14.62ZM66.4103 13.48C66.8023 13.48 67.1263 13.376 67.3823 13.168C67.6463 12.952 67.8423 12.68 67.9703 12.352C68.1063 12.024 68.1743 11.68 68.1743 11.32C68.1743 10.96 68.1063 10.616 67.9703 10.288C67.8423 9.96 67.6463 9.692 67.3823 9.484C67.1263 9.268 66.8023 9.16 66.4103 9.16C66.0183 9.16 65.6903 9.268 65.4263 9.484C65.1623 9.692 64.9623 9.96 64.8263 10.288C64.6983 10.616 64.6343 10.96 64.6343 11.32C64.6343 11.68 64.6983 12.024 64.8263 12.352C64.9623 12.68 65.1623 12.952 65.4263 13.168C65.6903 13.376 66.0183 13.48 66.4103 13.48ZM73.289 14.62C72.649 14.62 72.149 14.42 71.789 14.02C71.429 13.62 71.249 13.088 71.249 12.424V8.14H72.617V12.256C72.617 12.64 72.717 12.94 72.917 13.156C73.125 13.364 73.405 13.468 73.757 13.468C74.101 13.468 74.377 13.38 74.585 13.204C74.793 13.028 74.941 12.804 75.029 12.532C75.125 12.252 75.173 11.964 75.173 11.668V8.14H76.541V14.5H75.173V13.588H75.101C75.037 13.708 74.933 13.852 74.789 14.02C74.653 14.18 74.461 14.32 74.213 14.44C73.973 14.56 73.665 14.62 73.289 14.62ZM81.2119 14.62C80.6759 14.62 80.2079 14.528 79.8079 14.344C79.4079 14.152 79.0759 13.9 78.8119 13.588C78.5479 13.268 78.3479 12.912 78.2119 12.52C78.0839 12.128 78.0199 11.728 78.0199 11.32C78.0199 10.912 78.0839 10.512 78.2119 10.12C78.3479 9.728 78.5479 9.376 78.8119 9.064C79.0759 8.744 79.4079 8.492 79.8079 8.308C80.2079 8.116 80.6759 8.02 81.2119 8.02C81.7399 8.02 82.1759 8.1 82.5199 8.26C82.8719 8.412 83.1519 8.604 83.3599 8.836C83.5679 9.068 83.7239 9.3 83.8279 9.532C83.9319 9.764 83.9959 9.96 84.0199 10.12C84.0519 10.28 84.0679 10.36 84.0679 10.36H82.7719C82.7719 10.36 82.7519 10.3 82.7119 10.18C82.6799 10.06 82.6119 9.92 82.5079 9.76C82.4039 9.6 82.2479 9.46 82.0399 9.34C81.8399 9.22 81.5679 9.16 81.2239 9.16C80.8159 9.16 80.4759 9.264 80.2039 9.472C79.9319 9.672 79.7239 9.936 79.5799 10.264C79.4439 10.592 79.3759 10.944 79.3759 11.32C79.3759 11.696 79.4439 12.048 79.5799 12.376C79.7239 12.704 79.9319 12.972 80.2039 13.18C80.4759 13.38 80.8159 13.48 81.2239 13.48C81.5679 13.48 81.8399 13.42 82.0399 13.3C82.2479 13.18 82.4039 13.04 82.5079 12.88C82.6119 12.72 82.6799 12.58 82.7119 12.46C82.7519 12.34 82.7719 12.28 82.7719 12.28H84.0679C84.0679 12.28 84.0519 12.36 84.0199 12.52C83.9959 12.68 83.9319 12.876 83.8279 13.108C83.7239 13.34 83.5679 13.572 83.3599 13.804C83.1519 14.036 82.8719 14.232 82.5199 14.392C82.1759 14.544 81.7399 14.62 81.2119 14.62ZM88.3299 14.62C87.8259 14.62 87.4219 14.528 87.1179 14.344C86.8139 14.16 86.5939 13.916 86.4579 13.612C86.3299 13.3 86.2659 12.964 86.2659 12.604V9.244H85.1499V8.14H86.2659V6.556H87.6339V8.14H89.1219V9.244H87.6339V12.58C87.6339 13.18 87.9659 13.48 88.6299 13.48C88.7979 13.48 88.9539 13.468 89.0979 13.444C89.2419 13.42 89.3139 13.408 89.3139 13.408V14.524C89.3139 14.524 89.2139 14.54 89.0139 14.572C88.8219 14.604 88.5939 14.62 88.3299 14.62Z"
                                                fill="#1890FF"/>
                                            <defs>
                                                <clipPath id="clip0_2228_5395">
                                                    <rect width="12" height="12" fill="white"
                                                          transform="translate(0 4)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="nb-product-info-variant" v-if="productSelected.variant_num > 1">
                                        {{ productSelected.variant_num }} variants
                                    </div>
                                    <div class="nb-product-info-variant" v-if="productSelected.variant_num == 1">
                                        {{ productSelected.variant_num }} variant
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="nb-frame-block" style="order: 3;">
                    <h1 style="margin-bottom: 28px">Discount settings</h1>
                    <div v-for="(discount,index) in list_discount_setting"
                         style="display:grid; grid-template-columns: 1fr 2fr 1fr 0.125fr; gap: 16px;width: 100%;">
                        <div
                            style="display: flex; flex-direction: column; align-items: flex-start; padding: 0; gap: 6px">
                            <span class="nb-frame-text">Required quantity</span>
                            <InputNumber placeholder="Enter value"
                                         :min="1"
                                         v-model:value="discount.quantity"
                                         size="large"
                                         class="nb-border-radius-input"
                                         @input="checkInputNotNull"/>
                        </div>
                        <div
                            style="display: flex; flex-direction: column; align-items: flex-start; padding: 0; gap: 6px">
                            <span class="nb-frame-text">Discount type</span>
                            <Select size="large"
                                    style="width: 100%"
                                    placeholder="Select a discount type"
                                    @input="checkInputNotNull"
                                    v-model:value="discount.discountType">
                                <SelectOption value="percentage">Percentage discount</SelectOption>
                                <SelectOption value="fixed_amount">Fixed discount amount</SelectOption>
                            </Select>
                        </div>
                        <div
                            style="display: flex; flex-direction: column; align-items: flex-start; padding: 0; gap: 6px">
                            <span class="nb-frame-text">Discount value</span>
                            <div style="display: flex; flex-direction: row; align-items: center; gap: 18.5px">
                                <InputNumber v-if="discount.discountType == 'percentage'"
                                             addon-after="%"
                                             size="large"
                                             @input="checkInputNotNull"
                                             v-model:value="discount.amount"
                                             :min="1" :max="99"
                                             placeholder="Enter value"/>
                                <InputNumber v-else
                                             :addon-after="store_currency"
                                             size="large"
                                             @input="checkInputNotNull"
                                             v-model:value="discount.amount"
                                             :min="1"
                                             placeholder="Enter value"/>
                            </div>
                        </div>
                        <div style="align-self: flex-end;height: 30px">
                            <svg v-if="list_discount_setting.length == 1" style="cursor:pointer;cursor: not-allowed"

                                 width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.3333 4.99984V4.33317C13.3333 3.39975 13.3333 2.93304 13.1517 2.57652C12.9919 2.26292 12.7369 2.00795 12.4233 1.84816C12.0668 1.6665 11.6001 1.6665 10.6667 1.6665H9.33333C8.39991 1.6665 7.9332 1.6665 7.57668 1.84816C7.26308 2.00795 7.00811 2.26292 6.84832 2.57652C6.66667 2.93304 6.66667 3.39975 6.66667 4.33317V4.99984M8.33333 9.58317V13.7498M11.6667 9.58317V13.7498M2.5 4.99984H17.5M15.8333 4.99984V14.3332C15.8333 15.7333 15.8333 16.4334 15.5608 16.9681C15.3212 17.4386 14.9387 17.821 14.4683 18.0607C13.9335 18.3332 13.2335 18.3332 11.8333 18.3332H8.16667C6.76654 18.3332 6.06647 18.3332 5.53169 18.0607C5.06129 17.821 4.67883 17.4386 4.43915 16.9681C4.16667 16.4334 4.16667 15.7333 4.16667 14.3332V4.99984"
                                    stroke="#B6B6B6" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </svg>
                            <svg v-else @click="deleteDiscount(index)" style="cursor:pointer; width: 20px; height: 20px"
                                 viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.3333 4.99984V4.33317C13.3333 3.39975 13.3333 2.93304 13.1517 2.57652C12.9919 2.26292 12.7369 2.00795 12.4233 1.84816C12.0668 1.6665 11.6001 1.6665 10.6667 1.6665H9.33333C8.39991 1.6665 7.9332 1.6665 7.57668 1.84816C7.26308 2.00795 7.00811 2.26292 6.84832 2.57652C6.66667 2.93304 6.66667 3.39975 6.66667 4.33317V4.99984M8.33333 9.58317V13.7498M11.6667 9.58317V13.7498M2.5 4.99984H17.5M15.8333 4.99984V14.3332C15.8333 15.7333 15.8333 16.4334 15.5608 16.9681C15.3212 17.4386 14.9387 17.821 14.4683 18.0607C13.9335 18.3332 13.2335 18.3332 11.8333 18.3332H8.16667C6.76654 18.3332 6.06647 18.3332 5.53169 18.0607C5.06129 17.821 4.67883 17.4386 4.43915 16.9681C4.16667 16.4334 4.16667 15.7333 4.16667 14.3332V4.99984"
                                    stroke="#EB3D3D" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <button class="nb-select-product-btn" v-if="checkNullDiscount !== false"
                            style="width: 100%; color: #3199FF;gap: 9.33px; padding: 0;cursor:default; ">
                        <svg style="cursor:pointer" @click="addMoreDiscount" width="16" height="16" viewBox="0 0 16 16"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2593_370)">
                                <path
                                    d="M8.00004 5.3335V10.6668M5.33337 8.00016H10.6667M14.6667 8.00016C14.6667 11.6821 11.6819 14.6668 8.00004 14.6668C4.31814 14.6668 1.33337 11.6821 1.33337 8.00016C1.33337 4.31826 4.31814 1.3335 8.00004 1.3335C11.6819 1.3335 14.6667 4.31826 14.6667 8.00016Z"
                                    stroke="#3199FF" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2593_370">
                                    <rect width="16" height="16" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span @click="addMoreDiscount" style="order: 1;cursor: pointer">Add more discount option</span>
                    </button>


                    <button class="nb-select-product-btn" v-else
                            style="width: 100%; color: #939393;gap: 9.33px; padding: 0;cursor:default; ">
                        <svg style="cursor:not-allowed" width="16" height="16" viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2101_42176)">
                                <path
                                    d="M8.00016 5.33337V10.6667M5.3335 8.00004H10.6668M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                    stroke="#939393" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_2101_42176">
                                    <rect width="16" height="16" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>

                        <span style="order: 1;cursor: not-allowed">Add more discount option</span>
                    </button>


                </div>
                <div class="nb-frame-block" style="order: 4">
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Bundle display name</span>
                        <input class="nb-input-bundle-name nb-input-large" placeholder="Enter bundle name"
                               v-model="bundle_display_name"
                               @input="checkInputNotNull">
                    </div>
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Bundle description</span>
                        <input class="nb-input-bundle-name nb-input-large" placeholder="Enter bundle description"
                               v-model="bundle_description"
                               @input="checkInputNotNull">
                    </div>
                    <div class="nb-group-title-input">
                        <span class="nb-frame-text">Priority</span>
                        <InputNumber placeholder="Enter value from 1"
                                     style="display: flex; align-items: center"
                                     @input="checkInputNotNull"
                                     class="nb-input-large"
                                     :class="{'error_priority': list_priority.includes(priority)}"
                                     v-model:value="priority"
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

            <Volume_bundle_preview :checkNullDiscountPrev="checkNullDiscountPrev"
                                   :bundle_display_name="bundle_display_name"
                                   :bundle_description="bundle_description"
                                   :productSelected="productSelected"
                                   :volume_discount_bundle_data="volume_discount_bundle_data"
                                   :list_discount_setting="list_discount_setting"
                                   @selectDiscount="selectDiscount"
                                   :store_currency="store_currency"
                                   :country_code="country_code"
                                   :locale="locale"
                                   :currencySymbol="currencySymbol"
                                   :mode="mode"
                                   :is_backend='true'/>

            <Modal title="Select Product" centered
                   :maskClosable="isLoadingSearchProduct ? false : true"
                   :closable="isLoadingSearchProduct ? false : true"
                   v-model:visible="modalProductSelect" @cancel="closeProduct"
                   class="nb-modal nb-product-select" style="width: 50%; min-width: 700px">
                <template #footer>
                    <div class="nb-loading-tag-product" v-if="isLoadingSearchProduct">
                        <LoadingOutlined/>
                        <span>Processing</span>
                    </div>
                    <button class="ant-btn" style="color:#1C1C1E !important;"
                            :style="isLoadingSearchProduct ? {cursor: 'not-allowed'}:{cursor: 'pointer'}"
                            @click="closeProduct">Cancel
                    </button>
                    <button class="ant-btn ant-btn-primary"
                            :style="isLoadingSearchProduct ? {cursor: 'not-allowed'}:{cursor: 'pointer'}"
                            @click="addProduct" style="background-color: #1C1C1E;color: #FDFDFD">
                        Select
                    </button>
                </template>
                <div style="display: flex">
                    <div class="nb-product-select-wrapper">
                        <Input class="nb-input" v-model:value="search_query_product"
                               placeholder="Search by product name"
                               style="margin-bottom: 14px;" @input="searchProduct" :disabled="isLoadingTagProduct">
                            <template #prefix>
                                <SearchOutlined/>
                            </template>
                        </Input>
                        <div class="nb-product-select-list" v-if="isLoadingSearchProduct">
                            <div class="nb-product-option disabled" v-for="x in [1,2,3,4,5,6]" style="width: 100%;">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
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
                        <div class="nb-product-select-list" v-else>
                            <div v-if="search_query_product && search_query_product != '' && product_option.length == 0"
                                 class="nb-no-product">
                                <span style="font-weight: 600; font-size: 14px; line-height: 20px; color: #1C1C1E">
                                    No matching products found
                                </span>
                                <span style="font-weight: 400; font-size: 12px; line-height: 18px; color: #636366">
                                    Check spelling or try different keywords
                                </span>
                            </div>
                            <RadioGroup class="nb-radio-btn" v-model:value="tempSelectedFreeGiftID" style="min-width: 100%"  v-else>
                                <div v-for="product in product_option" class="nb-product-option"
                                     @click="tagProduct(product)"
                                     :title="product.name"

                                      :class="tempSelectedFreeGiftID === product.id   ?'selected': '' ">
                                    <Radio

                                              :value="product.id"
                                              />
                                    <div class="nb-product-info" style="overflow: hidden">
                                        <img class="nb-product-info-img" :src="product.img_src" alt=""/>
                                        <div>
                                            <div class="nb-product-info-title-volume">{{ product.name }}</div>
                                            <div class="nb-product-info-variant">
                                                {{ product.variant_num }} variants
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Dropdown,
    Input,
    InputNumber,
    Menu,
    MenuItem,
    Modal,
    notification,
    RangePicker,
    Select,
    Switch,
    SelectOption,
    SkeletonInput,
    Radio,
    RadioGroup,
    Space
} from "ant-design-vue"
import dayjs from "dayjs"
import {LoadingOutlined, MinusOutlined, SearchOutlined} from "@ant-design/icons-vue"
import _ from "lodash"
import axios from "axios"
import Volume_bundle_preview from "./volume_bundle_preview.vue"

export default {
    name: "volume_bundle",
    components: {
        MinusOutlined,
        ARangePicker: RangePicker,
        ASpace: Space,
        Volume_bundle_preview,
        CheckboxGroup,
        SkeletonInput,
        SearchOutlined,
        LoadingOutlined,
        Checkbox,
        Modal,
        Input,
        Menu,
        MenuItem,
        InputNumber,
        Button,
        Dropdown,
        RangePicker,
        SelectOption,
        Select,
        Radio,
        RadioGroup,
        Switch
    },
    emits: [
        'addBundle',
        "setState",
        'setIsLoadingData',
        "confirmNotSaveCreate"
    ],
    props: {
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
            volume_discount_bundle_data: null,
            bundle_display_name: "",
            bundle_description: "",
            priority: null,
            list_discount_setting: [{
                quantity: null,
                discountType: null,
                amount: null,
                discount_id: Math.floor(Math.random() * Date.now()).toString(16)
            }],
            checkNotNull: true,
            checkNullDiscount: true,
            checkNullDiscountPrev: true,
            isLoadingTagProduct: false,
            search_query_product: null,
            isLoadingSearchProduct: false,
            product_option: [],
            // tempSelectedProductIds: [],
            tempSelectedProduct: null,
            modalProductSelect: false,
            productSelected: null, //chon product la thang nay
            //edit screen
            active_status: false,
            backend_domain: window.location.origin,
            tempSelectedFreeGiftID: null,
        }
    },
    watch: {
        modalProductSelect: function (newone) {
            if (newone === true) {
                this.getProductLink()

            }
        }
    },
    methods: {
        getCursor(product_id) {
            if (this.realSelectedProductIds.length < 1 && this.realSelectedProductIds.includes(product_id)) {
                return 'pointer'
            }
            if (this.realSelectedProductIds.length >= 1 && !this.realSelectedProductIds.includes(product_id)) {
                return 'not-allowed'
            }
        },
        // preview volume
        selectDiscount(event) {
            var discount = event.target.value
            if (event.target.checked) {
                this.volume_discount_bundle_data = discount
            }
        },
        discounted_price(discount) {
            let discounted_price
            let temp_txt
            if (discount.amount === 0) {
                return 0
            }
            if (discount.discountType === 'percentage') {
                temp_txt = this.productSelected.price_range.split("-")[1]
                discounted_price = parseFloat(temp_txt) * (1 - discount.amount / 100)
            } else {
                discounted_price = parseFloat(this.productSelected.price_range.split("-")[1])
            }
            return discounted_price
        },
        //volume create
        leaveCreatePage() {
            this.$emit('setState', 'table')
        },
        addProduct() {
            if (this.isLoadingSearchProduct === false) {
                if (this.tempSelectedProduct !== null) {
                    this.productSelected = this.tempSelectedProduct
                } else {
                    this.productSelected = null
                }
                this.closeProduct()
            }
            this.checkInputNotNull()
        },
        closeProduct() {
            if (this.isLoadingSearchProduct === false) {
                this.modalProductSelect = false
                this.search_query_product = null
                this.tempSelectedFreeGiftID = null
            }

        },
        tagProduct: function (product) {

            this.tempSelectedProduct ={
                id: product.id,
                name: product.name,
                handle: product.handle,
                img_src: product.img_src,
                variant_num: product.variant_num,
                product_url: product.product_url,
                price_range: product.price_range,
                variants: product.variants,

            }
            // if (this.tempSelectedProduct.length == 0) {
            //     this.tempSelectedProduct.push(product_data)
            // } else {
            //     this.tempSelectedProduct = this.tempSelectedProduct.filter(i => i.id !== product.id)
            // }
            this.tempSelectedFreeGiftID = product.id
            // this.checkInputNotNull()
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

                let utcStartDate = this.toUTCDate(startDate)
                let utcEndDate = this.toUTCDate(endDate)

                if (this.priority !== null && flag === true) {
                    this.$emit('setIsLoadingData', true)
                    let discount_setting = []
                    for (let discount of this.list_discount_setting) {
                        let discount_data = null

                        discount_data = {
                            quantity: discount.quantity,
                            discountType: discount.discountType,
                            amount: discount.amount,

                        }

                        discount_setting.push(discount_data)
                    }
                    let bundle_data = {
                        priority: this.priority,
                        bundle_ids: this.edit_bundle.bundle_ids,
                        bundle: {
                            bundleName: this.bundle_name,
                            bundleType: "volume",
                            bundleDisplayName: this.bundle_display_name,
                            bundleDescription: this.bundle_description
                        },
                        status: this.mode === 'edit' && this.edit_bundle.status !== 'draft' ? status_edit : status,
                        discountType: discount_setting,
                        items: this.productSelected !== null ? 1 : 0,
                        productSelected: this.productSelected,
                        data_range: [utcStartDate, utcEndDate]
                    }
                    this.$emit('addBundle', bundle_data)
                }
            }

        },
        checkInputNotNull() {

            if (this.list_discount_setting.length === 1) {
                if (this.list_discount_setting[0].quantity !== null && this.list_discount_setting[0].discountType !== null && this.list_discount_setting[0].amount !== null) {
                    this.checkNullDiscount = true
                    this.checkNullDiscountPrev = true
                } else {
                    this.checkNullDiscount = false
                    this.checkNullDiscountPrev = false
                }
            } else {
                this.checkNullDiscount = true
                for (let discount of this.list_discount_setting) {
                    if (discount.quantity === null || discount.discountType === null || discount.amount === null) {
                        this.checkNullDiscount = false
                        break;
                    }
                }
            }

            if (this.bundle_name !== "" && this.priority !== null && this.productSelected !== null && this.active_dates !== null && this.bundle_display_name !== "" && this.bundle_description !== "" && this.checkNullDiscount === true
            ) {
                this.checkNotNull = false
            } else {
                this.checkNotNull = true
            }
        }, tagProductCheckBox(product) {
            event.preventDefault()
        },
        addMoreDiscount() {
            let discount_id = Math.floor(Math.random() * Date.now()).toString(16)
            let new_discount = {
                quantity: null,
                discountType: null,
                amount: null,
                discount_id: discount_id
            }
            this.list_discount_setting.push(new_discount)
            this.checkInputNotNull()
        },
        deleteDiscount(index) {
            if (this.list_discount_setting.length >= 0) {
                // if (this.volume_discount_bundle_data !== null) {
                //     if (this.list_discount_setting[index].discount_id === this.volume_discount_bundle_data.discount_id) {
                //         this.volume_discount_bundle_data = null
                //     }
                // }
                this.list_discount_setting.splice(index, 1)
            }
            this.checkInputNotNull()
        },
        show_toast: function (type, message, duration = 2.0) {
            notification[type]({
                message: message,
                duration: duration
            });
        },
        openProduct() {
            this.modalProductSelect = true
            this.isLoadingSearchProduct = true
            this.tempSelectedFreeGiftID = this.productSelected.id
        },
        searchProduct: function () {
            this.getProductLink()
        },
        getProductLink: _.debounce(function () {
            var self = this
            var search_query_product = this.search_query_product
            let store_url = window.nb_settings.domain

            this.product_option = []
            if (this.productSelected !== null) {
                this.tempSelectedProduct = null
                // this.tempSelectedProductIds = []
                this.tempSelectedProduct = this.productSelected
                // this.tempSelectedProductIds[0] = this.productSelected.id
            }
            if (!this.search_query_product) {
                search_query_product = ''
            }
            this.isLoadingSearchProduct = true
            axios.post('/nb/products_search/volume', {
                jsonrpc: "2.0",
                params: {
                    store_url: store_url,
                    limit: 20,
                    query: search_query_product
                }
            }).then(function (response) {
                var data = response.data.result
                if (data.code === 0) {
                    if (self.modalProductSelect) {
                        self.product_option = data.product_options
                    }
                } else if (data.code === -1) {
                    if (data.error == "Time out!") {
                        self.show_toast('error', "Please login again!")
                    } else {
                        self.show_toast('error', data.error)
                    }
                }
                self.isLoadingSearchProduct = false
            }).catch(function (error) {
                self.isLoadingSearchProduct = false;
                self.show_toast('error', error.message)
            })
        }, 500),
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
        }
    },
    computed: {
        // realSelectedProductIds: function () {
        //     var id = []
        //     for (let item of this.tempSelectedProduct) {
        //         id.push(item.id)
        //     }
        //     return id
        // }
    },
    async mounted() {


        if (this.mode === 'edit' && this.edit_bundle !== {}) {
            //format the active_dates
            this.volume_discount_bundle_data = this.list_discount_setting[0]
            this.active_dates = [dayjs(this.edit_bundle.start_active_date), dayjs(this.edit_bundle.end_active_date)]

            this.bundle_name = this.edit_bundle.bundle.bundleName
            this.volume_discount_bundle_data = this.edit_bundle.discountType.filter(item => item.choosed === true)[0]
            this.bundle_display_name = this.edit_bundle.bundle.bundleDisplayName
            this.bundle_description = this.edit_bundle.bundle.bundleDescription
            this.priority = this.edit_bundle.priority === -1 ? null : this.edit_bundle.priority
            this.list_discount_setting = this.edit_bundle.discountType
            this.productSelected = JSON.parse(this.edit_bundle.volume_json).productSelected
            this.active_status = this.edit_bundle.status === 'active'
            this.list_priority = this.list_priority_edit.filter(i => i !== this.edit_bundle.priority)
            this.checkInputNotNull()
        }
        if (this.mode == 'create') {
            this.list_priority = this.list_priority_edit
        }
    }
}
</script>
<style scoped>
</style>