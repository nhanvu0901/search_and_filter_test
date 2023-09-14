import json

import shopify

from odoo import models, fields
from odoo import http
from odoo.http import request, Response
import traceback
import logging
from datetime import datetime
import json

_logger = logging.getLogger(__name__)


class NestBundleLogWebhook(models.Model):
    _name = 'nb.webhook.log'

    name = fields.Char()
    data = fields.Text()
    state = fields.Char(default='pending')
    store_id = fields.Integer()
    log = fields.Text()
    type = fields.Char()

    def cron_uninstall_store(self, limit=500):
        records = self.sudo().search([('state', '!=', 'done'), ('type', '=', 'uninstall_store')],
                                     limit=limit, order='create_date ASC')
        if records:
            for rec in records:
                try:
                    rec.uninstall_store()
                    rec.state = 'done'
                except Exception as e:
                    rec.state = 'done'
                    rec.log = str(e)
                    continue
            return True

    def cron_create_order(self, limit=500):
        records = self.sudo().search([('state', '!=', 'done'), ('type', '=', 'create_order')],
                                     limit=limit, order='create_date ASC')
        if records:
            for rec in records:
                try:
                    rec.create_order()
                    rec.state = 'done'
                except Exception as e:
                    rec.state = 'done'
                    rec.log = str(e)
                    continue
            return True

    def cron_delete_product(self, limit=500):
        records = self.sudo().search([('state', '!=', 'done'), ('type', '=', 'delete_product')],
                                     limit=limit, order='create_date ASC')
        if records:
            for rec in records:
                try:
                    rec.delete_product()
                    rec.state = 'done'
                except Exception as e:
                    rec.state = 'done'
                    rec.log = str(e)
                    continue
            return True

    def cron_update_product(self, limit=100):
        records = self.sudo().search([('state', '!=', 'done'), ('type', '=', 'update_product')],
                                     limit=limit, order='create_date ASC')
        if records:
            for rec in records:
                try:
                    rec.update_product()
                    rec.state = 'done'
                except Exception as e:
                    rec.state = 'done'
                    rec.log = str(e)
                    continue
            return True


    def uninstall_store(self):
        try:
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("id", '=', self.store_id)], limit=1)
            if current_shopify_store:
                current_shopify_store.install_status = False
                for bundle in current_shopify_store.bundle:
                    bundle.unlink()
                for analytic in request.env['nb.bundle.analytic'].sudo().search([('store_ids', '=', current_shopify_store.id)]):
                    analytic.unlink()
                for design in request.env['nb.bundle.design'].sudo().search([('shopify_store', '=', current_shopify_store.id)]):
                    design.unlink()

            return True
        except Exception as e:
            _logger.error(traceback.format_exc())
        return True

    def update_product(self):
        try:
            data = json.loads(self.data)

            if self.store_id:
                store = self.env['nb.shopify.store'].sudo().search([('id', '=', int(self.store_id))], limit=1)
                if store:
                    new_session = store.init_nest_bundle_shopify_session()

                    query = '{product( id: "%s") { title variants(first: 20) { edges { node { id title image{url} price selectedOptions {  name value  } }} } }}' % (
                        data['admin_graphql_api_id'])
                    query_variant = json.loads(shopify.GraphQL().execute(query=query))
                    data_variants = query_variant['data']['product']['variants']['edges']

                    bundles_of_shop = self.env['nb.bundle'].sudo().search(
                        [("shopify_store", '=', store.id), ('active_bundle', '=', True)], order='bundle_type')
                    product_that_need_change = None
                    if bundles_of_shop:
                        for bundle in bundles_of_shop:
                            if bundle.bundle_type == 'product':
                                data_json = json.loads(bundle.bundle_json)
                                for index, product_json in enumerate(data_json):
                                    if int(product_json.get('id')) == data.get("id"):
                                        if product_that_need_change is None:
                                            selected_variant = product_json.get('selected_variant') if product_json.get(
                                                'selected_variant') != "all" else "all"
                                            preview_price = product_json.get('preview_price') if product_json.get(
                                                'preview_price') is not None else product_json.get('variants')[1].get(
                                                'price') if product_json.get('selected_variant') == 'all' else None

                                            selected_label = product_json.get('selected_label')
                                            product_that_need_change = self.process_new_product(preview_price,
                                                                                                selected_variant, data,
                                                                                                store, selected_label,
                                                                                                data_variants)
                                        del data_json[index]
                                        data_json.append(product_that_need_change)
                                        bundle.sudo().write({
                                            "bundle_json": json.dumps(data_json),
                                        })
                                        break
                                if bundle.discount_type == 'free_gift':
                                    free_gift = json.loads(bundle.free_gift)[0]
                                    if int(free_gift.get('id')) == data.get("id"):
                                        preview_price = free_gift.get('preview_price') if free_gift.get(
                                            'preview_price') is not None else free_gift.get('variants')[1].get(
                                            'price') if free_gift.get('selected_variant') == 'all' else None

                                        bundle.sudo().write({
                                            "free_gift": json.dumps([self.process_new_product(preview_price,
                                                                                              free_gift.get(
                                                                                                  'selected_variant'),
                                                                                              data, store,
                                                                                              free_gift.get(
                                                                                                  'selected_label'),
                                                                                              data_variants)]),
                                        })

                            if bundle.bundle_type == 'volume':
                                data_json = json.loads(bundle.volume_json)
                                if data_json.get('productSelected'):
                                    if int(data_json.get('productSelected').get("id")) == data.get("id"):
                                        if product_that_need_change is None:
                                            product_that_need_change = self.process_new_product(None,
                                                                                                None, data,
                                                                                                store, None,
                                                                                                data_variants)

                                        array_remove_key = ['selected_variant', 'selected_label']
                                        new_product = self.remove_keys(product_that_need_change, array_remove_key)
                                        if new_product.get('variants')[0].get('value') == 'all':
                                            del new_product.get('variants')[0]
                                        data_json.pop("productSelected")
                                        data_json['productSelected'] = new_product
                                        bundle.sudo().write({
                                            "volume_json": json.dumps(data_json)
                                        })


                    shopify.ShopifyResource.clear_session()
        except Exception as e:
            _logger.error(traceback.format_exc())
        return True

    def get_price_range(self, min_price_amount, max_price_amount):
        # if float(min_price_amount) < float(max_price_amount):
        return str(min_price_amount) + ' - ' + str(max_price_amount)

    def process_variant_list(self, selected_variant, data_variants, selected_label):

        flag_exist_selected_variant = False
        variant_list = []
        min_variant_price = float(data_variants[0].get('node').get('price'))
        max_variant_price = float(data_variants[0].get('node').get('price'))
        for variant in data_variants:
            if variant.get('node').get('title') != 'Default Title':
                if selected_variant != '':
                    if selected_variant != "all":
                        if selected_variant == variant.get('node').get('id').split('/')[-1]:
                            flag_exist_selected_variant = True
            else:
                selected_variant = variant.get('node').get('id').split('/')[-1]
                selected_label = variant.get('node').get('title')
                flag_exist_selected_variant = True

            variant_data = {
                "value": variant.get('node').get('id').split('/')[-1],
                "label": variant.get('node').get('title'),
                'price': float(variant.get('node').get('price')),
                "url": variant.get('node').get('image').get('url') if variant.get('node').get('image') != None else None
            }
            if float(variant.get('node').get('price')) >= max_variant_price:
                max_variant_price = float(variant.get('node').get('price'))
            if float(variant.get('node').get('price')) <= min_variant_price:
                min_variant_price = float(variant.get('node').get('price'))
            variant_list.append(variant_data)

        # if selected_variant != '':
        if len(variant_list) > 1:
            variant_list.insert(0, {
                "value": "all",
                "label": "All variants",
            })
        return {
            "flag_exist_selected_variant": flag_exist_selected_variant,
            "variant_list": variant_list,
            "min_variant_price": min_variant_price,
            "max_variant_price": max_variant_price,
            "selected_variant": selected_variant,
            "selected_label": selected_label
        }

    def process_new_product(self, preview_price, selected_variant, data, store, selected_label, data_variants):
        variant_list_processed = self.process_variant_list(selected_variant, data_variants, selected_label)
        flag_exist_selected_variant = variant_list_processed.get(
            'flag_exist_selected_variant')
        variant_list = variant_list_processed.get("variant_list")
        min_variant_price = variant_list_processed.get("min_variant_price")
        max_variant_price = variant_list_processed.get("max_variant_price")
        selected_variant = variant_list_processed.get("selected_variant")
        selected_label = variant_list_processed.get("selected_label")

        object = {
            'id': str(data['id']),
            'name': data['title'],
            'handle': data['handle'],
            'img_product': data['images'][0].get('src'),
            'img_src': data['images'][0].get('src'),
            'variant_num': len(data['variants']),
            'product_url': "https://" + store.store_url + "/products/" + data[
                'handle'],
            'price_range': self.get_price_range(min_variant_price,
                                                max_variant_price),
            "variants": variant_list,
            "selected_variant": str(
                selected_variant) if flag_exist_selected_variant == True else
            variant_list[0]['value'] if len(
                variant_list) > 0 else None,
            "selected_label": selected_label if flag_exist_selected_variant == True else
            variant_list[0]['label'] if len(
                variant_list) > 0 else None,
            "customer_select_variant": str(variant_list[1].get('value')) if variant_list[0]['value'] == 'all' else str(
                selected_variant) if flag_exist_selected_variant == True else None,
            "preview_price": preview_price if flag_exist_selected_variant == True else variant_list[1]['price'] if
            variant_list[0]['value'] == 'all' else None,

            # "customer_free_gift_variant":???
        }

        return object

    def remove_keys(self, obj, rubbish):
        assert isinstance(obj, dict)
        for rb in rubbish:
            if rb in obj:
                del obj[rb]
        return obj

    def delete_product(self):
        try:
            data = json.loads(self.data)

            if self.store_id:
                store = self.env['nb.shopify.store'].sudo().search([('id', '=', int(self.store_id))], limit=1)
                if store:
                    new_session = store.init_nest_bundle_shopify_session()
                    bundles_of_shop = self.env['nb.bundle'].sudo().search(
                        [("shopify_store", '=', store.id), ('active_bundle', '=', True)])
                    for bundle in bundles_of_shop:
                        if bundle.bundle_type == 'product':
                            data_json = json.loads(bundle.bundle_json)
                            for index, product_json in enumerate(data_json):
                                if int(product_json.get('id')) == data.get("id"):
                                    del data_json[index]
                                    bundle.sudo().write({
                                        "bundle_json": json.dumps(data_json),
                                        "status": 'draft' if data_json == [] else bundle.status
                                    })
                                    break
                            if bundle.discount_type == 'free_gift':
                                if bundle.free_gift is not False:
                                    free_gift = json.loads(bundle.free_gift)[0]
                                    if int(free_gift.get('id')) == data.get("id"):
                                        bundle.sudo().write({
                                            "free_gift": None,
                                            "status": 'draft'
                                        })
                        if bundle.bundle_type == 'volume':
                            data_json = json.loads(bundle.volume_json)
                            if data_json.get('productSelected'):
                                if int(data_json.get('productSelected').get("id")) == data.get("id"):
                                    data_json.pop("productSelected")
                                    data_json['productSelected'] = None
                                    bundle.sudo().write({
                                        "volume_json": json.dumps(data_json),
                                        "status": 'draft' if data_json.get(
                                            'productSelected') == None else bundle.status
                                    })
                    shopify.ShopifyResource.clear_session()
        except Exception as e:
            _logger.error(traceback.format_exc())
        return True

    def create_order(self):
        try:
            data_log = json.loads(self.data)
            current_shopify_store = self.env['nb.shopify.store'].sudo().search([("id", '=', self.store_id)],
                                                                               limit=1)
            if current_shopify_store:
                date = datetime.today().date()
                bundle_analytic = self.env['nb.bundle.analytic'].sudo().search(
                    [('date', '=', date), ("store_ids", '=', current_shopify_store.id)], limit=1)

                if bundle_analytic:
                    data = json.loads(bundle_analytic.analytic_json)

                    for index, obj in enumerate(data['data']):
                        for bundle_ids in json.loads(data_log['note']).get('count_bundle'):
                            if bundle_ids.get('bundle_id') == obj['bundle_id']:
                                # lay order va revenue tu note
                                data['data'][index]['order'] += 1
                                if bundle_ids.get("revenue") < 0:
                                    data['data'][index]['revenue'] += 0
                                else:
                                    data['data'][index]['revenue'] += bundle_ids.get("revenue")
                                break
                    bundle_analytic.write({
                        "analytic_json": json.dumps(data)
                    })
                    # return Response("success", status=200)
        except Exception as e:
            _logger.error(traceback.format_exc())
        return True
