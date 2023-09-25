<template>
    <!--    <div v-for="(option, index) in filter_options" class="filter-option">-->
    <!--        <span @click="openDropdown(option)">{{ option.attribute.toUpperCase() }}</span>-->
    <!--        <div class="dropdown-value">-->

    <!--            <div v-if="option.is_selected === true" v-for="(value,index) in option.values"-->
    <!--                 @click="select_filter(option.attribute,value)">-->
    <!--                {{ value.is_selected !== false && value.is_selected !== undefined ? "!" : '' }} {{ value.label }}-->
    <!--                ({{ value.count }})-->
    <!--            </div>-->
    <!--        </div>-->

    <!--    </div>-->


    <div class="gf-filter-header"></div>
    <div class="globo-selected-items-wrapper"></div>
    <div class="gf-filter-contents">
        <div :data-filter-type="option.attribute" v-for="(option, index) in filter_options"
             class="gf-option-block gf-option-block-checkbox capitalize" :class="{'is-collapsed': !option.is_selected}">
            <div class="gf-block-title" @click="openDropdown(option)">
                <div class="h3" style="font-size: 14px">
                    <span>{{ option.attribute.toUpperCase() }}</span>
                </div>
            </div>
            <div class="gf-block-content">
                <div class="gf-scroll gf-block-scroll"
                     v-if="option.attribute !== 'price' && option.attribute !== 'percent sale'">
                    <ul class="gf-option-box">
                        <li v-for="(value,index) in option.values" v-if="option.is_selected === true">
                            <button type="button" role="checkbox" :aria-checked="value.is_selected"
                                    :class="{'checked':value.is_selected}" :title="value.label"
                                    @click="select_filter(option.attribute,value)">
                                <span class="gf-Checkbox"></span>
                                <span class="gf-label">{{ value.label }}</span>
                                <span class="gf-count"> ({{ value.count }})</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="gf-scroll" v-else>
                    <div class="gf-range-inputs">
                        <input class="gf-range-min" :data-value="option.values.min" :data-min-value="option.values.min"
                               :value="option.values.min"
                               type="text" aria-label="Min value">
                        <span class="gf-range-split"> - </span>
                        <input class="gf-range-max" :data-value="option.values.max" :data-max-value="option.values.max"
                               :value="option.values.max" type="text" aria-label="Max value">
                    </div>
                    <div class="gf-range-slider noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr"
                         data-min="0" data-max="70" aria-label="Percent Sale" data-id="115327"
                         data-attribute="115327" id="slider-115327">
                        <div class="noUi-base">
                            <div class="noUi-connects">
                                <div class="noUi-connect"
                                     style="transform: translate(0%, 0px) scale(0.628571, 1);"></div>
                            </div>
                            <div class="noUi-origin" style="transform: translate(-1000%, 0px); z-index: 5;">
                                <div class="noUi-handle noUi-handle-lower" data-handle="0" tabindex="0"
                                     role="slider" aria-orientation="horizontal" aria-valuemin="0.0"
                                     aria-valuemax="44.0" aria-valuenow="0.0" aria-valuetext="0.00">
                                    <div class="noUi-touch-area"></div>
                                </div>
                            </div>
                            <div class="noUi-origin" style="transform: translate(-371.429%, 0px); z-index: 4;">
                                <div class="noUi-handle noUi-handle-upper" data-handle="1" tabindex="0"
                                     role="slider" aria-orientation="horizontal" aria-valuemin="0.0"
                                     aria-valuemax="70.0" aria-valuenow="44.0" aria-valuetext="44.00">
                                    <div class="noUi-touch-area"></div>
                                </div>
                            </div>
                        </div>
                        <div class="noUi-pips noUi-pips-horizontal">
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-large"
                                 style="left: 0%;"></div>
                            <div class="noUi-value noUi-value-horizontal noUi-value-large"
                                 :data-value="option.values.min"
                                 style="left: 0%;">0%
                            </div>
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-normal"
                                 style="left: 20%;"></div>
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-normal"
                                 style="left: 40%;"></div>
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-normal"
                                 style="left: 60%;"></div>
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-normal"
                                 style="left: 80%;"></div>
                            <div class="noUi-marker noUi-marker-horizontal noUi-marker-large"
                                 style="left: 100%;"></div>
                            <div class="noUi-value noUi-value-horizontal noUi-value-large"
                                 :data-value="option.values.max"
                                 style="left: 100%;">70%
                            </div>
                        </div>
                    </div>
                </div>


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

            value.is_selected = !value.is_selected
            if (!value.is_selected) {
                // this.selected_filter.filter(item => item.option !== option && item.value.label !== value.label)
                for (let item = 0; item <= this.selected_filter; item++) {
                    if (this.selected_filter[item].option === option) {
                        if (this.selected_filter[item].value.label === value.label) {
                            this.selected_filter.splice(item, 1);
                        }

                    }
                }
            } else {
                this.selected_filter.push({option: option, value: value})
            }
            this.$emit('setChooseFilter', {selected_filter: this.selected_filter, pagination: 1})
        }
    },
    mounted() {


    }
}
</script>
