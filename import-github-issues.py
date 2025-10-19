#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Copy issues from a public GitHub repository to another repository you can
write to. Skips PRs. Copies labels (creating missing ones), milestones
(optional creation), comments, and preserves closed/open state.

Usage:
  export GITHUB_TOKEN=...
  python copy_github_issues.py --src owner1/repo1 --dst owner2/repo2

Notes:
- You cannot impersonate original authors. The script attributes them
  inside the issue body and comments.
- Assignees are not copied by default (can optionally set a default).
- For GitHub Enterprise, use --api-base https://github.yourco.com/api/v3
"""

import argparse
import datetime as dt
import json
import os
import sys
import time
from typing import Dict, Generator, List, Optional, Tuple

import requests

PRINT_PREFIX = "[copy-issues]"

DEFAULT_API_BASE = "https://api.github.com"

# 429 is rare on GitHub; rate limiting is signaled via 403 with headers.
RETRY_STATUS = {500, 502, 503, 504, 429}


def log(msg: str) -> None:
    print(f"{PRINT_PREFIX} {msg}", flush=True)


def parse_repo(s: str) -> Tuple[str, str]:
    parts = s.split("/")
    if len(parts) != 2 or not all(parts):
        raise ValueError(f"Invalid repo '{s}', use owner/repo")
    return parts[0], parts[1]


def now_utc_iso() -> str:
    # Use timezone-aware UTC; keep trailing 'Z' for compatibility
    return (
        dt.datetime.now(dt.timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


class GitHub:
    def __init__(
        self,
        token: str,
        api_base: str = DEFAULT_API_BASE,
        throttle_ms: int = 0,
    ) -> None:
        self.token = token
        self.api_base = api_base.rstrip("/")
        # Sleep this long after write requests to avoid secondary limits
        self.throttle_ms = max(0, throttle_ms)

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "issue-migrator/1.0",
        }

    def _sleep_until_reset(self, reset_epoch: Optional[str]) -> None:
        if not reset_epoch:
            time.sleep(60)
            return
        try:
            reset_ts = int(reset_epoch)
            now = int(time.time())
            wait = max(0, reset_ts - now) + 5
        except Exception:
            wait = 60
        log(f"Rate limit reached. Sleeping {wait}s until reset...")
        time.sleep(wait)

    def request(
        self,
        method: str,
        path: str,
        params: Optional[Dict] = None,
        json_body: Optional[Dict] = None,
    ) -> requests.Response:
        url = path if path.startswith("http") else f"{self.api_base}{path}"
        backoff = 2
        # Max backoff ~ 5 minutes to be conservative
        max_backoff = 300
        while True:
            res = requests.request(
                method,
                url,
                headers=self._headers(),
                params=params,
                json=json_body,
                timeout=60,
            )
            # Primary rate limit: wait until reset
            if res.status_code == 403 and res.headers.get("X-RateLimit-Remaining") == "0":
                self._sleep_until_reset(res.headers.get("X-RateLimit-Reset"))
                continue
            # Secondary rate limit (anti-abuse) or abuse detection
            if res.status_code == 403:
                msg = ""
                try:
                    msg = (res.json() or {}).get("message", "")
                except Exception:
                    msg = res.text or ""
                if "secondary rate limit" in msg.lower() or "temporarily blocked" in msg.lower() or "abuse" in msg.lower():
                    retry_after = res.headers.get("Retry-After")
                    if retry_after:
                        try:
                            wait = int(float(retry_after))
                        except Exception:
                            wait = backoff
                    else:
                        wait = backoff
                    wait = min(wait, max_backoff)
                    log(f"Secondary rate limit on {method} {url}. Sleeping {wait}s...")
                    time.sleep(wait)
                    # Exponential backoff with jitter
                    backoff = min(int(backoff * 1.8) + 1, max_backoff)
                    continue
            if res.status_code in RETRY_STATUS:
                log(
                    f"HTTP {res.status_code} on {method} {url}. "
                    f"Retrying in {backoff}s..."
                )
                time.sleep(backoff)
                backoff = min(backoff * 2, 30)
                continue
            # Post-write throttle to smooth out bursts
            if res.ok and method in ("POST", "PATCH", "PUT", "DELETE") and self.throttle_ms > 0:
                time.sleep(self.throttle_ms / 1000.0)
            return res

    def get_json(
        self, path: str, params: Optional[Dict] = None
    ) -> Dict:
        res = self.request("GET", path, params=params)
        if not res.ok:
            raise RuntimeError(f"GET {path} failed: {res.status_code} {res.text}")
        return res.json()

    def paginate(
        self, path: str, params: Optional[Dict] = None
    ) -> Generator[Dict, None, None]:
        url = path if path.startswith("http") else f"{self.api_base}{path}"
        while url:
            res = requests.get(
                url, headers=self._headers(), params=params, timeout=60
            )
            if res.status_code == 403 and res.headers.get(
                "X-RateLimit-Remaining"
            ) == "0":
                self._sleep_until_reset(res.headers.get("X-RateLimit-Reset"))
                continue
            if not res.ok:
                raise RuntimeError(
                    f"GET {url} failed: {res.status_code} {res.text}"
                )
            data = res.json()
            if isinstance(data, list):
                for item in data:
                    yield item
            else:
                yield data
            link = res.headers.get("Link", "")
            next_url = None
            if link:
                parts = [p.strip() for p in link.split(",")]
                for p in parts:
                    if 'rel="next"' in p:
                        next_url = p[p.find("<") + 1 : p.find(">")]
                        break
            url = next_url
            params = None  # Only on first call
            # Tiny pause to avoid hammering on large pagination
            time.sleep(0.05)

    # Convenience wrappers
    def list_issues(
        self,
        owner: str,
        repo: str,
        state: str,
        since: Optional[str],
    ) -> Generator[Dict, None, None]:
        params = {"state": state, "per_page": 100}
        if since:
            params["since"] = since
        path = f"/repos/{owner}/{repo}/issues"
        yield from self.paginate(path, params=params)

    def list_labels(self, owner: str, repo: str) -> List[Dict]:
        path = f"/repos/{owner}/{repo}/labels"
        return list(self.paginate(path, params={"per_page": 100}))

    def create_label(
        self, owner: str, repo: str, name: str, color: str, desc: str = ""
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/labels"
        res = self.request(
            "POST",
            path,
            json_body={"name": name, "color": color, "description": desc},
        )
        if not res.ok and res.status_code != 422:
            # 422 if already exists (race)
            raise RuntimeError(
                f"Create label '{name}' failed: {res.status_code} {res.text}"
            )
        return res.json() if res.ok else {"name": name}

    def list_milestones(self, owner: str, repo: str) -> List[Dict]:
        path = f"/repos/{owner}/{repo}/milestones"
        return list(self.paginate(path, params={"per_page": 100, "state": "all"}))

    def create_milestone(
        self, owner: str, repo: str, title: str, state: str = "open"
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/milestones"
        res = self.request(
            "POST", path, json_body={"title": title, "state": state}
        )
        if not res.ok and res.status_code != 422:
            raise RuntimeError(
                f"Create milestone '{title}' failed: "
                f"{res.status_code} {res.text}"
            )
        return res.json() if res.ok else {"title": title}

    def create_issue(
        self,
        owner: str,
        repo: str,
        title: str,
        body: str,
        labels: List[str],
        milestone_number: Optional[int],
        assignees: Optional[List[str]] = None,
    ) -> Dict:
        payload = {"title": title, "body": body, "labels": labels}
        if milestone_number:
            payload["milestone"] = milestone_number
        if assignees:
            payload["assignees"] = assignees
        path = f"/repos/{owner}/{repo}/issues"
        res = self.request("POST", path, json_body=payload)
        if not res.ok:
            # Retry without assignees if that fails due to permissions
            if assignees and res.status_code == 422:
                log(
                    "Assign failed (likely not a collaborator). "
                    "Retrying without assignees."
                )
                payload.pop("assignees", None)
                res = self.request("POST", path, json_body=payload)
            if not res.ok:
                raise RuntimeError(
                    f"Create issue failed: {res.status_code} {res.text}"
                )
        return res.json()

    def list_comments(self, comments_url: str) -> List[Dict]:
        return list(self.paginate(comments_url, params={"per_page": 100}))

    # Reactions
    def list_issue_reactions(self, owner: str, repo: str, number: int) -> List[Dict]:
        path = f"/repos/{owner}/{repo}/issues/{number}/reactions"
        # Reactions API needs the special media type in some older deployments,
        # but GitHub.com works with the default Accept we set.
        return list(self.paginate(path, params={"per_page": 100}))

    def list_comment_reactions(
        self, owner: str, repo: str, comment_id: int
    ) -> List[Dict]:
        path = f"/repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        return list(self.paginate(path, params={"per_page": 100}))

    def create_issue_reaction(
        self, owner: str, repo: str, number: int, content: str
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/issues/{number}/reactions"
        res = self.request("POST", path, json_body={"content": content})
        if not res.ok and res.status_code != 200 and res.status_code != 201:
            raise RuntimeError(
                f"Create reaction failed: {res.status_code} {res.text}"
            )
        return res.json()

    def create_comment_reaction(
        self, owner: str, repo: str, comment_id: int, content: str
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
        res = self.request("POST", path, json_body={"content": content})
        if not res.ok and res.status_code != 200 and res.status_code != 201:
            raise RuntimeError(
                f"Create comment reaction failed: {res.status_code} {res.text}"
            )
        return res.json()

    # PR review comments (different from issue comments)
    def list_pr_review_comments(
        self, owner: str, repo: str, pr_number: int
    ) -> List[Dict]:
        path = f"/repos/{owner}/{repo}/pulls/{pr_number}/comments"
        return list(self.paginate(path, params={"per_page": 100}))

    # Lock/Unlock issue
    def lock_issue(self, owner: str, repo: str, number: int, reason: str = None) -> None:
        path = f"/repos/{owner}/{repo}/issues/{number}/lock"
        body = {"lock_reason": reason} if reason else {}
        res = self.request("PUT", path, json_body=body)
        if res.status_code not in (204, 201):
            raise RuntimeError(
                f"Lock issue failed: {res.status_code} {res.text}"
            )

    def create_comment(
        self, owner: str, repo: str, number: int, body: str
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/issues/{number}/comments"
        res = self.request("POST", path, json_body={"body": body})
        if not res.ok:
            raise RuntimeError(
                f"Create comment failed: {res.status_code} {res.text}"
            )
        return res.json()

    def update_issue_state(
        self, owner: str, repo: str, number: int, state: str
    ) -> Dict:
        path = f"/repos/{owner}/{repo}/issues/{number}"
        res = self.request("PATCH", path, json_body={"state": state})
        if not res.ok:
            raise RuntimeError(
                f"Update issue state failed: {res.status_code} {res.text}"
            )
        return res.json()


def sanitize_color(c: Optional[str]) -> str:
    if not c:
        return "ededed"
    c = c.strip().lstrip("#")
    if len(c) != 6:
        return "ededed"
    return c.lower()


def load_map(path: str) -> Dict:
    if not os.path.exists(path):
        return {"migrated": {}, "created": now_utc_iso()}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_map(path: str, data: Dict) -> None:
    data["updated"] = now_utc_iso()
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, sort_keys=True)
    os.replace(tmp, path)


def filter_issue(
    issue: Dict,
    include_labels: List[str],
    exclude_labels: List[str],
    since_date: Optional[str],
    until_date: Optional[str],
    include_prs: bool,
) -> bool:
    # Optionally include PRs (GitHub exposes PRs in the /issues feed)
    if "pull_request" in issue and not include_prs:
        return False
    labels = [
        (lab if isinstance(lab, str) else lab.get("name", ""))
        for lab in issue.get("labels", [])
    ]
    if include_labels:
        if not any(l in labels for l in include_labels):
            return False
    if exclude_labels:
        if any(l in labels for l in exclude_labels):
            return False
    created = issue.get("created_at")
    if since_date and created and created < since_date:
        return False
    if until_date and created and created > until_date:
        return False
    return True


def build_body_with_link(issue: Dict) -> str:
    # Copy body verbatim and append a minimal footer linking to the original.
    # If the original URL is already in the body, don't duplicate it.
    body = issue.get("body") or ""
    url = issue.get("html_url") or ""
    if url and url not in body:
        body = f"{body}\n\n---\nOriginal issue: {url}"
    return body


def ensure_labels(
    gh: GitHub,
    dst_owner: str,
    dst_repo: str,
    src_labels: List[Dict],
    cache: Dict[str, bool],
) -> List[str]:
    names: List[str] = []
    for lab in src_labels:
        if isinstance(lab, str):
            name = lab
            color = "ededed"
            desc = ""
        else:
            name = lab.get("name", "")
            color = sanitize_color(lab.get("color"))
            desc = lab.get("description") or ""
        if not name:
            continue
        if name not in cache:
            try:
                # Preserve label color and description when creating
                gh.create_label(dst_owner, dst_repo, name, color, desc)
            except Exception as e:
                log(f"Label create warning for '{name}': {e}")
            cache[name] = True
        names.append(name)
    return names


def map_milestone_number(
    gh: GitHub,
    dst_owner: str,
    dst_repo: str,
    src_milestone: Optional[Dict],
    allow_create: bool,
    ms_index: Dict[str, int],
) -> Optional[int]:
    if not src_milestone:
        return None
    title = src_milestone.get("title")
    if not title:
        return None
    if title in ms_index:
        return ms_index[title]
    # Refresh destination milestones
    dst_ms = gh.list_milestones(dst_owner, dst_repo)
    for m in dst_ms:
        ms_index[m.get("title", "")] = m.get("number")
    if title in ms_index:
        return ms_index[title]
    if not allow_create:
        log(f"Milestone '{title}' missing and creation disabled.")
        return None
    try:
        created = gh.create_milestone(dst_owner, dst_repo, title, "open")
        num = created.get("number")
        if num:
            ms_index[title] = num
            return num
    except Exception as e:
        log(f"Milestone create warning for '{title}': {e}")
    return None


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Copy issues between GitHub repos."
    )
    ap.add_argument("--src", required=True, help="source owner/repo")
    ap.add_argument("--dst", required=True, help="destination owner/repo")
    ap.add_argument(
        "--token",
        default=os.environ.get("GITHUB_TOKEN", ""),
        help="GitHub token (or set GITHUB_TOKEN env)",
    )
    ap.add_argument(
        "--api-base",
        default=DEFAULT_API_BASE,
        help="API base (for GH Enterprise)",
    )
    ap.add_argument(
        "--throttle-ms",
        type=int,
        default=250,
        help="sleep N milliseconds after each write request (POST/PATCH) "
        "to avoid secondary rate limits (default: 250)",
    )
    ap.add_argument(
        "--state",
        choices=["open", "closed", "all"],
        default="all",
        help="which issues to fetch from source",
    )
    ap.add_argument(
        "--include-label",
        action="append",
        default=[],
        help="only issues with any of these labels (repeatable)",
    )
    ap.add_argument(
        "--exclude-label",
        action="append",
        default=[],
        help="exclude issues with any of these labels (repeatable)",
    )
    ap.add_argument(
        "--since",
        default=None,
        help="only issues created at or after ISO time "
        "(e.g. 2023-01-01T00:00:00Z)",
    )
    ap.add_argument(
        "--until",
        default=None,
        help="only issues created at or before ISO time",
    )
    ap.add_argument(
        "--copy-comments",
        choices=["yes", "no"],
        default="yes",
        help="copy comments to destination",
    )
    ap.add_argument(
        "--include-prs",
        choices=["yes", "no"],
        default="yes",
        help="include pull requests (copied as issues with link to original PR)",
    )
    ap.add_argument(
        "--copy-pr-review-comments",
        choices=["yes", "no"],
        default="yes",
        help="copy PR review comments (for items that are PRs)",
    )
    ap.add_argument(
        "--copy-reactions",
        choices=["yes", "no"],
        default="yes",
        help="copy reactions on issues and comments (added by you)",
    )
    ap.add_argument(
        "--lock-like-source",
        choices=["yes", "no"],
        default="yes",
        help="lock destination issue if source was locked",
    )
    ap.add_argument(
        "--create-milestones",
        choices=["yes", "no"],
        default="yes",
        help="create missing milestones by title",
    )
    ap.add_argument(
        "--default-assignee",
        default=None,
        help="assign all created issues to this username (optional)",
    )
    ap.add_argument(
        "--close-like-source",
        choices=["yes", "no"],
        default="yes",
        help="close the new issue if source is closed",
    )
    ap.add_argument(
        "--limit",
        type=int,
        default=None,
        help="max number of issues to copy",
    )
    ap.add_argument(
        "--from-issue",
        type=int,
        default=None,
        help="start from this source issue number (skip lower numbers)",
    )
    ap.add_argument(
        "--map-file",
        default="migration-map.json",
        help="path to resume/record mapping file",
    )
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="do not create anything, just print actions",
    )

    args = ap.parse_args()

    if not args.token:
        log("Error: Missing token. Use --token or set GITHUB_TOKEN.")
        sys.exit(1)

    src_owner, src_repo = parse_repo(args.src)
    dst_owner, dst_repo = parse_repo(args.dst)

    gh = GitHub(args.token, args.api_base, args.throttle_ms)

    mapping = load_map(args.map_file)
    migrated: Dict[str, int] = mapping.get("migrated", {})
    mapping["source"] = args.src
    mapping["destination"] = args.dst

    # Cache destination labels to reduce API calls
    dst_labels = gh.list_labels(dst_owner, dst_repo)
    label_cache = {lab.get("name", ""): True for lab in dst_labels}

    # Cache destination milestones by title
    ms_index: Dict[str, int] = {}
    for m in gh.list_milestones(dst_owner, dst_repo):
        ms_index[m.get("title", "")] = m.get("number")

    copied = 0
    total_seen = 0

    log(
        f"Starting migration from {args.src} to {args.dst} "
        f"(state={args.state})"
    )

    for issue in gh.list_issues(src_owner, src_repo, args.state, args.since):
        if args.from_issue and issue.get("number", 0) < args.from_issue:
            continue
        if not filter_issue(
            issue,
            args.include_label,
            args.exclude_label,
            args.since,
            args.until,
            include_prs=(args.include_prs == "yes"),
        ):
            continue

        num = issue.get("number")
        total_seen += 1

        if str(num) in migrated:
            log(f"Skipping #{num}: already migrated as "
                f"#{migrated[str(num)]}.")
            continue

        title = issue.get("title", "")
        body = build_body_with_link(issue)

        src_labels = issue.get("labels", [])
        labels = ensure_labels(
            gh, dst_owner, dst_repo, src_labels, label_cache
        )

        milestone_number = map_milestone_number(
            gh=gh,
            dst_owner=dst_owner,
            dst_repo=dst_repo,
            src_milestone=issue.get("milestone"),
            allow_create=(args.create_milestones == "yes"),
            ms_index=ms_index,
        )

        assignees = (
            [args.default_assignee] if args.default_assignee else None
        )

        if args.dry_run:
            log(
                f"[DRY-RUN] Would create issue: '{title}' "
                f"labels={labels} milestone={milestone_number} "
                f"assignees={assignees}"
            )
            new_number = -1
        else:
            created = gh.create_issue(
                dst_owner,
                dst_repo,
                title,
                body,
                labels,
                milestone_number,
                assignees,
            )
            new_number = created.get("number")
            new_url = created.get("html_url")
            log(f"Created #{new_number}: {new_url}")

        # Copy comments (issue comments)
        created_comments_map: List[int] = []
        if args.copy_comments == "yes" and not args.dry_run:
            comments = gh.list_comments(issue.get("comments_url", ""))
            for c in comments:
                try:
                    new_c = gh.create_comment(
                        dst_owner, dst_repo, new_number, c.get("body") or ""
                    )
                    created_comments_map.append(new_c.get("id"))
                except Exception as e:
                    log(f"Comment copy warning: {e}")

        # Copy PR review comments if this is a PR
        if (
            args.include_prs == "yes"
            and args.copy_pr_review_comments == "yes"
            and "pull_request" in issue
            and not args.dry_run
        ):
            pr_number = issue.get("number")
            try:
                pr_rcs = gh.list_pr_review_comments(src_owner, src_repo, pr_number)
                for rc in pr_rcs:
                    # Minimal context header so you don't lose file/line info
                    path = rc.get("path", "")
                    pos = rc.get("position")
                    author = rc.get("user", {}).get("login", "unknown")
                    header = f"[PR review comment by @{author} at {path}"
                    header += f":{pos}]" if pos is not None else "]"
                    body_rc = rc.get("body") or ""
                    try:
                        gh.create_comment(
                            dst_owner, dst_repo, new_number, f"{header}\n\n{body_rc}"
                        )
                    except Exception as e:
                        log(f"PR review comment copy warning: {e}")
            except Exception as e:
                log(f"List PR review comments warning: {e}")

        # Close if needed
        if (
            args.close_like_source == "yes"
            and issue.get("state") == "closed"
            and not args.dry_run
        ):
            try:
                gh.update_issue_state(
                    dst_owner, dst_repo, new_number, "closed"
                )
            except Exception as e:
                log(f"Close warning: {e}")

        # Lock if needed (requires sufficient permissions on destination)
        if (
            args.lock_like_source == "yes"
            and issue.get("locked")
            and not args.dry_run
        ):
            try:
                # GitHub Issues API may include lock_reason; if present, pass it
                reason = issue.get("active_lock_reason")
                gh.lock_issue(dst_owner, dst_repo, new_number, reason)
            except Exception as e:
                log(f"Lock warning: {e}")

        # Update mapping file
        if not args.dry_run:
            migrated[str(num)] = new_number
            mapping["migrated"] = migrated
            save_map(args.map_file, mapping)

        copied += 1
        if args.limit and copied >= args.limit:
            log(f"Hit limit {args.limit}. Stopping.")
            break

    log(
        f"Done. Considered {total_seen} issues; copied {copied}. "
        f"Mapping saved to {args.map_file}."
    )


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("Interrupted.")
        sys.exit(130)