import json
from odoo import http
from odoo.http import request, Response
import traceback
import logging
from .auth import verify_request
from urllib import parse

_logger = logging.getLogger(__name__)


class BundleListController(http.Controller):
    @http.route('/nb/get_bundle_list', auth='public', type="json")
    def nb_get_bundle_list(self, **kw):
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['store_url'])],
                                                                                  limit=1)
            bundle_list = []
            if current_shopify_store:
                for bundle_data in current_shopify_store.bundle:
                    if bundle_data.active_bundle:
                        bundle_list.append(bundle_data.get_data_bundle())
            return {
                'code': 0,
                'bundle_list': bundle_list,
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

    @http.route('/nb/delete_bundle', auth='public', type="json")
    def nb_delete_bundle(self, **kw):
        try:
            verify_request()
            current_shopify_store = request.env['nb.shopify.store'].sudo().search([("store_url", '=', kw['store_url'])],
                                                                                  limit=1)
            delete_bundle = request.env['nb.bundle'].sudo().search(
                [('id', '=', kw['bundle_ids']), ("shopify_store", '=', current_shopify_store.id),
                 ('active_bundle', '=', True)], limit=1)
            if delete_bundle:
                delete_bundle.active_bundle = False
                return {'code': 0, 'message': 'Bundle is successfully deleted!'}
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
