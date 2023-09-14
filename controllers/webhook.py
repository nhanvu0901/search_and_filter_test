from odoo.tools import date_utils
from .auth import verify_webhook
from odoo import http
from odoo.http import request, Response
import traceback
import werkzeug
import logging
from datetime import datetime
import hmac
import hashlib
import json
import base64
import shopify

_logger = logging.getLogger(__name__)


class NSBundleWebhook(http.Controller):
    @http.route("/webhook/ns_bundle/uninstalled/<int:store_id>", auth="public", type="json", csrf=False, cors="*",
                save_session=False)
    def store_uninstalled(self, store_id):
        if verify_webhook():
            data = request.jsonrequest
            try:
                request.env['nb.webhook.log'].sudo().create({
                    'name': 'UninstallStore-' + str(store_id),
                    'data': json.dumps(data),
                    'store_id': int(store_id),
                    'type': 'uninstall_store'
                })
            except Exception as e:
                _logger.error(traceback.format_exc())
            return True
        return True

    @http.route("/webhook/ns_bundle/order_create/<int:store_id>", auth="public", type="json", csrf=False, cors="*",
                save_session=False)
    def create_order(self, store_id):
        if verify_webhook():
            data = request.jsonrequest
            try:
                request.env['nb.webhook.log'].sudo().create({
                    'name': 'CreateOrder-' + str(store_id),
                    'data': json.dumps(data),
                    'store_id': int(store_id),
                    'type': 'create_order'
                })
            except Exception as e:
                _logger.error(traceback.format_exc())
            return True
        return True

    @http.route("/webhook/ns_bundle/product/delete/<int:store_id>", auth="public", type="json", csrf=False, cors="*",
                save_session=False)
    def delete_product(self, store_id):
        if verify_webhook():
            data = request.jsonrequest
            try:
                request.env['nb.webhook.log'].sudo().create({
                    'name': 'DeleteProduct-' + str(store_id),
                    'data': json.dumps(data),
                    'store_id': int(store_id),
                    'type': 'delete_product'
                })
            except Exception as e:
                _logger.error(traceback.format_exc())
            return True
        return True

    @http.route("/webhook/ns_bundle/product/updated/<int:store_id>", auth="public", type="json", csrf=False, cors="*",
                save_session=False)
    def update_product(self, store_id):
        if verify_webhook():
            data = request.jsonrequest
            try:
                request.env['nb.webhook.log'].sudo().create({
                    'name': 'UpdateProduct-' + str(store_id),
                    'data': json.dumps(data),
                    'store_id': int(store_id),
                    'type': 'update_product'
                })
            except Exception as e:
                _logger.error(traceback.format_exc())
            return True
        return True

    @http.route('/webhook/ns_bundle/customers_redact', type='http', auth="public", csrf=False, save_session=False)
    def nb_customers_redact(self):
        return Response('success', status=200)

    @http.route('/webhook/ns_bundle/customers_data_request', type='json', auth="public", csrf=False, save_session=False)
    def nb_customers_data_redact(self):
        return Response('success', status=200)

    @staticmethod
    def verify_subs_webhook():
        secret_key = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_secret_key')
        # request.httprequest.data
        digest = hmac.new(
            secret_key.encode('utf-8'),
            request.httprequest.data,
            # json.dumps(request.params).encode('utf-8'),
            hashlib.sha256
        ).digest()
        computed_hmac = base64.b64encode(digest)
        if not hmac.compare_digest(computed_hmac,
                                   request.httprequest.headers.get('X-Shopify-Hmac-Sha256').encode('utf-8')):
            _logger.error('Secret key is not verified')
            raise Exception('Secret key is not verified')
        return True

    @http.route('/webhook/ns_bundle/shop_redact', type='json', auth="public", csrf=False, save_session=False)
    def nb_shop_redact(self):
        try:
            self.verify_subs_webhook()
            data = json.loads(request.httprequest.data)
            if data.get('shop_domain'):
                store = request.env['nb.shopify.store'].sudo().search([('store_url', '=', data.get('shop_domain'))],
                                                                      limit=1)
                if store:
                    store.install_status = False
            return Response('', status=200)
        except Exception as e:
            _logger.error(traceback.format_exc())
        # return Response('', status=200)
        return werkzeug.wrappers.Response(status=401)


class JsonRequest(http.JsonRequest):

    def _json_response(self, result=None, error=None):
        response = {
            'jsonrpc': '2.0',
            'id': self.jsonrequest.get('id')
        }
        if error is not None:
            response['error'] = error
        if result is not None:
            response['result'] = result

        mime = 'application/json'
        body = json.dumps(response, default=date_utils.json_default)
        status = 200
        if '401 UNAUTHORIZED' in body:
            status = 401
        return Response(
            body, status=error and error.pop('http_status', status) or status,
            headers=[('Content-Type', mime), ('Content-Length', len(body))]
        )


http.JsonRequest._json_response = JsonRequest._json_response
