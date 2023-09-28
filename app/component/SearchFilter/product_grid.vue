<template>
     <div v-html="generateGrid()"></div>

    <!--    <div class="product-grid-container" id="ProductGridContainer">-->
    <!--        <div class="collection page-width">-->
    <!--            <div class="loading-overlay gradient"></div>-->
    <!--            <ul data-settings="{&quot;products_per_page&quot;:20,&quot;columns_desktop&quot;:4,&quot;image_ratio&quot;:&quot;adapt&quot;,&quot;image_shape&quot;:&quot;default&quot;,&quot;show_secondary_image&quot;:true,&quot;show_vendor&quot;:false,&quot;show_rating&quot;:false,&quot;enable_quick_add&quot;:false,&quot;enable_filtering&quot;:false,&quot;filter_type&quot;:&quot;horizontal&quot;,&quot;enable_sorting&quot;:false,&quot;columns_mobile&quot;:&quot;2&quot;,&quot;padding_top&quot;:0,&quot;padding_bottom&quot;:68}"-->
    <!--                id="gf-products" class="-->
    <!--                grid product-grid grid&#45;&#45;2-col-tablet-down-->
    <!--                grid&#45;&#45;4-col-desktop"-->
    <!--                old-id="product-grid" style="min-height: auto;">-->
    <!--                <li class="grid__item" v-for="product in product_list">-->
    <!--                    <div class="card-wrapper product-card-wrapper underline-links-hover">-->
    <!--                        <div class="card-->
    <!--                                  card&#45;&#45;card-->
    <!--                                   card&#45;&#45;media-->
    <!--                                   color-[object Object]-->

    <!--                                  " style="&#45;&#45;ratio-percent: 100%;">-->
    <!--                            <div class="card__inner  ratio" style="&#45;&#45;ratio-percent: 100%;">-->
    <!--                                <div class="card__media">-->
    <!--                                    <div class="media media&#45;&#45;transparent media&#45;&#45;hover-effect">-->
    <!--                                        <img-->
    <!--                                            :src="product.img_src"-->
    <!--                                            sizes="(min-width: 1200px) 267px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"-->
    <!--                                            alt="" class="motion-reduce" width="549" height="549"></div>-->
    <!--                                </div>-->

    <!--                            </div>-->
    <!--                            <div class="card__content">-->
    <!--                                <div class="card__information">-->
    <!--                                    <h3 class="card__heading h5">-->
    <!--                                        <a :href="'/products/' + product.handle + (product.variants.length > 0 ? '?variant=' + returnVariant(product.variants).id : '')"-->

    <!--                                           class="full-unstyled-link"-->
    <!--                                           >-->
    <!--                                            {{product.title}}-->
    <!--                                        </a>-->
    <!--                                    </h3>-->
    <!--                                    <div class="card-information">-->
    <!--                                        <div class="price">-->
    <!--                                            <div class="price__container">-->
    <!--                                                <div class="price__regular">-->
    <!--                                                    <span-->
    <!--                                                        class="visually-hidden visually-hidden&#45;&#45;inline">Regular price</span>-->
    <!--                                                    <span class="price-item price-item&#45;&#45;regular">-->
    <!--                                      ${{ returnVariant(product.variants).price }} {{ currency }}-->
    <!--                                    </span>-->
    <!--                                                </div>-->
    <!--                                                <div class="price__sale"><span-->
    <!--                                                    class="visually-hidden visually-hidden&#45;&#45;inline">Regular price</span>-->
    <!--                                                    <span>-->
    <!--                                      <s class="price-item price-item&#45;&#45;regular">  $0 SGD  </s>-->
    <!--                                    </span><span class="visually-hidden visually-hidden&#45;&#45;inline">Sale price</span>-->
    <!--                                                    <span class="price-item price-item&#45;&#45;sale price-item&#45;&#45;last">-->
    <!--                                      ${{ returnVariant(product.variants).price }} {{ currency }}-->
    <!--                                    </span>-->
    <!--                                                </div>-->
    <!--                                            </div>-->
    <!--                                        </div>-->
    <!--                                    </div>-->
    <!--                                </div>-->
    <!--                                <div class="card__badge bottom left"></div>-->
    <!--                            </div>-->
    <!--                        </div>-->
    <!--                    </div>-->
    <!--                </li>-->
    <!--            </ul>-->
    <!--        </div>-->
    <!--    </div>-->
</template>
<script setup>

</script>
<script>


export default {
    name: "ProductGrid",
    emits: [],
    props: {
        product_list: Array,


    },
    data() {
        return {
            currency: null,
            style_theme: null,
            htmlContent: null
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
        },
        editListProductVariable(outer_html){

        },
        generateGrid() {
            let div_main = document.createElement('div')
            div_main.id = 'nds-main-grid'
            let data_theme = window.data_theme
            let generate_contain_class = document.createElement(JSON.parse(data_theme.contain_class).type)
            let attributesArray = JSON.parse(data_theme.contain_class).class
            attributesArray.forEach(function (attributeObject) {
                for (let key in attributeObject) {
                    generate_contain_class.setAttribute(key, attributeObject[key]);
                }
            });
            this.editListProductVariable(data_theme.child_class,)
            for(let item in this.product_list){

                generate_contain_class.insertAdjacentHTML('afterbegin', data_theme.child_class)
            }












            div_main.appendChild(generate_contain_class)
            return div_main.outerHTML
        },

    },

    mounted() {
        this.currency = Shopify.currency.active
        this.style_theme = window.data_theme
    }
}
</script>

