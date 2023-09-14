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
let MainFrame = document.getElementById('MainContent')

if (window.location.href.includes('/collections/')) {
    let collection = document.createElement('div');
    collection.id = "nest-something-id"
    collection.style.display = 'flex'
    collection.style.justifyContent = 'center'
    MainFrame.appendChild(collection)
    if (collection) {
        createApp({
            name: 'Collection', render: () => {
                return h(ShopifyCollection, {
                    data: {
                        currency: Shopify.currency.active,
                        currency_rate: parseFloat(Shopify.currency.rate),
                        country_code: Shopify.country,
                        locale: Shopify.locale
                    }
                })
            }
        }).component("font-awesome-icon", FontAwesomeIcon).use(Antd).mount(collection)
    }
}


// function CaptureFetch(ns, fetch) {
//     if (typeof fetch !== 'function') return;
//     ns.fetch = function () {
//         var out = fetch.apply(this, arguments);
//         var oldURL = arguments[Object.keys(arguments)[0]]
//         var index = oldURL.indexOf('?')
//         var newURL = oldURL
//
//         if (index != -1) {
//             newURL = oldURL.substring(0, index);
//         }
//         out.then(({ok}) => {
//             if (ok) {
//                 if (["/cart/add.js", "/cart/update.js", "/cart/change.js", "/cart/clear.js",].includes(newURL)) {
//                     getAjaxCart()
//                 }
//             }
//         })
//         return out;
//     }
// }