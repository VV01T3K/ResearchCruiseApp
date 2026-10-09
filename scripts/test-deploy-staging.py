"""Exercise the real deployment script with a mock curl and the real jq."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("deploy-staging.sh")
SETTINGS = {
    "STAGING_SYNC_URL": "https://example.invalid/sync",
    "STAGING_DEPLOY_URL": "https://example.invalid/up",
    "STAGING_DEPLOY_API_KEY": "test-api-key",
    "CLOUDFLARE_WEBHOOK_SECRET": "test-webhook-secret",
}
SYNC_OK = '{"success":true,"data":{"success":true}}'
DEPLOY_OK = '{"message":"pulling"}\n{"done":true}\n'
MOCK_CURL = """#!/usr/bin/env python3
import json, os, sys
args = sys.argv[1:]
with open(os.environ['CALLS'], 'a') as log:
    log.write(json.dumps(args) + '\\n')
code, body = json.loads(os.environ['RESPONSES'])[args[-1]]
sys.stdout.write(body)
sys.exit(code)
"""


class DeploymentChecks(unittest.TestCase):
    def run_script(self, sync=SYNC_OK, deploy=DEPLOY_OK, sync_exit=0,
                   deploy_exit=0, missing=None):
        with tempfile.TemporaryDirectory() as directory:
            mock = Path(directory, "curl")
            mock.write_text(MOCK_CURL)
            mock.chmod(0o700)
            calls = Path(directory, "calls.jsonl")
            env = {**os.environ, **SETTINGS,
                   "PATH": directory + os.pathsep + os.environ["PATH"],
                   "CALLS": str(calls), "RESPONSES": json.dumps({
                       SETTINGS["STAGING_SYNC_URL"]: [sync_exit, sync],
                       SETTINGS["STAGING_DEPLOY_URL"]: [deploy_exit, deploy],
                   })}
            if missing:
                env.pop(missing)
            result = subprocess.run(["bash", str(SCRIPT)], env=env,
                                    capture_output=True, text=True)
            requests = [json.loads(line) for line in calls.read_text().splitlines()] if calls.exists() else []
            return result, requests

    def test_success_orders_requests_and_preserves_authentication(self):
        result, calls = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([call[-1] for call in calls],
                         [SETTINGS["STAGING_SYNC_URL"], SETTINGS["STAGING_DEPLOY_URL"]])
        for call in calls:
            headers = [call[i + 1] for i, arg in enumerate(call) if arg == "--header"]
            self.assertIn("X-Api-Key: test-api-key", headers)
            self.assertIn("X-Cloudflare-Secret: test-webhook-secret", headers)
            self.assertIn("Content-Type: application/json", headers)
            self.assertIn("--fail", call)
            self.assertEqual(call[call.index("--proto") + 1], "=https")
        self.assertEqual(json.loads(calls[0][calls[0].index("--data") + 1]), {})
        self.assertEqual(json.loads(calls[1][calls[1].index("--data") + 1]),
                         {"pullPolicy": "always", "forceRecreate": False, "recreateVolumes": False})

    def test_failed_sync_never_deploys(self):
        for body in ['{"success":false,"data":{"success":true}}',
                     '{"success":true,"data":{"success":false}}',
                     '{"success":true}', '{}', '', 'invalid json']:
            with self.subTest(body=body):
                result, calls = self.run_script(sync=body)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(len(calls), 1)

    def test_http_errors_fail_even_with_success_bodies(self):
        for options, expected_calls in [({"sync_exit": 22}, 1), ({"deploy_exit": 22}, 2)]:
            with self.subTest(options=options):
                result, calls = self.run_script(**options)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(len(calls), expected_calls)

    def test_missing_settings_never_make_requests(self):
        for setting in SETTINGS:
            with self.subTest(setting=setting):
                result, calls = self.run_script(missing=setting)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(setting, result.stderr)
                self.assertEqual(calls, [])

    def test_incomplete_deployment_fails(self):
        for body in ['', 'invalid json', '{"message":"pulling"}\n',
                     '{"done":false}\n', '{"done":"true"}\n',
                     '{"done":true}\n{"done":false}\n']:
            with self.subTest(body=body):
                result, calls = self.run_script(deploy=body)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(len(calls), 2)


if __name__ == "__main__":
    unittest.main()
