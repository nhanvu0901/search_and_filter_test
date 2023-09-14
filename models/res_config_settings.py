import logging
import traceback
from odoo import models, fields

_logger = logging.getLogger(__name__)


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    nb_api_key = fields.Char('API Key', config_parameter='nestbundle.nb_api_key')
    nb_api_secret_key = fields.Char('Secret Key', config_parameter='nestbundle.nb_api_secret_key')
    nb_api_version = fields.Char('API Version', config_parameter='nestbundle.nb_api_version')
    nb_webhook_base_url = fields.Char('Webhook URL', config_parameter='nestbundle.nb_webhook_base_url', default='')
    nb_script_tag_url = fields.Char('Script Tag URL', config_parameter='nestbundle.nb_script_tag_url')
    nb_password_master = fields.Char('Password Master', config_parameter='nestbundle.nb_password_master')

    def update_nest_bundle_script_tag(self):
        nb_script_tag_url = self.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_script_tag_url')
        nb_script_tag_url = nb_script_tag_url.split('?v=')[0]
        nb_script_tag_url = nb_script_tag_url + '?v=' + str(fields.Datetime.now().timestamp())
        self.env['ir.config_parameter'].set_param('nestbundle.nb_script_tag_url', nb_script_tag_url)
        need_update_stores = self.env['nb.shopify.store'].sudo().search([('install_status', '=', True)])
        for store in need_update_stores:
            store.sudo().script_tag_updated = False

    def update_nest_bundle_webhook(self):
        need_update_stores = self.env['nb.shopify.store'].sudo().search([('install_status', '=', True)])
        for store in need_update_stores:
            store.sudo().webhook_updated = False
