#!/usr/bin/env python3
"""Publish the two digests from a successful build into Arcane's Compose source."""
import pathlib
import re
import sys

compose = pathlib.Path('docker/arcane/compose.yaml')
content = compose.read_text()
for component in ('frontend', 'backend'):
    digest = (pathlib.Path(sys.argv[1]) / f'{component}.digest').read_text().strip()
    if not re.fullmatch(r'sha256:[0-9a-f]{64}', digest):
        raise ValueError(f'Invalid {component} image digest')
    pattern = rf'ghcr\.io/vv01t3k/researchcruiseapp/{component}@sha256:[0-9a-f]{{64}}'
    content, count = re.subn(pattern, f'ghcr.io/vv01t3k/researchcruiseapp/{component}@{digest}', content)
    if count != 1:
        raise ValueError(f'Expected one pinned {component} image, found {count}')
compose.write_text(content)
