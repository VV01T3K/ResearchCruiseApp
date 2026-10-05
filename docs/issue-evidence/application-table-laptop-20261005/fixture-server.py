"""Synthetic API fixture for the applications layout issue. Run from the repo root."""
import json
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

# The checked-in application fixture is a JavaScript object; this fixture mirrors it.
manager = dict(id='11111111-1111-1111-1111-111111111111', email='manager@example.com', firstName='Ada', lastName='Lovelace')
application = dict(id='layout-0', number='1000', year=2026, date='2026-05-16', mainManager=manager,
    deputyManager=dict(manager, id='22222222-2222-2222-2222-222222222222', firstName='Grace', lastName='Hopper'),
    hasFormA=True, hasFormB=False, hasFormC=False, points=100, status='acceptedBySupervisor', effectsDoneRate='0',
    note=None, cruiseHours='24', cruiseDays=1, acceptablePeriodBeg='10', acceptablePeriodEnd='12',
    optimalPeriodBeg='10', optimalPeriodEnd='11', precisePeriodStart=None, precisePeriodEnd=None,
    startDate=None, endDate=None)
items = [dict(application, id=f'layout-{i}', number=str(1000-i)) for i in range(100)]
account = dict(id='fixture-admin', userName='admin@example.com', email='admin@example.com', firstName='Test', lastName='Admin',
    roles=['Administrator'], emailConfirmed=True, accepted=True)

class Handler(BaseHTTPRequestHandler):
    def respond(self, payload, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', self.headers.get('Origin', 'http://localhost:5173'))
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())
    def do_OPTIONS(self): self.respond({})
    def do_POST(self): self.do_GET()
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/v2/auth/refresh':
            self.respond(dict(accessToken='synthetic-layout-fixture', accessTokenExpirationDate=(datetime.now(timezone.utc)+timedelta(hours=24)).isoformat(),
                refreshTokenExpirationDate=(datetime.now(timezone.utc)+timedelta(hours=24)).isoformat()))
        elif path == '/v2/users/me': self.respond(account)
        elif path == '/v2/applications/managers': self.respond([manager])
        elif path == '/v2/applications': self.respond(dict(items=items, nextCursor=None))
        elif path == '/health': self.respond(dict(status='Healthy'))
        else: self.respond(dict(error='No fixture for this path'), 404)

ThreadingHTTPServer(('127.0.0.1', 8091), Handler).serve_forever()
