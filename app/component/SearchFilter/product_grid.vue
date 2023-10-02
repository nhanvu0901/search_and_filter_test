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

    editListProductVariable(outer_html, list_attribute, product) {
      //Step 1 : change all the image url,get the tag of the elememt
      let variant = this.returnVariant(product.variants)
      let parser = new DOMParser();
      let doc = parser.parseFromString(outer_html, 'text/html');

      let container_element = doc.documentElement.children[1].firstChild
      let anchor = container_element.querySelectorAll("a[href*='/products/']");
      if (anchor.length > 1) {
        for (let i = 0; i < anchor.length; i++) {
          anchor[i].href = window.location.origin + "/products/" + product.handle
          anchor[i].textContent = product.title
        }
      } else {
        anchor.href = window.location.origin + "/products/" + product.handle
      }
      let image_list = container_element.getElementsByTagName("img");

      for (let i = 0; i < image_list.length; i++) {

        image_list[i].srcset = product.img_src + "&amp;width=165 165w," + product.img_src + "&amp;width=360 360w," + product.img_src + " 466w"
        image_list[i].src = product.img_src + "&amp;width=533"
        image_list[i].alt = product.title
      }
      //fix the list_attribute

      for (let i = 0; i < list_attribute.length; i++) {
        let parentElement = doc.querySelectorAll(list_attribute[i].parent.type + "." + list_attribute[i].parent.attribute[0].class)
        for (let j = 0; j < parentElement.length; j++) {
          // if (parentElement[j].children.length === 1) {
            let childElement = parentElement[j].querySelector(list_attribute[i].child.type + "." + list_attribute[i].child.attribute[0].class.replace(/\s/g, "."));

            if (list_attribute[i].key === 'title') {
              childElement.textContent = product.title
            } else if (list_attribute[i].key.includes('price')) {
              childElement.textContent = "$" + variant.price
            }
          // }

        }


      }

      return container_element.outerHTML
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

      for (let item in this.product_list) {
        let new_edit_outterHTML = this.editListProductVariable(data_theme.child_class, JSON.parse(data_theme.list_attribute), this.product_list[item])
        generate_contain_class.insertAdjacentHTML('afterbegin', new_edit_outterHTML)
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

