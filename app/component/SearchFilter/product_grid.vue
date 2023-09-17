<template>
  <div class="product-grid-container">
    <div v-for="product in product_list">
      <img  :src="product.img_src" sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)">
      <div>{{ product.title }}</div>
      <div>{{ returnProductPrice(product.variants) }} {{ currency }}</div>
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
    returnProductPrice(variants) {
      if (variants.length > 1) {
        for (let item of variants) {
          if (item.price !== null) {
            return item.price
          }
        }
      } else {
        return variants[0].price
      }
    }
  },

  mounted() {
    this.currency =Shopify.currency.active

  }
}
</script>