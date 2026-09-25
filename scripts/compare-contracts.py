"""Compare generated contracts with the working tree, or install them for the explicit fix task."""
import shutil
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
mode, scratch_arg = sys.argv[1:]
scratch = Path(scratch_arg).resolve()
if mode not in ("check", "fix") or not scratch.is_relative_to(root / "backend/artifacts/contracts"):
    raise SystemExit("Invalid contract workspace")
pairs = [
    (scratch / "openapi", root / "backend/ResearchCruiseApp/openapi"),
    (scratch / "frontend/src/api/generated", root / "frontend/src/api/generated"),
]
different = False
for generated, tracked in pairs:
    if not generated.is_dir() or not any(generated.rglob("*")):
        raise SystemExit(f"Missing generated output: {generated}")
    if tracked.is_symlink() or not tracked.resolve().is_relative_to(root):
        raise SystemExit(f"Unsafe generated output destination: {tracked}")
    if mode == "fix":
        if tracked.exists():
            shutil.rmtree(tracked)
        shutil.copytree(generated, tracked)
        continue
    expected = {p.relative_to(generated): p.read_bytes() for p in generated.rglob("*") if p.is_file()}
    actual = {p.relative_to(tracked): p.read_bytes() for p in tracked.rglob("*") if p.is_file()}
    for name in sorted(expected.keys() | actual.keys()):
        if expected.get(name) != actual.get(name):
            print(f"Generated contract differs: {(tracked / name).relative_to(root)}")
            different = True
if different:
    raise SystemExit("Run vpr fix to regenerate contracts, then review the changes.")
