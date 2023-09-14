import json, traceback, logging, shopify, requests, hmac, base64, hashlib
from urllib import parse
from odoo import http
from odoo.http import request, Response
import traceback
import logging
from .auth import verify_request, verify_app_proxy_request
from datetime import datetime
import pytz

_logger = logging.getLogger(__name__)


class AnalyticController(http.Controller):
    @http.route('/nb/tracking_analytic/<string:mode>', auth='public', type='json', method=['POST'], csrf=False,
                cors="*")
    def nb_tracking_analytic(self, mode, **kw):
        try:
            # verify_app_proxy_request()
            # params = dict(parse.parse_qs(request.httprequest.query_string.decode()))
            # if kw['store_url'] == params['shop'][0]:
            current_shopify_store = request.env['nb.shopify.store'].sudo().search(
                [("store_url", '=', kw['store_url'])], limit=1)
            date = datetime.today().date()
            bundle_analytic = request.env['nb.bundle.analytic'].sudo().search(
                [('date', '=', date), ("store_ids", '=', current_shopify_store.id)], limit=1)
            if current_shopify_store:
                if mode == 'view':
                    if kw.get("bundle_view_ids"):
                        if bundle_analytic:
                            data = json.loads(bundle_analytic.analytic_json)
                            bundle_view_ids_set = set(kw.get("bundle_view_ids"))
                            bundle_ids_set = {obj['bundle_id'] for obj in data['data']}

                            intersection_set = bundle_view_ids_set & bundle_ids_set
                            diff_set = bundle_view_ids_set - intersection_set
                            update_bundle_ids = bundle_ids_set.union(diff_set)
                            for index, obj in enumerate(data['data']):
                                if obj['bundle_id'] in bundle_view_ids_set:
                                    data['data'][index]['view'] += 1
                            if len(diff_set) > 0:
                                for bundle_id in diff_set:
                                    data['data'].append({
                                        'bundle_id': bundle_id,
                                        'clicks': 0,
                                        'view': 1,
                                        'order': 0,
                                        "revenue": 0,
                                    })
                            bundle_analytic.write({
                                "bundle_ids": [(6, 0, update_bundle_ids)],
                                "analytic_json": json.dumps(data)
                            })
                        else:
                            data = []
                            for bundle_id in kw.get("bundle_view_ids"):
                                data.append({
                                    'bundle_id': bundle_id,
                                    'clicks': 0,
                                    'view': 1,
                                    "order": 0,
                                    "revenue": 0,
                                })
                            bundle_analytic.create({
                                "date": date,
                                "bundle_ids": [(6, 0, kw.get("bundle_view_ids"))],
                                "store_ids": current_shopify_store.id,
                                "analytic_json": json.dumps({"data": data})
                            })
                elif mode == 'click':
                    if kw.get('id'):
                        if bundle_analytic:
                            data = json.loads(bundle_analytic.analytic_json)
                            for index, obj in enumerate(data['data']):
                                if obj['bundle_id'] == kw.get('id'):
                                    data['data'][index]['clicks'] += 1
                            bundle_analytic.write({"analytic_json": json.dumps(data)})
        except Exception as e:
            _logger.error(traceback.format_exc())
        return {
            'code': -1,
            'error': 'Something went wrong. Please contact the customer support'
        }

    @http.route('/nb/get_analytic_data', auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def nb_get_analytic_data(self, **kw):
        try:
            verify_request()
            current_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['store_url'])],
                                                                          limit=1)
            if current_store:
                start_date = datetime.strptime(kw.get('start_date'), '%Y-%m-%d')
                end_date = datetime.strptime(kw.get('end_date'), '%Y-%m-%d')
                bundle_analytic = request.env['nb.bundle.analytic'].get_analytic(start_date, end_date, current_store,
                                                                                 True)
                table_data = request.env['nb.bundle.analytic'].get_bundle_table_data(bundle_analytic['list_bundle'])
                return {
                    "bundle_analytic": bundle_analytic,
                    "table_data": table_data
                }

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

    @http.route('/nb/get_dashboard_data', auth='public', type='json', method=['POST'], csrf=False, cors="*")
    def nb_get_analytic_dashboard(self, **kw):
        try:
            verify_request()
            current_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['store_url'])],
                                                                          limit=1)
            if current_store:
                timezone = current_store.timezone
                tz = pytz.timezone(timezone)
                today = datetime.now(tz)
                first_day_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                # xoa analytic o day
                bundle_analytic = request.env['nb.bundle.analytic'].get_analytic(first_day_of_month, today,
                                                                                 current_store, False)

                return {
                    "bundle_analytic": bundle_analytic
                }

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
