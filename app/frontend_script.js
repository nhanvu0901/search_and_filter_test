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


window.findStyle = function () {
    if (document.getElementById('nsd-main-container')) {
        let div = document.getElementById('nsd-main-container')
        return div.nextElementSibling.querySelectorAll('link[type="text/css"][rel="stylesheet"], style')
    }
}

function generate(data_theme) {
    window.data_theme = data_theme
    let MainFrame = document.getElementById('nsd-main-container')
    let style_list = JSON.parse(data_theme.style)
    for (let i = 0; i < style_list.length; i++) {
        let tag = null
        if (Object.keys(style_list[i])[0] === 'link') {
            tag = document.createElement('link')
            tag.href = style_list[i].link

        } else {
            tag = document.createElement('style')
            tag.insertAdjacentHTML('beforeend', style_list[i].style)
        }
        MainFrame.appendChild(tag)
    }
    if (MainFrame) {
        let main = document.createElement('div')
        main.id = 'nsd-main'
        MainFrame.appendChild(main)
        createApp({
            name: 'Collection', render: () => {
                return h(ShopifyCollection, {})
            }
        }).component("font-awesome-icon", FontAwesomeIcon).use(Antd).mount(main)
    }
}

window.captureElement = async function (list_attribute, element) {
    if (window.location.href.includes('/collections/')) {


        let screen_type = ''
        let parent_attribute = []
        let save_style = []

        let style_list = window.findStyle()

        for (let i = 0; i < element.parentElement.attributes.length; i++) {
            var varName = element.parentElement.attributes.item(i).name;
            var dict = {};
            dict[varName] = element.parentElement.attributes.item(i).value;
            parent_attribute.push(dict)
        }
        let parent_class = {
            type: element.parentElement.localName,
            class: parent_attribute
        }
        for (let i = 0; i < style_list.length; i++) {
            var varName = style_list.item(i).localName;
            var dict = {};
            if (style_list.item(i).localName === 'link') {
                dict[varName] = style_list.item(i).href;
            } else {
                dict[varName] = style_list.item(i).outerHTML;
            }

            save_style.push(dict)
        }
        await axios.post('/apps/nestbundle/save_theme', {
            jsonrpc: '2.0',
            params: {

                screen_type: screen_type,
                theme: Shopify.theme,
                store_url: window.location.hostname,
                contain_class: JSON.stringify(parent_class),
                child_class: element.outerHTML,
                style: JSON.stringify(save_style),
                list_attribute: JSON.stringify(list_attribute)
            }
        }).then(res => {
            if (res.data.result !== null) {

                generate(res.data.result)
            }
        }).catch(error => {
        })

    }
}

function make_list_attr(object_attr) {
    let parent_attribute = []
    for (let i = 0; i < object_attr.length; i++) {
        var varName = object_attr.item(i).name;
        var dict = {};
        dict[varName] = object_attr.item(i).value;
        parent_attribute.push(dict)
    }
    return parent_attribute
}

function containsString(element, searchString) {
    let parent_attribute = []
    if (element.textContent !== null) {
        if (element.textContent.includes(searchString) && element.children.length === 0) {

            for (let i = 0; i < element.attributes.length; i++) {
                var varName = element.attributes.item(i).name;
                var dict = {};
                dict[varName] = element.attributes.item(i).value;
                parent_attribute.push(dict)
            }
            return parent_attribute
        }
    }
    for (let i = 0; i < element.children.length; i++) {
        if (containsString(element.children[i], searchString)) {
            for (let i = 0; i < element.attributes.length; i++) {
                var varName = element.attributes.item(i).name;
                var dict = {};
                dict[varName] = element.attributes.item(i).value;
                parent_attribute.push(dict)
            }
            return parent_attribute

        }
    }
    return false;
}

window.getVariableHTMl = async function () {
    let element = window.findProductContainer()
    let element_outerHTML = element.outerHTML
    let parser = new DOMParser();
    let outterHTML = parser.parseFromString(element_outerHTML, 'text/html');
    let url = ''
    const elements = outterHTML.querySelector("a[href*='/products/']");
    let list_attribute = []

    if (elements) {

        await axios.get(window.location.origin + elements.attributes.href.value + ".js").then(res => {
            if (res.data !== null) {

                for (let key in res.data) {
                    let find_variable = containsString(outterHTML, res.data[key])
                    if (find_variable !== false) {
                        list_attribute.push({
                            key: key,
                            positions: find_variable
                        });
                    }
                }
                window.captureElement(list_attribute, element)
            }
        }).catch(error => {
        })

    }
}


if (window.location.href.includes('/collections/')) {
    let self = this
    let flag = false
    let data_theme = null
    await axios.post('/apps/nestbundle/get_theme', {
        jsonrpc: '2.0',
        params: {
            store_url: window.location.hostname,
        }
    }).then(res => {
        if (res.data.result !== false) {
            flag = true
            data_theme = res.data.result
            generate(data_theme)
        } else {

        }
    }).catch(error => {
    })

    if (flag === false) {
        window.getVariableHTMl()

    }


}



