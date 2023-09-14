import json
import logging
import requests
import shopify
import traceback
from operator import itemgetter

from odoo import http
from odoo.http import request

from .auth import verify_app_proxy_request
from .currency_symbol import get_currency_symbol

logger = logging.getLogger(__name__)


def nb_get_bundle_is_applicable(**kw):
    try:
        list_product_in_cart = []
        product_info_dict = {}
        for item in kw['cart_infors']:
            product_id = item['product_id']
            variant_id = item['variant_id']
            quantity = item['quantity']

            if product_id in product_info_dict:
                product_info = product_info_dict[product_id]
                if 'variants' in product_info:
                    product_info['variants'].append({
                        'variant_id': variant_id,
                        'quantity': quantity
                    })
                else:
                    product_info['variants'] = [{
                        'variant_id': variant_id,
                        'quantity': quantity
                    }]
                product_info['total_quantity'] += quantity
            else:
                product_info_dict[product_id] = {
                    'product_id': product_id,
                    'product_name': item['product_name'],
                    'variants': [{
                        'variant_id': variant_id,
                        'quantity': quantity
                    }],
                    'total_quantity': quantity
                }

        for product_info in product_info_dict.values():
            list_product_in_cart.append(product_info)

        current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['shop_url'])], limit=1)
        bundles = request.env['nb.bundle'].sudo().search([("shopify_store", '=', current_shopify_store.id), ("status", '=', 'active'), ('active_bundle', '=', True)])

        if bundles:
            list_bundle = []
            for bundle in bundles:
                if bundle.bundle_type == 'product':
                    count = 0
                    for product_in_cart in list_product_in_cart:
                        for product_in_bundle in json.loads(bundle.bundle_json):
                            if str(product_in_cart['product_id']) == product_in_bundle['id']:
                                if (product_in_bundle['selected_label'] == 'Default Title' or product_in_bundle['selected_variant'] == 'all') and product_in_cart['total_quantity'] >= 1:
                                    count += 1
                                if product_in_bundle['selected_label'] != 'Default Title' and product_in_bundle['selected_variant'] != 'all':
                                    for variant_in_cart in product_in_cart['variants']:
                                        if product_in_bundle['selected_variant'] == str(variant_in_cart['variant_id']) and variant_in_cart['quantity'] >= 1:
                                            count += 1

                    if count == len(json.loads(bundle.bundle_json)):
                        list_bundle.append(bundle.get_data_bundle())

                if bundle.bundle_type == 'volume':
                    for product_in_cart in list_product_in_cart:
                        count = 0
                        if str(product_in_cart['product_id']) == json.loads(bundle.volume_json)['productSelected']['id']:
                            for discount_type in json.loads(bundle.volume_json)['discountType']:
                                if product_in_cart['total_quantity'] >= discount_type['quantity']:
                                    count += 1

                        if count > 0:
                            bundle_temp = bundle.get_data_bundle()
                            if bundle_temp not in list_bundle:
                                list_bundle.append(bundle_temp)

            count_time_bundle = []

            for bundle in list_bundle:
                if bundle['bundle']['bundleType'] == "product":
                    for product_in_bundle in json.loads(bundle['bundle_json']):
                        for product_in_cart in list_product_in_cart:
                            if str(product_in_cart['product_id']) == product_in_bundle['id']:
                                if product_in_bundle['selected_label'] == "Default Title" or product_in_bundle['selected_variant'] == "all":
                                    product_bundle_count_time = {
                                        'product_name': product_in_cart['product_name'],
                                        'product_id': str(product_in_bundle['id']),
                                        "time": product_in_cart['total_quantity'],
                                        "bundle_id": bundle['bundle_ids'],
                                        "bundle_type": 'product',
                                        "priority": bundle['priority'],
                                        'variant_id': 'All variants'
                                    }
                                    if product_bundle_count_time not in count_time_bundle:
                                        count_time_bundle.append(product_bundle_count_time)

                                if product_in_bundle['selected_label'] != "Default Title" and product_in_bundle['selected_variant'] != "all":
                                    for variant_in_cart in product_in_cart['variants']:
                                        if product_in_bundle['selected_variant'] == str(variant_in_cart['variant_id']):
                                            product_bundle_count_time = {
                                                "variant_label": product_in_bundle['selected_label'],
                                                'variant_id': str(variant_in_cart['variant_id']),
                                                'product_name': product_in_cart['product_name'],
                                                'product_id': str(product_in_bundle['id']),
                                                "time": variant_in_cart['quantity'],
                                                "bundle_id": bundle['bundle_ids'],
                                                "bundle_type": 'product',
                                                "priority": bundle['priority']
                                            }
                                            if product_bundle_count_time not in count_time_bundle:
                                                count_time_bundle.append(product_bundle_count_time)

                if bundle['bundle']['bundleType'] == 'volume':
                    for product_in_cart in list_product_in_cart:
                        if str(product_in_cart['product_id']) == json.loads(bundle['volume_json'])['productSelected']['id']:
                            for option in json.loads(bundle['volume_json'])['discountType']:
                                temp_volume_bundle_data = {
                                    "time": product_in_cart['total_quantity'] // option['quantity'],
                                    'product_id': str(product_in_cart['product_id']),
                                    'product_name': product_in_cart['product_name'],
                                    "quantity_need_per_bundle": option['quantity'],
                                    "bundle_id": bundle['bundle_ids'],
                                    "priority": bundle['priority'],
                                    "bundle_type": 'volume'
                                }
                                if temp_volume_bundle_data not in count_time_bundle:
                                    count_time_bundle.append(temp_volume_bundle_data)

            sorted_list = sorted(count_time_bundle, key=itemgetter('priority', 'time'))
            list_count_bundle_time = []
            seen_combinations = set()

            for item in sorted_list:
                combination = (item['priority'], item['bundle_id'])
                if combination not in seen_combinations:
                    list_count_bundle_time.append({
                        'bundle_type': item['bundle_type'],
                        'bundle_id': item['bundle_id'],
                        'priority': item['priority'],
                        'time': item['time']
                    })
                    seen_combinations.add(combination)

            list_bundle_is_applicable = nb_get_list_bundle_applicable(list_count_bundle_time, list_bundle, list_product_in_cart)

            return {
                "list_bundle_is_applicable": list_bundle_is_applicable,
                'store_currency': current_shopify_store.currency,
                'list_bundle': list_bundle
            }
        else:
            return {'list_bundle_is_applicable': 0}
    except Exception as e:
        logger.error(traceback.format_exc())
        return {'list_bundle_is_applicable': 0, "error": e}


def nb_get_list_bundle_applicable(list_count_bundle_time, list_bundle, list_product_in_cart):
    try:
        if len(list_count_bundle_time) > 0:
            list_bundle_is_applicable = []
            for line in list_count_bundle_time:
                if line['bundle_type'] == "product":
                    if line['time'] == 1:
                        for bundle in list_bundle:
                            count_product = 0
                            if bundle['bundle_ids'] == line['bundle_id']:
                                list_variant_id_in_product_bundle = []
                                for product_in_bundle in json.loads(bundle['bundle_json']):
                                    if product_in_bundle['selected_variant'] == 'all' or product_in_bundle['selected_label'] == 'Default Title':
                                        for product_in_cart in list_product_in_cart:
                                            if len(product_in_cart['variants']) > 1:
                                                for i in range(0, len(product_in_cart['variants']) - 1):
                                                    if product_in_bundle['id'] == str(product_in_cart['product_id']) and product_in_cart['total_quantity'] >= 1:
                                                        product_in_cart['variants'][i]['quantity'] -= 1
                                                        variant_id = str(product_in_cart['variants'][i]['variant_id'])

                                                        if product_in_cart['variants'][i]['quantity'] < 0:
                                                            product_in_cart['variants'][i + 1]['quantity'] -= 1
                                                            product_in_cart['variants'][i]['quantity'] = 0
                                                            variant_id = str(product_in_cart['variants'][i + 1]['variant_id'])

                                                        list_variant_id_in_product_bundle.append({
                                                            "quantity": 1, 'variant_id': variant_id
                                                        })
                                                        product_in_cart['total_quantity'] -= 1
                                                        count_product += 1

                                            else:
                                                if product_in_bundle['id'] == str(product_in_cart['product_id']) and product_in_cart['variants'][0]['quantity'] >= 1:
                                                    product_in_cart['variants'][0]['quantity'] -= 1
                                                    product_in_cart['total_quantity'] -= 1
                                                    count_product += 1
                                                    list_variant_id_in_product_bundle.append({
                                                        "quantity": 1, "variant_id": product_in_cart['variants'][0]['variant_id']
                                                    })

                                    if product_in_bundle['selected_variant'] != 'all' and product_in_bundle['selected_label'] != 'Default Title':
                                        for product_in_cart in list_product_in_cart:
                                            for variant_in_cart in product_in_cart['variants']:
                                                if str(variant_in_cart['variant_id']) == product_in_bundle['selected_variant'] and variant_in_cart['quantity'] >= 1:
                                                    variant_in_cart['quantity'] -= 1
                                                    product_in_cart['total_quantity'] -= 1
                                                    count_product += 1
                                                    list_variant_id_in_product_bundle.append({
                                                        'quantity': 1, 'variant_id': variant_in_cart['variant_id']
                                                    })

                                    if count_product == len(json.loads(bundle['bundle_json'])):
                                        list_bundle_is_applicable.append({
                                            "variant_ids": list_variant_id_in_product_bundle,
                                            'bundle_id': line['bundle_id'],
                                            "priority": line['priority'],
                                            "time": 1
                                        })

                    elif line['time'] > 1:
                        list_temp_product_in_cart = [dict(item) for item in list_product_in_cart]
                        variant_ids = []
                        for i in range(line['time'], 0, -1):
                            for bundle in list_bundle:
                                count_product = 0
                                if bundle['bundle_ids'] == line['bundle_id']:
                                    for product_in_cart in list_temp_product_in_cart:
                                        for product_in_bundle in json.loads(bundle['bundle_json']):
                                            if product_in_bundle['selected_variant'] == "all" or product_in_bundle['selected_label'] == "Default Title":
                                                if product_in_bundle['id'] == str(product_in_cart['product_id']) and product_in_cart['total_quantity'] >= i:
                                                    count_product += 1

                                            if product_in_bundle['selected_variant'] != "all" and product_in_bundle['selected_label'] != "Default Title":
                                                for variant_in_cart in product_in_cart['variants']:
                                                    if product_in_bundle['selected_variant'] == str(variant_in_cart['variant_id']) and variant_in_cart['quantity'] >= i:
                                                        count_product += 1

                                        if count_product == len(json.loads(bundle['bundle_json'])):
                                            if len(list_bundle_is_applicable) > 0:
                                                check_bundle_in_list = 0
                                                for item_in_list in list_bundle_is_applicable:
                                                    if item_in_list['bundle_id'] == bundle['bundle_ids']:
                                                        check_bundle_in_list += 1

                                                if check_bundle_in_list == 0:
                                                    for product_in_bundle in json.loads(bundle['bundle_json']):
                                                        for product_in_temp_cart in list_temp_product_in_cart:
                                                            if product_in_bundle['selected_variant'] != 'all' and product_in_bundle['selected_label'] != "Default Title":
                                                                for variant_in_cart in product_in_temp_cart['variants']:
                                                                    if str(variant_in_cart['variant_id']) == product_in_bundle['selected_variant']:
                                                                        variant_in_cart['quantity'] -= i
                                                                        product_in_temp_cart['total_quantity'] -= i
                                                                        variant_ids.append({
                                                                            "quantity": i,
                                                                            'variant_id': variant_in_cart['variant_id']
                                                                        })

                                                            if product_in_bundle['selected_variant'] == 'all' or product_in_bundle['selected_label'] == "Default Title":
                                                                needed_quantity = i
                                                                if str(product_in_temp_cart['product_id']) == product_in_bundle['id']:
                                                                    subtracted_quantity = ''
                                                                    for variant_in_cart in product_in_temp_cart['variants']:
                                                                        remaining_quantity = variant_in_cart['quantity']
                                                                        if remaining_quantity <= 0 and product_in_temp_cart['total_quantity'] >= needed_quantity:
                                                                            product_in_temp_cart['total_quantity'] -= needed_quantity
                                                                            for z in range(len(product_in_temp_cart['variants']) - 1):
                                                                                variant_ids.append({
                                                                                    'quantity': product_in_temp_cart['variants'][z]['quantity'],
                                                                                    "variant_id": product_in_temp_cart['variants'][z]['variant_id']
                                                                                })
                                                                                product_in_temp_cart['variants'][z]['quantity'] -= needed_quantity
                                                                                if product_in_temp_cart['variants'][z]['quantity'] < 0:
                                                                                    product_in_temp_cart['variants'][z + 1]['quantity'] += product_in_temp_cart['variants'][z]['quantity']
                                                                                    needed_quantity -= product_in_temp_cart['variants'][z]['quantity']
                                                                                    variant_ids.append({
                                                                                        'quantity': -product_in_temp_cart['variants'][z]['quantity'],
                                                                                        "variant_id": product_in_temp_cart['variants'][z+1]['variant_id']
                                                                                    })
                                                                                    product_in_temp_cart['variants'][z]['quantity'] = 0

                                                                            if needed_quantity == 0:
                                                                                break
                                                                        if variant_in_cart['quantity'] > 0 and needed_quantity > 0:
                                                                            if subtracted_quantity:
                                                                                subtracted_quantity = min(variant_in_cart['quantity'], needed_quantity, subtracted_quantity)
                                                                                variant_ids.append({
                                                                                    "quantity": subtracted_quantity,
                                                                                    'variant_id': variant_in_cart['variant_id']
                                                                                })
                                                                                needed_quantity -= subtracted_quantity
                                                                                variant_in_cart['quantity'] -= subtracted_quantity
                                                                                product_in_temp_cart['total_quantity'] -= subtracted_quantity
                                                                                remaining_quantity -= subtracted_quantity
                                                                            else:
                                                                                subtracted_quantity = min(variant_in_cart['quantity'], needed_quantity, remaining_quantity)
                                                                                variant_ids.append({
                                                                                    "quantity": subtracted_quantity,
                                                                                    'variant_id': variant_in_cart['variant_id']
                                                                                })
                                                                                needed_quantity -= subtracted_quantity
                                                                                variant_in_cart['quantity'] -= subtracted_quantity
                                                                                product_in_temp_cart['total_quantity'] -= subtracted_quantity
                                                                                remaining_quantity -= subtracted_quantity

                                                    list_bundle_is_applicable.append({
                                                        'bundle_id': line['bundle_id'],
                                                        "priority": line['priority'],
                                                        "variant_ids": variant_ids,
                                                        "time": i
                                                    })

                                            else:
                                                for product_in_temp_cart in list_temp_product_in_cart:
                                                    for product_in_bundle in json.loads(bundle['bundle_json']):
                                                        if product_in_bundle['selected_label'] != "Default Title" and product_in_bundle['selected_variant'] != 'all':
                                                            for variant_in_cart in product_in_temp_cart['variants']:
                                                                if str(variant_in_cart['variant_id']) == product_in_bundle['selected_variant']:
                                                                    variant_in_cart['quantity'] -= i
                                                                    product_in_temp_cart['total_quantity'] -= i
                                                                    variant_ids.append({
                                                                        "quantity": i,
                                                                        'variant_id': variant_in_cart['variant_id']
                                                                    })
                                                        if product_in_bundle['selected_label'] == "Default Title" or product_in_bundle['selected_variant'] == 'all':
                                                            needed_quantity = i
                                                            if str(product_in_temp_cart['product_id']) == product_in_bundle['id']:
                                                                subtracted_quantity = ''
                                                                for variant_in_cart in product_in_temp_cart['variants']:
                                                                    remaining_quantity = variant_in_cart['quantity']
                                                                    if remaining_quantity <= 0 and product_in_temp_cart['total_quantity'] >= needed_quantity:
                                                                        product_in_temp_cart['total_quantity'] -= needed_quantity
                                                                        for z in range(len(product_in_temp_cart['variants']) - 1):
                                                                            variant_ids.append({
                                                                                'quantity': product_in_temp_cart['variants'][z]['quantity'],
                                                                                "variant_id": product_in_temp_cart['variants'][z]['variant_id']
                                                                            })
                                                                            product_in_temp_cart['variants'][z]['quantity'] -= needed_quantity
                                                                            if product_in_temp_cart['variants'][z]['quantity'] < 0:
                                                                                product_in_temp_cart['variants'][z + 1]['quantity'] += product_in_temp_cart['variants'][z]['quantity']
                                                                                needed_quantity -= product_in_temp_cart['variants'][z]['quantity']
                                                                                variant_ids.append({
                                                                                    'quantity': -product_in_temp_cart['variants'][z]['quantity'],
                                                                                    "variant_id": product_in_temp_cart['variants'][z + 1]['variant_id']
                                                                                })
                                                                                product_in_temp_cart['variants'][z]['quantity'] = 0
                                                                        if needed_quantity == 0:
                                                                            break
                                                                    if variant_in_cart['quantity'] > 0 and needed_quantity > 0:
                                                                        if subtracted_quantity:
                                                                            subtracted_quantity = min(variant_in_cart['quantity'], needed_quantity, subtracted_quantity)
                                                                            variant_ids.append({
                                                                                "quantity": subtracted_quantity,
                                                                                'variant_id': variant_in_cart['variant_id']
                                                                            })
                                                                            needed_quantity -= subtracted_quantity
                                                                            variant_in_cart['quantity'] -= subtracted_quantity
                                                                            product_in_temp_cart['total_quantity'] -= subtracted_quantity
                                                                            remaining_quantity -= subtracted_quantity
                                                                        else:
                                                                            subtracted_quantity = min(variant_in_cart['quantity'], needed_quantity, remaining_quantity)
                                                                            variant_ids.append({
                                                                                "quantity": subtracted_quantity,
                                                                                'variant_id': variant_in_cart['variant_id']
                                                                            })
                                                                            needed_quantity -= subtracted_quantity
                                                                            variant_in_cart['quantity'] -= subtracted_quantity
                                                                            product_in_temp_cart['total_quantity'] -= subtracted_quantity
                                                                            remaining_quantity -= subtracted_quantity

                                                list_bundle_is_applicable.append({
                                                    'bundle_id': line['bundle_id'],
                                                    "priority": line['priority'],
                                                    "variant_ids": variant_ids,
                                                    "time": i
                                                })

                                            list_product_in_cart = [dict(item) for item in list_temp_product_in_cart]
                                        else:
                                            list_temp_product_in_cart = [dict(item) for item in list_product_in_cart]

                if line['bundle_type'] == "volume":
                    for product_in_cart in list_product_in_cart:
                        for bundle in list_bundle:
                            if bundle['bundle_ids'] == line['bundle_id'] and str(product_in_cart['product_id']) == json.loads(bundle['volume_json'])["productSelected"]['id']:
                                sorted_discount_types = sorted(bundle['discountType'], key=lambda x: x['quantity'], reverse=True)
                                for discount_type in sorted_discount_types:
                                    variant_ids = []
                                    count_time = product_in_cart['total_quantity'] // discount_type['quantity']
                                    if count_time > 0:
                                        needed_quantity = count_time * discount_type['quantity']
                                        for variant_in_cart in product_in_cart['variants']:
                                            if variant_in_cart['quantity'] < needed_quantity:
                                                needed_quantity -= variant_in_cart['quantity']
                                                product_in_cart['total_quantity'] -= variant_in_cart['quantity']
                                                variant_ids.append({
                                                    "variant_id": variant_in_cart['variant_id'],
                                                    'quantity': variant_in_cart['quantity']
                                                })
                                                variant_in_cart['quantity'] = 0
                                            else:
                                                product_in_cart['total_quantity'] -= needed_quantity
                                                variant_in_cart['quantity'] -= needed_quantity
                                                variant_ids.append({
                                                    "variant_id": variant_in_cart['variant_id'],
                                                    'quantity': needed_quantity
                                                })
                                                break

                                        volume_bundle_is_applicable = {
                                            'discountType': discount_type['discountType'],
                                            "amount_discount": discount_type['amount'],
                                            "bundle_id": bundle['bundle_ids'],
                                            'priority': bundle['priority'],
                                            "time": count_time,
                                            'quantity_need': discount_type['quantity'],
                                            'variant_ids': variant_ids
                                        }

                                        if volume_bundle_is_applicable not in list_bundle_is_applicable and volume_bundle_is_applicable['time'] > 0:
                                            list_bundle_is_applicable.append(volume_bundle_is_applicable)

            return list_bundle_is_applicable
        else:
            return 0
    except Exception as e:
        logger.error(traceback.format_exc())


class ShopifyController(http.Controller):
    @http.route('/nb/shopify_cart', auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def nb_shopify_cart(self, **kw):
        try:
            verify_app_proxy_request()
            list_bundle_price = []
            list_bundle_data = nb_get_bundle_is_applicable(**kw)
            list_bundle_is_applicable = list_bundle_data['list_bundle_is_applicable']
            list_bundle = list_bundle_data['list_bundle']

            if list_bundle_is_applicable != 0:
                for line in list_bundle_is_applicable:
                    total_compare_at_price = 0
                    price_is_reduced = 0

                    for bundle in list_bundle:
                        if line['bundle_id'] == bundle['bundle_ids']:
                            if bundle['bundle']['bundleType'] == "product":
                                for product_in_bundle in json.loads(bundle['bundle_json']):
                                    if product_in_bundle['selected_variant'] == 'all':
                                        for variant_in_cart in line['variant_ids']:
                                            for variant_in_bundle in product_in_bundle['variants']:
                                                if str(variant_in_cart['variant_id']) == variant_in_bundle['value']:
                                                    total_compare_at_price += float(variant_in_bundle['price']) * variant_in_cart['quantity']

                                    else:
                                        if len(product_in_bundle['variants']) == 1:
                                            total_compare_at_price += float(product_in_bundle['variants'][0]['price']) * line['time']
                                        else:
                                            for variant_in_bundle in product_in_bundle['variants']:
                                                if variant_in_bundle['value'] == product_in_bundle['selected_variant']:
                                                    total_compare_at_price += variant_in_bundle['price'] * line['time']

                                free_gift = []

                                if bundle['discountType'] == "percentage":
                                    price_is_reduced += total_compare_at_price * bundle['amount_discount'] / 100
                                    bundle_type = "product_bundle_percentage"

                                if bundle['discountType'] == "fixed_amount":
                                    price_is_reduced += bundle['amount_discount']
                                    bundle_type = "product_bundle_fixed_amount"

                                if bundle['discountType'] == "free_gift":
                                    bundle_type = "product_bundle_free_gift"
                                    if kw["nbFreeGift"] is not None:
                                        list_free_gift = []
                                        bundle_free_gifts = {}
                                        for item in json.loads(kw['nbFreeGift']):
                                            bundle_id = item["bundle_id"]
                                            temp_free_gift = {
                                                "variant_id": item["variant_id"],
                                                "price": item["price"]
                                            }
                                            if bundle_id in bundle_free_gifts:
                                                bundle_free_gifts[bundle_id].append(temp_free_gift)
                                            else:
                                                bundle_free_gifts[bundle_id] = [temp_free_gift]

                                        for bundle_id, free_gifts in bundle_free_gifts.items():
                                            list_free_gift.append({"bundle_id": bundle_id, "free_gift": free_gifts})

                                        for item_in_list_free_gift in list_free_gift:
                                            if item_in_list_free_gift['bundle_id'] == bundle['bundle_ids']:
                                                if len(item_in_list_free_gift['free_gift']) == line['time']:
                                                    for variant_free_gift in item_in_list_free_gift['free_gift']:
                                                        for variant_in_free_gift_bundle in json.loads(bundle['free_gift'])[0]['variants']:
                                                            if variant_in_free_gift_bundle['value'] != 'all' and variant_in_free_gift_bundle['value'] == variant_free_gift['variant_id']:
                                                                free_gift_data = {
                                                                    "variant_id": variant_free_gift['variant_id'],
                                                                    'variant_label': variant_in_free_gift_bundle['label'],
                                                                    "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                    "quantity": 1
                                                                }

                                                                existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)
                                                                if existing_gift:
                                                                    existing_gift["quantity"] += 1
                                                                else:
                                                                    free_gift.append(free_gift_data)
                                                                price_is_reduced += float(variant_in_free_gift_bundle['price'])
                                                else:
                                                    if len(item_in_list_free_gift['free_gift']) < line['time']:
                                                        need_time_bundle = line['time'] - len(item_in_list_free_gift['free_gift'])
                                                        for i in range(len(item_in_list_free_gift['free_gift'])):
                                                            for variant_in_free_gift_bundle in json.loads(bundle['free_gift'])[0]['variants']:
                                                                if json.loads(bundle['free_gift'])[0]['selected_variant'] == 'all':
                                                                    if variant_in_free_gift_bundle['value'] == item_in_list_free_gift['free_gift'][i]['variant_id']:
                                                                        free_gift_data = {
                                                                            "variant_id": item_in_list_free_gift['free_gift'][i]['variant_id'],
                                                                            "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                            'variant_label': variant_in_free_gift_bundle['label'],
                                                                            "quantity": 1
                                                                        }
                                                                        existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)
                                                                        if existing_gift:
                                                                            existing_gift["quantity"] += 1
                                                                        else:
                                                                            free_gift.append(free_gift_data)
                                                                        price_is_reduced += float(item_in_list_free_gift['free_gift'][i]['price'])
                                                                else:
                                                                    if variant_in_free_gift_bundle['value'] == item_in_list_free_gift['free_gift'][i]['variant_id']:
                                                                        free_gift_data = {
                                                                            "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                            "variant_id": item_in_list_free_gift[i]['variant_id'],
                                                                            'variant_label': variant_in_free_gift_bundle['label'],
                                                                            "quantity": 1
                                                                        }
                                                                        existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)

                                                                        if existing_gift:
                                                                            existing_gift["quantity"] += 1
                                                                        else:
                                                                            free_gift.append(free_gift_data)
                                                                        price_is_reduced += float(variant_in_free_gift_bundle['price'])

                                                        for j in range(need_time_bundle):
                                                            free_gift_data = {
                                                                'variant_label': json.loads(bundle['free_gift'])[0]['variants'][1]['label'],
                                                                "variant_id": json.loads(bundle['free_gift'])[0]['variants'][1]['value'],
                                                                "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                "quantity": 1
                                                            }
                                                            existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)

                                                            if existing_gift:
                                                                existing_gift["quantity"] += 1
                                                            else:
                                                                free_gift.append(free_gift_data)
                                                            price_is_reduced += float(json.loads(bundle['free_gift'])[0]['variants'][1]['price'])
                                                    else:
                                                        for i in range(line['time']):
                                                            for variant_in_free_gift_bundle in json.loads(bundle['free_gift'])[0]['variants']:
                                                                if json.loads(bundle['free_gift'])[0]['selected_variant'] == 'all':
                                                                    if variant_in_free_gift_bundle['value'] == item_in_list_free_gift['free_gift'][i]['variant_id']:
                                                                        free_gift_data = {
                                                                            "variant_id": item_in_list_free_gift['free_gift'][i]['variant_id'],
                                                                            "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                            'variant_label': variant_in_free_gift_bundle['label'],
                                                                            "quantity": 1
                                                                        }
                                                                        existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)
                                                                        if existing_gift:
                                                                            existing_gift["quantity"] += 1
                                                                        else:
                                                                            free_gift.append(free_gift_data)
                                                                        price_is_reduced += float(item_in_list_free_gift['free_gift'][i]['price'])
                                                                else:
                                                                    if variant_in_free_gift_bundle['value'] == item_in_list_free_gift['free_gift'][i]['variant_id']:
                                                                        free_gift_data = {
                                                                            "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                                            "variant_id": item_in_list_free_gift[i]['variant_id'],
                                                                            'variant_label': variant_in_free_gift_bundle['label'],
                                                                            "quantity": 1
                                                                        }
                                                                        existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)

                                                                        if existing_gift:
                                                                            existing_gift["quantity"] += 1
                                                                        else:
                                                                            free_gift.append(free_gift_data)
                                                                        price_is_reduced += float(variant_in_free_gift_bundle['price'])

                                    else:
                                        for i in range(line['time']):
                                            free_gift_data = {
                                                'variant_label': json.loads(bundle['free_gift'])[0]['variants'][1]['label'],
                                                "variant_id": json.loads(bundle['free_gift'])[0]['variants'][1]['value'],
                                                "product_name": json.loads(bundle['free_gift'])[0]['name'],
                                                "quantity": 1
                                            }
                                            existing_gift = next((item for item in free_gift if item["variant_id"] == free_gift_data["variant_id"]), None)

                                            if existing_gift:
                                                existing_gift["quantity"] += 1
                                            else:
                                                free_gift.append(free_gift_data)
                                            price_is_reduced += float(json.loads(bundle['free_gift'])[0]['variants'][1]['price'])

                                if bundle['discountType'] == "set_price":
                                    bundle_type = "product_bundle_set_price"
                                    price_is_reduced += total_compare_at_price - bundle['amount_discount'] * line['time']

                                bundle_price = {
                                    "total_compare_at_price": total_compare_at_price,
                                    'price_is_reduced': round(price_is_reduced, 2),
                                    "bundle_id": line['bundle_id'],
                                    'priority': line['priority'],
                                    "bundle_type": bundle_type,
                                    "free_gift": free_gift,
                                    "time": line['time']
                                }

                                if bundle_price not in list_bundle_price:
                                    list_bundle_price.append(bundle_price)

                            if bundle['bundle']['bundleType'] == "volume":
                                for variant_in_bundle in json.loads(bundle['volume_json'])["productSelected"]['variants']:
                                    for variant_in_cart in line['variant_ids']:
                                        if str(variant_in_cart['variant_id']) == variant_in_bundle['value']:
                                            total_compare_at_price += float(variant_in_bundle['price']) * float(variant_in_cart['quantity'])

                                if line['discountType'] == "percentage":
                                    bundle_type = "volume_bundle_percentage"
                                    price_is_reduced += total_compare_at_price * line['amount_discount'] / 100

                                if line["discountType"] == 'fixed_amount':
                                    bundle_type = "volume_bundle_fixed_amount"
                                    price_is_reduced += line['amount_discount'] * line['time']

                                bundle_price = {
                                    "total_compare_at_price": total_compare_at_price,
                                    'price_is_reduced': round(price_is_reduced, 2),
                                    "bundle_id": line['bundle_id'],
                                    'priority': line['priority'],
                                    "bundle_type": bundle_type,
                                    "time": line['time'],
                                    "free_gift": 0
                                }

                                if bundle_price not in list_bundle_price:
                                    list_bundle_price.append(bundle_price)

                if 'currency' in kw:
                    return {
                        "list_bundle_price": list_bundle_price,
                        "store_currency": kw['currency'],
                        'currency_symbol': get_currency_symbol(kw['currency'])
                    }
                else:
                    return {
                        "list_bundle_price": list_bundle_price,
                        "store_currency": list_bundle_data['store_currency']
                    }
            else:
                if 'currency' in kw:
                    return {
                        'error': "No bundle can active",
                        "list_bundle_price": [],
                        "store_currency": kw['currency'],
                        'currency_symbol': get_currency_symbol(kw['currency'])
                    }
                else:
                    return {
                        'error': "No bundle can active",
                        "list_bundle_price": []
                    }
        except Exception as e:
            logger.error(traceback.format_exc())

    @http.route("/nb/shopify_create_draft_order", auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def nb_shopify_create_draft_order(self, **kw):
        verify_app_proxy_request()
        current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['shop_url'])], limit=1)
        if current_shopify_store:
            try:
                api_key = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_key')
                api_version = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_version')

                bundles = self.nb_shopify_cart(**kw)['list_bundle_price']
                line_items = []

                for product_in_cart in kw['cart_infors']:
                    line_items.append({
                        'variant_id': product_in_cart["variant_id"],
                        'quantity': product_in_cart["quantity"]
                    })

                note_data = {'count_bundle': [], "total_sale_off_in_order": 0}

                for bundle in bundles:
                    note_data['count_bundle'].append({
                        "bundle_id": bundle['bundle_id'],
                        "time": bundle['time'],
                        "revenue": round((float(bundle['total_compare_at_price']) - float(bundle['price_is_reduced'])), 2)
                    })

                    note_data['total_sale_off_in_order'] += round(bundle['price_is_reduced'], 2)

                    if bundle['bundle_type'] == 'product_bundle_free_gift':
                        for item_free_gift in bundle['free_gift']:
                            line_items.append({
                                "quantity": item_free_gift['quantity'],
                                'variant_id': item_free_gift['variant_id']
                            })

                # draft_order = shopify.DraftOrder.create({
                #     "line_items": line_items,
                #     "applied_discount": {
                #         "value": total_sale_off_in_cart,
                #         "value_type": "fixed_amount"
                #     }
                # })

                data_draft_order = {
                    'draft_order': {
                        'line_items': line_items,
                        "note": json.dumps(note_data),
                        'applied_discount': {
                            'value': round(note_data['total_sale_off_in_order'], 2),
                            "title": "BUNDLE DISCOUNT",
                            'value_type': 'fixed_amount'
                        }
                    }
                }

                current_shopify_store.init_nest_bundle_shopify_session()

                endpoint = f'https://{api_key}:{current_shopify_store.shopify_access_token}@{current_shopify_store.store_url}/admin/api/{api_version}/draft_orders.json'
                draft_order = requests.post(url=endpoint, data=json.dumps(data_draft_order), headers={'Content-Type': 'application/json'})

                shopify.ShopifyResource.clear_session()

                if draft_order.ok:
                    return {"draft_order_url": draft_order.json()["draft_order"]['invoice_url']}
                else:
                    return {"draft_order_url": 0, "error_check_out": "Cannot create draft order!"}

            except Exception as e:
                logger.error(traceback.format_exc())
                return {'draft_order_url': 0, "error_check_out": e}
        else:
            return {'draft_order_url': 0, "error_check_out": "Cannot verify shop!"}
