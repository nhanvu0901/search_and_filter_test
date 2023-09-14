<template>
    <div class="nb-checkout-btn-cart" style="padding-bottom: 0; gap: 2px; display: flex; flex-direction: column">
        <div v-if="total_sale_off > 0 && is_bundle"
             style="font-size: 2rem; color: #a2a2a2; text-decoration: line-through"
             class="flex-row-reverse nb-output">{{ formattedPrice(subTotal) }}
        </div>
        <div style="font-size: 16px; font-weight: 500" class="flex-row-reverse"
             v-if="(total_sale_off > 0 || stringFreeGift) && is_bundle">
            You saved with our bundle!
        </div>
        <div class="flex-row-reverse">
            <div class="nb-output" v-if="total_sale_off > 0 && is_bundle"
                 style="font-size: 18px; color: #3199FF; letter-spacing: 1px; padding: 0 5px; border: 2px solid #3199FF; font-weight: 700; border-radius: 4px">
                -{{ formattedPrice(total_sale_off) }}
            </div>
        </div>
        <div v-if="total_sale_off > 0 && is_bundle" class="flex-row-reverse"
             style="align-items: center; gap: 20px; margin-top: 5px">
            <div class="nb-output" style="font-size: 2rem; color: #939393">
                {{ formattedPrice((subTotal - total_sale_off).toFixed(2)) }}
            </div>
            <div style="font-size: 2rem">Subtotal</div>
        </div>
        <div v-if="total_sale_off == 0 && subTotal > 0" class="flex-row-reverse"
             style="align-items: center; gap: 20px; margin-top: 5px">
            <div class="nb-output" style="font-size: 2rem; color: #939393">
                {{ formattedPrice(subTotal) }}
            </div>
            <div style="font-size: 2rem">Subtotal</div>
        </div>
        <div v-if="list_free_gift.length > 0 && is_bundle" style="padding-bottom: 15px; text-align: right"
             class="flex-row-reverse">
            You got {{ stringFreeGift }} as our free gift!
        </div>
        <div style="margin-bottom: 10px; text-align: right; color: #939393">
            Taxes and shipping calculated at checkout
        </div>
        <div v-if="is_bundle" @click="checkOut" class="nb-checkout">Check out</div>
        <button class="nb-checkout" type="submit" v-if="!is_bundle && !is_btn_checkout" form="cart" name="checkout">
            Check out
        </button>
    </div>
</template>
<script>
import axios from "axios"

export default {
    name: "CartPreview",
    // created() {
    //     let nb_check_out = document.getElementById('nb_check_out')
    //     if (nb_check_out) {
    //         this.is_btn_checkout = true
    //     }
    // },
    mounted() {
        let self = this
        self.country_code = Shopify.country
        self.store_currency = Shopify.currency.active
        self.locale = Shopify.locale
        self.render_cart()
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.initiatorType === "fetch") {
                    let list = ["/cart/add.js", "/cart/update.js", "/cart/change.js", "/cart/clear.js", "/cart/change"]
                    if (list.some(element => {
                        return entry.name.includes(element)
                    })) {
                        self.render_cart()
                    }
                }
            }
        })
        observer.observe({
            entryTypes: ["resource"]
        })
    },
    methods: {
        render_cart() {
            let self = this
            self.is_bundle = false
            let cart_infors = []
            axios.get(window.location.origin + "/cart.js").then(res_cart => {
                self.subTotal = res_cart.data.total_price / 100
                if (res_cart.data.items) {
                    for (let item of res_cart.data.items) {
                        cart_infors.push({
                            product_id: item.product_id,
                            product_name: item.product_title,
                            variant_id: item.variant_id,
                            quantity: item.quantity
                        })
                    }
                }
            }).then(() => {
                axios.post("/apps/nestbundle/shopify_cart", {
                    jsonrpc: "2.0",
                    params: {
                        cart_infors: cart_infors,
                        shop_url: window.location.host,
                        currency: Shopify.currency.active,
                        nbFreeGift: localStorage.getItem('nbFreeGift')
                    }
                }).then(response => {
                    if (response.data.result.list_bundle_price) {
                        let nb_check_out = document.getElementById('nb_check_out')
                        if (nb_check_out) {
                            nb_check_out.remove()
                            this.is_btn_checkout = false
                        }
                        self.is_bundle = true
                        self.list_bundle = response.data.result.list_bundle_price
                        self.currency_rate = parseFloat(Shopify.currency.rate)
                        self.currencySymbol = response.data.result.currency_symbol
                        let cart_error = document.getElementById("cart-errors")
                        if (cart_error) {
                            cart_error.style.display = "none"
                        }
                    } else {
                        if (response.data.result.error) {
                            console.log(response.data.result.error)
                        }
                    }
                }).catch(error => {
                    console.log(error)
                })
            }).catch(error => {
                console.log(error)
            })
        },
        checkOut() {
            axios.get(window.location.origin + "/cart.js").then(res_cart => {
                if (res_cart.data.items) {
                    let cart_infors = []
                    for (let item of res_cart.data.items) {
                        cart_infors.push({
                            product_id: item.product_id,
                            product_name: item.product_title,
                            variant_id: item.variant_id,
                            quantity: item.quantity
                        })
                    }
                    axios.post('/apps/nestbundle/shopify_create_draft_order', {
                        jsonrpc: '2.0', params: {
                            cart_infors: cart_infors,
                            shop_url: window.location.host,
                            nbFreeGift: localStorage.getItem('nbFreeGift')
                        }
                    }).then(response_checkout => {
                        if (response_checkout.data.result.draft_order_url != 0) {
                            localStorage.clear()
                            window.location.href = response_checkout.data.result.draft_order_url
                        } else {
                            console.log("error_check_out: ", response_checkout.data.result.error_check_out)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
            })
        },
        formattedPrice(price) {
            let self = this
            let option = {style: 'currency', currency: self.store_currency}
            let stringFormatted = ''
            if (parseFloat(price).toLocaleString(self.localeString, option).includes(self.currencySymbol + '.')) {
                stringFormatted = parseFloat(price).toLocaleString(self.localeString, option).replace(self.currencySymbol + '.', ' ') + self.store_currency
            } else {
                stringFormatted = parseFloat(price).toLocaleString(self.localeString, option).replace(self.currencySymbol, '') + ' ' + self.store_currency
            }
            if (stringFormatted.split(self.store_currency).length - 1 == 2) {
                stringFormatted = stringFormatted.replace(self.store_currency, '')
            }
            return stringFormatted
        }
    },
    data() {
        return {
            list_bundle: [],
            store_currency: '',
            country_code: '',
            locale: '',
            currency_rate: 0,
            subTotal: 0,
            currencySymbol: '',
            is_bundle: false,
            is_btn_checkout: true
        }
    },
    computed: {
        list_free_gift() {
            let self = this
            let list_free_gift = []
            for (let bundle of self.list_bundle) {
                if (bundle.bundle_type == "product_bundle_free_gift") {
                    for (let gift of bundle.free_gift) {
                        if (list_free_gift.length <= 0) {
                            list_free_gift.push(gift)
                        } else {
                            const index = list_free_gift.findIndex(item => item.variant_id === gift.variant_id)
                            if (index !== -1) {
                                // Nếu variant_id đã tồn tại trong list_gift, cộng thêm quantity vào list_gift
                                list_free_gift[index].quantity += gift.quantity
                            } else {
                                // Nếu variant_id chưa tồn tại trong list_gift, thêm gift vào list_gift
                                list_free_gift.push(gift)
                            }
                        }
                    }
                }
            }
            return list_free_gift
        },
        stringFreeGift() {
            let self = this
            let totalStringFreeGift = ''
            if (self.list_free_gift.length > 0) {
                for (let item of self.list_free_gift) {
                    if (item.variant_label != "Default Title") {
                        totalStringFreeGift += `"${item.quantity} ${item.product_name} (${item.variant_label})" `
                    } else {
                        totalStringFreeGift += `"${item.quantity} ${item.product_name}" `
                    }
                }
            }
            return totalStringFreeGift
        },
        total_sale_off() {
            let self = this
            let total_sale_off = 0
            for (let bundle of self.list_bundle) {
                if (bundle.bundle_type != "product_bundle_free_gift") {
                    total_sale_off += bundle.price_is_reduced
                }
            }
            return total_sale_off * this.currency_rate
        },
        localeString() {
            if (this.store_currency === 'EUR') {
                return 'de-' + this.country_code
            } else {
                return this.locale + '-' + this.country_code
            }
        }
    }
}
</script>
<style>
.flex-row-reverse {
    display: flex;
    flex-direction: row-reverse
}

.nb-checkout {
    width: 290px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 0;
    margin-right: 0;
    margin-left: auto;
    padding: 0 3rem;
    cursor: pointer;
    font: inherit;
    font-size: 1.5rem;
    text-decoration: none;
    color: white;
    transition: box-shadow 0.1s ease;
    -webkit-appearance: none;
    appearance: none;
    background-color: black;
    line-height: 3;
    border-radius: 6px;
}

.strikeThrough {
    text-decoration: line-through;
}

#ns-bundle-cart-preview {
    margin-right: 0 !important;
    width: 50%;
}

.cart__footer {
    display: flex;
    flex-direction: row;
    float: right;
    width: 100%;
    padding: 20px 0 20px 0 !important;
}
</style>