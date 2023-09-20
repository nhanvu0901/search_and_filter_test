<template>
    <!--    <div class="product-grid-container">-->
    <!--        <div v-for="product in product_list">-->
    <!--            <a :href="'/products/' + product.handle + (product.variants.length > 0 ? '?variant=' + returnVariant(product.variants).id : '')">-->
    <!--                <div class="zoom-container">-->
    <!--                    <img :src="product.img_src">-->
    <!--                </div>-->
    <!--                <div>{{ product.title }}</div>-->
    <!--                <div>{{ returnVariant(product.variants).price }} {{ currency }}</div>-->
    <!--            </a>-->
    <!--        </div>-->
    <!--    </div>-->


    <div class="product-grid-container" id="ProductGridContainer">
        <div class="collection page-width">
            <div class="loading-overlay gradient"></div>
            <ul id="product-grid" class="grid product-grid grid--2-col-tablet-down grid--4-col-desktop">
                <li class="grid__item scroll-trigger animate--slide-in" v-for="product in product_list">


                    <link
                        href=""
                        rel="stylesheet" type="text/css" media="all">
                    <div class="card-wrapper product-card-wrapper underline-links-hover">
                        <div class="card card--media card--card color-background-1 gradient" style="--ratio-percent: 100.0%;">
                            <div class="card__inner " style="--ratio-percent: 100.0%;">
                                <div class="card__media" style="min-height: 150px;">
                                    <div class="media media--transparent media--hover-effect" style="min-height: 150px">

                                        <img
                                            :src="product.img_src"
                                            width="925" height="617"
                                            sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
                                            :alt="product.title"
                                            class="motion-reduce">

                                    </div>
                                </div>
                                <div class="card__content">
                                    <div class="card__information">
                                        <h3 class="card__heading">
                                            <a :href="'/products/' + product.handle + (product.variants.length > 0 ? '?variant=' + returnVariant(product.variants).id : '')"

                                               class="full-unstyled-link"
                                            >
                                                {{ product.title }}
                                            </a>
                                        </h3>
                                    </div>
                                    <div class="card__badge bottom left"></div>
                                </div>
                            </div>
                            <div class="card__content">
                                <div class="card__information">
                                    <h3 class="card__heading h5">
                                        <a :href="'/products/' + product.handle + (product.variants.length > 0 ? '?variant=' + returnVariant(product.variants).id : '')"


                                           class="full-unstyled-link"
                                        >
                                            {{ product.title }}
                                        </a>
                                    </h3>
                                    <div class="card-information"><span class="caption-large light"></span>
                                        <div class="
                                                price ">
                                            <div class="price__container">
                                                <div class="price__regular">
                                                    <span
                                                        class="visually-hidden visually-hidden--inline">Regular price</span>
                                                    <span class="price-item price-item--regular">
                                                        ${{ returnVariant(product.variants).price }} {{ currency }}
                                                      </span>
                                                </div>
                                                <div class="price__sale">
                                                    <span
                                                        class="visually-hidden visually-hidden--inline">Regular price</span>
                                                    <span>
                                                      <s class="price-item price-item--regular">



                                                      </s>
                                                    </span><span class="visually-hidden visually-hidden--inline">Sale price</span>
                                                    <span class="price-item price-item--sale price-item--last">
                                                    ${{ returnVariant(product.variants).price }} {{ currency }}
                                                  </span>
                                                </div>
                                                <small class="unit-price caption hidden">
                                                    <span class="visually-hidden">Unit price</span>
                                                    <span class="price-item price-item--last">
                                                    <span></span>
                                                    <span aria-hidden="true">/</span>
                                                    <span class="visually-hidden">&nbsp;per&nbsp;</span>
                                                    <span>
                                                    </span>
                                                  </span>
                                                </small>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="card__badge bottom left"></div>
                            </div>
                        </div>
                    </div>
                </li>

            </ul>
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