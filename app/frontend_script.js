import {createApp, h} from 'vue/dist/vue.esm-bundler'
import ShopifyCollection from "./ShopifyCollection.vue";
import CartPreview from "./component/cart_preview.vue"
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import {fas} from '@fortawesome/free-solid-svg-icons'
import {library} from '@fortawesome/fontawesome-svg-core'
import {far} from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';

library.add(fas, far)

window.findProductContainer = function () {
    var liElements = document.querySelectorAll('li');
    var articleElements = document.querySelectorAll('article');
    let element = null
    var hasProductLinkInLi = Array.from(liElements).some(function (li) {
        var anchor = li.querySelector("a[href*='/products/']");
        if (anchor !== null) {
            element = li
            return !(anchor.classList.contains('product-single__thumbnail') || anchor.classList.contains('product-slideshow__open'));
        }

    });

    var hasProductLinkInArticle = Array.from(articleElements).some(function (article) {
        var anchor = article.querySelector("a[href*='/products/']");
        if (anchor !== null) {
            if (element === null) {
                element = article
            }
            return !(anchor.classList.contains('product-single__thumbnail') || anchor.classList.contains('product-slideshow__open'));
        }
    });
    if (hasProductLinkInLi) {
        return element
    } else if (hasProductLinkInArticle) {
        return element
    } else {
        // get the selector in backend
    }
}


window.captureElement = function () {
    if (window.location.href.includes('/collections/')) {
        let element = window.findProductContainer()
        let screen_type = ''
        let parent_attribute = []

        for (let i = 0; i < element.parentElement.attributes.length; i++) {
            var varName = element.parentElement.attributes.item(i).name;
            var dict = {};
            dict[varName] = element.parentElement.attributes.item(i).value;
            parent_attribute.push(dict)
        }
        axios.post('/apps/nestbundle/save_theme', {
            jsonrpc: '2.0',
            params: {

                screen_type: screen_type,
                theme: Shopify.theme,
                store_url: window.location.hostname,
                contain_class: parent_attribute,
                child_class: element.outerHTML,
            }
        }).then(res => {
            if (res.data.result.code === 0) {


            }
        }).catch(error => {
        })
        return {
            screen_type: screen_type,
            theme: Shopify.theme,
            store_url: window.location.hostname,
            contain_class: parent_attribute,
            child_class: element.outerHTML,
        }
    }
}

if (window.location.href.includes('/collections/')) {
    let self = this
    let flag = false
    let data = null
    await axios.post('/apps/nestbundle/get_theme', {
        jsonrpc: '2.0',
        params: {
            store_url: window.location.hostname,
        }
    }).then(res => {
        if (res.data.result.code === 0) {
            self.flag = true
            self.data = res.data.result
        } else {

        }
    }).catch(error => {
    })

    if (flag === false) {
        data = window.captureElement()
    }

    let MainFrame = document.getElementById('nsd-main-container')
    if (MainFrame) {

     var collection =   createApp({
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



