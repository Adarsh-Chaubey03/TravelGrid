#!/usr/bin/env python3
"""
gssoc_pr_scores.py
Scan merged PRs in a public repo and produce a CSV of contributors who have PRs
labelled with 'gssoc25' AND exactly one of 'level 1', 'level 2', 'level 3'.

Output CSV columns: Name, GitHub ID, PR Count, Total Score
"""

import requests
import csv
import time
import os
import argparse
from collections import defaultdict

# CONFIG: level -> score, must match label text exactly
LEVEL_SCORES = {
    "level 1": 3,
    "level 2": 7,
    "level 3": 10
}
REQUIRED_LABEL = "gssoc25"   # must match exactly

API_BASE = "https://api.github.com"

def get_headers(token):
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

def fetch_all_closed_prs(owner, repo, token=None, per_page=100, sleep=0.2):
    """Return list of PR dicts (closed PRs). We will filter merged ones later."""
    page = 1
    prs = []
    headers = get_headers(token)
    while True:
        url = f"{API_BASE}/repos/{owner}/{repo}/pulls"
        params = {"state": "closed", "per_page": per_page, "page": page}
        r = requests.get(url, headers=headers, params=params)
        if r.status_code != 200:
            raise RuntimeError(f"GitHub API error: {r.status_code} {r.text}")
        batch = r.json()
        if not batch:
            break
        prs.extend(batch)
        page += 1
        time.sleep(sleep)
    return prs

def fetch_user_name(login, token=None):
    """Optional: fetch user's full name from /users/{login}. Returns None if not found."""
    headers = get_headers(token)
    url = f"{API_BASE}/users/{login}"
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        data = r.json()
        return data.get("name") or None
    return None

def analyze_prs(prs, token=None, require_exact_one_level=True):
    """
    prs: list of PR objects (as returned by GitHub)
    Returns: dict keyed by login -> {'name': str, 'pr_count': int, 'score': int}
    """
    stats = defaultdict(lambda: {"name": None, "pr_count": 0, "score": 0})
    for pr in prs:
        # Only count merged PRs
        if not pr.get("merged_at"):
            continue

        labels = [lab.get("name", "") for lab in pr.get("labels", [])]

        # require label 'gssoc25'
        if REQUIRED_LABEL not in labels:
            continue

        # collect level labels present in the PR
        levels_present = [lvl for lvl in LEVEL_SCORES.keys() if lvl in labels]

        # require exactly one level label
        if require_exact_one_level:
            if len(levels_present) != 1:
                continue
            level = levels_present[0]
        else:
            if not levels_present:
                continue
            level = levels_present[0]

        # contributor
        user = pr.get("user") or {}
        login = user.get("login", "unknown")

        stats[login]["pr_count"] += 1
        stats[login]["score"] += LEVEL_SCORES[level]
        if not stats[login]["name"]:
            stats[login]["name"] = login

    return stats

def write_csv(stats, out_path):
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "GitHub ID", "PR Count", "Total Score"])
        # sort by score descending then PR count
        items = sorted(stats.items(), key=lambda kv: (-kv[1]["score"], -kv[1]["pr_count"], kv[0]))
        for login, rec in items:
            writer.writerow([rec["name"], login, rec["pr_count"], rec["score"]])

def write_xlsx(stats, out_path_xlsx):
    """Optional: write XLSX using pandas (if available)."""
    try:
        import pandas as pd
    except Exception:
        print("pandas not installed; cannot write xlsx. Install pandas and openpyxl to enable.")
        return
    rows = []
    items = sorted(stats.items(), key=lambda kv: (-kv[1]["score"], -kv[1]["pr_count"], kv[0]))
    for login, rec in items:
        rows.append({"Name": rec["name"], "GitHub ID": login, "PR Count": rec["pr_count"], "Total Score": rec["score"]})
    df = pd.DataFrame(rows)
    df.to_excel(out_path_xlsx, index=False)
    print(f"Wrote XLSX: {out_path_xlsx}")

def main():
    parser = argparse.ArgumentParser(description="Generate CSV of gssoc25 PR counts & scores per contributor.")
    parser.add_argument("--owner", required=True, help="GitHub repo owner (user/org)")
    parser.add_argument("--repo", required=True, help="GitHub repo name")
    parser.add_argument("--output", default="gssoc25_scores.csv", help="CSV output filename")
    parser.add_argument("--token", default=None, help="GitHub token (optional). If not provided, env var GITHUB_TOKEN will be used if present.")
    parser.add_argument("--fetch-names", action="store_true", help="Try to fetch contributors' full names from GitHub (uses extra API calls).")
    parser.add_argument("--xlsx", action="store_true", help="Also write an XLSX file (requires pandas + openpyxl).")
    args = parser.parse_args()

    token = args.token or os.environ.get("GITHUB_TOKEN")
    print(f"Fetching closed PRs for {args.owner}/{args.repo} (token={'YES' if token else 'NO'})...")

    try:
        prs = fetch_all_closed_prs(args.owner, args.repo, token=token)
    except Exception as e:
        print("Error while fetching PRs:", e)
        return

    print(f"Total closed PRs fetched: {len(prs)}. Filtering merged PRs with labels...")

    stats = analyze_prs(prs, token=token, require_exact_one_level=True)

    if args.fetch_names and token:
        print("Fetching full names for contributors (this uses 1 request per contributor)...")
        for login in list(stats.keys()):
            try:
                name = fetch_user_name(login, token=token)
                if name:
                    stats[login]["name"] = name
            except Exception as e:
                print(f" - failed to fetch name for {login}: {e}")
            time.sleep(0.1)

    # Ensure name fallback
    for login, rec in stats.items():
        if not rec["name"]:
            rec["name"] = login

    write_csv(stats, args.output)
    print(f"Wrote CSV: {args.output}")

    if args.xlsx:
        out_xlsx = os.path.splitext(args.output)[0] + ".xlsx"
        write_xlsx(stats, out_xlsx)

    # Print a short summary
    total_contrib = len(stats)
    total_prs = sum(r["pr_count"] for r in stats.values())
    total_score = sum(r["score"] for r in stats.values())
    print(f"Summary: contributors={total_contrib}, counted PRs={total_prs}, total score={total_score}")
    print("Top contributors:")
    top = sorted(stats.items(), key=lambda kv: (-kv[1]["score"], -kv[1]["pr_count"]))[:10]
    for login, rec in top:
        print(f" - {rec['name']} ({login}): {rec['pr_count']} PRs, {rec['score']} points")

if __name__ == "__main__":
    main()
