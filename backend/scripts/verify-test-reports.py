"""Reject missing, empty, failed or skipped suites, including stale-report avoidance by caller."""
import sys
from pathlib import Path
from xml.etree import ElementTree

namespace = {"t": "http://microsoft.com/schemas/VisualStudio/TeamTest/2010"}
failed = False
for directory in map(Path, sys.argv[1:]):
    reports = list(directory.glob("*.trx"))
    if len(reports) != 1:
        print(f"ERROR: {directory}: expected one fresh TRX report, found {len(reports)}")
        failed = True
        continue
    try:
        root = ElementTree.parse(reports[0]).getroot()
        counters = root.find("t:ResultSummary/t:Counters", namespace)
        results = root.findall("t:Results/t:UnitTestResult", namespace)
        if counters is None:
            raise ValueError("missing counters")
        total = int(counters.attrib["total"])
        executed = int(counters.attrib["executed"])
        passed = int(counters.attrib["passed"])
        if total == 0 or executed != total or passed != total or len(results) != total:
            raise ValueError(f"total={total}, executed={executed}, passed={passed}, results={len(results)}")
        if any(result.attrib.get("outcome") != "Passed" for result in results):
            raise ValueError("a test did not pass")
        print(f"{directory.name}: {passed} executed and passed, no skips")
    except (ElementTree.ParseError, KeyError, ValueError) as error:
        print(f"ERROR: {directory}: {error}")
        failed = True
if len(sys.argv) < 2:
    print("ERROR: supply at least one results directory")
    failed = True
sys.exit(1 if failed else 0)
