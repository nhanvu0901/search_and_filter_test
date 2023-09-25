// ========================================================================= LOADING FILE======================================================================
// ============================================================================================================================================================
function initJQuery(e) {
    var t;
    "undefined" == typeof jQuery ? ((t = document.createElement("SCRIPT")).src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js", t.type = "text/javascript", t.onload = e, document.head.appendChild(t)) : e()
}

function isMobileDevice() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}


function initCss(e) {
    var style_css = document.createElement("link");
    style_css.setAttribute("rel", "stylesheet"), style_css.setAttribute("type", "text/css"), style_css.onload = e, style_css.setAttribute("href", "https://apps.allfetch.com/s_shopify_sticky_add_to_cart/static/src/css/style_css_frontend_v3_16.css"), document.head.appendChild(style_css);
}

function allfetchWAPGetShopify() {
    if (null != window.Shopify) return window.Shopify.shop;
    var e = window.location.href;
    return (e.indexOf("://") > -1 ? e.split("/")[2] : e.split("/")[0]).split(":")[0];
}


//=============================================================================================================================================================================
//=============================================================================================================================================================================


var productDetail = [];
//===================================================================== MAIN FUNCTION ==========================================================================================
//==============================================================================================================================================================================
var miniCartDetail = [];
var SettingCurrency = '';
var stickyCart = [];

var barSetting = []

var quickAddToCartSetting = []

var shopPlan = ''

var data_parse;
window.allfetchstickycart = function () {
    //Check when your page is PRODUCT function will call product.json to get product detail
    if (window.location.pathname.match("(.*)/products/(.*)") || window.location.pathname.match("(.*)/products")) {
        let url = window.location.href;
        // Exception url product to check it always get name product is right
        url = url.split('/')
        let product = url[url.length - 1];
        let product_url = window.location.href;
        if (product.indexOf('?') != -1) {
            product = product.replace('?', '_');
            product_url = product.split('_')[0];
        }
        if (product.indexOf('#') != -1) {
            product = product.replace('#', '_');
            product_url = product.split('_')[0];
        }

        // Call API to get data of product
        jQuery.ajax({
            type: "GET",
            url: product_url + '.json',
            data: JSON.stringify({}),
            error: function (request, error) {
            },
            complete(data) {
                // return data of product detail
                try {
                    productDetail = JSON.parse(data["responseText"])['product'];
                } catch (e) {
                    console.info(e);
                    return;
                }
            }, async: false,
        });
    }

    if ($('#admin-bar-iframe')) {
        $('#admin-bar-iframe').hide();
    }
    window.miniCartDetail = [];
    var shop_origin = ''
    typeof window.Shopify.shop != "undefined" ? shop_origin = window.Shopify.shop : false

    // Function call call to url in odoo to get data sticky bar, sticky cart, mini cart....
    jQuery.ajax({
        type: "POST",
        url: 'https://apps.allfetch.com/fetch_data_sticky/' + shop_origin,
        data: JSON.stringify({}),
        contentType: "application/json",
        error: function (request, error) {
            console.log(error)
        },
        complete(data) {
            var data_parse = JSON.parse(data["responseText"])['result'];
            String.prototype.decodeHTML = function () {
                var map = {"gt": ">" /* , … */};
                return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
                    if ($1[0] === "#") {
                        return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16) : parseInt($1.substr(1), 10));
                    } else {
                        return map.hasOwnProperty($1) ? map[$1] : $0;
                    }
                });
            };
            data_parse = JSON.parse(data["responseText"])['result'];
            barSetting = data_parse[0];
            miniCartDetail = data_parse[1];
            window.stickyCart = data_parse[2];
            quickAddToCartSetting = data_parse[3];
            shopPlan = data_parse[4];
            window.SettingCurrency = data_parse[5];
            // if (window.location.pathname.match("(.*)/products/(.*)") || window.location.pathname.match("(.*)/products")) {
            view_success_popup();
            view_outofstock_popup();
            // }

            if (!isMobileDevice()) {
                if (window.stickyCart['is_enable_for_desktop']) {
                    get_data_cart_in_view_mini(miniCartDetail, window.stickyCart, window.SettingCurrency);
                }
                if (window.location.pathname.match("(.*)/products/(.*)") || window.location.pathname.match("(.*)/products")) {
                    if (barSetting['is_enable_for_desktop']) {
                        if (barSetting['timer']) {
                            setTimeout(function () {
                                view_slide_bar_cart(productDetail, barSetting, window.SettingCurrency);
                                if (barSetting['scroll_bar'] == 'only_add_to_cart' || barSetting['scroll_bar'] == 'display_custom') {
                                    var position = 0
                                    var type = ''
                                    if (barSetting['scroll_bar'] == 'display_custom') {
                                        position = parseInt(barSetting['setting_custom_bar'])
                                        type = 'display_custom'
                                    }
                                    window.addEventListener('scroll', function () {
                                        scrollFunction(position, type);
                                    });
                                } else {
                                    if (barSetting['position'] != 'mgn-stickybar') {
                                        showStickyBar()
                                    } else {
                                        window.addEventListener('scroll', function () {
                                            if ($('.site-header').height() < document.documentElement.scrollTop) {

                                                showStickyBar()
                                            } else {
                                                hideStickyBar()
                                            }
                                        });
                                    }
                                }

                            }, parseInt(barSetting['timer']) * 1000);
                        }
                    }
                } else if (window.location.pathname === '/' && barSetting['enable_bar_home_page'] && barSetting['url_link_product']) {
                    jQuery.ajax({
                        type: "GET",
                        url: barSetting['url_link_product'].toString() + '.json',
                        data: JSON.stringify({}),
                        error: function (request, error) {
                        },
                        complete(data) {
                            // return data of product detail
                            try {
                                productDetail = JSON.parse(data["responseText"])['product'];
                            } catch (e) {
                                console.info(e);
                                return;
                            }
                            if (barSetting['is_enable_for_desktop']) {
                                if (barSetting['timer']) {
                                    setTimeout(function () {
                                        view_slide_bar_cart(productDetail, barSetting, window.SettingCurrency);
                                        if (barSetting['scroll_bar'] == 'only_add_to_cart' || barSetting['scroll_bar'] == 'display_custom') {
                                            var position = 0
                                            var type = ''
                                            if (barSetting['scroll_bar'] == 'display_custom') {
                                                position = parseInt(barSetting['setting_custom_bar'])
                                                type = 'display_custom'
                                            }
                                            window.addEventListener('scroll', function () {
                                                scrollFunction(position, type);
                                            });
                                        } else {
                                            if (barSetting['position'] != 'mgn-stickybar') {
                                                showStickyBar()
                                            } else {
                                                window.addEventListener('scroll', function () {
                                                    if ($('.site-header').height() < document.documentElement.scrollTop) {
                                                        showStickyBar()
                                                    } else {
                                                        hideStickyBar()
                                                    }
                                                });
                                            }
                                        }
                                    }, parseInt(barSetting['timer']) * 1000);
                                }
                            }
                        }, async: false,
                    });
                }

            }
            if (isMobileDevice()) {
                if (window.stickyCart['is_enable_for_mobile']) {
                    get_data_cart_in_view_mini(miniCartDetail, window.stickyCart, window.SettingCurrency);
                }

                if (barSetting['is_enable_for_mobile']) {
                    if (window.location.pathname.match("(.*)/products/(.*)") || window.location.pathname.match("(.*)/products")) {
                        if (barSetting['timer']) {
                            setTimeout(function () {
                                view_slide_bar_cart(productDetail, barSetting, window.SettingCurrency);
                                if (barSetting['scroll_bar'] == 'only_add_to_cart' || barSetting['scroll_bar'] == 'display_custom') {
                                    var position = 0
                                    var type = ''
                                    if (barSetting['scroll_bar'] == 'display_custom') {
                                        position = parseInt(barSetting['setting_custom_bar'])
                                        type = 'display_custom'
                                    }
                                    window.addEventListener('scroll', function () {
                                        scrollFunction(position, type);
                                    });
                                } else {
                                    if (barSetting['position'] != 'mgn-stickybar') {
                                        showStickyBar()
                                    } else {
                                        window.addEventListener('scroll', function () {
                                            if ($('.site-header').height() < document.documentElement.scrollTop) {

                                                showStickyBar()
                                            } else {
                                                hideStickyBar()
                                            }
                                        });
                                    }
                                }

                            }, parseInt(barSetting['timer']) * 1000);
                        }
                    }
                    if (window.location.pathname === '/' && barSetting['enable_bar_home_page'] && barSetting['url_link_product']) {
                        jQuery.ajax({
                            type: "GET",
                            url: barSetting['url_link_product'].toString() + '.json',
                            data: JSON.stringify({}),
                            error: function (request, error) {
                            },
                            complete(data) {
                                // return data of product detail
                                try {
                                    productDetail = JSON.parse(data["responseText"])['product'];
                                } catch (e) {
                                    console.info(e);
                                    return;
                                }
                                setTimeout(function () {
                                    view_slide_bar_cart(productDetail, barSetting, window.SettingCurrency);
                                    if (barSetting['scroll_bar'] == 'only_add_to_cart' || barSetting['scroll_bar'] == 'display_custom') {
                                        var position = 0
                                        var type = ''
                                        if (barSetting['scroll_bar'] == 'display_custom') {
                                            position = parseInt(barSetting['setting_custom_bar'])
                                            type = 'display_custom'
                                        }
                                        window.addEventListener('scroll', function () {
                                            scrollFunction(position, type);
                                        });
                                    } else {
                                        if (barSetting['position'] != 'mgn-stickybar') {
                                            showStickyBar()
                                        } else {
                                            window.addEventListener('scroll', function () {
                                                if ($('.site-header').height() < document.documentElement.scrollTop) {
                                                    showStickyBar()
                                                } else {
                                                    hideStickyBar()
                                                }
                                            });
                                        }
                                    }
                                }, parseInt(barSetting['timer']) * 1000);
                            }
                        });
                    }
                }
                // Phần này sửa lỗi menu dành riêng cho theme Impulse trên điện thoại
                if (Shopify.theme.name == 'Impulse') {
                    $("[data-type=menu]").each(function () {
                        var parent = this
                        $(this).find('.footer__title.collapsible-trigger').click(function () {
                            var height = ($(parent).find("li").length) * $($(parent).find("li")[0]).height()
                            $(parent).find('.collapsible-content.collapsible-content--small').height(height)
                        })
                    })
                }
            }

            initListenAddToCart()
        }
    });
}
window.allfetchQuickAddToCartHover = function () {
    if (meta.page.pageType === 'home' || meta.page.pageType === 'collection') {
        if (isMobileDevice()) {
            if ($('body').find('.qatc-blur').length === 0) {
                setQatcMobileBar()
            }
        }
        var selector = quickAddToCartSetting['position_selector']
        if (selector == false) {
            $("a[href*='/products/']").not('.product-single__thumbnail, .product-slideshow__open').each(function () {
                var product_url = jQuery(this).attr('href')
                var handle = product_url.split('/products/')[1];
                handle = strip_handle(handle);
                setQatcWrapperHover(this, handle, product_url)
            })
        } else {
            $(selector).each(function () {
                var hyperlink_tag = $(this).find("a[href*='/products/']").not('.product-single__thumbnail, .product-slideshow__open')
                var product_url = $(hyperlink_tag).attr('href')
                var handle = product_url.split('/products/')[1];
                handle = strip_handle(handle);
                setQatcWrapperHover(this, handle, product_url)
            })
        }
    }
}

function setQatcMobileBar() {
    var btn_atc_mobile = '', noti_bar_mobile = '', warning_bar_mobile = '';
    if (quickAddToCartSetting['enable_button_atc'] == true) {
        btn_atc_mobile = '<div class="quick-add-btn-wrapper-under atc-wrapper-bar btn-wrapper-bar">\n' +
            '           <button class="real-atc-btn" style="color: ' + quickAddToCartSetting['add_to_cart_btn_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['add_to_cart_btn_background_color'] + '; padding: 0px">' + quickAddToCartSetting['add_to_cart_btn_text'] + '</button>\n' +
            '      </div>\n';

        noti_bar_mobile = '<div class="quick-add-btn-wrapper-under noti-wrapper-bar btn-wrapper-bar" style="display: none;">\n' +
            '            <button disabled class="noti-bar" style="color: ' + quickAddToCartSetting['noti_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['noti_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['noti_bar_text'] + '</button>\n' +
            '     </div>\n';

        warning_bar_mobile = '<div class="quick-add-btn-wrapper-under warning-wrapper-bar btn-wrapper-bar" style="display: none;">\n' +
            '            <button disabled class="warning-bar" style="color: ' + quickAddToCartSetting['warning_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['warning_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['warning_bar_text'] + '</button>\n' +
            '     </div>\n';
    }
    var mobile_qatc_bar = '                   <div class="qatc-blur" style="display: none"></div>\n' +
        '                   <div class="quick-add-to-cart-wrapper-bar" style="display: none">\n' +
        '                       <div class="quick-add-to-cart-elements-wrapper-bar">\n' +
        '                           <div class="qatc-bar" style="background: #fff; display: block;">\n' +
        '                               <div class="qatc-bar-content">\n' +
        '                                   <div class="qatc-product-info" style="">\n' +
        '                                       <div class="qatc-product-photo" style="">\n' +
        '                                           <div style="width: 60px; height: 60px">\n' +
        '                                               <img class="qatc-product-image-bar"\n' +
        '                                                   alt="">\n' +
        '                                           </div>\n' +
        '                                       </div>\n' +
        '                                       <div class="qtc-product-details">\n' +
        '                                           <div class="qatc-product-name" style="">\n' +
        '                                               <span style="color: #000"></span>\n' +
        '                                           </div>\n' +
        '                                           <div class="qatc-product-price" style="">\n' +
        '                                               <span style="color: #000; margin-right: 40px;"></span>\n' +
        '                                               <a href="#" style="color: #000">View details</a>\n' +
        '                                           </div>\n' +
        '                                       </div>\n' +
        '                                       <div class="qtc-product-close">\n' +
        '                                           <span>X</span>\n' +
        '                                       </div>\n' +
        '                                   </div>\n' +
        '                                   <div class="variant-qty-wrapper-bar">\n' +
        '                                       <div class="product-variants-wrapper-bar">\n' +
        '                                           <select class="product-variants-bar">\n' +
        '                                           </select>\n' +
        '                                       </div>\n' +
        '                                       <div class="product-qty-wrapper-bar" style="">\n' +
        '                                           <button class="qty-btn qtyminus-under qatc-minus">-</button>\n' +
        '                                           <input class="input_qty_product_under" type="number" min="1" value="1">\n' +
        '                                           <button class="qty-btn qtyplus-under qatc-plus">+</button>\n' +
        '                                       </div>\n' +
        '                                   </div>\n' +
        '                                   <hr/>\n' + btn_atc_mobile + noti_bar_mobile + warning_bar_mobile +
        '                               </div>\n' +
        '                           </div>\n' +
        '                       </div>\n' +
        '                   </div>'
    $('body').append(mobile_qatc_bar)
}

function setQatcWrapperHover(product_wrapper, handle, product_url) {
    if (!isMobileDevice()) {
        setHoverDesktop(product_wrapper, handle, product_url)
    } else {
        setHoverMobile(product_wrapper, handle, product_url)
    }
}

function setHoverDesktop(product_wrapper, handle, product_url) {
    var parent = jQuery(product_wrapper).parent();
    var url_handle = window.location.href.split('/products/')[1];
    url_handle = strip_handle(url_handle);

    var btn_atc = '', btn_real_atc = '', btn_vp = '', noti_bar = '', warning_bar = '', atc_icon = '', atc_text = '',
        vp_icon = '', vp_text = '';
    var wrapper_height = 0;

    if (quickAddToCartSetting['detail_visibility'] == 'icon' || quickAddToCartSetting['detail_visibility'] == 'text_icon') {
        var viewBox, path;
        if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-cart") {
            viewBox = '0 -31 512.00033 512'
            path = '<path d="m166 300.003906h271.003906c6.710938 0 12.597656-4.4375 14.414063-10.882812l60.003906-210.003906c1.289063-4.527344.40625-9.390626-2.433594-13.152344-2.84375-3.75-7.265625-5.964844-11.984375-5.964844h-365.632812l-10.722656-48.25c-1.523438-6.871094-7.617188-11.75-14.648438-11.75h-91c-8.289062 0-15 6.710938-15 15 0 8.292969 6.710938 15 15 15h78.960938l54.167968 243.75c-15.9375 6.929688-27.128906 22.792969-27.128906 41.253906 0 24.8125 20.1875 45 45 45h271.003906c8.292969 0 15-6.707031 15-15 0-8.289062-6.707031-15-15-15h-271.003906c-8.261719 0-15-6.722656-15-15s6.738281-15 15-15zm0 0"/><path d="m151 405.003906c0 24.816406 20.1875 45 45.003906 45 24.8125 0 45-20.183594 45-45 0-24.8125-20.1875-45-45-45-24.816406 0-45.003906 20.1875-45.003906 45zm0 0"/><path d="m362.003906 405.003906c0 24.816406 20.1875 45 45 45 24.816406 0 45-20.183594 45-45 0-24.8125-20.183594-45-45-45-24.8125 0-45 20.1875-45 45zm0 0"/>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-bag") {
            viewBox = '0 0 279 279'
            path = '<path d="M262.421,270.339L246.466,72.896C246.151,69.001,242.898,66,238.99,66h-42.833v-9.495C196.157,25.348,171.143,0,139.985,0  h-0.99c-31.157,0-56.838,25.348-56.838,56.505V66H39.99c-3.908,0-7.161,3.001-7.476,6.896l-16,198  c-0.169,2.088,0.543,4.15,1.963,5.689S21.897,279,23.99,279h231c0.006,0,0.014,0,0.02,0c4.143,0,7.5-3.357,7.5-7.5  C262.51,271.105,262.48,270.717,262.421,270.339z M97.157,56.505C97.157,33.619,116.109,15,138.995,15h0.99  c22.886,0,41.172,18.619,41.172,41.505V66h-84V56.505z"/>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-basket") {
            viewBox = '0 0 576 512'
            path = '<path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z" class=""></path>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-cart-plus") {
            viewBox = '0 0 576 512'
            path = '<path  d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z"/>'
        } else {
            viewBox = '0 0 576 512'
            path = '<path d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z" class=""></path>'
        }
        atc_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="20px" stroke="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '" fill="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '">' +
            path +
            '</svg>'

        if (quickAddToCartSetting['view_product_icon'] == "fas fa-info-circle") {
            viewBox = '0 0 576 512'
            path = '<path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>'
        } else {
            viewBox = '0 0 576 512'
            path = '<path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" class=""></path>'
        }
        vp_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="20px" stroke="' + quickAddToCartSetting['view_product_btn_icon_color'] + '" fill="' + quickAddToCartSetting['view_product_btn_icon_color'] + '">' +
            path +
            '</svg>'
    }

    if (quickAddToCartSetting['detail_visibility'] == 'text' || quickAddToCartSetting['detail_visibility'] == 'text_icon') {
        atc_text = quickAddToCartSetting['add_to_cart_btn_text']
        vp_text = quickAddToCartSetting['view_product_btn_text']
    }

    if (quickAddToCartSetting['enable_button_atc'] == true) {
        btn_real_atc = '<div class="quick-add-btn-wrapper real-atc-btn-wrapper">\n' +
            '           <button class="real-atc-btn" style="color: ' + quickAddToCartSetting['add_to_cart_btn_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['add_to_cart_btn_background_color'] + '; padding: 0px">' + atc_icon + atc_text + '</button>\n' +
            '      </div>\n';

        btn_atc = '<div class="quick-add-btn-wrapper atc-btn-wrapper">\n' +
            '           <button class="atc-btn" style="color: ' + quickAddToCartSetting['add_to_cart_btn_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['add_to_cart_btn_background_color'] + '; padding: 0px">' + atc_icon + atc_text + '</button>\n' +
            '      </div>\n';

        noti_bar = '<div class="quick-add-btn-wrapper noti-bar-wrapper" style="display: none;">\n' +
            '            <button disabled class="noti-bar" style="color: ' + quickAddToCartSetting['noti_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['noti_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['noti_bar_text'] + '</button>\n' +
            '     </div>\n';

        warning_bar = '<div class="quick-add-btn-wrapper warning-bar-wrapper" style="display: none;">\n' +
            '            <button disabled class="warning-bar" style="color: ' + quickAddToCartSetting['warning_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['warning_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['warning_bar_text'] + '</button>\n' +
            '     </div>\n';
    }

    if (quickAddToCartSetting['enable_button_vp'] == true) {
        btn_vp = '<div class="quick-add-btn-wrapper vp-btn-wrapper">\n' +
            '            <button class="vp-btn" style="color: ' + quickAddToCartSetting['view_product_btn_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['view_product_btn_background_color'] + '; padding: 0px">' + vp_icon + vp_text + '</button>\n' +
            '     </div>\n';
    }

    var quickAddToCartWrapper = '<div class="quick-add-to-cart-wrapper" id="' + handle + 'qatc-wrapper" align="center">\n' +
        '                    <div class="quick-add-to-cart-elements-wrapper">\n' +
        '                        <div class="product-variants-wrapper" style="display: none;">\n' +
        '                            <select class="product-variants" id="' + handle + '_qatc-variants" style="background-color: #fff;">\n' +
        '                            </select>\n' +
        '                        </div>\n' +
        '                        <div class="product-qty-wrapper" data-product="' + handle + '">\n' +
        '                            <button class="qtyminus qty-btn qatc-minus" productname="' + handle + '" style="color: #000 !important; font-weight: lighter;">-</button>\n' +
        '                            <input type="number" class="qatc_input_qty_product" min="1" value="1" productname="' + handle + '" style="background-color: #fff;">\n' +
        '                            <button class="qtyplus qty-btn qatc-plus" productname="' + handle + '" style="color: #000 !important; font-weight: lighter;  ">+</button>\n' +
        '                        </div>\n' + btn_real_atc + btn_atc + btn_vp + noti_bar + warning_bar +
        '                    </div>\n' +
        '                </div>\n';

    if (handle != url_handle && !handle.match(/(\.jpg|\.png|\.gif)/)) {
        if ($(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
            if ($(product_wrapper).find('div.quick-add-to-cart-wrapper').length === 0) {
                try {
                    if (jQuery(product_wrapper).find(".jdgm-carousel-item__product-image").length === 0) {
                        jQuery(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").eq(0).before(quickAddToCartWrapper);
                    }
                } catch (e) {
                    if (jQuery(product_wrapper).find(".jdgm-carousel-item__product-image").length === 0) {
                        jQuery(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").before(quickAddToCartWrapper);
                    }
                }
            }
            wrapper_height = jQuery(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").height()
            set_quick_add_to_cart_size(product_wrapper, wrapper_height)
            hoverAndActionDesktop($(product_wrapper), handle, product_url)
        } else if ($(product_wrapper).find(".visually-hidden").length !== 0 || $(product_wrapper).find("noscript").length !== 0) {
            if (parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
                if (parent.find('.quick-add-to-cart-wrapper').length === 0) {
                    $(product_wrapper).css("z-index", 0);
                    parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").after(quickAddToCartWrapper);
                }
                wrapper_height = parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").height()
                set_quick_add_to_cart_size(parent, wrapper_height)
                hoverAndActionDesktop($(parent), handle, product_url)
            } else {
                if ($(product_wrapper).find('div.quick-add-to-cart-wrapper').length === 0) {
                    if ($(product_wrapper).find(".grid-product__image-mask").length !== 0) {
                        $(product_wrapper).find(".grid-product__image-mask").before(quickAddToCartWrapper);
                    } else {
                        $(product_wrapper).css("z-index", 0);
                        $(product_wrapper).find("img").after(quickAddToCartWrapper);
                    }
                }
                if ($(product_wrapper).find(".grid-product__image-mask").length !== 0) {
                    wrapper_height = $(product_wrapper).find(".grid-product__image-mask").height();
                    set_quick_add_to_cart_size(product_wrapper, wrapper_height)
                    hoverAndActionDesktop($(product_wrapper), handle, product_url)
                } else {
                    wrapper_height = $(product_wrapper).find("img").height();
                    set_quick_add_to_cart_size(product_wrapper, wrapper_height)
                    hoverAndActionDesktop($(product_wrapper), handle, product_url)
                }
            }
        } else if (parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
            if (parent.find('div.quick-add-to-cart-wrapper').length === 0) {
                parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").after(quickAddToCartWrapper);
            }
            wrapper_height = parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").height();
            set_quick_add_to_cart_size(parent, wrapper_height)
            hoverAndActionDesktop($(parent), handle, product_url)
        }
    }
}

function setHoverMobile(product_wrapper, handle, product_url) {
    var parent = jQuery(product_wrapper).parent();
    var url_handle = window.location.href.split('/products/')[1];
    url_handle = strip_handle(url_handle);

    var btn_atc_icon = '', btn_vp_icon = '', atc_icon = '', vp_icon = '';
    var mobile_wrapper_position = '';

    var viewBox, path;
    if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-cart") {
        viewBox = '0 -31 512.00033 512'
        path = '<path d="m166 300.003906h271.003906c6.710938 0 12.597656-4.4375 14.414063-10.882812l60.003906-210.003906c1.289063-4.527344.40625-9.390626-2.433594-13.152344-2.84375-3.75-7.265625-5.964844-11.984375-5.964844h-365.632812l-10.722656-48.25c-1.523438-6.871094-7.617188-11.75-14.648438-11.75h-91c-8.289062 0-15 6.710938-15 15 0 8.292969 6.710938 15 15 15h78.960938l54.167968 243.75c-15.9375 6.929688-27.128906 22.792969-27.128906 41.253906 0 24.8125 20.1875 45 45 45h271.003906c8.292969 0 15-6.707031 15-15 0-8.289062-6.707031-15-15-15h-271.003906c-8.261719 0-15-6.722656-15-15s6.738281-15 15-15zm0 0"/><path d="m151 405.003906c0 24.816406 20.1875 45 45.003906 45 24.8125 0 45-20.183594 45-45 0-24.8125-20.1875-45-45-45-24.816406 0-45.003906 20.1875-45.003906 45zm0 0"/><path d="m362.003906 405.003906c0 24.816406 20.1875 45 45 45 24.816406 0 45-20.183594 45-45 0-24.8125-20.183594-45-45-45-24.8125 0-45 20.1875-45 45zm0 0"/>'
    } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-bag") {
        viewBox = '0 0 279 279'
        path = '<path d="M262.421,270.339L246.466,72.896C246.151,69.001,242.898,66,238.99,66h-42.833v-9.495C196.157,25.348,171.143,0,139.985,0  h-0.99c-31.157,0-56.838,25.348-56.838,56.505V66H39.99c-3.908,0-7.161,3.001-7.476,6.896l-16,198  c-0.169,2.088,0.543,4.15,1.963,5.689S21.897,279,23.99,279h231c0.006,0,0.014,0,0.02,0c4.143,0,7.5-3.357,7.5-7.5  C262.51,271.105,262.48,270.717,262.421,270.339z M97.157,56.505C97.157,33.619,116.109,15,138.995,15h0.99  c22.886,0,41.172,18.619,41.172,41.505V66h-84V56.505z"/>'
    } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-basket") {
        viewBox = '0 0 576 512'
        path = '<path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z" class=""></path>'
    } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-cart-plus") {
        viewBox = '0 0 576 512'
        path = '<path  d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z"/>'
    } else {
        viewBox = '0 0 576 512'
        path = '<path d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z" class=""></path>'
    }
    atc_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="26px" stroke="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '" fill="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '">' +
        path +
        '</svg>'

    if (quickAddToCartSetting['view_product_icon'] == "fas fa-info-circle") {
        viewBox = '0 0 576 512'
        path = '<path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>'
    } else {
        viewBox = '0 0 576 512'
        path = '<path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" class=""></path>'
    }
    vp_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="26px" stroke="' + quickAddToCartSetting['view_product_btn_icon_color'] + '" fill="' + quickAddToCartSetting['view_product_btn_icon_color'] + '">' +
        path +
        '</svg>'

    if (quickAddToCartSetting['enable_button_atc'] == true) {
        btn_atc_icon = '<div class="quick-add-btn-wrapper atc-btn-wrapper">\n' +
            '           <button class="atc-icon" style="background-color: ' + quickAddToCartSetting['add_to_cart_btn_background_color'] + '">' + atc_icon + '</button>\n' +
            '      </div>\n';
    }

    if (quickAddToCartSetting['mobile_btn_position'] == 'top_left') {
        mobile_wrapper_position = 'top: 0; left: 0'
    } else if (quickAddToCartSetting['mobile_btn_position'] == 'top_right') {
        mobile_wrapper_position = 'top: 0; right: 0'
    } else if (quickAddToCartSetting['mobile_btn_position'] == 'bottom_left') {
        mobile_wrapper_position = 'bottom: 0; left: 0'
    } else if (quickAddToCartSetting['mobile_btn_position'] == 'bottom_right') {
        mobile_wrapper_position = 'bottom: 0; right: 0'
    }

    if (quickAddToCartSetting['enable_button_vp'] == true) {
        btn_vp_icon = '<div class="quick-add-btn-wrapper vp-btn-wrapper">\n' +
            '           <button class="vp-icon" style="background-color: ' + quickAddToCartSetting['view_product_btn_background_color'] + '">' + vp_icon + '</button>\n' +
            '      </div>\n';
    }

    var quickAddToCartMobileWrapper = '<div class="quick-add-to-cart-wrapper" id="' + handle + 'qatc-wrapper" align="center" style="display: none">\n' +
        '                    <div class="icon-group">\n' +
        '                        <div class="mobile-icons-wrapper" style="' + mobile_wrapper_position + '">\n' + btn_vp_icon + btn_atc_icon +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n';


    if (handle != url_handle && !handle.match(/(\.jpg|\.png|\.gif)/)) {
        if ($(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
            if ($(product_wrapper).find('div.quick-add-to-cart-wrapper').length === 0) {
                try {
                    if (jQuery(product_wrapper).find(".jdgm-carousel-item__product-image").length === 0) {
                        jQuery(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").eq(0).before(quickAddToCartMobileWrapper);
                    }
                } catch (e) {
                    if (jQuery(product_wrapper).find(".jdgm-carousel-item__product-image").length === 0) {
                        jQuery(product_wrapper).find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").before(quickAddToCartMobileWrapper);
                    }
                }
            }
            hoverAndActionMobile($(product_wrapper), handle, product_url)
        } else if ($(product_wrapper).find(".visually-hidden").length !== 0 || $(product_wrapper).find("noscript").length !== 0) {
            if (parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
                if (parent.find('.quick-add-to-cart-wrapper').length === 0) {
                    $(product_wrapper).css("z-index", 0);
                    parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").after(quickAddToCartMobileWrapper);
                }
                hoverAndActionMobile($(parent), handle, product_url)
            } else {
                if ($(product_wrapper).find('div.quick-add-to-cart-wrapper').length === 0) {
                    if ($(product_wrapper).find(".grid-product__image-mask").length !== 0) {
                        $(product_wrapper).find(".grid-product__image-mask").before(quickAddToCartMobileWrapper);
                        // hoverAndActionMobile($(product_wrapper), handle, product_url)
                    } else {
                        $(product_wrapper).css("z-index", 0);
                        $(product_wrapper).find("img").after(quickAddToCartMobileWrapper);
                        hoverAndActionMobile($(product_wrapper), handle, product_url)
                    }
                }
            }
        } else if (parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").length !== 0) {
            if (parent.find('div.quick-add-to-cart-wrapper').length === 0) {
                parent.find("img[src*='/products/']:not([src*='compact']), img[srcset*='/products/']:not([srcset*='compact']), img[data-src*='/products/']:not([data-src*='compact']), img[data-img-raw-src*='/products/']:not([data-img-raw-src*='compact'])").after(quickAddToCartMobileWrapper);
            }
            hoverAndActionMobile($(parent), handle, product_url)
        }
    }
}

window.allfetchQuickAddToCartUnder = function () {
    if (meta.page.pageType === 'home' || meta.page.pageType === 'collection') {
        if ($("li:has(a[href*='/products/'])").length > 0) {
            $("li:has(a[href*='/products/'])").each(function () {
                var list_wrapper = this
                var handle = $(list_wrapper).contents().find("a[href*='/products/']").attr('href').split('/products/')[1];
                if ($(list_wrapper).find(".quick-add-to-cart-wrapper-under").length == 0) {
                    setQatcWrapperUnder(list_wrapper, handle)
                }
            })
        } else if ($("article:has(a[href*='/products/'])").length > 0) {
            $("article:has(a[href*='/products/'])").each(function () {
                var list_wrapper = this
                var handle = $(list_wrapper).contents().find("a[href*='/products/']").attr('href').split('/products/')[1];
                if ($(list_wrapper).find(".quick-add-to-cart-wrapper-under").length == 0) {
                    setQatcWrapperUnder(list_wrapper, handle)
                }
            })
        } else {
            var selector = quickAddToCartSetting['position_selector']
            if (selector !== false) {
                $(selector).each(function () {
                    var product_wrapper = this
                    var handle = $(product_wrapper).contents().find("a[href*='/products/']").attr('href').split('/products/')[1];
                    if ($(product_wrapper).find(".quick-add-to-cart-wrapper-under").length == 0) {
                        setQatcWrapperUnder(product_wrapper, handle)
                    }
                })
            }
        }
    }
}

function setQatcWrapperUnder(product_wrapper, handle) {
    var btn_atc_under = '', noti_bar_under = '', warning_bar_under = '', atc_icon = '', atc_text = '';
    if (quickAddToCartSetting['detail_visibility'] == 'icon' || quickAddToCartSetting['detail_visibility'] == 'text_icon') {
        var viewBox, path;
        if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-cart") {
            viewBox = '0 -31 512.00033 512'
            path = '<path d="m166 300.003906h271.003906c6.710938 0 12.597656-4.4375 14.414063-10.882812l60.003906-210.003906c1.289063-4.527344.40625-9.390626-2.433594-13.152344-2.84375-3.75-7.265625-5.964844-11.984375-5.964844h-365.632812l-10.722656-48.25c-1.523438-6.871094-7.617188-11.75-14.648438-11.75h-91c-8.289062 0-15 6.710938-15 15 0 8.292969 6.710938 15 15 15h78.960938l54.167968 243.75c-15.9375 6.929688-27.128906 22.792969-27.128906 41.253906 0 24.8125 20.1875 45 45 45h271.003906c8.292969 0 15-6.707031 15-15 0-8.289062-6.707031-15-15-15h-271.003906c-8.261719 0-15-6.722656-15-15s6.738281-15 15-15zm0 0"/><path d="m151 405.003906c0 24.816406 20.1875 45 45.003906 45 24.8125 0 45-20.183594 45-45 0-24.8125-20.1875-45-45-45-24.816406 0-45.003906 20.1875-45.003906 45zm0 0"/><path d="m362.003906 405.003906c0 24.816406 20.1875 45 45 45 24.816406 0 45-20.183594 45-45 0-24.8125-20.183594-45-45-45-24.8125 0-45 20.1875-45 45zm0 0"/>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-bag") {
            viewBox = '0 0 279 279'
            path = '<path d="M262.421,270.339L246.466,72.896C246.151,69.001,242.898,66,238.99,66h-42.833v-9.495C196.157,25.348,171.143,0,139.985,0  h-0.99c-31.157,0-56.838,25.348-56.838,56.505V66H39.99c-3.908,0-7.161,3.001-7.476,6.896l-16,198  c-0.169,2.088,0.543,4.15,1.963,5.689S21.897,279,23.99,279h231c0.006,0,0.014,0,0.02,0c4.143,0,7.5-3.357,7.5-7.5  C262.51,271.105,262.48,270.717,262.421,270.339z M97.157,56.505C97.157,33.619,116.109,15,138.995,15h0.99  c22.886,0,41.172,18.619,41.172,41.505V66h-84V56.505z"/>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-shopping-basket") {
            viewBox = '0 0 576 512'
            path = '<path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z" class=""></path>'
        } else if (quickAddToCartSetting['add_to_cart_icon'] == "fas fa-cart-plus") {
            viewBox = '0 0 576 512'
            path = '<path  d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z"/>'
        } else {
            viewBox = '0 0 576 512'
            path = '<path d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z" class=""></path>'
        }
        atc_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="26px" stroke="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '" fill="' + quickAddToCartSetting['add_to_cart_btn_icon_color'] + '">' +
            path +
            '</svg>'
    }

    if (quickAddToCartSetting['detail_visibility'] == 'text' || quickAddToCartSetting['detail_visibility'] == 'text_icon') {
        atc_text = quickAddToCartSetting['add_to_cart_btn_text']
    }

    btn_atc_under = '<div class="quick-add-btn-wrapper-under atc-btn-wrapper-under">\n' +
        '           <button class="real-atc-btn" style="color: ' + quickAddToCartSetting['add_to_cart_btn_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['add_to_cart_btn_background_color'] + '; padding: 0px">' + atc_icon + atc_text + '</button>\n' +
        '      </div>\n';

    noti_bar_under = '<div class="quick-add-btn-wrapper-under noti-bar-wrapper-under" style="display: none;">\n' +
        '            <button disabled class="noti-bar" style="color: ' + quickAddToCartSetting['noti_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['noti_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['noti_bar_text'] + '</button>\n' +
        '     </div>\n';

    warning_bar_under = '<div class="quick-add-btn-wrapper-under warning-bar-wrapper-under" style="display: none;">\n' +
        '            <button disabled class="warning-bar" style="color: ' + quickAddToCartSetting['warning_bar_text_color'] + ' !important; background-color: ' + quickAddToCartSetting['warning_bar_background_color'] + '; padding: 0px">' + quickAddToCartSetting['warning_bar_text'] + '</button>\n' +
        '     </div>\n';

    var quickAddToCartWrapperUnder = '<div class="quick-add-to-cart-wrapper-under">\n' +
        '                               <div class="variant-qty-wrapper">\n' +
        '                                   <div class="product-variants-wrapper-under">\n' +
        '                                       <select class="product-variants-under" id="' + handle + '_qatc-variants" style="background-color: #fff;">\n' +
        '                                       </select>\n' +
        '                                   </div>\n' +
        '                                   <div class="product-qty-wrapper-under">\n' +
        '                                       <button class="qtyminus-under qty-btn qatc-minus" productname="' + handle + '" style="color: #000 !important; font-weight: lighter;">-</button>\n' +
        '                                       <input class="input_qty_product_under" type="number" min="1" value="1" productname="' + handle + '" style="background-color: #fff;">\n' +
        '                                       <button class="qtyplus-under qty-btn qatc-plus" productname="' + handle + '" style="color: #000 !important; font-weight: lighter;">+</button>\n' +
        '                                   </div>\n' +
        '                               </div>\n' + btn_atc_under + noti_bar_under + warning_bar_under +
        '                             </div>'

    $(product_wrapper).append($(quickAddToCartWrapperUnder))
    add_variants_wrapper(product_wrapper, handle);
    qatc_qty_change(product_wrapper, handle, 'input_qty_product_under')
    if ($(product_wrapper).find('.real-atc-btn')) {
        $(product_wrapper).find('.real-atc-btn').off("click").on("click", function () {
            var quantity = $($(product_wrapper).find('.input_qty_product_under')).val()
            var id_product = ''
            if ($(product_wrapper).find('.product-variants-under').length > 0) {
                id_product = $($(product_wrapper).find('.product-variants-under')).find(":selected").attr('data_var_id')
            } else {
                id_product = $($(product_wrapper).find('.product-variants-wrapper-under')[0]).attr('data_var_id')
            }
            console.log(parseInt(quantity))
            console.log(id_product)
            $.ajax({
                url: '/cart/add.js',
                method: "POST",
                data: {items: [{quantity: parseInt(quantity), id: id_product,}]},
                dataType: 'json'
            }).done((response) => {
                update_count_number()
                $($(product_wrapper).find('.noti-bar-wrapper-under')).show();
                $($(product_wrapper).find('.variant-qty-wrapper')).hide()
                $($(product_wrapper).find('.atc-btn-wrapper-under')).hide()
                setTimeout(function () {
                    $($(product_wrapper).find('.atc-btn-wrapper-under')).show();
                    $($(product_wrapper).find('.variant-qty-wrapper')).show()
                    $($(product_wrapper).find('.noti-bar-wrapper-under')).hide();
                    $($(product_wrapper).find('.input_qty_product_under')).val(1)
                }, 1500);
            }).fail((err) => {
                console.log(err.message)
                $($(product_wrapper).find('.warning-bar-wrapper-under')).show();
                $($(product_wrapper).find('.variant-qty-wrapper')).hide()
                $($(product_wrapper).find('.atc-btn-wrapper-under')).hide()
                setTimeout(function () {
                    $($(product_wrapper).find('.atc-btn-wrapper-under')).show();
                    $($(product_wrapper).find('.variant-qty-wrapper')).show()
                    $($(product_wrapper).find('.warning-bar-wrapper-under')).hide();
                    $($(product_wrapper).find('.input_qty_product_under')).val(1)
                }, 1500);
            })
        })
    }
}

function initListenAddToCart() {
    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send,
        onReadyStateChange;
    var is_need_update_cart = false;

    function openReplacement(method, url, async, user, password) {
        if (url.indexOf('cart/add') !== -1) {
            is_need_update_cart = true;
        }
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;

        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        if (is_need_update_cart == true) {
            is_need_update_cart = false;
            if (data_parse != undefined) {
                get_data_cart_in_view_mini(miniCartDetail, window.stickyCart, window.SettingCurrency);
            }
        }
        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;
}

// Main function
initJQuery(function () {
    if (typeof $ == "undefined") {
        $ = jQuery;
    }
    if (typeof jQuery.ui == "undefined") {
        var jquery_ui = '<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js" type="text/javascript"></script>'
        $('head').append(jquery_ui);
    }
    try {
        $(document).bind('mouseup', function (e) {
            var container = $(".mgn-minicart");
            // if the target of the click isn't the container nor a descendant of the container
            if (container.is(':visible') && container.length > 0 && !container.is(e.target) && container.has(e.target).length === 0) {
                var button = $("#sp_sticky");
                if (button.is(e.target) || button.has(e.target).length > 0) {
                    return;
                } else {
                    continue_to_buy(miniCartDetail[`type`], miniCartDetail[`animation`]);
                }
            }
        });
    } catch (error) {
        console.log(error)
    }
    if (window.AllFetchURL == undefined) {
        window.AllFetchURL = 'https://apps.allfetch.com';
        initCss();
        window.allfetchstickycart();
        if ($("form[action='/cart/add']").length > 0) {
            if ($("form[action='/cart/add']").find($("[type='submit']")).length > 0) {
                $("form[action='/cart/add']").find($("[type='submit']"))[0].addEventListener("click", function () {
                    // let count = parseInt($('.mgn-stickycart-count')[0].innerText);
                    // let update_count = parseInt(count) + 1;
                    // $('.mgn-stickycart-count')[0].innerText = update_count;
                    setTimeout(function () {
                        update_count_number()
                    }, 1000)
                })
            }
        }
    } else {
        console.log("Error Window.AllFetchURL");
    }
    var lastScrollTop = 0, delta = 100;
    setTimeout(function () {
        if (shopPlan['plan_name'] == 'Advanced') {
            if (isMobileDevice() == false) {
                if (quickAddToCartSetting['is_enable_for_desktop'] == true) {
                    if (quickAddToCartSetting['quick_add_to_cart_when'] == 'hover') {
                        window.allfetchQuickAddToCartHover()
                        $(window).scroll(function (event) {
                            var st = $(this).scrollTop();
                            if (Math.abs(lastScrollTop - st) <= delta)
                                return;
                            if (st > lastScrollTop) {
                                setTimeout(function () {
                                    window.allfetchQuickAddToCartHover()
                                }, 500);
                            }
                            lastScrollTop = st;
                        });
                    } else if (quickAddToCartSetting['quick_add_to_cart_when'] == 'under') {
                        window.allfetchQuickAddToCartUnder()
                        $(window).scroll(function (event) {
                            var st = $(this).scrollTop();
                            if (Math.abs(lastScrollTop - st) <= delta)
                                return;
                            if (st > lastScrollTop) {
                                setTimeout(function () {
                                    window.allfetchQuickAddToCartUnder()
                                }, 500);
                            }
                            lastScrollTop = st;
                        });
                    }
                }
            } else {
                if (quickAddToCartSetting['is_enable_for_mobile']) {
                    if (quickAddToCartSetting['quick_add_to_cart_when'] == 'hover') {
                        window.allfetchQuickAddToCartHover()
                        $(window).scroll(function (event) {
                            var st = $(this).scrollTop();
                            if (Math.abs(lastScrollTop - st) <= delta)
                                return;
                            if (st > lastScrollTop) {
                                setTimeout(function () {
                                    window.allfetchQuickAddToCartHover()
                                }, 500);
                            }
                            lastScrollTop = st;
                        });
                    } else if (quickAddToCartSetting['quick_add_to_cart_when'] == 'under') {
                        window.allfetchQuickAddToCartUnder()
                        $(window).scroll(function (event) {
                            var st = $(this).scrollTop();
                            if (Math.abs(lastScrollTop - st) <= delta)
                                return;
                            if (st > lastScrollTop) {
                                setTimeout(function () {
                                    window.allfetchQuickAddToCartUnder()
                                }, 500);
                            }
                            lastScrollTop = st;
                        });
                    }
                }
            }
        }
    }, 1000);
});
//==============================================================================================================================================
//==============================================================================================================================================


// =======================================================================View==================================================================
// =============================================================================================================================================
function view_outofstock_popup() {
    var position = ''
    if (barSetting['position'] == 'mgn-stickybar') {
        position = 'top:0;position:fixed;bottom:auto';
    }
    let html = '<div class="container-popup-outofstock" id="container-popup-outofstock" style="' + position + '">\n' +
        '<div class="popup-out-of-stock">\n' +
        '<span>' + barSetting['out_of_stock_label'] + '</span>' +
        '  </div>  \n' +
        '</div';
    var txt = $(html);
    jQuery("body").append(txt);
}

function showStickyBar() {
    var isMinicartVisible = $('.mgn-minicart').is(':visible');
    if (!isMinicartVisible) {
        $('#mgn-stickybar').show();
    }
}

function hideStickyBar() {
    $('#mgn-stickybar').hide();
}

//view sticky cart
function view_shop_cart(cartDetail, parser_data) {
    var path = ''
    var viewBox = ''
    if (parser_data['sticky_cart_icon'] == "fas fa-shopping-cart") {
        viewBox = '0 -31 512.00033 512'
        path = '<path d="m166 300.003906h271.003906c6.710938 0 12.597656-4.4375 14.414063-10.882812l60.003906-210.003906c1.289063-4.527344.40625-9.390626-2.433594-13.152344-2.84375-3.75-7.265625-5.964844-11.984375-5.964844h-365.632812l-10.722656-48.25c-1.523438-6.871094-7.617188-11.75-14.648438-11.75h-91c-8.289062 0-15 6.710938-15 15 0 8.292969 6.710938 15 15 15h78.960938l54.167968 243.75c-15.9375 6.929688-27.128906 22.792969-27.128906 41.253906 0 24.8125 20.1875 45 45 45h271.003906c8.292969 0 15-6.707031 15-15 0-8.289062-6.707031-15-15-15h-271.003906c-8.261719 0-15-6.722656-15-15s6.738281-15 15-15zm0 0"/><path d="m151 405.003906c0 24.816406 20.1875 45 45.003906 45 24.8125 0 45-20.183594 45-45 0-24.8125-20.1875-45-45-45-24.816406 0-45.003906 20.1875-45.003906 45zm0 0"/><path d="m362.003906 405.003906c0 24.816406 20.1875 45 45 45 24.816406 0 45-20.183594 45-45 0-24.8125-20.183594-45-45-45-24.8125 0-45 20.1875-45 45zm0 0"/>'
    } else if (parser_data['sticky_cart_icon'] == "fas fa-shopping-bag") {
        viewBox = '0 0 279 279'
        path = '<path d="M262.421,270.339L246.466,72.896C246.151,69.001,242.898,66,238.99,66h-42.833v-9.495C196.157,25.348,171.143,0,139.985,0  h-0.99c-31.157,0-56.838,25.348-56.838,56.505V66H39.99c-3.908,0-7.161,3.001-7.476,6.896l-16,198  c-0.169,2.088,0.543,4.15,1.963,5.689S21.897,279,23.99,279h231c0.006,0,0.014,0,0.02,0c4.143,0,7.5-3.357,7.5-7.5  C262.51,271.105,262.48,270.717,262.421,270.339z M97.157,56.505C97.157,33.619,116.109,15,138.995,15h0.99  c22.886,0,41.172,18.619,41.172,41.505V66h-84V56.505z"/>'
    } else if (parser_data['sticky_cart_icon'] == "fas fa-shopping-basket") {
        viewBox = '0 0 576 512'
        path = '<path d="M576 216v16c0 13.255-10.745 24-24 24h-8l-26.113 182.788C514.509 462.435 494.257 480 470.37 480H105.63c-23.887 0-44.139-17.565-47.518-41.212L32 256h-8c-13.255 0-24-10.745-24-24v-16c0-13.255 10.745-24 24-24h67.341l106.78-146.821c10.395-14.292 30.407-17.453 44.701-7.058 14.293 10.395 17.453 30.408 7.058 44.701L170.477 192h235.046L326.12 82.821c-10.395-14.292-7.234-34.306 7.059-44.701 14.291-10.395 34.306-7.235 44.701 7.058L484.659 192H552c13.255 0 24 10.745 24 24zM312 392V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm112 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24zm-224 0V280c0-13.255-10.745-24-24-24s-24 10.745-24 24v112c0 13.255 10.745 24 24 24s24-10.745 24-24z" class=""></path>'
    } else if (parser_data['sticky_cart_icon'] == "fas fa-cart-plus") {
        viewBox = '0 0 576 512'
        path = '<path  d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z"/>'
    } else {
        viewBox = '0 0 576 512'
        path = '<path d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM403.029 192H360v-60c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v60h-43.029c-10.691 0-16.045 12.926-8.485 20.485l67.029 67.029c4.686 4.686 12.284 4.686 16.971 0l67.029-67.029c7.559-7.559 2.205-20.485-8.486-20.485z" class=""></path>'
    }
    var x = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="26px" stroke="' + parser_data['icon_color'] + '" fill="' + parser_data['icon_color'] + '">' +
        path +
        '</svg>'
    var html = '\n' +
        '<div id="sp_sticky" class="' + parser_data['position'] + '" onclick="open_mini_cart(miniCartDetail[`type`],miniCartDetail[`animation`])" style="background:' + parser_data['icon_background_color'] + ';cursor: pointer">\n' +
        '<span class="mgn-stickycart-icon" style="color:' + parser_data['icon_color'] + '">\n' +
        x +
        '</span>\n' +
        '<span class="mgn-stickycart-count" style="background:' + parser_data['counter_background_color'] + '; color:' + parser_data['counter_number_color'] + '">' + cartDetail['item_count'] + '</span>\n' +
        '</div>\n';
    var txt = $(html);
    if ($('.mgn-stickycart').length >= 1) {
        $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
    } else {
        jQuery("body").append(txt);
    }

}

// view inside mini card
function view_mini_cart(cartDetail, parser_data, currency) {
    let list_item = '';

    if (cartDetail['items'].length > 0) {
        for (let i = 0; i < cartDetail['items'].length; i++) {
            var price_product = cartDetail['items'][i]['price'];
            var quantity_product = cartDetail['items'][i]['quantity'];
            var price_pr = format_currency(currency, parseInt(cartDetail['items'][i]['price']) / 100)
            var cart_item_title = '';
            if (cartDetail['items'][i]['variant_title']) {
                cart_item_title = cartDetail['items'][i]['variant_title']
            }
            list_item += `
                <li class="mgn-minicart-item" id="item_mini_` + cartDetail['items'][i]['id'] + `">
                    <div class="mgn-product-inner">
                        <a href="#" class="mgn-product-photo">
                            <img class="img-product-minicart" src="` + cartDetail['items'][i]['image'] + `" alt="">
                        </a>
                        <div class="mgn-product-details">
                            <div class="ngm-product-title-delete">
                                <p class="mgn-product-name">` + cartDetail['items'][i]['product_title'] + `</p>
                                <p style="text-align:right;cursor:pointer;" 
                                   id="` + cartDetail['items'][i]['id'] + `" 
                                   data="` + cartDetail['items'].length + `" 
                                   onclick="delete_product_minicart(this.id, ` + price_product + `, ` + quantity_product + `)">
                                    X
                                </p>
                            </div>
                            <p class="mgn-product-desc">
                                <span>` + cart_item_title + `</span>
                            </p>
                            <div class="mgn-product-info">
                                <div class="mgn-mini-cart-quantity">
                                    <button class="mini_cart_button_update mini_cart_button_minus" 
                                            id="` + cartDetail['items'][i]['id'] + `" 
                                            onclick="update_product_minus(this.id, ` + price_product + `)">
                                        -
                                    </button>
                                    <input type="number" min="1" value="` + cartDetail['items'][i]['quantity'] + `" 
                                           class="input_number_mini_cart" id="input_` + cartDetail['items'][i]['id'] + `" 
                                           readonly>
                                    <button class="mini_cart_button_update mini_cart_button_plus" 
                                            id="` + cartDetail['items'][i]['id'] + `" 
                                            onclick="update_product_plus(this.id, ` + price_product + `)">
                                        +
                                    </button>
                                </div>
                                <strong class="mgn-product-price">` + price_pr + `</strong>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        }
    } else {
        if (miniCartDetail['text_empty_cart']) {
            list_item += '<h3 class="sticky-cart-empty">' + miniCartDetail['text_empty_cart'].toString() + '</h3>'
        } else {
            list_item += '<h3 class="sticky-cart-empty">Your cart is currently empty</h3>'
        }
    }

    var html = `
        <div id="minicart_onboarding_content">
            <div class="mgn-preview-wrapper mgn-preview-minicart">
                <div class="mgn-preview-inner">
                    <div class="` + parser_data['type'] + `" style="display: none;">
                        <div class="mgn-minicart-head">
                            <p></p>
                            <h3>` + parser_data['text_shopping_cart'] + `</h3>
                            <p onclick="continue_to_buy('` + miniCartDetail['type'] + `', '` + miniCartDetail['animation'] + `');" 
                               style="cursor: pointer">
                                X
                            </p>
                        </div>
                        <div class="mgn-minicart-content">
                            <ul class="mgn-minicart-list">` + list_item + `</ul>
                        </div>
                        <div class="mgn-minicart-foot">
                            <p class="mgn-minicart-subtotal">
                                <span style="color: #0f0f0f;font-weight: bold;">` + parser_data['text_subtotal'] + `</span>
                                <strong class="` + cartDetail['total_price'] + `" id="total_mini_cart">` + format_currency(currency, parseInt(cartDetail['total_price']) / 100) + `</strong>
                            </p>
                            <div class="mgn-minicart-actions">
                                <a href="#" class="mgn-minicart-btn mgn-minicart-continue" 
                                   onclick="continue_to_buy('` + miniCartDetail['type'] + `', '` + miniCartDetail['animation'] + `');" 
                                   style="background:` + parser_data['continue_background_color'] + `; 
                                          color:` + parser_data['continue_text_color'] + `">` + parser_data['continue_button_text'] + `</a>
                                <a href="/checkout" class="mgn-minicart-btn mgn-minicart-checkout" 
                                   style="background:` + parser_data['checkout_button_color'] + `; 
                                          color:` + parser_data['checkout_text_color'] + `">` + parser_data['checkout_button_text'] + `</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    var txt = $(html);
    if ($('#minicart_onboarding_content').length >= 1) {

    } else {
        jQuery("body").append(txt);
    }
}

function format_currency(currency, price) {
    var shopify_currency = Shopify.currency
    if (shopify_currency != 'undefined') {
        var currency_code = shopify_currency.active
        var formatter = new Intl.NumberFormat('en', {
            style: 'currency',
            currency: currency_code,
            minimumFractionDigits: 2,
        });
        var result = formatter.format(price);
        console.log(result)
        result = $("<textarea/>")
            .html(result)
            .text();
        return result
    }
        // if (currency['money_format'] != 'undefined') {
        //     var format_money_s = currency['money_format'].indexOf("{{");
        //     var format_money_e = currency['money_format'].indexOf("}}");
        //     var format_money = currency['money_format'].slice(format_money_s, format_money_e + 2);
        //     var regular_price = (parseFloat(price)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        //     var result = currency['money_format'].replace(format_money, regular_price);
        //     var txt = document.createElement('textarea');
        //     txt.innerHTML = result;
        //     result = txt.value;
        //     result = result.replace(/(<([^>]+)>)/ig, '');
        //     result = $("<textarea/>")
        //         .html(result)
        //         .text();
        //     return result
    // }
    else {
        return ""
    }
}

// View slider bar
function view_slide_bar_cart(productDetail, data_parser, currency) {
    var button_add = '', button_buy = '', show_product_compare_price = '', show_product_image = '',
        show_product_name = '', show_product_price = '', show_product_quantity = '', show_product_variant = '',
        animation_when = '', animation_type = '';

    if (isMobileDevice()) {
        console.log('is_mobile')
        if (!data_parser['show_product_image_mobile']) {
            show_product_image = 'display:none'
        }
        if (!data_parser['show_product_compare_price_mobile']) {
            show_product_compare_price = 'display:none'
        }
        if (!data_parser['show_product_name_mobile']) {
            show_product_name = 'display:none'
        }
        if (!data_parser['show_product_price_mobile']) {
            show_product_price = 'display:none'
        }
        if (!data_parser['show_product_quantity_mobile']) {
            show_product_quantity = 'display:none'
        }
        if (!data_parser['show_product_variant_mobile']) {
            show_product_variant = 'display:none'
        }
    } else {
        console.log('is_not_mobile')
        if (!data_parser['show_product_image']) {
            show_product_image = 'display:none'
        }
        if (!data_parser['show_product_compare_price']) {
            show_product_compare_price = 'opacity:0'
        }
        if (!data_parser['show_product_name']) {
            show_product_name = 'display:none'
        }
        if (!data_parser['show_product_price']) {
            show_product_price = 'opacity:0'
        }
        if (!data_parser['show_product_quantity']) {
            show_product_quantity = 'opacity:0'
        }
        if (!data_parser['show_product_variant']) {
            show_product_variant = 'opacity:0'
        }
    }
    if (shopPlan['plan_name'] == 'Advanced') {
        if (data_parser['button_animation']) {
            animation_when = data_parser['animation_when']
            animation_type = data_parser['animation_type']
        }
    }
    if (data_parser['enable_button_bn']) {
        button_buy = '<div class="mgn-product-option mgn-product-option--buynow">\n' +
            '             <button class="mgn-buynow-btn ' + animation_type + " " + animation_when + '" id="buy_now" onclick="buy_now(this.id)" style="height: 40px; background:' + data_parser['buy_now_button_color'] + '; color: ' + data_parser['buy_now_text_color'] + ';">' + data_parser['buy_now_label'] + '</button>\n' +
            '         </div>\n'
    }

    if (data_parser['enable_button_atc']) {
        button_add = '<div class="mgn-product-option mgn-product-option--addtocart">\n' +
            '             <button class="mgn-addtocart-btn ' + animation_type + " " + animation_when + '" id="add_to_cart" onclick="buy_now(this.id)" style="height: 40px; background:' + data_parser['add_to_cart_button_color'] + '; color: ' + data_parser['add_to_cart_text_color'] + ';">' + data_parser['add_to_cart_label'] + '</button>\n' +
            '         </div>\n'
    }
    var money = productDetail.variants[0].price ? format_currency(SettingCurrency, productDetail.variants[0].price) : '';
    var compare_at_price = productDetail.variants[0].compare_at_price ? format_currency(SettingCurrency, productDetail.variants[0].compare_at_price) : '';
    let content_option = '';
    var count = 0;
    for (let i = 0; i < productDetail.options.length; i++) {
        let text_option = '';
        count += 1
        for (let j = 0; j < productDetail.options[i].values.length; j++) {
            var text_value = productDetail.options[i].values[j];
            text_option += '<option>' + text_value + '</option>\n';
        }
        content_option +=
            '<div class="mgn-product-option mgn-product-option--size" style="' + show_product_variant + '">\n' +
            '    <select id="shopify_sticky_' + count.toString() + '" onchange="AllFetchOnchangeSelect();" style="text-align: center;color:black;background-color:white;margin-bottom: 0px;">\n' +
            text_option +
            '    </select>\n' +
            '</div>\n';
    }
    if (productDetail.options.length == 1 && productDetail.options[0].values[0] == "Default Title") {
        content_option = ''
    }
    var style_sticky_bar = ''
    if (data_parser['position'] == 'mgn-stickybar') {
        var top_space = 0;
        if (!isMobileDevice()) {
            var venture_nav_bar = document.getElementById("StickNavWrapper")
            if (venture_nav_bar) {
                top_space = venture_nav_bar.offsetHeight
            }
            var parallax_nav_bar = document.getElementsByClassName("sticky-header--true mm-fixed-top")[0]
            if (parallax_nav_bar) {
                top_space = parallax_nav_bar.offsetHeight
            }
            var testament_nav_bar = $("[data-sticky-class=navigation--sticky]")[0]
            if (testament_nav_bar) {
                top_space = testament_nav_bar.offsetHeight
            }
            var fashionopolism_nav_bar = document.getElementsByClassName("stickynav")[0]
            if (fashionopolism_nav_bar) {
                top_space = fashionopolism_nav_bar.offsetHeight
            }
            var smart_menu_nav_bar = document.getElementById("StickyBar")
            if (smart_menu_nav_bar) {
                top_space = smart_menu_nav_bar.offsetHeight
            }
            var startup_nav_bar = document.getElementsByClassName("main-header-wrapper collapsed-navigation sticky-header")[0]
            if (startup_nav_bar) {
                if (startup_nav_bar.offsetHeight > 100) {
                    top_space = startup_nav_bar.offsetHeight - 40
                } else {
                    top_space = startup_nav_bar.offsetHeight
                }
            }
        }
        if (isMobileDevice()) {
            var parallax_nav_bar = document.getElementsByClassName("mobile-sticky-header--true mm-fixed-top")[0]
            if (parallax_nav_bar) {
                top_space = parallax_nav_bar.offsetHeight
            }
            var testament_nav_bar = document.getElementById("upper-content")
            if (testament_nav_bar) {
                top_space = testament_nav_bar.offsetHeight
            }
            var fashionopolism_nav_bar = document.getElementsByClassName("theme-header header--sticky")[0]
            if (fashionopolism_nav_bar) {
                top_space = fashionopolism_nav_bar.offsetHeight
            }
        }
        var kagami_nav_bar = document.getElementsByClassName("header__wrapper")[0]
        if (kagami_nav_bar) {
            top_space = kagami_nav_bar.offsetHeight
        }
        style_sticky_bar = 'top: ' + top_space.toString() + 'px; background: ' + data_parser['background_color']
    } else {
        style_sticky_bar = 'background: ' + data_parser['background_color']
    }
    var img_src = ''
    if (productDetail['image'] != null) {
        img_src = productDetail['image']['src']
    }
    if (style_sticky_bar && img_src) {
        var html = '<div class="mgn-preview-wrapper">\n' +
            '<div class="' + data_parser['position'] + '" id="mgn-stickybar" style="' + style_sticky_bar.toString() + '">\n' +
            // '<div class="' + data_parser['position'] + '" id="mgn-stickybar" style="background: ' + data_parser['background_color'] + '">\n' +
            '<div class="mgn-stickybar-content">\n' +
            '            <div class="mgn-product-info">\n' +
            '                <div class="mgn-product-photo" style="' + show_product_image + '">\n' +
            '                    <img src="' + img_src + '" alt=""/>\n' +
            '                </div>\n' +
            '                <div class="mgn-product-details">\n' +
            '                    <div class="mgn-product-name" style="' + show_product_name + '"><a href="#" style="color: ' + data_parser['product_text_color'] + '">' + productDetail['title'] + '</a></div>\n' +
            '                    <div class="mgn-product-price" id="mgn-product-price" style="' + show_product_price + '"><span class="mgn-product-price_s" style="color: ' + data_parser['price_text_color'] + '">' + money + '</span>&nbsp;<span class="mgn-product-compare-at-price" style="' + show_product_compare_price + ';color: ' + data_parser['price_compare_text_color'] + '"><del>' + compare_at_price + '</del></span></div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="mgn-product-options">\n' +
            content_option +
            '            </div>\n' +
            '\n' +
            '            <div class="mgn-product-options-action">\n' +
            '                <div class="mgn-product-option mgn-product-option--qty" style="' + show_product_quantity + '">\n' +
            '                    <button class="qtyminus" id="buy_now" onclick="change_input_number(-1)">-</button>\n' +
            '                    <input type="number" class="input_qty_product" min="1" style="" value="1" >\n' +
            '                    <button class="qtyplus" id="buy_now" onclick="change_input_number(1)">+</button>\n' +
            '                </div>\n' +
            button_buy +
            button_add +
            '            </div>\n' +
            '            \n' +
            '        </div>    </div></div>\n' +
            '</div>'
        var txt = $(html);
        jQuery("body").append(txt);
    }
}

function change_input_number(qty) {
    var result = 0
    var value = $('.input_qty_product').val()
    result = parseInt(value) + qty
    $('.input_qty_product').val(result)
    if (value <= 0) {
        $('.input_qty_product').val(1)
    }
}

function view_success_popup() {
    var position = 'background:' + barSetting['background_added_cart'] + ';' + 'color:' + barSetting['text_added_color'];
    if (barSetting['position'] == 'mgn-stickybar') {
        position = 'top:0;position:fixed;bottom:auto;' + 'background:' + barSetting['background_added_cart'] + ';' + 'color:' + barSetting['text_added_color'];
    }
    let html = '<div class="container-popup" id="container-popup" style="' + position + '">\n' +
        '<div class="popup">\n' +
        '<span style="color: ' + barSetting['text_added_color'] + '">' + barSetting['text_added_cart'] + '</span>' +
        '  </div>  \n' +
        '</div';
    var txt = $(html);
    jQuery("body").append(txt);
}

//=============================================================================================================================================================================
//=============================================================================================================================================================================


//=================================================================== FUNCTION -JAVASCRIPT =====================================================================================
//=============================================================================================================================================================================

function open_mini_cart(type, animation) {
    if (shopPlan['plan_name'] != 'Advanced') {
        animation = ''
    }
    if (stickyCart['button_action'] === 'go_to_cart') {
        // disableBodyScrolling()
        if ($('.mgn-minicart').is(":visible")) {
            continue_to_buy(type, animation)
            return
        }
        jQuery.getJSON('/cart.js', function (cartDetail) {
            if (cartDetail) {
                $('#minicart_onboarding_content').remove();
                view_mini_cart(cartDetail, miniCartDetail, SettingCurrency);
                var duration = 500
                if (type == 'mgn-minicart mgn-minicart--modal') {
                    duration = 650
                }
                if (animation == 'horizontally') {
                    $('.mgn-minicart').show("slide", {direction: "right"}, duration);
                } else if (animation == 'vertically') {
                    $('.mgn-minicart').slideDown(duration);
                } else if (animation == 'fade') {
                    $('.mgn-minicart').fadeIn(duration);
                } else {
                    $('.mgn-minicart').show();
                }
                if ($('.mgn-stickycart-count')) {
                    $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
                }
                $('.mgn-stickybar').hide();
            }
        });
    } else if (stickyCart['button_action'] === 'go_to_cart_page') {
        window.location.href = "/cart";
    } else {
        window.location.href = "/checkout";
    }
}

function disableBodyScrolling() {
    $('body').addClass('stickycartlock');
}

function enableBodyScrolling() {
    $('body').removeClass('stickycartlock');

}

function buy_now(check_button) {
    // Get information from select input on SLIDERBAR
    let idProduct = '';
    var productQuantity = $('.input_qty_product').val();
    let productDetails = '';
    var productvariant = '';
    var sizeValue = $("#shopify_sticky_1 option:selected") ? $("#shopify_sticky_1 option:selected").text() : '';
    if (sizeValue != '') {
        productvariant = productvariant + sizeValue
    }
    var colorValue = $("#shopify_sticky_2 option:selected") ? $("#shopify_sticky_2 option:selected").text() : '';
    if (colorValue != '') {
        productvariant = productvariant + ' / ' + colorValue
    }
    var materialValue = $("#shopify_sticky_3 option:selected") ? $("#shopify_sticky_3 option:selected").text() : '';
    if (materialValue != '') {
        productvariant = productvariant + ' / ' + materialValue
    }

    if (productDetail.variants.length <= 1) {
        productDetails = productDetail.id + '__' + productDetail.title + '__' + format_currency(SettingCurrency, productDetail.variants[0].price);
    }
    for (let i = 0; i < productDetail.variants.length; i++) {
        var product_variant = productDetail.variants[i].title
        if (productvariant == product_variant) {
            idProduct = productDetail.variants[i].id;
            productDetails = productDetail.id + '__' + productDetail.title + '__' + format_currency(SettingCurrency, productDetail.variants[i].price);

        }
    }
    if (productDetail.variants.length == 1) {
        idProduct = productDetail.variants[0].id;
    }

    $.ajax({
        url: '/cart/add.js',
        method: "POST",
        data: {items: [{quantity: parseInt(productQuantity) > 1 ? parseInt(productQuantity) : 1, id: idProduct,}],},
        dataType: 'json'
    }).done((response) => {
        if (check_button == 'buy_now') {
            countBuyNow(productDetails);
            // redirect to checkout page
            window.location.href = "/checkout";
        } else {
            countAddToCart(productDetails);
            update_count_number();
            if (check_button == 'add_to_cart') {
                if (barSetting['add_to_cart_btn_action'] == 'go_to_cart_page') {
                    window.location.href = "/cart";
                } else {
                    removeElement();
                    // Loading form mini,sticky one more time
                    if ($('.mgn-stickycart-count')[0]) {
                        get_data_cart_in_view_mini(miniCartDetail, stickyCart, SettingCurrency);
                    }
                    document.getElementById("container-popup").style.display = "block";
                    setTimeout(function () {
                        document.getElementById("container-popup").style.display = "none";
                    }, 1000);
                    if (barSetting['add_to_cart_btn_action'] == 'open_mini_cart') {
                        jQuery.getJSON('/cart.js', function (cartDetail) {
                            if (cartDetail) {
                                $('#minicart_onboarding_content').remove();
                                view_mini_cart(cartDetail, miniCartDetail, SettingCurrency);
                                var duration = 500
                                if (miniCartDetail['type'] == 'mgn-minicart mgn-minicart--modal') {
                                    duration = 650
                                }
                                if (miniCartDetail['animation'] == 'horizontally') {
                                    $('.mgn-minicart').show("slide", {direction: "right"}, duration);
                                } else if (miniCartDetail['animation'] == 'vertically') {
                                    $('.mgn-minicart').slideDown(duration);
                                } else if (miniCartDetail['animation'] == 'fade') {
                                    $('.mgn-minicart').fadeIn(duration);
                                } else {
                                    $('.mgn-minicart').show();
                                }
                                if ($('.mgn-stickycart-count')) {
                                    $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
                                }
                                $('.mgn-stickybar').hide();
                            }
                        });
                    } else {
                        return;
                    }
                }
            }
        }
    }).fail((response) => {
        document.getElementById("container-popup-outofstock").style.display = "block";
        setTimeout(function () {
            document.getElementById("container-popup-outofstock").style.display = "none";
        }, 2000);
    });

}

function continue_to_buy(type, animation) {
    // enableBodyScrolling();
    if (shopPlan['plan_name'] != 'Advanced') {
        animation = ''
    }
    var duration = 500
    if (type == 'mgn-minicart mgn-minicart--modal') {
        duration = 650
    }
    if (animation == 'horizontally') {
        $('.mgn-minicart').hide("slide", {direction: "right"}, duration);
    } else if (animation == 'vertically') {
        $('.mgn-minicart').slideUp(duration);
    } else if (animation == 'fade') {
        $('.mgn-minicart').fadeOut(duration);
    } else {
        $('.mgn-minicart').hide();
    }
    $('.mgn-stickybar').show();
}

function get_data_cart_in_view_mini(mini_cart, sticky_cart, currency) {
    jQuery.getJSON('/cart.js', function (cartDetail) {
        if (cartDetail) {
            view_mini_cart(cartDetail, mini_cart, currency);
            view_shop_cart(cartDetail, sticky_cart);
        }
    });
}

// Function change select to know Out of stock for products variant
function AllFetchOnchangeSelect() {
    var sizeValue = $("#shopify_sticky_1 option:selected") ? $("#shopify_sticky_1 option:selected").text() : '';
    var colorValue = $("#shopify_sticky_2 option:selected") ? $("#shopify_sticky_2 option:selected").text() : '';
    var materialValue = $("#shopify_sticky_3 option:selected") ? $("#shopify_sticky_3 option:selected").text() : '';
    var productvariant = sizeValue.toString() + colorValue.toString() + materialValue.toString();
    var variant_id
    console.log(productvariant)
    // var get_select_shopify = document.getElementById('ProductSelect-product-template');
    // if (!get_select_shopify) {
    //     get_select_shopify = document.getElementById('ProductSelect--product-template');
    // }
    for (let i = 0; i < productDetail.variants.length; i++) {
        // var variant_out = get_select_shopify[i].text.split(" / ").join("");
        // Check out of stock or available
        if (productDetail.variants[i].title.split(" / ").join("") === productvariant) {
            var price = productDetail.variants[i].price ? format_currency(SettingCurrency, productDetail.variants[i].price) : '';
            var compare_money = productDetail.variants[i].compare_at_price ? format_currency(SettingCurrency, productDetail.variants[i].compare_at_price) : '';
            $('#mgn-product-price .mgn-product-price_s').text(price);
            $('#mgn-product-price .mgn-product-compare-at-price del').text(compare_money);
            variant_id = productDetail.variants[i].id
            console.log(variant_id)
        }
    }
    for (let i = 0; i < productDetail.images.length; i++) {
        if (productDetail.images[i].variant_ids.includes(variant_id)) {
            var variant_img_url = productDetail.images[i].src
            $('div.mgn-product-photo').find('img').attr("src", variant_img_url)
            break
        }
    }
}

// delete product
function delete_product_minicart(idProduct, priceProduct, quantity) {
    // Change quantity product from N to O
    if (idProduct > 0) {
        $.ajax({
            url: '/cart/change.js',
            method: "POST",
            data: {quantity: 0, id: idProduct},
            dataType: 'json'
        }).done((response) => {
            var idItem = '#item_mini_' + idProduct;
            var total_price_mini_cart = document.getElementById('total_mini_cart').className;
            //Update count number when delete product in mini cart
            update_count_number();
            //Delete product from items list and update price
            var input_id = '#input_' + idProduct.toString()
            var quantity_input = $(input_id).val()
            var removeCartItems = document.getElementsByClassName('mgn-minicart-item');
            if (removeCartItems.length <= 1) {
                $(".mgn-minicart-list").append($("<h3 class='sticky-cart-empty'>").text(miniCartDetail['text_empty_cart']));
            }
            $(idItem).hide()
            var updte_total = (parseInt(total_price_mini_cart) - parseInt(priceProduct) * parseInt(quantity_input)) / 100;
            $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
            if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
                $('#total_mini_cart').addClass(((updte_total) * 100).toString());
            }
        })


    }
}

function update_price(idProduct, priceProduct, quantity) {
    var total_price_mini_cart = document.getElementById('total_mini_cart').className;
    //Update count number when delete product in mini cart
    update_count_number();
    //Delete product from items list and update price
    var removeCartItems = document.getElementsByClassName('mgn-minicart-item');
    if (removeCartItems.length <= 1) {
        $(".mgn-minicart-list").append($("<h3 class='sticky-cart-empty'>").text(miniCartDetail['text_empty_cart']));
    }
    for (let i = 0; i < removeCartItems.length; i++) {
        var button = removeCartItems[i];
        button.addEventListener('click', function (event) {
            var buttonRemove = event.target;
            buttonRemove.parentElement.parentElement.remove();
        });
    }

    var updte_total = parseInt(total_price_mini_cart) - parseInt(priceProduct) * parseInt(quantity);
    $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
    if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
        $('#total_mini_cart').addClass(updte_total.toString());
    }
}

// The number of click add to cart
function countAddToCart(idProduct) {
    jQuery.ajax({
        method: "GET",
        url: window.AllFetchURL + "/count_add_to_cart/" + allfetchWAPGetShopify() + "/" + idProduct,
        error: function (xhr, status, error) {
            console.log("Error!" + xhr.status);
        },
        complete(data) {
        }
    });

}

//The number of click checkout
function countBuyNow(idProduct) {
    jQuery.ajax({
        method: "GET",
        url: window.AllFetchURL + "/count_buy_now/" + allfetchWAPGetShopify() + "/" + idProduct,
        error: function (xhr, status, error) {
            console.log("Error!" + xhr.status);
        },
        complete(data) {
        }
    })
}

function removeElement() {
    $('#minicart_onboarding_content').remove();
    $('.mgn-minicart').remove();
}


var count = 0;

function update_count_number() {
    jQuery.ajax({
        method: "GET",
        url: '/cart.json',
        complete(data) {
            try {
                cartData = JSON.parse(data["responseText"]);
                if ($('.mgn-stickycart-count')[0]) {
                    $('.mgn-stickycart-count')[0].innerText = cartData['item_count'];
                }
            } catch (e) {
                console.info(e);
            }
        }
    })
}

// Helpping customer for croll screen with top-bottom
function scrollFunction(position, type) {

    if (window.location.pathname.match("(.*)/products/(.*)") || window.location.pathname.match("(.*)/products")) {
        if (type === 'display_custom') {
            if (document.body.scrollTop >= window.innerHeight * (position / 100) || document.documentElement.scrollTop >= window.innerHeight * (position / 100)) {
                showStickyBar()
            } else {
                hideStickyBar()
            }
        } else {
            const a = Array.from(document.getElementsByTagName("button"))
                .filter(b => b.getAttribute('name') === 'add')

            if (a.length < 1) {
                if (document.body.scrollTop >= window.innerHeight * (35 / 100) || document.documentElement.scrollTop >= window.innerHeight * (35 / 100)) {
                    showStickyBar()
                } else {
                    hideStickyBar()
                }
            } else {
                if ((document.body.scrollTop >= $(a).offset().top || document.documentElement.scrollTop >= $(a).offset().top)) {
                    showStickyBar()
                } else {
                    hideStickyBar()
                }
            }
        }

    } else {
        showStickyBar()
    }
}

function update_product_minus(id_product, price_product) {
    $('.mini_cart_button_minus').attr('disabled', 'disabled');
    var idInput = '#input_' + id_product;
    var update_quantity_minus = 0;
    var quantity_current = parseInt($(idInput).val());
    update_quantity_minus = quantity_current - 1;
    var total_price_mini_cart = document.getElementById('total_mini_cart').className;
    if (update_quantity_minus < 1) {
        var idItem = '#item_mini_' + id_product;
        $.ajax({
            url: '/cart/change.js',
            method: "POST",
            data: {quantity: 0, id: id_product},
            dataType: 'json'
        }).done((response) => {
            jQuery.ajax({
                method: "GET",
                url: '/cart.json',
                complete(data) {
                    try {
                        var cartDetail = JSON.parse(data["responseText"]);
                        $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
                        var updte_total = cartDetail['total_price'] / 100;
                        $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
                        if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
                            updte_total = updte_total * 100
                            $('#total_mini_cart').addClass(updte_total.toString());
                        }
                        $(idInput).val(0);
                    } catch (e) {
                        console.info(e);
                    }
                }
            })
            // $(idItem).hide()
            // var updte_total = (parseInt(total_price_mini_cart) - parseInt(price_product)) / 100;
            // $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
            // if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
            //     updte_total = updte_total * 100
            //     $('#total_mini_cart').addClass(updte_total.toString());
            // }
            // $(idInput).val(update_quantity_minus);
        })
    } else {
        $.ajax({
            url: '/cart/change.js',
            method: "POST",
            data: {quantity: update_quantity_minus, id: id_product},
            dataType: 'json'
        }).done((response) => {
            jQuery.ajax({
                method: "GET",
                url: '/cart.json',
                complete(data) {
                    try {
                        var cartDetail = JSON.parse(data["responseText"]);
                        $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
                        var updte_total = cartDetail['total_price'] / 100;
                        $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
                        setTimeout(function () {
                            $('.mini_cart_button_update').removeAttr('disabled');
                        }, 200);
                        if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
                            updte_total = updte_total * 100
                            $('#total_mini_cart').addClass(updte_total.toString());
                        }
                        $(idInput).val(response['items'][0]['quantity']);
                    } catch (e) {
                        console.info(e);
                    }
                }
            })
            // $(idInput).val(response['items'][0]['quantity']);
            // var count = parseInt($('.mgn-stickycart-count')[0].innerText);
            // var update_count = parseInt(count) - 1;
            // $('.mgn-stickycart-count')[0].innerText = update_count;
            // var updte_total = (parseInt(total_price_mini_cart) - parseInt(price_product)) / 100;
            // $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
            // if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
            //     updte_total = updte_total * 100
            //     $('#total_mini_cart').addClass(updte_total.toString());
            // }
            // $(idInput).val(update_quantity_minus);
        })
    }
}


function update_product_plus(id_product, price_product) {
    $('.mini_cart_button_plus').attr('disabled', 'disabled');
    var total_price_mini_cart = document.getElementById('total_mini_cart').className;
    var idInput = '#input_' + id_product;
    $.ajax({
        url: '/cart/add.js',
        method: "POST",
        data: {items: [{quantity: 1, id: id_product,}]},
        dataType: 'json'
    }).done((response) => {
        jQuery.ajax({
            method: "GET",
            url: '/cart.json',
            complete(data) {
                try {
                    var cartDetail = JSON.parse(data["responseText"]);
                    $('.mgn-stickycart-count')[0].innerText = cartDetail['item_count'];
                    var updte_total = cartDetail['total_price'] / 100;
                    $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
                    setTimeout(function () {
                        $('.mini_cart_button_update').removeAttr('disabled');
                    }, 200);
                    if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
                        updte_total = updte_total * 100
                        $('#total_mini_cart').addClass(updte_total.toString());
                    }
                    $(idInput).val(response['items'][0]['quantity']);
                } catch (e) {
                    console.info(e);
                }
            }
        }).fail((err) => {
            console.log(err.message)
        })
        // var count = parseInt($('.mgn-stickycart-count')[0].innerText);
        // var update_count = parseInt(count) + 1;
        // $('.mgn-stickycart-count')[0].innerText = update_count;
        // var updte_total = (parseInt(total_price_mini_cart) + parseInt(price_product)) / 100;
        // $('.mgn-minicart-subtotal strong')[0].innerText = format_currency(SettingCurrency, updte_total);
        //
        // setTimeout(function () {
        //     $('.mini_cart_button_update').removeAttr('disabled');
        // }, 2000);
        // if ($('#total_mini_cart').removeClass(total_price_mini_cart)) {
        //     updte_total = updte_total * 100
        //     $('#total_mini_cart').addClass(updte_total.toString());
        // }
        // $(idInput).val(response['items'][0]['quantity']);

    })
}

function hoverAndActionDesktop(element, handle, url) {
    if (!isMobileDevice()) {
        // Desktop device
        $(element).hover(function () {
            $($(element).find('.product-variants-wrapper')).hide();
            $($(element).find('.real-atc-btn')).hide();
            $($(element).find('.quick-add-to-cart-wrapper')).addClass("mouse-on")
            $($(element).find('.atc-btn')).show();
            $($(element).find('.vp-btn')).show();
            $($(element).find('.noti-bar-wrapper')).hide();
            $($(element).find('.warning-bar-wrapper')).hide();
            if ($($(element).find('.qatc_input_qty_product')).val() == '') {
                $($(element).find('.qatc_input_qty_product')).val(1)
            }
            $($(element).find('.product-qty-wrapper')).css("display", "none");
            add_variants_wrapper(element, handle);
        }, function () {
            $($(element).find('.quick-add-to-cart-wrapper')).removeClass("mouse-on")
            $($(element).find('.noti-bar-wrapper')).hide();
            $($(element).find('.warning-bar-wrapper')).hide();
        })
    }

    if ($(element).find('.real-atc-btn')) {
        $(element).find('.real-atc-btn').off("click").on("click", function () {
            var quantity = $($(element).find('.qatc_input_qty_product')).val()
            var id_product = ''
            if ($(element).find('.product-variants').length > 0) {
                id_product = $($(element).find('.product-variants')).find(":selected").attr('data_var_id')
            } else {
                id_product = $($(element).find('.product-variants-wrapper')[0]).attr('data_var_id')
            }
            console.log(parseInt(quantity))
            console.log(id_product)
            $.ajax({
                url: '/cart/add.js',
                method: "POST",
                data: {items: [{quantity: parseInt(quantity), id: id_product,}]},
                dataType: 'json'
            }).done((response) => {
                update_count_number()
                $($(element).find('.product-qty-wrapper')).hide()
                $($(element).find('.noti-bar-wrapper')).show();
                $($(element).find('.real-atc-btn')).hide()
                $($(element).find('.product-variants-wrapper')).hide()
                $($(element).find('.qatc_input_qty_product')).val(1)
            }).fail((err) => {
                console.log(err.message)
                $($(element).find('.product-qty-wrapper')).hide()
                $($(element).find('.warning-bar-wrapper')).show();
                $($(element).find('.real-atc-btn')).hide()
                $($(element).find('.product-variants-wrapper')).hide()
                $($(element).find('.qatc_input_qty_product')).val(1)
            })
            event.stopPropagation();
            event.preventDefault();
        })
    }
    if ($(element).find('.atc-btn')) {
        $(element).find('.atc-btn').off("click").on("click", function () {
            $($(element).find('.product-qty-wrapper')).css("display", "flex")
            $($(element).find('.product-variants-wrapper')).show()
            $($(element).find('.real-atc-btn')).show()
            $($(element).find('.atc-btn')).hide()
            $($(element).find('.vp-btn')).hide()
            event.stopPropagation();
            event.preventDefault();
        })
    }
    if ($(element).find('.vp-btn')) {
        $(element).find('.vp-btn').off("click").on("click", function () {
            window.location.href = url
            event.stopPropagation();
            event.preventDefault();
        })
    }
    if ($(element).find('.product-qty-wrapper')) {
        $(element).find('.product-qty-wrapper').off("click").on("click", function () {
            event.stopPropagation();
            event.preventDefault();
        })
    }
    qatc_qty_change(element, handle, 'qatc_input_qty_product')
    if ($(element).find('.product-variants')) {
        $(element).find('.product-variants').off("click").on("click", function () {
            event.stopPropagation();
            event.preventDefault();
        })
    }

    if ($(element).find('.quick-add-to-cart-wrapper')) {
        $(element).find('.quick-add-to-cart-wrapper').off("click").on("click", function (e) {
            if (e.target !== this)
                return;
            window.location.href = url
            event.stopPropagation();
            event.preventDefault();
        })
    }
}

function hoverAndActionMobile(element, handle, url) {
    if (isMobileDevice()) {
        // Mobile device does not have hover event, so use touch event
        document.addEventListener("touchstart", function (event) {
            if ($($(element)[0]).is(event.target) || $(element)[0].contains(event.target)) {
                if ($($(element).find('.quick-add-to-cart-wrapper')).is(":hidden")) {
                    $($(element).find('.quick-add-to-cart-wrapper')).show();
                } else {
                    return
                }
            } else {
                $($(element).find('.quick-add-to-cart-wrapper')).css("display", "none");
            }
        })

        var qatc_bar = $('.quick-add-to-cart-wrapper-bar')

        if ($(element).find('.atc-icon')) {
            $(element).find('.atc-icon').off("click").on("click", function () {
                $($(element).find('.quick-add-to-cart-wrapper')).hide()
                $('.qatc-blur').show()
                $(qatc_bar).fadeIn(600)
                setInfoQuickAddToCartBar(handle, url)
                event.stopPropagation();
                event.preventDefault();
            })
        }

        if ($(element).find('.vp-btn')) {
            $(element).find('.vp-btn').off("click").on("click", function () {
                window.location.href = url
                event.stopPropagation();
                event.preventDefault();
            })
        }

        if ($(element).find('.quick-add-to-cart-wrapper')) {
            $(element).find('.quick-add-to-cart-wrapper').off("click").on("click", function (e) {
                window.location.href = url
                event.stopPropagation();
                event.preventDefault();
            })
        }

        $('.qatc-blur').click(function () {
            closeQuickAddToCartBar()
        })

        $('.qtc-product-close').click(function () {
            closeQuickAddToCartBar()
        })

        if ($(qatc_bar).find('.real-atc-btn')) {
            $(qatc_bar).find('.real-atc-btn').off("click").on("click", function () {
                var quantity = $('.input_qty_product_under').val()
                var id_product = ''
                if ($(qatc_bar).find('.product-variants-bar').length > 0) {
                    id_product = $('.product-variants-bar').find(":selected").attr('data_var_id')
                } else {
                    id_product = $('.product-variants-wrapper-bar').attr('data_var_id')
                }
                console.log(parseInt(quantity))
                console.log(id_product)
                $.ajax({
                    url: '/cart/add.js',
                    method: "POST",
                    data: {items: [{quantity: parseInt(quantity), id: id_product,}]},
                    dataType: 'json'
                }).done((response) => {
                    update_count_number()
                    $(qatc_bar).find('.noti-wrapper-bar').show();
                    $(qatc_bar).find('.atc-wrapper-bar').hide()
                    setTimeout(function () {
                        $(qatc_bar).find('.atc-wrapper-bar').show();
                        $(qatc_bar).find('.noti-wrapper-bar').hide();
                        $(qatc_bar).find('.input_qty_product_under').val(1)
                    }, 1500);
                }).fail((err) => {
                    console.log(err.message)
                    $(qatc_bar).find('.warning-wrapper-bar').show();
                    $(qatc_bar).find('.atc-wrapper-bar').hide()
                    setTimeout(function () {
                        $(qatc_bar).find('.atc-wrapper-bar').show();
                        $(qatc_bar).find('.warning-wrapper-bar').hide();
                        $(qatc_bar).find('.input_qty_product_under').val(1)
                    }, 1500);
                })
            })
        }
    }

}

function closeQuickAddToCartBar() {
    if ($('.qatc-blur').is(':visible')) {
        $('.qatc-blur').hide()
    }
    if ($('.quick-add-to-cart-wrapper-bar').is(':visible')) {
        $('.quick-add-to-cart-wrapper-bar').fadeOut(600)
    }
    $('.input_qty_product_under').val(1)
}

function setInfoQuickAddToCartBar(handle, product_url) {
    var wrapper_bar = $('.quick-add-to-cart-wrapper-bar')
    var product_data
    $('.product-variants-bar').attr('id', handle + '_qatc-variants')
    $('.input_qty_product_under').attr('productname', handle)
    $('.qatc-product-price a').attr('href', product_url)
    qatc_qty_change(wrapper_bar, handle, 'input_qty_product_under')
    add_variants_wrapper(wrapper_bar, handle)
    jQuery.ajax({
        type: "GET",
        url: product_url + '.json',
        data: JSON.stringify({}),
        error: function (request, error) {
        },
        complete(data) {
            // return data of product detail
            try {
                product_data = JSON.parse(data["responseText"])['product'];
                $('.qatc-product-name span').text(product_data['title'].slice(0, 20) + '...')
                var money = product_data.variants[0].price ? format_currency(SettingCurrency, product_data.variants[0].price) : '';
                $('.qatc-product-price span').text(money)
                $('.qatc-product-image-bar').attr('src', product_data['image']['src'])
                $('.product-variants-bar').change(function () {
                    QatcBarOnchangeSelect(product_data)
                })
            } catch (e) {
                console.info(e);
                return;
            }
        }, async: false,
    });
}

function strip_handle(handle) {
    let final_string = "";
    if (handle != undefined) {
        var no_and = handle.split("&")[0];
        var no_query = no_and.split("?")[0];
        final_string = no_query;
    }
    return final_string;
}

function QatcBarOnchangeSelect(product_data) {
    var product_variant = $(".product-variants-bar option:selected").text().split(" / ").join("")
    var variant_id
    for (let i = 0; i < product_data.variants.length; i++) {
        if (product_data.variants[i].title.split(" / ").join("") === product_variant) {
            var price = product_data.variants[i].price ? format_currency(SettingCurrency, product_data.variants[i].price) : '';
            $('.qatc-product-price span').text(price)
            variant_id = product_data.variants[i].id
        }
    }
    for (let i = 0; i < product_data.images.length; i++) {
        if (product_data.images[i].variant_ids.includes(variant_id)) {
            var variant_img_url = product_data.images[i].src
            $('.qatc-product-image-bar').attr("src", variant_img_url)
            break
        }
    }
}

function qatc_qty_change(wrapper, handle, classname) {
    if ($(wrapper).find('.qty-btn')) {
        $(wrapper).find('.qty-btn').off("click").on("click", function () {
            var result, qty = 0;
            if (this.classList.contains('qatc-minus')) {
                qty = -1
            }
            if (this.classList.contains('qatc-plus')) {
                qty = 1
            }
            productname = "' + handle + '"
            var value = $("[class='" + classname + "'][productname=" + handle + "]").val()
            result = parseInt(value) + qty
            $("[class='" + classname + "'][productname=" + handle + "]").val(result)
            if (result <= 1) {
                $("[class='" + classname + "'][productname=" + handle + "]").val(1)
            }
        })
    }
}

function add_variants_wrapper(element, handle) {
    var variants_wrapper = $(element).find('#' + handle + '_qatc-variants');
    $.getJSON('/products/' + handle + '.js', function (result) {
        if (result.available) {
            var variantsItem = result.variants;
            let option_item = '';

            var isNoVariants = false;
            if (variantsItem.length == 1) {
                isNoVariants = true;
                // if (variantsItem[0].title == "Default Title") {
                //     isNoVariants = true;
                // }
            }
            if (isNoVariants) {
                $(variants_wrapper).parent().attr("data_var_id", variantsItem[0].id);
                $(variants_wrapper).parent().hide()
                $(variants_wrapper).remove()
            } else {
                for (let i = 0, va = variantsItem.length; i < va; i++) {
                    if (variantsItem[i].available) {
                        option_item += '<option data_var_id="' + variantsItem[i].id + '">' + variantsItem[i].title + '</option>'
                    }
                }
                variants_wrapper.html(option_item);
            }
        } else {
            $(variants_wrapper).parent().hide()
            $(variants_wrapper).remove()
        }
    })
}

function set_quick_add_to_cart_size(element, height) {
    var font_height = height / 20
    if (font_height > 28) {
        font_height = 28
    } else if (font_height < 11) {
        font_height = 11
    }
    $(element).find(".quick-add-to-cart-wrapper").height(height)
    $(element).find(".quick-add-to-cart-elements-wrapper").css("margin-top", 2 * height / 5)
    $(element).find(".product-qty-wrapper").css({
        "max-height": 70,
        "min-height": 25,
        "height": height / 8,
        "margin-bottom": height / 25
    })
    $(element).find(".product-variants-wrapper").css({
        "max-height": 70,
        "min-height": 25,
        "height": height / 8,
        "margin-bottom": height / 25
    })
    $(element).find(".qatc_input_qty_product").css({
        "min-height": 25,
    })
    $(element).find(".product-variants").css({
        "max-height": 70,
        "min-height": 25,
        "height": height / 8,
        "font-size": font_height,
        "padding-top": 0,
        "padding-bottom": 0,
        "width": "100%",
        "min-width": 60,
    })
    $(element).find("button").css({
        "max-height": 70,
        "min-height": 25,
        "height": height / 8,
        "font-size": font_height,
    })
    $(element).find(".quick-add-btn-wrapper > button").css({
        "border-radius": font_height / 2,
    })
    $(element).find(".noti-bar-wrapper > button").css({
        "border-radius": 0,
    })
    $(element).find(".warning-bar-wrapper > button").css({
        "border-radius": 0,
    })
}

//=============================================================================================================================================================================
//=============================================================================================================================================================================
