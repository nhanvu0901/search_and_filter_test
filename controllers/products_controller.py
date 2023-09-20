import traceback
import json
import shopify
import logging
from odoo import http
from odoo.http import request
import math
from array import array
from urllib import parse
import time
from .auth import verify_request
from .auth import verify_app_proxy_request

_logger = logging.getLogger(__name__)

list_collections = []
list_vendors = []
list_product_types = []
list_tags = []


class NestBundleProductController(http.Controller):
    @http.route('/nb/products_search/<string:mode>', methods=['POST'], type='json', auth='public')
    def search_product(self, mode, **kw):
        try:
            start_time = time.time()
            verify_request()
            current_store = request.env['nb.shopify.store'].sudo().search(
                [("store_url", '=', kw['store_url'])], limit=1)
            if current_store:
                new_session = current_store.init_nest_bundle_shopify_session()
                search_query = kw['query']
                filter_options = []
                list_collections = self.get_filter_options('collections')
                list_vendors = self.get_filter_options('productVendors')
                list_product_types = self.get_filter_options('productTypes')
                list_tags = self.get_filter_options('productTags')
                list_availability = self.get_filter_options('availability')
                list_price_range = self.get_filter_options('price')
                list_percent_sale = self.get_filter_options('percent')

                min_percent_sale = 100
                max_percent_sale = 0
                min_price = math.inf
                max_price = 0
                product_list = []
                loop = 0
                last_element = ''
                error_count = 0
                limit = 17

                theme = shopify.Theme.find()

                while True:
                    query = ('{products(first: %d, query: "title:%s* AND status:ACTIVE" after:"%s" ) {'
                             'pageInfo {hasNextPage}'
                             'edges {cursor node {id title '
                             'collections(first: 5) { nodes {title}}'
                             'options(first: 5) { id name values } '
                             'variants(first: 5) { nodes {id availableForSale sku compareAtPrice price title image {url} }}'
                             ' title handle createdAt productType tags vendor images(first: 1) {edges { node {originalSrc}}} }}}}') % (
                                limit, search_query, last_element) \
                        if loop != 0 else (
                                              '{products(first: %d, query: "title:%s* AND status:ACTIVE") {'
                                              'pageInfo {hasNextPage}'
                                              'edges {cursor node {id title '
                                              'collections(first: 5) { nodes  {title}}'
                                              'options(first: 4) { id name values } '
                                              'variants(first: 5) { nodes {id availableForSale sku compareAtPrice price title image {url} }}'
                                              ' title handle createdAt productType tags vendor images(first: 1) {edges { node {originalSrc}}}}}}}') % (
                                              limit, search_query)

                    query_result = shopify.GraphQL().execute(query=query)
                    query_result = json.loads(query_result)
                    product_options = []

                    if 'errors' in query_result:
                        if 'cost' in query_result['errors'][0]['extensions']:
                            if error_count == 0:
                                point_per_product = (query_result['errors'][0]['extensions']['cost'] / limit)
                                limit = math.ceil(1000 / point_per_product)
                            else:
                                limit -= 1
                            error_count += 1
                        else:
                            time.sleep((query_result['extensions']['cost']['requestedQueryCost'] -
                                        query_result['extensions']['cost']['throttleStatus'][
                                            'currentlyAvailable']) / 50)
                        continue
                    else:
                        error_count = 0
                        if 1000 - query_result['extensions']['cost']['throttleStatus']['currentlyAvailable'] <= 100:
                            limit += 1

                    last_element = query_result['data']['products']['edges'][
                        len(query_result['data']['products']['edges']) - 1].get('cursor')
                    loop += 1

                    if query_result:
                        try:
                            if 'data' in query_result:
                                if 'products' in query_result['data'] and query_result['data']['products'][
                                    'edges'] != []:
                                    for product in query_result['data']['products']['edges']:
                                        data = product['node']
                                        if not data['images']['edges']:
                                            data['images']['edges'].append({
                                                'node': {
                                                    'originalSrc': 'https://apps.nestscale.com/omnichat/static/img/no_image.png'
                                                }
                                            })
                                        variant_list = []
                                        not_available = 0
                                        for data_variant in data['variants'].get('nodes'):
                                            variant_data = {
                                                "available": data_variant.get("availableForSale"),
                                                "id": data_variant['id'].split('/')[-1],
                                                # "inventory_policy": data_variant.get("inventoryPolicy"),
                                                "compare_at_price": data_variant.get("compareAtPrice"),
                                                'price': float(data_variant.get('price')),
                                                # "selected_options": data_variant.get("selectedOptions"),
                                                "title": data_variant.get('title'),
                                                "url": data_variant.get('image').get('url') if data_variant.get(
                                                    'image') != None else None
                                                # "weight": data_variant.get("weight"),
                                                # "weight_unit": data_variant.get("weightUnit"),
                                            }
                                            if data_variant.get("availableForSale") == False:
                                                not_available += 1
                                            if float(data_variant['price']) < min_price:
                                                min_price = float(data_variant['price'])
                                            if float(data_variant['price']) > max_price:
                                                max_price = float(data_variant['price'])
                                            if data_variant.get("compareAtPrice") is not None and data_variant.get(
                                                    'price') is not None:
                                                if ((float(data_variant.get('price')) / float(
                                                        data_variant.get("compareAtPrice"))) * 100) < min_percent_sale:
                                                    min_percent_sale = (float(data_variant.get('price')) / float(
                                                        data_variant.get("compareAtPrice"))) * 100
                                                if ((float(data_variant.get('price')) / float(
                                                        data_variant.get("compareAtPrice"))) * 100) > max_percent_sale:
                                                    max_percent_sale = (float(data_variant.get('price')) / float(
                                                        data_variant.get("compareAtPrice"))) * 100

                                            variant_list.append(variant_data)
                                        product_options.append({
                                            "available": False if not_available == len(variant_list) else True,
                                            "collections": data['collections']['nodes'],
                                            "created_at": data['createdAt'],
                                            'id': data['id'].split("/")[-1],
                                            'img_src': data['images']['edges'][0]['node'][
                                                'originalSrc'] if 'images' in data else None,
                                            "options": data['options'],
                                            "product_type": data['productType'],
                                            'title': data['title'],
                                            "handle": data['handle'],
                                            # 'product_url': data['onlineStorePreviewUrl'],
                                            "tags": data['tags'],
                                            "variants": variant_list,
                                            "vendor": data['vendor']
                                        })
                                        self.count_options(list_vendors, data['vendor'], 'vendors')
                                        self.count_options(list_product_types, data['productType'], 'productType')
                                        self.count_options(list_tags, data['tags'], 'tags')
                                        self.count_options(list_availability,
                                                           False if not_available == len(variant_list) else True,
                                                           'availability')
                            product_list = product_list + product_options
                        except Exception as e:
                            _logger.error(traceback.format_exc())
                            if str(e) == "Time out!":
                                return {
                                    'code': -1,
                                    'error': str(e)
                                }
                    # time.sleep(5.3)
                    if query_result['data']['products']['pageInfo']['hasNextPage'] == False:
                        break
                print(len(product_list))
                list_price_range['min'] = min_price
                list_price_range['max'] = max_price
                list_percent_sale['min'] = min_percent_sale
                list_percent_sale['max'] = max_percent_sale
                self.append_filter_options(list_collections, filter_options, 'collections', True, False, False, 0, 0,
                                           'Checkbox')
                self.append_filter_options(list_vendors, filter_options, 'vendor', True, False, False, 0, 1,
                                           'Checkbox')
                self.append_filter_options(list_product_types, filter_options, 'product_type', True, False, False, 0, 2,
                                           'Checkbox')
                self.append_filter_options(list_availability, filter_options, 'availability', True, False, False, 0, 3,
                                           'Checkbox')
                self.append_filter_options(list_tags, filter_options, 'tags', True, False, False, 0, 4,
                                           'Checkbox')
                self.append_filter_options(list_price_range, filter_options, 'price', True, False, False, 0, 5,
                                           'Slider')
                self.append_filter_options(list_percent_sale, filter_options, 'percent sale', True, False, False, 0, 6,
                                           'Slider')
                end_time = time.time()
                elapsed_time = end_time - start_time
                print(f"Elapsed time: {elapsed_time} seconds")
                current_store.product_list = json.dumps(product_list)
                current_store.filter_option = json.dumps(filter_options)

                shopify.ShopifyResource.clear_session()

            else:
                return {
                    'code': -1,
                    'error': 'Store not found.'
                }
        except Exception as e:
            _logger.error(traceback.format_exc())
            if str(e) == "Time out!":
                return {
                    'code': -1,
                    'error': str(e)
                }
            return {
                'code': -1,
                'error': 'Something went wrong. Please contact the customer support'
            }

    def count_options(self, list, data, options_name):
        if options_name == 'tags':
            for collection in data:
                index_of_collection = next(
                    (index for index, obj in zip(array('i', range(len(list))), list) if
                     obj['label'] == collection), None)
                if index_of_collection is not None:
                    list[index_of_collection]['count'] += 1
        elif options_name == 'vendors' or options_name == 'productType':
            index_of_collection = next(
                (index for index, obj in zip(array('i', range(len(list))), list) if
                 obj['label'] == data), None)
            if index_of_collection or index_of_collection == 0:
                list[index_of_collection]['count'] += 1
        elif options_name == 'availability':
            if data:
                list[0]['count'] += 1
            else:
                list[1]['count'] += 1

    def get_filter_options(self, options):
        loop = 0
        list_options = []
        query_params = ''
        last_element = ''

        while True:
            if loop != 0:
                string_after = 'after:"' + last_element + '" '
            else:
                string_after = ''
            if options == 'collections':
                query_params = '{' + options + '(first: 100' + string_after + ') {pageInfo {hasNextPage} edges {cursor node { productsCount title}} }}'
            elif options == 'productVendors' or options == 'productTypes' or options == 'productTags':
                query_params = '{' + options + '(first: 100' + string_after + ') {pageInfo {hasNextPage} edges {cursor node }}}'
            elif options == "availability":
                list_options = [{
                    "count": 0,
                    "label": "In Stock",
                    "value": 1
                }, {
                    "count": 0,
                    "label": "Out of Stock",
                    "value": 2
                }]
                break
            else:
                list_options = {
                    "min": 0,
                    "max": 0
                }
                break
            query = ('{shop ' + query_params + '}')
            query = json.loads(shopify.GraphQL().execute(query=query))
            last_element = query['data']['shop'][options]['edges'][
                len(query['data']['shop'][options]['edges']) - 1].get('cursor')
            loop += 1
            if query:
                if 'data' in query:
                    if 'shop' in query['data'] and options in query['data']['shop']:
                        if len(query['data']['shop'][options]['edges']) > 1:
                            for option in query['data']['shop'][options]['edges']:
                                self.append_list_options(options, option, list_options)
                        else:
                            self.append_list_options(options, query['data']['shop'][options]['edges'][0], list_options)
            if query['data']['shop'][options]['pageInfo']['hasNextPage'] == False:
                break
        return list_options

    def append_list_options(self, options, option, list_options):
        if options == 'collections':
            if option['node']['productsCount'] > 0:
                list_options.append({
                    "count": option['node']['productsCount'],
                    "label": option['node']['title'],
                })
        else:
            list_options.append({
                "label": option['node'],
                "count": 0,
            })

    def append_list_options(self, options, option, list_options):
        if options == 'collections':
            if option['node']['productsCount'] > 0:
                list_options.append({
                    "count": option['node']['productsCount'],
                    "label": option['node']['title'],
                })
        else:
            list_options.append({
                "label": option['node'],
                "count": 0,
            })

    def append_filter_options(self, options, filter_options, attribute, is_collapse, is_form_filter, is_selected, label,
                              position, style):
        filter_options.append({
            'attribute': attribute,
            'is_collapse': is_collapse,
            'is_form_filter': is_form_filter,
            'is_selected': is_selected,
            'label': label,
            'position': position,
            'style': style,
            'values': options,
        })
        return filter_options

    @http.route('/nb/get_product', auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def get_product(self, **kw):

        current_store = request.env['nb.shopify.store'].sudo().search(
            [("store_url", '=', kw['store_url'])], limit=1)

        if kw['query']['value'] == '':
            total_product = json.loads(current_store.product_list)
            product_list = self.get_product_chunk(total_product, kw['query']['pagination'] - 1, 12)
            # last_page = math.ceil(len(json.loads(current_store.product_list)) / 12)
            # has_more_page = True if last_page - kw['query']['pagination'] > 0 else False

        else:
            if kw['query']['option'] == 'collections':
                total_product = list(
                    filter(lambda x: any(option['title'] == kw['query']['value']['label'] for option in x[kw['query']['option']]),
                           json.loads(current_store.product_list)))
            elif kw['query']['option'] == 'tags':
                total_product = list(
                    filter(lambda x: any(
                        option == kw['query']['value']['label'] for option in x[kw['query']['option']]),
                           json.loads(current_store.product_list)))
            else:
                total_product = list(filter(lambda x: x[kw['query']['option']] == kw['query']['value']['label'],
                                            json.loads(current_store.product_list)))
            # last_page = math.ceil(len(product_list) / 12)
            product_list = self.get_product_chunk(total_product, kw['query']['pagination'] - 1, 12)

            # has_more_page = True if last_page - kw['query']['pagination'] > 0 else False

        pagination = {
            'current_page': kw['query']['pagination'],
            # 'from': kw['query'],
            # 'hasMorePages': has_more_page,
            # 'last_page': last_page,
            'per_page': 12,
            'total': len(total_product),
        }
        if current_store:
            return {
                'code': 0,
                'filter_options': current_store.filter_option if kw['is_mounted'] is True else '',
                'pagination': pagination,
                "product_list": product_list,
                "is_mounted": True if kw['is_mounted'] == True else False
            }

    def get_product_chunk(self, product_list, chunk_number, chunk_size):
        # chunk_number the number of chunk want to get (0:first 12)
        start_index = chunk_number * chunk_size
        end_index = start_index + chunk_size
        return json.dumps(product_list[start_index:end_index])
