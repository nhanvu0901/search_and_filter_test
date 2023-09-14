import shopify
from odoo import models, fields, api
from urllib.parse import urlparse
import json
from odoo.http import request, Response
from datetime import datetime


class NestBundleBundle(models.Model):
    _name = 'nb.bundle.analytic'
    _rec_name = 'bundle_ids'

    date = fields.Date()
    bundle_ids = fields.One2many("nb.bundle", "bundle_analytic")
    analytic_json = fields.Char()
    store_ids = fields.Many2one("nb.shopify.store")

    def get_analytic(self, start_date, end_date, store, get_bundle_list):
        records = self.env['nb.bundle.analytic'].sudo().search([
            ('date', '>=', start_date),
            ('date', '<=', end_date),
            ('store_ids', '=', store.id)
        ])
        total_click = 0
        total_view = 0
        total_revenue = 0
        total_order = 0

        list_bundle = {}
        for analytic in records:
            data = json.loads(analytic.analytic_json)
            for bundle_analytic in data['data']:
                exist_bundle = request.env['nb.bundle'].sudo().search([('id', '=', bundle_analytic['bundle_id'])],
                                                                      limit=1)

                if get_bundle_list:
                    if bundle_analytic['bundle_id'] not in list_bundle:
                        list_bundle[bundle_analytic['bundle_id']] = {
                            # "click": bundle_analytic['clicks'],
                            # "view": bundle_analytic['view'],
                            "created_date": exist_bundle.create_date.strftime("%Y-%m-%d"),
                            "bundle_name": exist_bundle.bundle_name,
                            "bundle_display_name": exist_bundle.bundle_display_name,
                            "total_order": bundle_analytic['order'],
                            "total_revenue": bundle_analytic['revenue'],
                            'status': exist_bundle.status,
                            "active_bundle": exist_bundle.active_bundle
                        }
                    else:
                        list_bundle[bundle_analytic['bundle_id']] = {
                            # "click": bundle_analytic['clicks'] + list_bundle[bundle_analytic['bundle_id']]["click"],
                            # "view": bundle_analytic['view'] + list_bundle[bundle_analytic['bundle_id']]["click"],
                            "created_date": exist_bundle.create_date.strftime("%Y-%m-%d"),
                            "bundle_name": exist_bundle.bundle_name,
                            "bundle_display_name": exist_bundle.bundle_display_name,
                            "total_order": bundle_analytic['order'] + list_bundle[bundle_analytic['bundle_id']][
                                "total_order"],
                            "total_revenue": bundle_analytic['revenue'] + list_bundle[bundle_analytic['bundle_id']][
                                "total_revenue"],
                            "active_bundle": exist_bundle.active_bundle,
                            'status': exist_bundle.status
                        }
                total_click += bundle_analytic['clicks']
                total_view += bundle_analytic['view']
                total_order += bundle_analytic['order']
                total_revenue += bundle_analytic['revenue']

        return {
            "click": total_click,
            "view": total_view,
            "revenue": total_revenue,
            "order": total_order,
            "list_bundle": list_bundle
        }

    def get_bundle_table_data(self, list_bundle):
        filtered_data = filter(lambda x: x[1]['total_order'] > 0, list_bundle.items())
        sorted_data = sorted(filtered_data, key=lambda x: (x[1]['total_order'], x[1]['total_revenue']), reverse=True)[:5]
        top_5_objects = dict(sorted_data)
        array_top_5_objects = [value for key, value in top_5_objects.items()]
        counter = 1
        for obj in array_top_5_objects:
            obj["no"] = counter
            counter += 1

        return array_top_5_objects
