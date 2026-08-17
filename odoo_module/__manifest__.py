# -*- coding: utf-8 -*-
{
    'name': 'Deploy Test – React App',
    'version': '17.0.1.0.0',
    'summary': 'Sample React.js application served via Odoo for deploy testing on Odoo.sh',
    'description': """
        A sample React application that:
        - Serves a React SPA through an Odoo HTTP controller
        - Tests DB manager, auth, and server health against the Odoo JSON-RPC API
        - Works identically on localhost and Odoo.sh
    """,
    'author': 'Your Name',
    'category': 'Technical',
    'depends': ['web'],
    'data': [
        'views/react_app_template.xml',
    ],
    'assets': {
        # No Odoo asset pipeline — React builds its own bundle.
        # The controller serves the built index.html directly.
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
