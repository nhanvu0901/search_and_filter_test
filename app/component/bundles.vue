<template>
    <div class="nb-content-wrapper" v-if="this.state ==='table'">
        <div class="nb-bundle-heading">
            <h1 class="nb-title">Bundles</h1>
            <Button type="primary" size="large" style="display: flex; justify-content: center; align-items: center"
                    @click="chooseCreateBundle">
                <template #icon>
                    <svg width="16" height="16" style="margin-right: 9.33px" viewBox="0 0 16 16" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                                d="M8.00004 5.33337V10.6667M5.33337 8.00004H10.6667M14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8.00004C1.33337 4.31814 4.31814 1.33337 8.00004 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004Z"
                                stroke="#FDFDFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </template>
                New bundle
            </Button>
        </div>
        <div class="nb-bundle-table" style="margin-top: 36px">
            <Table v-if="bundles_data.length > 0" :columns="bundles_columns" :width="'100%'"
                   :data-source="bundles_data" size="small"
                   :pagination="{hideOnSinglePage:true, defaultPageSize:10, position:['bottomCenter']}">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'priority'">
                        <span v-if="record.priority === null || record.priority === -1">N/A</span>
                        <span v-else>{{ record.priority }}</span>
                    </template>
                    <template v-if="column.key === 'bundle'">
                        <div style="display: flex; flex-direction:column">
                            <span class="nb-blue-color" style="width: fit-content;cursor: pointer"
                                  @click="editBundle(record)">
                                {{ record.bundle.bundleName }}
                            </span>
                            <div>
                                <span
                                        style="font-weight: 400;font-size: 13px;line-height: 16px;color: #939393">Type:</span>
                                {{ record.bundle.bundleType }}
                            </div>
                        </div>
                    </template>
                    <template v-if="column.key === 'status'">
                        <Tag
                                :color="record.status === 'active' ? 'green' : record.status === 'inactive' ? 'volcano' : 'grey'">
                            {{ record.status }}
                        </Tag>
                    </template>
                    <template v-if="column.key === 'items'">
                        <span>{{ record.items }}</span>
                    </template>
                    <template v-if="column.key === 'discountType'">
                        <span
                                v-if="record.bundle.bundleType === 'volume' && !hasDuplicateAttribute(record.discountType,'discountType')"
                                v-for="discount in record.discountType">
                            {{ discountTypeTitle(discount.discountType) }}
                        </span>
                        <span
                                v-else-if="record.bundle.bundleType === 'volume' && hasDuplicateAttribute(record.discountType,'discountType')">
                              {{ discountTypeTitle(record.discountType[0].discountType) }}
                        </span>
                        <span v-if="record.bundle.bundleType === 'product'">
                            {{ discountTypeTitle(record.discountType) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <div class="nb-table-dropdown">
                            <Dropdown placement="bottomLeft" :trigger="['click']">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" style="cursor: pointer">
                                    <path
                                            d="M9.99996 10.8334C10.4602 10.8334 10.8333 10.4603 10.8333 10C10.8333 9.5398 10.4602 9.16671 9.99996 9.16671C9.53972 9.16671 9.16663 9.5398 9.16663 10C9.16663 10.4603 9.53972 10.8334 9.99996 10.8334Z"
                                            stroke="black" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    <path
                                            d="M9.99996 5.00004C10.4602 5.00004 10.8333 4.62694 10.8333 4.16671C10.8333 3.70647 10.4602 3.33337 9.99996 3.33337C9.53972 3.33337 9.16663 3.70647 9.16663 4.16671C9.16663 4.62694 9.53972 5.00004 9.99996 5.00004Z"
                                            stroke="black" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                    <path
                                            d="M9.99996 16.6667C10.4602 16.6667 10.8333 16.2936 10.8333 15.8334C10.8333 15.3731 10.4602 15 9.99996 15C9.53972 15 9.16663 15.3731 9.16663 15.8334C9.16663 16.2936 9.53972 16.6667 9.99996 16.6667Z"
                                            stroke="black" stroke-width="1.5" stroke-linecap="round"
                                            stroke-linejoin="round"/>
                                </svg>
                                <template #overlay>
                                    <Menu>
                                        <MenuItem class="nb-edit-button" @click="editBundle(record)">
                                            Edit attributes
                                        </MenuItem>
                                        <MenuItem class="nb-delete-button" style="color: #EB5757"
                                                  @click="confirmDelete(record.bundle_ids)">
                                            Delete bundle
                                        </MenuItem>
                                    </Menu>
                                </template>
                            </Dropdown>
                        </div>
                    </template>
                </template>
            </Table>
            <div v-else class="nb-dashboard-block" style="padding: 14px;">
                <div style="background: #F4F4F4;padding: 80px 300px;gap: 10px;" class="nb-flex-center">
                    <div class="nb-empty-state-table">
                        <span style="font-size: 24px;font-weight: 500;">Your bundles will be shown here</span>
                        <span style="font-size: 14px;font-weight: 400;">Easily create product or volume discount bundles in minutes and show them on your store</span>
                        <div class="nb-button-group">
                            <Button type="primary" size="large"
                                    style="display: flex; justify-content: center; align-items: center"
                                    @click="chooseCreateBundle">
                                Create new bundle
                            </Button>
                            <div class="nb-create-bundle-btn"
                                 style="color: #1C1C1E; background: #FDFDFD;border: 1px solid #D1D1D1"
                                 size="large">
                                Learn more
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Product_bundle v-if="this.state === 'product_bundle'"
                    @setState="setState"
                    @confirmNotSaveCreate="confirmNotSaveCreate"
                    @addBundle="addBundle"
                    @setIsLoadingData="setIsLoadingData"
                    :store_currency="store_currency"
                    :needSave="needSave"
                    :country_code="country"
                    :currencySymbol="currency_symbol"
                    :locale="locale"
                    :mode="mode"
                    :list_priority_edit="list_priority"
                    :edit_bundle="edit_bundle"/>
    <Volume_bundle v-if="this.state === 'volume_bundle'"
                   @addBundle="addBundle"
                   @setState="setState"
                   @confirmNotSaveCreate="confirmNotSaveCreate"
                   @setIsLoadingData="setIsLoadingData"
                   :store_currency="store_currency"
                   :needSave="needSave"
                   :country_code="country"
                   :currencySymbol="currency_symbol"
                   :locale="locale"
                   :mode="mode"
                   :list_priority_edit="list_priority"
                   :edit_bundle="edit_bundle"/>

    <Modal class="nb-loading-blur nb-modal nb-modal-confirm"
           v-model:visible="modal.confirmDeleteBundle"
           title="Are you sure you want to delete this bundle?"
           centered
           style="height: 140px"
           @ok="deleteBundle"
           okText="Delete bundle">
        <div style="color: #6B6B6B; margin: 0 24px">This action cannot be undone.</div>
    </Modal>
    <Modal class="nb-loading-blur nb-modal nb-modal-create"
           v-model:visible="modal.openCreateBundle"
           title="Select a bundle type"
           centered
           style="height: 394px"
           @ok="redirectCreateBundle"
           okText="Create bundle">
        <div class="nb-select-bundle-type">
            <div class="nb-sl-bundle-type-button"
                 :class="{'nb-selected-type': selected_type_bundle=='product_bundle'}"
                 id="nb-create-product-bundle"
                 @click="selectBundleType"
                 :data-selected-bundle="'product_bundle'">
                <div class="nb-select-modal-text-container">
                    <span
                            style="font-weight: 600;font-size: 16px;line-height: 20px;text-transform: capitalize;color: #3A3A3C;">Product bundle</span>
                    <span style="font-weight: 400;font-size: 14px;line-height: 20px;color: #757575;">Create bundle from multiple products</span>
                </div>
                <div><img height="50" src="/nestbundle/static/img/cloth-hoodie-cap.png"></div>
            </div>
            <div class="nb-sl-bundle-type-button"
                 :class="{'nb-selected-type': selected_type_bundle=='volume_bundle'}"
                 id="nb-create-volume-bundle" @click="selectBundleType"
                 :data-selected-bundle="'volume_bundle'">
                <div class="nb-select-modal-text-container">
                    <span
                            style="font-weight: 600;font-size: 16px;line-height: 20px;text-transform: capitalize;color: #3A3A3C;">Volume discount</span>
                    <span style="font-weight: 400;font-size: 14px;line-height: 20px;color: #757575;">Give discount when customers purchase a certain quantity of a product</span>
                </div>
                <div><img height="50" src="/nestbundle/static/img/cap.png"></div>
            </div>
        </div>
    </Modal>
    <Modal class="nb-loading-blur nb-modal nb-modal-confirm"
           v-model:visible="modal.confirmNotSave"
           title="Your changes have not been saved"
           centered
           style="height: 140px"
           @cancel="modal.confirmNotSave = false"
           @ok="confirmBackToView"
           okText="Leave page">
        <div style="color: #6B6B6B; margin: 0 24px">Leaving page will discard all of your changes.</div>
    </Modal>
</template>
<script>
import axios from "axios"
import {Tag, Table, notification, Dropdown, MenuItem, Menu, Button, Modal} from "ant-design-vue"
import Loading from 'vue-loading-overlay'
import Product_bundle from "./product_bundle.vue"
import Volume_bundle from "./volume_bundle.vue"
import _ from "lodash";

export default {
    name: "bundles",
    components: {Volume_bundle, Product_bundle, Loading, Table, Tag, Dropdown, MenuItem, Menu, Button, Modal},
    props: {
        needSave: Boolean,
        state: String,
        store_currency: String,
        mode: String,
        isLoadingData: Boolean,
        country: String,
        currency_symbol: String,
        locale: String
    },

    data() {
        return {

            edit_bundle: {},

            selected_bundle: null,
            selected_type_bundle: null,
            modal: {
                confirmNotSave: false,
                confirmDeleteBundle: false,
                openCreateBundle: false
            },
            bundles_columns: [{
                title: 'Priority',
                key: 'priority',
                width: "100px",
                align: 'center',

                defaultSortOrder: null,
            }, {
                title: 'Bundle name',
                key: 'bundle',
                width: '486px'
            }, {
                title: 'Status',
                key: 'status',
                width: "120px"
            }, {
                title: 'Items',
                key: 'items',
                width: "120px"
            }, {
                title: 'Discount type',
                key: 'discountType',
                width: "222px"
            }, {
                title: '',
                key: 'action',
                width: "44px"
            }],
            bundles_data: [],
            // real_state: null
            list_priority: [],
        }
    },
    watch: {

        mode: function () {
            if (this.mode === 'create' || this.mode === 'edit') {
                this.$emit('setNeedSave', true)
            } else {
                this.$emit('setNeedSave', false)
                this.getBundleList()
                this.checkPriority()
            }
        },

    },
    emits: [
        'setNeedSave',
        "setMode",
        "setRealState",
        'setIsLoadingData'
    ],
    methods: {
        setIsLoadingData(flag) {
            this.$emit('setIsLoadingData', flag)
        },
        discountTypeTitle(discountType) {
            if (discountType === 'fixed_amount') {
                return 'fixed discount'
            } else if (discountType === 'free_gift') {
                return 'free gift'
            } else if (discountType === 'set_price') {
                return 'set price'
            } else {
                return 'percentage'
            }
        },
        hasDuplicateAttribute(arr, attribute) {
            return arr.some((obj, index) => {
                const filteredArr = arr.filter((otherObj, otherIndex) => {
                    return otherIndex !== index && otherObj[attribute] === obj[attribute]
                })
                return filteredArr.length > 0
            })
        },
        confirmNotSaveCreate() {
            this.modal.confirmNotSave = true
        },
        confirmBackToView: function () {
            this.modal.confirmNotSave = false
            this.$emit('setNeedSave', false)
            this.$emit('setRealState', 'table')
            this.$emit('setMode', 'view')
        },
        addBundle(bundle_data) {


            let domain = window.nb_settings.domain
            if (this.mode === 'create') {
                let index = this.bundles_data.findIndex(item => item.priority === bundle_data.priority && item.priority !== -1);
                if (index !== -1) {
                    this.show_toast('error', "Select other priority!")
                    this.$emit('setIsLoadingData', false)
                } else {

                    axios.post('/nb/action/create', {
                        jsonrpc: '2.0',
                        params: {
                            store_url: domain,
                            bundle_data: bundle_data
                        }
                    }).then(res => {
                        this.$emit('setNeedSave', false)
                        if (res.data.result.code === 0) {
                            this.show_toast('success', res.data.result.message)
                            bundle_data['bundle_ids'] = res.data.result.bundle_ids
                            bundle_data['status'] = res.data.result.status
                            this.$emit('setRealState', 'table')
                            // this.$emit('setState',false)
                            this.$emit('setMode', "view")
                            this.bundles_data.push(bundle_data)
                        } else {
                            this.show_toast('error', res.data.result.error)
                        }

                        this.$emit('setIsLoadingData', false)
                    }).catch(error => {
                        this.show_toast('error', error.message)
                        this.$emit('setIsLoadingData', false)
                    })
                }
            }
            if (this.mode === 'edit') {
                let flag = false
                let index = this.bundles_data.findIndex(item => item.priority === bundle_data.priority);

                if (index !== -1) {
                    if (this.bundles_data[index].bundle_ids !== bundle_data.bundle_ids) {
                        this.show_toast('error', "Select other priority!")
                        flag = true
                    }
                }

                if (flag === false) {
                    let bundle_index = this.bundles_data.findIndex(item => item.bundle_ids === bundle_data.bundle_ids);
                    axios.post('/nb/action/edit', {
                        jsonrpc: '2.0',
                        params: {
                            store_url: domain,
                            bundle_data: bundle_data
                        }
                    }).then(res => {
                        this.$emit('setNeedSave', false)
                        if (res.data.result.code === 0) {
                            this.show_toast('success', res.data.result.message)
                            bundle_data['status'] = res.data.result.status

                            this.$emit('setRealState', 'table')

                            this.$emit('setMode', 'view')
                            this.bundles_data[bundle_index] = bundle_data
                        } else {
                            this.show_toast('error', res.data.result.error)
                        }
                        this.$emit('setIsLoadingData', false)
                    }).catch(error => {
                        this.$emit('setIsLoadingData', false)
                        this.show_toast('error', error.message)
                    })
                }


            }


        },
        setState(state) {
            // this.real_state = "table"
            this.$emit('setRealState', state)
        },
        selectBundleType(e) {
            if (e.currentTarget.getAttribute("data-selected-bundle") !== this.selected_type_bundle) {
                if (e.currentTarget.getAttribute("data-selected-bundle") === 'volume_bundle') {
                    if (e.currentTarget.previousSibling.classList.value.includes("nb-selected-type")) {
                        e.currentTarget.previousSibling.classList.remove('nb-selected-type')
                    }
                } else {
                    if (e.currentTarget.nextSibling.classList.value.includes("nb-selected-type")) {
                        e.currentTarget.nextSibling.classList.remove('nb-selected-type')
                    }
                }
                this.selected_type_bundle = e.currentTarget.getAttribute("data-selected-bundle")
                e.currentTarget.classList.add('nb-selected-type')
            }
        },
        chooseCreateBundle() {
            this.modal.openCreateBundle = true
            this.selected_type_bundle = "product_bundle"
        },
        confirmDelete(bundle_ids) {
            if (bundle_ids !== null) {
                this.modal.confirmDeleteBundle = true;
                this.selected_bundle = bundle_ids
            } else {
                this.show_toast('error', "Bundle not have priority")
            }
        },
        redirectCreateBundle() {
            // this.changeMenu(this.selected_type_bundle)

            let product_bundle = document.getElementById('nb-create-product-bundle')
            let volume_bundle = document.getElementById('nb-create-volume-bundle')
            if (this.selected_type_bundle === product_bundle.getAttribute("data-selected-bundle")) {
                product_bundle.classList.remove('nb-selected-type')
                this.$emit('setRealState', this.selected_type_bundle)

                this.$emit('setMode', 'create')

            }
            if (this.selected_type_bundle === volume_bundle.getAttribute("data-selected-bundle")) {
                volume_bundle.classList.remove('nb-selected-type')
                this.$emit('setRealState', this.selected_type_bundle)

                this.$emit('setMode', 'create')

            }
            this.selected_type_bundle = null
            this.modal.openCreateBundle = false


        },
        editBundle(record) {
            this.edit_bundle = record
            this.$emit('setMode', "edit")
            if (record.bundle.bundleType === 'product') {
                // this.real_state = 'product_bundle'
                this.$emit('setRealState', 'product_bundle')
            }
            if (record.bundle.bundleType === 'volume') {
                // this.real_state = 'volume_bundle'
                this.$emit('setRealState', 'volume_bundle')
            }

        },
        deleteBundle() {
            let domain = window.nb_settings.domain
            axios.post('/nb/delete_bundle', {
                jsonrpc: '2.0',
                params: {
                    store_url: domain,
                    bundle_ids: this.selected_bundle,
                }
            }).then(res => {
                this.$emit('setNeedSave', false)
                if (res.data.result.code === 0) {
                    this.bundles_data = this.bundles_data.filter(item => item.bundle_ids !== this.selected_bundle)
                    this.modal.confirmDeleteBundle = false
                    this.show_toast('success', res.data.result.message)
                } else {
                    if (res.data.result.error == "Time out!") {
                        this.show_toast('error', "Please login again!")
                    } else {
                        this.show_toast('error', res.data.result.error)
                    }
                }
                this.selected_bundle = null
            }).catch(error => {
                this.show_toast('error', error.message)
            })
            this.checkPriority()
        },
        show_toast: function (type, message, duration = 2.0) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        sorterBundleTable(arr) {
            return arr.sort(function (a, b) {
                if (a.priority === -1) return 1; // move a to the end
                if (b.priority === -1) return -1; // move b to the end
                return a.priority - b.priority; // sort in ascending order
            })
        },
        getBundleList: _.debounce(
            function () {

                var self = this
                let domain = window.nb_settings.domain
                axios.post('/nb/get_bundle_list', {
                    jsonrpc: '2.0',
                    params: {
                        store_url: domain
                    }
                }).then(res => {
                    if (res.data.result.code === 0) {
                        self.bundles_data = self.sorterBundleTable(res.data.result.bundle_list)
                    } else {
                        if (res.data.result.error == "Time out!") {
                            self.show_toast('error', "Please login again!")
                        } else {
                            self.show_toast('error', res.data.result.error)
                        }
                    }
                    self.setIsLoadingData(false)
                }).catch(error => {
                    self.setIsLoadingData(false)
                    self.show_toast('error', error.message)
                })
            }, 500
        ),
        checkPriority: _.debounce(
            function () {

                var self = this
                let domain = window.nb_settings.domain
                axios.post('/nb/check_priority', {
                    jsonrpc: '2.0',
                    params: {
                        shop_url: domain
                    }
                }).then(res => {
                    if ('error_check_priority' in res.data.result) {
                        if (res.data.result.error_check_priority == "Time out!") {
                            self.show_toast("error", "Please login again!")
                        } else {
                            self.show_toast("error", 'Something went wrong. Please contact the customer support')
                            console.log(res.data.result.error_check_priority)
                        }
                    } else {
                        self.list_priority = res.data.result.list_priority
                    }
                }).catch(error => {
                    console.log(error)
                })
            }, 500
        ),
    },

    async mounted() {
        if (this.mode === 'view') {
            this.setIsLoadingData(true)
        }

        this.getBundleList()

        this.checkPriority()
    }
}
</script>
<style scoped>
</style>

