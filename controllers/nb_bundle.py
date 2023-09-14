import json
import traceback
import pytz
import logging
from urllib import parse
from odoo import http
from odoo.http import request, Response
from .auth import verify_request, verify_app_proxy_request
from datetime import datetime
from .currency_symbol import get_currency_symbol

_logger = logging.getLogger(__name__)


class BundleController(http.Controller):
    @http.route('/nb/action/<string:mode>', methods=['POST'], auth='public', type="json")
    def nb_create_bundle(self, mode, **kw):
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['store_url'])],
                                                                                  limit=1)
            exist_bundle_design = request.env["nb.bundle.design"].sudo().search(
                [('shopify_store', '=', current_shopify_store.id)], limit=1)
            if kw['bundle_data']['bundle']['bundleType'] == 'product':
                bundle_json = json.dumps(kw['bundle_data']['productSelected'])
                volume_json = ''
            else:
                bundle_json = ''
                volume_json = json.dumps({
                    "discountType": kw['bundle_data']['discountType'],
                    "productSelected": kw['bundle_data']['productSelected']
                })

            bundle_data = {
                "bundle_name": kw['bundle_data']['bundle']['bundleName'],
                'shopify_store': current_shopify_store.id,
                "priority": kw['bundle_data']['priority'],
                'bundle_display_name': kw['bundle_data']['bundle']['bundleDisplayName'],
                'bundle_description': kw['bundle_data']['bundle']['bundleDescription'],
                'status': kw['bundle_data']['status'],
                'bundle_type': kw['bundle_data']['bundle']['bundleType'],
                'discount_type': kw['bundle_data']['discountType'] if kw['bundle_data']['bundle'][
                                                                          'bundleType'] == 'product' else '',
                'amount': int(kw['bundle_data']['amount_discount']) if kw['bundle_data']['bundle'][
                                                                           'bundleType'] == 'product' else '',
                'free_gift': json.dumps(kw['bundle_data']['selectedFreeGift']) if kw['bundle_data']['bundle'][
                                                                                      'bundleType'] == 'product' else '',
                "bundle_json": bundle_json,
                'volume_json': volume_json,
                'start_active_date': datetime.strptime(kw['bundle_data']['data_range'][0], '%Y-%m-%dT%H:%M:%S.%fZ'),
                'end_active_date': datetime.strptime(kw['bundle_data']['data_range'][1], '%Y-%m-%dT%H:%M:%S.%fZ'),
                'active_bundle': True
            }

            if mode == 'create':
                exist_bundle = request.env['nb.bundle'].sudo().search([
                    ('priority', '=', kw['bundle_data']['priority']), ('priority', '!=', -1),
                    ('active_bundle', '=', True), ("shopify_store", '=', current_shopify_store.id)], limit=1)
                if not exist_bundle:
                    new_bundle = request.env['nb.bundle'].sudo().create(bundle_data)

                    bundle_status = new_bundle.check_date_status()

                    if exist_bundle_design:
                        new_bundle.bundle_design = exist_bundle_design.id
                    return {'code': 0, 'message': 'Bundle has been saved!', 'bundle_ids': new_bundle.id,
                            'status': bundle_status}
                else:
                    return {'code': -1, 'error': f'Bundle priority {exist_bundle.priority} has existed!'}

            if mode == 'edit':
                find_bundle = request.env['nb.bundle'].sudo().search([
                    ('priority', '=', kw['bundle_data']['priority']), ('priority', '!=', -1),
                    ('id', '!=', kw['bundle_data']['bundle_ids']), ('active_bundle', '=', True),
                    ("shopify_store", '=', current_shopify_store.id)], limit=1)
                edit_bundle = request.env['nb.bundle'].sudo().search([
                    ('id', '=', kw['bundle_data']['bundle_ids']),
                    ("shopify_store", '=', current_shopify_store.id),
                    ('active_bundle', '=', True)], limit=1)

                if not find_bundle:
                    edit_bundle.sudo().write(bundle_data)

                    bundle_status = edit_bundle.check_date_status()

                    if exist_bundle_design:
                        edit_bundle.bundle_design = exist_bundle_design.id
                    return {'code': 0, 'message': 'Bundle has been updated!', 'bundle_ids': edit_bundle.id,
                            'status': bundle_status}
                else:
                    return {'code': -1, 'error': f'Bundle priority {find_bundle.priority} has existed!'}

        except Exception as e:
            _logger.error(traceback.format_exc())
            return {
                'code': -1,
                'error': str(e)
            }
        return {
            'code': -1,
            'error': 'Something went wrong. Please contact the customer support'
        }

    @http.route("/nb/create_bundle_design", auth='public', type="json")
    def nb_create_bundle_design(self, **kw):
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([
                ("store_url", '=', kw['shop_url'])], limit=1)
            if kw['bundle_type'] == "product":
                bundle_design_data = {
                    'shopify_store': current_shopify_store.id,
                    "button_text_product": kw['bundle_setting']['btn_text'],
                    "button_text_color_product": kw['bundle_setting']['btn_text_color'],
                    "button_color_product": kw['bundle_setting']['btn_color'],
                    "button_action_product": kw['bundle_setting']['btn_action'],
                    "bundle_display_name_color_product": kw['bundle_setting']['bundle_display_name_color'],
                    "bundle_description_color_product": kw['bundle_setting']['bundle_description_color'],
                    "bundle_discount_price_color_product": kw['bundle_setting']['discounted_price_color'],
                    "bundle_compare_at_price_color_product": kw['bundle_setting']['compare_at_price_color'],
                    "bundle_product_name_color_product": kw['bundle_setting']['product_name_color'],
                    "confirmation_message_product": kw['bundle_setting']['message_text'],
                    "max_bundle": kw['max_number']
                }
            else:
                bundle_design_data = {
                    'shopify_store': current_shopify_store.id,
                    "button_text_volume": kw['bundle_setting']['btn_text'],
                    "button_text_color_volume": kw['bundle_setting']['btn_text_color'],
                    "button_color_volume": kw['bundle_setting']['btn_color'],
                    "button_action_volume": kw['bundle_setting']['btn_action'],
                    "bundle_display_name_color_volume": kw['bundle_setting']['bundle_display_name_color'],
                    "bundle_description_color_volume": kw['bundle_setting']['bundle_description_color'],
                    "bundle_discount_price_color_volume": kw['bundle_setting']['discounted_price_color'],
                    "bundle_compare_at_price_color_volume": kw['bundle_setting']['compare_at_price_color'],
                    "bundle_product_name_color_volume": kw['bundle_setting']['product_name_color'],
                    "confirmation_message_volume": kw['bundle_setting']['message_text'],
                    "max_bundle": kw['max_number']
                }

            exist_bundle_design = request.env["nb.bundle.design"].sudo().search(
                [('shopify_store', '=', current_shopify_store.id)], limit=1)

            if not exist_bundle_design:
                exist_bundle_design = request.env["nb.bundle.design"].sudo().create(bundle_design_data)
            else:
                exist_bundle_design.write(bundle_design_data)

            exist_bundles = request.env['nb.bundle'].sudo().search(
                [("shopify_store", '=', current_shopify_store.id), ('active_bundle', '=', True)])
            if exist_bundles:
                for exist_bundle in exist_bundles:
                    exist_bundle.bundle_design = exist_bundle_design.id

            exist_bundle_design_data = exist_bundle_design.get_bundle_design()
            return {"bundle_design_data": exist_bundle_design_data}
        except Exception as e:
            return {'bundle_design_data': 0, 'bundle_design_data_error': e}

    @http.route('/nb/get_bundle_design', auth='public', type="json")
    def nb_get_bundle_design(self, **kw):
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['shop_url'])],
                                                                                  limit=1)
            exist_bundle_design = request.env["nb.bundle.design"].sudo().search(
                [('shopify_store', '=', current_shopify_store.id)], limit=1)
            if exist_bundle_design:
                return {
                    "bundle_design_data": exist_bundle_design.get_bundle_design(),
                    'shop_url': current_shopify_store.store_url
                }
            else:
                return {"bundle_design_data": 0}
        except Exception as e:
            return {"bundle_design_data": 0, 'bundle_design_data_error': e}

    @http.route("/nb/get_bundle_front_end", auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def nb_get_bundle_front_end(self, **kw):
        try:
            # verify_app_proxy_request()
            currency_symbol = get_currency_symbol(kw['currency'])
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['shop_url'])],
                                                                                  limit=1)
            exist_bundles = request.env['nb.bundle'].sudo().search(
                [("shopify_store", '=', current_shopify_store.id), ("status", '=', "active"),
                 ('active_bundle', '=', True)])
            list_bundle = []
            if exist_bundles:
                exist_bundle_design = request.env['nb.bundle.design'].sudo().search(
                    [("shopify_store", '=', current_shopify_store.id)], limit=1)
                for exist_bundle in exist_bundles:
                    if exist_bundle.bundle_type == 'product':
                        if len(json.loads(exist_bundle.free_gift)) > 0:
                            for product in json.loads(exist_bundle.bundle_json):
                                if json.loads(exist_bundle.free_gift)[0]['id'] == \
                                        str(kw['product_id']) or str(kw['product_id']) == product['id']:
                                    if exist_bundle.get_data_bundle() not in list_bundle:
                                        list_bundle.append(exist_bundle.get_data_bundle())

                        else:
                            for product in json.loads(exist_bundle.bundle_json):
                                if str(kw['product_id']) == \
                                        product['id'] and exist_bundle.get_data_bundle() not in list_bundle:
                                    list_bundle.append(exist_bundle.get_data_bundle())
                    else:
                        if exist_bundle.get_data_bundle() not in list_bundle and str(kw['product_id']) == \
                                json.loads(exist_bundle.volume_json)['productSelected']['id']:
                            list_bundle.append(exist_bundle.get_data_bundle())

                if len(list_bundle) == 0:
                    return {'bundles': 1}

                else:
                    sorted_list_bundle = sorted(list_bundle, key=lambda x: x['priority'])
                    return {
                        "exist_bundle_design": exist_bundle_design.get_bundle_design(),
                        'bundles': sorted_list_bundle,
                        "store_currency": current_shopify_store.currency,
                        'currency_symbol': currency_symbol
                    }
            else:
                return {'bundles': 1}

        except Exception as e:
            return {'bundles': 0, "error_get_bundle_front_end": e}

    @http.route('/nb/check_priority', auth='public', type="json")
    def nb_check_priority(self, **kw):
        list_priority = []
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw["shop_url"])],
                                                                                  limit=1)
            exist_bundles = request.env['nb.bundle'].sudo().search(
                [("shopify_store", '=', current_shopify_store.id), ('active_bundle', '=', True)])

            if exist_bundles:
                for bundle in exist_bundles:
                    if bundle.priority != -1:
                        list_priority.append(bundle.priority)

            return {'list_priority': list_priority}

        except Exception as e:
            return {'list_priority': list_priority, 'error_check_priority': e}
