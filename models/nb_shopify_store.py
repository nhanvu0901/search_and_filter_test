import shopify
from odoo import models, fields
import pytz
from datetime import datetime

topics = {
    'product_update': {
        'name': 'products/update',
        'path': '/webhook/ns_bundle/product/updated'
    },
    'product_delete': {
        'name': 'products/delete',
        'path': '/webhook/ns_bundle/product/delete'
    },
    'uninstall': {
        'name': 'app/uninstalled',
        'path': '/webhook/ns_bundle/uninstalled'
    },
    'orders_create': {
        'name': 'orders/create',
        'path': '/webhook/ns_bundle/order_create'
    },

}


class NestBundleShopifyStore(models.Model):
    _name = 'nb.shopify.store'

    name = fields.Char()
    email = fields.Char()
    store_url = fields.Char()
    primary_domain = fields.Char()
    install_status = fields.Boolean(default=True)
    timezone = fields.Char()
    shopify_access_token = fields.Char()
    shop_id = fields.Char()
    currency = fields.Char()
    script_tag_updated = fields.Boolean(default=True)
    webhook_updated = fields.Boolean(default=True)
    webhook_ids = fields.Char()
    bundle = fields.One2many("nb.bundle", "shopify_store")
    primary_locale = fields.Char()
    country = fields.Char()
    product_list = fields.Char()
    filter_option = fields.Char()

    theme_id = fields.One2many("theme.store", "shopify_store")
    store_front_api = fields.Char()

    def register_webhook(self):
        try:
            self.ensure_one()
            webhook_ids = []
            session = self.init_nest_bundle_shopify_session()
            existing_webhooks = shopify.Webhook.find(limit=100)
            webhook_base_url = self.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_webhook_base_url')
            if not len(existing_webhooks) > 0:
                for t in topics:
                    topic = topics[t]
                    full_path = webhook_base_url + topic['path'] + '/' + str(self.id)
                    webhook = shopify.Webhook()
                    webhook.topic = topic['name']
                    webhook.address = full_path
                    webhook.format = 'json'
                    webhook.save()
                    if webhook.id:
                        webhook_ids.append(webhook.id)
                if len(webhook_ids) > 0:
                    self.webhook_ids = ','.join(map(str, webhook_ids))
        except Exception as e:
            return False
        shopify.ShopifyResource.clear_session()

    def init_nest_bundle_shopify_session(self):
        api_version = self.env['ir.config_parameter'].sudo().get_param('nestbundle.nb_api_version')
        new_session = shopify.Session(self.store_url, api_version, token=self.shopify_access_token)
        shopify.ShopifyResource.activate_session(new_session)
        return new_session

    def update_store_info(self):
        self.init_nest_bundle_shopify_session()
        shop = shopify.Shop.current()
        self.email = shop.email
        self.timezone = shop.iana_timezone
        self.name = shop.name
        self.currency = shop.currency
        self.primary_domain = shop.domain
        self.shop_id = shop.id
        self.country = shop.country
        self.primary_locale = shop.primary_locale
        return True

    def cron_job_update_active_date(self):
        for shopify_store in self.env['nb.shopify.store'].sudo().search([('install_status', '=', True)]):
            tz = pytz.timezone(shopify_store.timezone)
            current_time = datetime.now(tz).astimezone(pytz.timezone(shopify_store.timezone))
            for bundle in self.env['nb.bundle'].sudo().search([('active_bundle', '=', True), ('status', '=', 'active'),('shopify_store','=',shopify_store.id)
                                                               , ('end_active_date', '<', current_time)]):
                bundle.check_active_date(True)
