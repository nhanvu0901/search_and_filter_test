import {createApp, h} from 'vue/dist/vue.esm-bundler'
import ShopifyCollection from "./ShopifyCollection.vue";
import CartPreview from "./component/cart_preview.vue"
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {fas} from '@fortawesome/free-solid-svg-icons'
import {library} from '@fortawesome/fontawesome-svg-core'
import {far} from '@fortawesome/free-regular-svg-icons'
import * as events from "events";

library.add(fas, far)
window.captureElement = function () {
    if (meta.page.pageType === 'home' || meta.page.pageType === 'collection') {
        var liElements = document.querySelectorAll('li');
        var articleElements = document.querySelectorAll('article');

        var hasProductLinkInLi = Array.from(liElements).some(function (li) {
            var anchor = li.querySelector("a[href*='/products/']");
            if (anchor !== null) {
                return !(anchor.classList.contains('product-single__thumbnail') || anchor.classList.contains('product-slideshow__open'));
            }

        });

        var hasProductLinkInArticle = Array.from(articleElements).some(function (article) {
            var anchor = article.querySelector("a[href*='/products/']");
            if (anchor !== null) {
                return !(anchor.classList.contains('product-single__thumbnail') || anchor.classList.contains('product-slideshow__open'));
            }
        });

        if (hasProductLinkInLi) {

        } else if (hasProductLinkInArticle) {
            // do something else
        } else {
            // do another thing
        }
    }
}

if (window.location.href.includes('/collections/')) {
    setTimeout(window.captureElement(), 1000);

    // let MainFrame = document.getElementById('MainContent')
    // if (MainFrame) {
    //     let productGrid = MainFrame.querySelector('[id*="product-grid"]')
    //     if (productGrid) {
    //         let remove_element = productGrid.lastElementChild
    //         remove_element.remove()
    //         let collection = document.createElement('div');
    //         collection.id = "nest-something-id"
    //         collection.style.display = 'flex'
    //         collection.style.justifyContent = 'center'
    //         collection.style.width = "100%"
    //         productGrid.appendChild(collection)
    //         if (collection) {
    //             createApp({
    //                 name: 'Collection', render: () => {
    //                     return h(ShopifyCollection, {
    //                         data: {
    //                             currency: Shopify.currency.active,
    //                             currency_rate: parseFloat(Shopify.currency.rate),
    //                             country_code: Shopify.country,
    //                             locale: Shopify.locale
    //                         }
    //                     })
    //                 }
    //             }).component("font-awesome-icon", FontAwesomeIcon).use(Antd).mount(collection)
    //         }
    //     }
    // }


}



