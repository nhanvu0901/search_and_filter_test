# -*- coding: utf-8 -*-
{
    'name': "nestbundle",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'http_routing'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/setting_views.xml',
        'views/views.xml',
        'views/menu_items.xml',
        'views/templates.xml',
        'views/http_routing_template.xml',
        'data/ir_cron_nest_bundle.xml'
    ],
    # only loaded in demonstration mode
    # 'demo': [
    #     'demo/demo.xml',
    # ],
    'assets': {
        'nestbundle.nb_js_package_assets': [
            'nestbundle/static/js/index.js',
        ],
    }
}
