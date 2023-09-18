<template>
    <div class="product-grid-container">
        <div v-for="product in product_list">
            <a :href="'/products/' + product.handle + (product.variants.length > 0 ? '?variant=' + returnVariant(product.variants).id : '')">
                <div class="zoom-container">
                    <img :src="product.img_src">
                </div>
                <div>{{ product.title }}</div>
                <div>{{ returnVariant(product.variants).price }} {{ currency }}</div>
            </a>
        </div>
    </div>
</template>
<script setup>

</script>
<script>


export default {
    name: "ProductGrid",
    emits: [],
    props: {
        product_list: Array

    },
    data() {
        return {
            currency: null
        }
    },
    methods: {
        returnVariant(variants) {
            if (variants.length > 1) {
                for (let item of variants) {
                    if (item.price !== null) {
                        return item
                    }
                }
            } else {
                return variants[0]
            }
        }
    },

    mounted() {
        this.currency = Shopify.currency.active

    }
}
</script>