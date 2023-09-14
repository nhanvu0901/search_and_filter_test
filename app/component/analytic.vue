<template>
    <div class=" nb-analytic" style="gap: 12px;display: flex;flex-direction: column;">
        <div class="flex-align-center nb-data-responsive" style="justify-content: space-between">
            <h1 class="nb-title"
                style="color: #1C1C1E !important; font-family: 'Be Vietnam Pro', sans-serif !important">
                Analytics
            </h1>
            <div style="display: flex; gap: 12px">
                <a-select v-model:value="duration_analytic" class="nb-choose-bundle-type"
                          style="width: 143px; height: 44px" @change="select_time_range">
                    <a-select-option value="all_time">All time</a-select-option>
                    <a-select-option value="custom">Custom</a-select-option>
                    <a-select-option value="last_7_days">Last 7 days</a-select-option>
                    <a-select-option value="last_14_days">Last 14 days</a-select-option>
                    <a-select-option value="last_30_days">Last 30 days</a-select-option>
                </a-select>
                <a-space direction="vertical">
                    <a-range-picker v-model:value="active_dates" format="YYYY-MM-DD" :allowClear="false" class="nb-input-large"
                                    @change="handleDateChange">
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
        <div v-if="!isLoadingData">
            <div class="nb-bundle-title" style="padding: 20px 0">Performance statistics</div>
            <div  class="nb-data-container">
                <div class="flex-column" style="flex: 6.5; gap: 24px">
                    <div style="justify-content: space-between; display: flex; background: white; align-items: center; height: 136px; border-radius: 10px">
                        <div style="padding-left: 20px" class="nb-total-revenue">Total revenue</div>
                        <div style="padding-right: 32px" class="nb-analytic-value">
                            {{ convert_money(total_revenue) }}
                        </div>
                    </div>
                    <div style="display: flex; gap: 24px">
                        <div class="flex-column nb-analytic-block">
                            <div class="title_block" style="color: #636366 !important">Total order</div>
                            <div class="nb-analytic-value">{{ total_order }}</div>
                        </div>
                        <div class="flex-column nb-analytic-block">
                            <div class="title_block" style="color: #636366 !important">Average order value</div>
                            <div class="nb-analytic-value">{{ convert_money(compute_average_ord_value) }}
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background: white; flex: 3.5; padding: 16px 20px 32px; gap: 28px; border-radius: 10px;display: flex;flex-direction: column;">
                    <div class="title_block">Bundle performance</div>
                    <div style="display: flex">
                        <div class="flex-align-center" style="flex: 1; justify-content: center; padding-left: 27px">
                            <doughnut_chart :doughnutChartData="doughnut_chart_data" :height="200" :cutout="90"/>
                            <div style="position: absolute; text-align: center; gap: 12px;width: 10% !important;"
                                 class="flex-column">
                                <div class="nb-bundle-performance-detail">Click rate</div>
                                <div class="nb-bundle-performance-value">{{ compute_click_rate }}%</div>
                            </div>
                        </div>
                        <div class="flex-column" style="flex: 1; align-items: center">
                            <div class="nb-bundle-performance-block">
                                <div class="nb-bundle-performance-value">{{ total_click }}</div>
                                <div class="nb-bundle-performance-detail flex-align-center" style="gap: 4px">
                                    <img style="height: 8px; width: 8px"
                                         src="/nestbundle/static/icon/bundle_click_color.png" alt="">
                                    <div>Bundle clicks</div>
                                </div>
                            </div>
                            <div class="nb-bundle-performance-block">
                                <div class="nb-bundle-performance-value">{{ total_view }}</div>
                                <div class="nb-bundle-performance-detail flex-align-center" style="gap: 4px">
                                    <img style="height: 8px; width: 8px" alt=""
                                         src="/nestbundle/static/icon/bundle_view_color.png">
                                    <div>Bundle views</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nb-bundle-title" style="padding-top: 32px; padding-bottom: 20px">Best-selling bundles</div>
            <div class="nb-bundle-table nb-bundle-analytic-table" style="padding-bottom: 20px">
                <a-table :pagination="false" :columns="analytic_columns" :data-source="best_selling_bundles">
                    <template #headerCell="{ column }"/>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'no'">{{ record.no }}</template>
                        <template v-else-if="column.key === 'bundle_name'">{{ record.bundle_name }}</template>
                        <template v-else-if="column.key === 'created_date'">{{ record.created_date }}</template>
                        <template v-else-if="column.key === 'bundle_display_name'">
                            {{ record.bundle_display_name }}
                        </template>
                        <template v-else-if="column.key === 'total_order'">{{ record.total_order }}</template>
                        <template v-else-if="column.key === 'total_revenue' && record.total_revenue > 0">
                            {{ convert_money(record.total_revenue) }}
                        </template>
                        <template v-else-if="column.key === 'total_revenue' && record.total_revenue == 0">0</template>
                        <template v-else-if="column.key === 'status' && record.status == 'active' && record.active_bundle == true">Active</template>
                        <template v-else-if="column.key === 'status' && record.status == 'inactive' && record.active_bundle == true">Inactive</template>
                        <template v-else-if="column.key === 'status' && record.active_bundle == false">Deleted</template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
    <div v-if="isLoadingData" style="text-align: center; margin: 80px 0 120px 0">
        <svg width="79" height="78" viewBox="0 0 79 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.5532 41.6641L48.2911 32.1735L49.9461 34.046L39.2082 43.5366L37.5532 41.6641Z" fill="black"/>
            <path d="M23.8442 42.8828L24.5792 40.4928L32.5415 42.9415L31.8065 45.3315L23.8442 42.8828Z" fill="black"/>
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
    <div class="nb-loading-blur" v-if="isLoadingData " style="z-index: 9999;position: fixed;">
        <Loading :active="isLoadingData" loader="spinner" color="#6D41E9" v-if="isLoadingData"
                 :is-full-page="false" :height="200" style="text-align: center"/>
    </div>
</template>
<script>
import doughnut_chart from './doughnut_chart.vue'
import {Select, SelectOption, Space, RangePicker, Table, notification} from "ant-design-vue"
import {MinusOutlined} from '@ant-design/icons-vue'
import _ from "lodash"
import axios from "axios"
import dayjs from "dayjs"
import Loading from 'vue-loading-overlay'

export default {
    name: "analytic",
    components: {
        doughnut_chart,
        ASelect: Select,
        ASelectOption: SelectOption,
        ASpace: Space,
        ARangePicker: RangePicker,
        MinusOutlined,
        ATable: Table,
        Loading
    },
    props: {
        store_currency: String,
        country: String,
        locale: String,
        currency_symbol: String
    },
    data() {
        return {
            isLoadingData: true,
            active_dates: [dayjs(window.nb_settings.create_date), dayjs(new Date())],
            start_date: '',
            end_date: '',
            total_click: 0,
            total_view: 0,
            total_order: 0,
            total_revenue: 0,
            doughnut_chart_data: [
                {label: 'Bundle clicks', data: 0, color: '#1C1C1E'},
                {label: 'Bundle views', data: 0, color: '#EBEBEB'}
            ],
            duration_analytic: "all_time",
            analytic_columns: [{
                title: 'No',
                key: 'no',
                width: "50px",
                align: 'left',
                defaultSortOrder: 'ascend'
            }, {
                title: 'Bundle name',
                key: 'bundle_name',
                width: '217px'
            }, {
                title: 'Created date',
                key: 'created_date',
                width: "211px"
            }, {
                title: 'Display name',
                key: 'bundle_display_name',
                width: "217px"
            }, {
                title: 'Total order',
                key: 'total_order',
                width: "200px"
            }, {
                title: 'Total revenue',
                key: 'total_revenue',
                width: "200px"
            }, {
                title: 'Status',
                key: 'status',
                width: "200px"
            }],
            best_selling_bundles: [],
        }
    },
    watch: {},
    methods: {
        convert_money(money) {
            let self = this
            let localeString
            if (self.store_currency == 'EUR') {
                localeString = 'de-' + self.country
            } else {
                localeString = self.locale + '-' + self.country
            }
            let option = {style: 'currency', currency: self.store_currency}
            let covert_money_string
            if (parseFloat(money).toLocaleString(localeString, option).includes(self.currency_symbol + '.')) {
                covert_money_string = parseFloat(money).toLocaleString(localeString, option).replace(self.currency_symbol + ".", ' ') + self.store_currency
            } else {
                covert_money_string = parseFloat(money).toLocaleString(localeString, option).replace(self.currency_symbol, '') + ' ' + self.store_currency
            }
            if (covert_money_string.split(self.store_currency).length - 1 == 2) {
                covert_money_string = covert_money_string.replace(self.store_currency, '')
            }
            return covert_money_string
        },
        select_time_range() {
            var currentDate = new Date()
            var pastDate = new Date()
            if (this.duration_analytic === "last_7_days") {
                pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            } else if (this.duration_analytic === "last_14_days") {
                pastDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            } else if (this.duration_analytic === "last_30_days") {
                pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            } else if (this.duration_analytic === "custom") {
                pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
            } else if (this.duration_analytic === "all_time") {
                pastDate = new Date(window.nb_settings.create_date)
            }

            this.active_dates = [dayjs(pastDate), dayjs(currentDate)]
            this.end_date = this.formatDate(currentDate)
            this.start_date = this.formatDate(pastDate)

            this.getDataAnalytic()

            // if (this.start_date < this.end_date) {
            //     this.getDataAnalytic()
            // } else if (this.duration_analytic === 'custom') {
            //     this.show_toast('error', "start date before end date")
            // }


        },
        formatDate(date) {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        },
        handleDateChange(date_range) {
            let self = this
            this.duration_analytic = "custom"
            if (this.duration_analytic === "custom") {
                let temp_start_date = new Date(date_range[0].$d)
                let temp_end_date = new Date(date_range[1].$d)

                self.start_date = `${temp_start_date.getFullYear()}-${(temp_start_date.getMonth() + 1).toString().padStart(2, '0')}-${temp_start_date.getDate().toString().padStart(2, '0')}`
                self.end_date = `${temp_end_date.getFullYear()}-${(temp_end_date.getMonth() + 1).toString().padStart(2, '0')}-${temp_end_date.getDate().toString().padStart(2, '0')}`

                if (this.start_date < this.end_date) {
                    this.getDataAnalytic()
                } else if (this.duration_analytic === 'custom') {
                    this.show_toast('error', "start date before end date")
                }
            }

        },
        show_toast: function (type, message, duration = 2) {
            notification[type]({
                message: message,
                duration: duration
            })
        },
        getDataAnalytic: _.debounce(
            function () {
                var self = this
                self.isLoadingData = true
                let store_url = window.nb_settings.domain
                axios.post('/nb/get_analytic_data', {
                    jsonrpc: "2.0",
                    params: {
                        store_url: store_url,
                        start_date: self.start_date,
                        end_date: self.end_date
                    }
                }).then(res => {
                    if (res.status === 200) {
                        if ('error' in res.data.result) {
                            if (res.data.result.error == "Time out!") {
                                self.show_toast("error", "Please login again!")
                            } else {
                                self.show_toast('error', res.data.error)
                            }
                        } else {
                            let data = res.data.result.bundle_analytic
                            self.best_selling_bundles = res.data.result.table_data
                            self.total_revenue = data.revenue.toFixed(2)
                            self.total_click = data.click
                            self.total_view = data.view
                            self.total_order = data.order
                            self.doughnut_chart_data = [{
                                label: 'Bundle clicks',
                                data: data.click,
                                color: '#1C1C1E'
                            }, {
                                label: 'Bundle views',
                                data: data.view,
                                color: '#EBEBEB'
                            }]
                        }
                    } else {
                        self.show_toast('error', res.data.error)
                    }
                    self.isLoadingData = false
                }).catch(function (error) {
                    self.show_toast('error', error.message)
                    self.isLoadingData = false
                    console.log(error)
                })
            }, 150
        )
    },
    computed: {
        compute_average_ord_value() {
            if (this.total_order !== 0 && this.total_revenue !== 0) {
                return (this.total_revenue / this.total_order).toFixed(2)
            } else {
                return 0
            }
        },
        compute_click_rate() {
            if (this.total_view !== 0 && this.total_click !== 0) {
                return ((this.total_click / this.total_view) * 100).toFixed(2)
            } else {
                return 0
            }
        }
    },
    async mounted() {
        if (this.duration_analytic !== null && this.duration_analytic !== '' && this.duration_analytic === 'all_time') {
            var currentDate = new Date()
            var pastDate = new Date(window.nb_settings.create_date)
            this.end_date = this.formatDate(currentDate)
            this.start_date = this.formatDate(pastDate)
            this.getDataAnalytic()
        }
    }
}
</script>
<style scoped>
</style>