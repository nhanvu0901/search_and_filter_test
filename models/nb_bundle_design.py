import shopify
from odoo import models, fields, api
from urllib.parse import urlparse


class NestBundleBundleDesign(models.Model):
    _name = 'nb.bundle.design'
    _rec_name = 'shopify_store'

    shopify_store = fields.Many2one("nb.shopify.store")
    button_text_product = fields.Char(default='Add to Cart')
    button_text_color_product = fields.Char(default='#ffffff')
    button_color_product = fields.Char(default='#000000')
    button_action_product = fields.Selection(
        [('add_to_cart', 'Add to cart only'), ('redirect', 'Redirect to Cart page')], default="add_to_cart",
        string='Button Action')
    bundle_display_name_color_product = fields.Char(default='#000000')
    bundle_description_color_product = fields.Char(default='#000000')
    bundle_discount_price_color_product = fields.Char(default='#000000')
    bundle_compare_at_price_color_product = fields.Char(default='#a8a8a8')
    bundle_product_name_color_product = fields.Char(default='#000000')
    confirmation_message_product = fields.Char(default='Bundle added to cart')
    max_bundle = fields.Integer(default=3)

    button_text_volume = fields.Char(default='Add to Cart')
    button_text_color_volume = fields.Char(default='#ffffff')
    button_color_volume = fields.Char(default='#000000')
    button_action_volume = fields.Selection(
        [('add_to_cart', 'Add to cart only'), ('redirect', 'Redirect to Cart page')], default="add_to_cart",
        string='Button Action')
    bundle_display_name_color_volume = fields.Char(default='#000000')
    bundle_description_color_volume = fields.Char(default='#000000')
    bundle_discount_price_color_volume = fields.Char(default='#000000')
    bundle_compare_at_price_color_volume = fields.Char(default='#a8a8a8')
    bundle_product_name_color_volume = fields.Char(default='#000000')
    confirmation_message_volume = fields.Char(default='Bundle added to cart')

    def get_bundle_design(self):
        bundle_design_data = {
            'max_number': self.max_bundle,
            'bundle_design_product': {
                "btn_text": self.button_text_product,
                "btn_text_color": self.button_text_color_product,
                "btn_color": self.button_color_product,
                "btn_action": self.button_action_product,
                'bundle_display_name_color': self.bundle_display_name_color_product,
                'bundle_description_color': self.bundle_description_color_product,
                'discounted_price_color': self.bundle_discount_price_color_product,
                'compare_at_price_color': self.bundle_compare_at_price_color_product,
                'product_name_color': self.bundle_product_name_color_product,
                'message_text': self.confirmation_message_product
            },
            'bundle_design_volume': {
                "btn_text": self.button_text_volume,
                "btn_text_color": self.button_text_color_volume,
                "btn_color": self.button_color_volume,
                "btn_action": self.button_action_volume,
                'bundle_display_name_color': self.bundle_display_name_color_volume,
                'bundle_description_color': self.bundle_description_color_volume,
                'discounted_price_color': self.bundle_discount_price_color_volume,
                'compare_at_price_color': self.bundle_compare_at_price_color_volume,
                'product_name_color': self.bundle_product_name_color_volume,
                'message_text': self.confirmation_message_volume
            }
        }
        return bundle_design_data
