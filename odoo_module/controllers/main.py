# -*- coding: utf-8 -*-
"""
controllers/main.py
-------------------
Serves the compiled React SPA at /deploy-test and handles HTML5 client-side
routing (any sub-path returns index.html so React Router can take over).

Works on:
  • Local dev  : http://localhost:8069/deploy-test
  • Odoo.sh    : https://<instance>.odoo.com/deploy-test
"""

import os
import logging

from odoo import http
from odoo.http import request, Response

_logger = logging.getLogger(__name__)

# ── Paths ─────────────────────────────────────────────────────────────────────

MODULE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR   = os.path.join(MODULE_DIR, 'static')
BUILD_DIR    = os.path.join(STATIC_DIR, 'build')   # React production build
INDEX_HTML   = os.path.join(BUILD_DIR, 'index.html')


class DeployTestController(http.Controller):
    """
    Catch-all controller for the React SPA.

    Route strategy:
      /deploy-test          → serves index.html (React entry)
      /deploy-test/<path>   → also serves index.html (client-side routing)
      Static assets (JS/CSS/images) are served automatically by Odoo's
      built-in static file serving from /deploy_test_react/static/build/.
    """

    # ── SPA shell ─────────────────────────────────────────────────────────────

    @http.route(
        ['/deploy-test', '/deploy-test/<path:subpath>'],
        type='http',
        auth='public',
        website=False,
        csrf=False,
        sitemap=False,
    )
    def react_app(self, subpath=None, **kwargs):
        """
        Serve the React SPA shell.
        Any path under /deploy-test returns the same index.html so that
        React Router (or simple state-based routing) can handle navigation
        entirely on the client side.
        """
        if not os.path.exists(INDEX_HTML):
            _logger.warning(
                'React build not found at %s. '
                'Run `npm run build` inside the react_app/ folder first.',
                BUILD_DIR,
            )
            return Response(
                _build_missing_page(),
                status=503,
                content_type='text/html; charset=utf-8',
            )

        with open(INDEX_HTML, 'r', encoding='utf-8') as f:
            html = f.read()

        return Response(html, content_type='text/html; charset=utf-8')

    # ── Health-check endpoint (useful for Odoo.sh readiness probes) ───────────

    @http.route(
        '/deploy-test/health',
        type='json',
        auth='none',
        csrf=False,
        sitemap=False,
    )
    def health_check(self, **kwargs):
        """
        Simple JSON health endpoint.
        Returns 200 + {"status": "ok"} when the module is loaded.
        """
        return {
            'status': 'ok',
            'module': 'deploy_test_react',
            'build_exists': os.path.exists(INDEX_HTML),
        }


# ── Helper ────────────────────────────────────────────────────────────────────

def _build_missing_page():
    """Return a friendly HTML page when the React build hasn't been generated."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Build Missing – Odoo Deploy Test</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0; background: #f8f9fc; }
    .card { background: #fff; border-radius: 12px; padding: 40px 48px;
            box-shadow: 0 2px 12px rgba(0,0,0,.1); max-width: 520px; text-align: center; }
    h1 { color: #1e1b4b; margin: 0 0 12px; }
    pre { background: #1e1b4b; color: #a5b4fc; padding: 16px; border-radius: 8px;
          text-align: left; font-size: .9rem; margin: 20px 0 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔧 React build missing</h1>
    <p>The React app hasn't been compiled yet. Run the following commands:</p>
    <pre>cd react_app
npm install
npm run build</pre>
    <p>Then restart (or update) the Odoo module.</p>
  </div>
</body>
</html>"""
