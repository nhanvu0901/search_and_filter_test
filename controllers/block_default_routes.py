import logging
import werkzeug
from odoo import http
from odoo.addons.web.controllers import main
from odoo.http import request

_logger = logging.getLogger(__name__)


class BlockRouteController(http.Controller):
    @http.route(['/my', '/my/home', '/my/account'], type='http', auth="user", website=True)
    def home(self, **kw):
        user = request.env.user
        if user.has_group('base.group_system'):
            return werkzeug.utils.redirect('/web')
        else:
            return request.render('http_routing.404')

    @http.route(['/internal/signin'], type='http', auth="public", website=False)
    def internal_signin(self, **kw):
        return request.render('nestbundle.nestscale_app_admin_login')

    @http.route(['/internal/auth'], type='http', auth="public", website=False)
    def internal_auth(self, **kw):
        try:
            print(kw)
            if 'username' in kw and 'password' in kw:
                login = kw['username']
                passwd = kw['password']
                uid = request.session.authenticate(request.session.db, login, passwd)
                return werkzeug.utils.redirect('/web')
        except Exception as e:
            return werkzeug.utils.redirect('/internal/signin')


# class Home(main.Home):
#     @http.route('/web/login', type='http', auth="none")
#     def web_login(self, redirect=None, **kw):
#         user = request.env.user
#         if user.has_group('base.group_system'):
#             return super(Home, self).web_login(redirect, **kw)
#         else:
#             return werkzeug.utils.redirect('https://nestscale.com')
#
#     @http.route('/web/signup', type='http', auth='public', website=True, sitemap=False)
#     def web_auth_signup(self, *args, **kw):
#         qcontext = self.get_auth_signup_qcontext()
#         user = request.env.user
#         if user.has_group('base.group_system'):
#             return super(Home, self).web_auth_signup(*args, **kw)
#         else:
#             return werkzeug.utils.redirect('https://nestscale.com')
#
#     @http.route('/web/reset_password', type='http', auth='public', website=True, sitemap=False)
#     def web_auth_reset_password(self, *args, **kw):
#         user = request.env.user
#         if user.has_group('base.group_system'):
#             return super(Home, self).web_auth_reset_password(*args, **kw)
#         else:
#             return werkzeug.utils.redirect('https://nestscale.com')
#
#     @http.route('/', auth='user')
#     def default(self, **kw):
#         user = request.env.user
#         if user.has_group('base.group_system'):
#             return werkzeug.utils.redirect('/web')
#         else:
#             return werkzeug.utils.redirect('https://nestscale.com')
