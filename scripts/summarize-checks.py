"""Render separate suite results without turning a failed job green."""
from pathlib import Path
from xml.etree import ElementTree

root = Path(__file__).resolve().parent.parent / "backend/artifacts"
ns = {"t": "http://microsoft.com/schemas/VisualStudio/TeamTest/2010"}
print("| Suite | Execution |")
print("| --- | --- |")
for label, folder in [("Legacy backend (unreviewed)", "legacy-unreviewed"), ("Backend unit", "Unit"), ("Backend integration", "Integration")]:
    reports = sorted(root.glob(f"tests/run-*/{folder}/*.trx"), key=lambda p: p.stat().st_mtime)
    if not reports:
        result = "No report; not verified"
    else:
        counters = ElementTree.parse(reports[-1]).getroot().find("t:ResultSummary/t:Counters", ns)
        result = f"{counters.get('passed')}/{counters.get('total')} passed; {counters.get('executed')} executed" if counters is not None else "Missing counters"
    print(f"| {label} | {result} |")
frontend = root / "frontend-unit.xml"
if frontend.exists():
    document = ElementTree.parse(frontend).getroot()
    tests = document.findall(".//testcase")
    failures = sum(1 for test in tests if test.find("failure") is not None or test.find("error") is not None)
    skipped = sum(1 for test in tests if test.find("skipped") is not None)
    result = f"{len(tests)} cases, {failures} failures, {skipped} skipped"
else:
    result = "No report; not verified"
print(f"| Frontend unit | {result} |")
print("\nFormatting, analysis, types and contract comparison: see the workspace check step and log.")
