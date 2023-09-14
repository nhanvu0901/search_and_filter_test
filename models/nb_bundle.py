import json
import shopify
from odoo import api, fields, models, _
from urllib import parse
from urllib.parse import urlparse
from odoo.http import request
from odoo.exceptions import ValidationError
import pytz
from datetime import datetime


class NestBundleBundle(models.Model):
    _name = 'nb.bundle'
    _rec_name = 'bundle_name'

    shopify_store = fields.Many2one("nb.shopify.store")
    bundle_design = fields.Many2one("nb.bundle.design")
    bundle_analytic = fields.Many2one("nb.bundle.analytic")
    priority = fields.Integer()
    bundle_name = fields.Char()
    bundle_display_name = fields.Char(default="Best of summer collection")
    bundle_description = fields.Char(default='Buy more save more with this summer combo')
    status = fields.Selection([('active', 'Active'), ('inactive', 'Inactive'), ('draft', 'Draft')], default="draft",
                              string='Status')
    bundle_type = fields.Selection([('product', 'Product discount bundle'), ('volume', 'Volume discount bundle')],
                                   default="product", string='Bundle Type')
    discount_type = fields.Selection(
        [('percentage', 'Percentage discount'), ('free_gift', 'Free gift'), ('fixed_amount', 'Fixed discount amount'),
         ('set_price', 'Set price')], default="percentage", string='Discount Type')
    amount = fields.Integer()
    free_gift = fields.Char()
    bundle_json = fields.Char()
    volume_json = fields.Char()
    start_active_date = fields.Datetime(string='Start Date')
    end_active_date = fields.Datetime(string='End Date')
    active_bundle = fields.Boolean(default=False)

    compute_end_active_date = fields.Datetime(compute='_compute_date')

    def _compute_date(self):
        timezone = self.shopify_store.timezone
        tz = pytz.timezone(timezone)
        end_active_time = tz.localize(self.end_active_date.replace(tzinfo=None))
        return end_active_time

    @api.constrains
    def check_bundle_priority(self):
        for rec in self:
            bundle = self.env['nb.bundle'].search([('priority', '=', rec.priority), ('id', '!=', rec.id)],
                                                  ('priority', '!=', -1), limit=1)
            if bundle:
                raise ValidationError(_('Priority already used'))

    def get_data_bundle(self):
        return {
            'bundle_ids': self.id,
            'bundle_design': self.bundle_design if self.bundle_design else '',
            'bundle_analytic': self.bundle_analytic if self.bundle_analytic else '',
            'priority': self.priority if self.priority != -1 else -1,
            "bundle": {
                'bundleName': self.bundle_name,
                "bundleType": self.bundle_type,
                "bundleDisplayName": self.bundle_display_name,
                'bundleDescription': self.bundle_description
            },
            'items': len(json.loads(self.bundle_json)) if self.bundle_type == 'product' else 0 if json.loads(
                self.volume_json).get('productSelected') == None else 1,
            'status': self.status,
            'discountType': self.discount_type if self.bundle_type == 'product' else json.loads(self.volume_json).get(
                'discountType'),
            'amount_discount': self.amount,
            'free_gift': self.free_gift,
            'bundle_json': self.bundle_json,
            'volume_json': self.volume_json,
            'start_active_date': self.start_active_date,
            'end_active_date': self.end_active_date
        }

    def check_active_date(self, flag):
        if self.status != 'draft':
            if not flag:
                if self.status == "inactive":
                    self.status = 'inactive'
                else:
                    self.status = "active"
            elif self.status == "active":
                self.status = "inactive"
            return self.status
        else:
            return 'draft'

    def check_date_status(self):
        timezone = self.shopify_store.timezone
        tz = pytz.timezone(timezone)
        current_time = datetime.now(tz)
        start_active_time = tz.localize(self.start_active_date.replace(tzinfo=None))
        end_active_time = tz.localize(self.end_active_date.replace(tzinfo=None))


        if start_active_time < end_active_time < current_time:
            bundle_status = self.check_active_date(True)
        else:
            bundle_status = self.check_active_date(False)

        return bundle_status

    # def cron_active_date(self):
    #     for record in self.env['nb.bundle'].sudo().search([('active_bundle', '=', True), ('status', '=', 'active')]):
    #         record.check_date_status()
    #         # timezone = record.shopify_store.timezone.split()[1]
    #         # tz = pytz.timezone(timezone)
    #         # current_time = datetime.now(tz)
    #         # start_active_time = tz.localize(record.start_active_date.replace(tzinfo=None))
    #         # end_active_time = tz.localize(record.end_active_date.replace(tzinfo=None))
    #         # if start_active_time < current_time < end_active_time:
    #         #     record.check_active_date(True)
    #         # else:
    #         #     record.check_active_date(False)
