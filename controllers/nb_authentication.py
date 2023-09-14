import shopify
import werkzeug
import logging
import traceback
import json
from odoo import http
from odoo.http import request, Response
from datetime import datetime
from werkzeug.http import dump_cookie
from odoo.service import security
from urllib.parse import urlencode
from .currency_symbol import get_currency_symbol

_logger = logging.getLogger(__name__)

SCOPES = [
    'read_products', "read_draft_orders", 'write_draft_orders', "read_orders"
]


class Root(http.Root):
    def get_response(self, httprequest, result, explicit_session):
        if isinstance(result, Response) and result.is_qweb:
            try:
                result.flatten()
            except Exception as e:
                if request.db:
                    result = request.registry['ir.http']._handle_exception(e)
                else:
                    raise

        if isinstance(result, (bytes, str)):
            response = Response(result, mimetype='text/html')
        else:
            response = result

        save_session = (not request.endpoint) or request.endpoint.routing.get('save_session', True)
        if not save_session:
            return response

        if httprequest.session.should_save:
            if httprequest.session.rotate:
                self.session_store.delete(httprequest.session)
                httprequest.session.sid = self.session_store.generate_key()
                if httprequest.session.uid:
                    httprequest.session.session_token = security.compute_session_token(httprequest.session, request.env)
                httprequest.session.modified = True
            self.session_store.save(httprequest.session)
        # We must not set the cookie if the session id was specified using a http header or a GET parameter.
        # There are two reasons to this:
        # - When using one of those two means we consider that we are overriding the cookie, which means creating a new
        #   session on top of an already existing session and we don't want to create a mess with the 'normal' session
        #   (the one using the cookie). That is a special feature of the Session Javascript class.
        # - It could allow session fixation attacks.
        if not explicit_session and hasattr(response, 'set_cookie'):
            cookie = dump_cookie('session_id', request.session.sid, max_age=90 * 24 * 60 * 60, secure=True,
                                 httponly=True)
            cookie = "{}; {}".format(cookie, b'SameSite=None'.decode('latin1'))
            response.headers.add('Set-Cookie', cookie)

        return response


http.Root.get_response = Root.get_response


class NestBundleAuthentication(http.Controller):
    @staticmethod
    def is_shop_auth(self, kw):
        timestamp = kw['timestamp']
        shop = request.env['nb.shopify.store'].sudo().search(
            [('store_url', '=', kw['shop']), ('install_status', '=', True)], limit=1)
        is_shop_login = 'nb_shop_login' in request.session and request.session['nb_shop_login'] == kw['shop']
        is_shop_login = is_shop_login and shop and not self.expire_session(timestamp)
        if is_shop_login:
            return True
        return False

    @staticmethod
    def expire_session(timestamp):
        try:
            if 'last_login' not in request.session:
                return False
            last_login = request.session.get('last_login')
            if last_login and timestamp:
                current_timestamp = datetime.now().timestamp()
                # check last shop last login by field last_login in shop, > 30p return False
                if last_login >= current_timestamp - 1800:
                    return False
        except Exception as e:
            _logger.error(traceback.format_exc())
        return False

    @http.route('/shopify/nestbundle', auth='public')
    def index(self, **kw):
        try:
            if self.is_shop_auth(self, kw):
                request.params['session_id'] = request.session.sid
                redirect_url = '/shopify/nestbundle/main?' + urlencode(request.params)
                return werkzeug.utils.redirect(redirect_url)
            else:
                return werkzeug.utils.redirect("/shopify/nestbundle/auth?" + urlencode(request.params))
        except Exception as e:
            _logger.error(traceback.format_exc())
        return werkzeug.utils.redirect('https://nestscale.com')

    @http.route('/shopify/nestbundle/auth', auth='public')
    def nestbundle_auth(self, **kw):
        if 'shop' in kw:
            api_key = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_key')
            api_secret = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_secret_key')
            api_version = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_version')
            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')
            try:
                shopify.ShopifyResource.clear_session()
                shopify.Session.setup(api_key=api_key, secret=api_secret)
                shopify_session = shopify.Session(request.params['shop'], api_version)
                scope = SCOPES
                redirect_uri = base_url + "/shopify/nestbundle/finalize"
                permission_url = shopify_session.create_permission_url(scope, redirect_uri)
                headers = {'Content-Security-Policy': "frame-ancestors https://" +
                                                      request.params['shop'] + " https://admin.shopify.com;"}
                return request.render('nestbundle.nestbundle_redirect', {'url': permission_url}, headers=headers)
            except Exception as e:
                _logger.error(traceback.format_exc())
        return werkzeug.utils.redirect('https://nestscale.com')

    @http.route('/shopify/nestbundle/finalize', auth='public')
    def nestbundle_finalize(self, **kw):
        if 'shop' not in request.params:
            raise Exception('Missing shop url parameter')

        api_key = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_key')
        api_secret = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_secret_key')
        api_version = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_version')
        try:
            shopify.Session.setup(api_key=api_key, secret=api_secret)
            shopify_session = shopify.Session(kw['shop'], api_version)
            token = shopify_session.request_token(kw)
            store = request.env['nb.shopify.store'].sudo().search([('store_url', '=', request.params['shop'])], limit=1)
            if not store:
                store = request.env['nb.shopify.store'].sudo().create({
                    'store_url': request.params['shop'],
                    'shopify_access_token': token
                })
                store.update_store_info()
            else:
                store.shopify_access_token = token
                store.install_status = True
                store.update_store_info()

            exist_bundle_design = request.env['nb.bundle.design'].sudo().search([('shopify_store', '=', store.id)],
                                                                                limit=1)
            if not exist_bundle_design:
                request.env['nb.bundle.design'].sudo().create({'shopify_store': store.id})

            request.session['last_login'] = datetime.now().timestamp()
            request.session['nb_shop_login'] = request.params['shop']
            store.register_webhook()

            redirect_url = 'https://' + request.params[
                'shop'] + '/admin/apps/' + api_key + "?session_id=" + request.session.sid

            return werkzeug.utils.redirect(redirect_url)
        except Exception as e:
            _logger.error(traceback.format_exc())
        return werkzeug.utils.redirect('https://nestscale.com')

    @http.route('/shopify/nestbundle/main', auth='public')
    def main(self, **kw):
        try:
            store = request.env['nb.shopify.store'].sudo().search([('store_url', '=', request.params['shop'])], limit=1)
            api_key = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_key')
            password_master = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_password_master')
            if store:
                headers = {'Content-Security-Policy': "frame-ancestors https://" +
                                                      request.params['shop'] + " https://admin.shopify.com;"}
                value = {
                    "current_store": store.name,
                    "store_currency": store.currency,
                    "domain": store.primary_domain,
                    "timezone": store.timezone,
                    "create_date": store.create_date.strftime("%Y-%m-%d"),
                    'primary_locale': store.primary_locale,
                    "country": store.country,
                    "currency_symbol": get_currency_symbol(store.currency),
                    'k': api_key  # Shopify API Key dùng để tạo App Bridge
                }
                password_master = password_master

                return request.render('nestbundle.nestbundle_index', {'nb_settings': json.dumps(value),
                                                                      'nb_password_master': json.dumps(
                                                                          password_master)},
                                      headers=headers)
        except Exception as e:
            _logger.error(traceback.format_exc())
        return werkzeug.utils.redirect('https://nestscale.com')

    @http.route('/shopify/nestbundle/internal_admin', auth='user')
    def check_internal(self, **kw):
        try:
            password_master = request.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_password_master')
            if "shop" in kw and kw['password_master'] == password_master:
                current_user = request.env.user
                if current_user.has_group('base.group_user'):
                    request.session['last_login'] = datetime.now().timestamp()
                    request.session['nb_shop_login'] = request.params['shop']
                    request.params['session_id'] = request.session.sid
                    redirect_url = '/shopify/nestbundle/main?' + urlencode(request.params)
                    return werkzeug.utils.redirect(redirect_url)
            else:
                return request.render('http_routing.404')
        except Exception as e:
            _logger.error(traceback.format_exc())
        return werkzeug.utils.redirect('https://nestscale.com')
