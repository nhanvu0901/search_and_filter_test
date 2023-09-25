import shopify
from odoo import models, fields
import pytz
from datetime import datetime




class NestBundleShopifyStore(models.Model):
    _name = 'theme.store'

    name = fields.Char()
    id = fields.Char()
    shopify_store = fields.Many2one("nb.shopify.store")
    parent_class = fields.Char()
    child_class = fields.Char()
