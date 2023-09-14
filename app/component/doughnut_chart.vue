<template>
    <div style="width: 200px; height: 200px" class="nestscale-doughnut-char">
        <Doughnut :chart-options="chartOptions"
                  :chart-data="chartData"
                  :chart-id="'doughnut-chart'"
                  :dataset-id-key="'label'"
                  :height="height"/>
    </div>
</template>
<script>
import {Doughnut} from 'vue-chartjs'
import 'chart.js/auto'

export default {
    name: "doughnut_chart",
    components: {Doughnut},
    props: {
        height: {
            type: Number,
            default: null
        },
        cutout: {
            type: Number,
            default: null
        },
        doughnutChartData: {
            type: Array,
            default: []
        },
        displayCenter: {
            type: String,
            default: 'list'
        },
        displayCenterTotal: {
            type: Object,
            default: null
        }
    },
    watch: {
        doughnutChartData: function (newone) {
            this.buildChartData(newone)
        }
    },
    data() {
        return {
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                borderWidth: 0,
                cutout: this.cutout,
                plugins: {legend: {display: false}}
            },
            chartData: {
                labels: ['1', '2'],
                datasets: [{
                    data: [1, 2],
                    backgroundColor: []
                }]
            }
        }
    },
    methods: {
        buildChartData: async function (doughnutChartData) {
            const delay = (time) => {
                return new Promise(resolve => setTimeout(resolve, time))
            }
            var colors = []
            var dataset = []
            var label_set = []
            for (let item in doughnutChartData) {
                dataset.push(doughnutChartData[item].data)
                colors.push(doughnutChartData[item].color)
                label_set.push(doughnutChartData[item].label)
            }
            await delay(10)
            let checker = dataset.every(v => v === 0)
            if (checker) dataset[0] = 0.000001
            this.chartData = {
                labels: label_set,
                datasets: [{
                    data: dataset,
                    backgroundColor: colors
                }]
            }
        }
    },
    mounted() {
        this.buildChartData(this.doughnutChartData)
    }
}
</script>
<style scoped>
</style>