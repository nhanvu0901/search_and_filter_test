<template>
    <div v-for="(option, index) in filter_options" class="filter-option">
        <span @click="openDropdown(option)">{{ option.attribute.toUpperCase() }}</span>
        <div class="dropdown-value">

            <div v-if="option.is_selected === true" v-for="(value,index) in option.values"
                 @click="select_filter(option,value)">
                {{ value.is_selected !== false && value.is_selected !== undefined ? "!" : '' }} {{ value.label }}
                ({{ value.count }})
            </div>
        </div>

    </div>
</template>
<script setup>

</script>
<script>
import axios from 'axios'

export default {
    name: "Dropdown",
    emits: [
        'setChooseFilter',
    ],
    props: {

        filter_options: Array
    },
    data() {
        return {
            selected_filter: []
        }
    },
    methods: {
        openDropdown(option) {
            option.is_selected = !option.is_selected

        },
        select_filter(option, value) {
            this.selected_filter.push(value)
            value.is_selected = !value.is_selected
            this.$emit('setChooseFilter', {option: option,value:value});
        }
    },
    mounted() {


    }
}
</script>