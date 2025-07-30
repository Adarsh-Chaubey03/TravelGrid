import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "Adarsh-Chaubey03/TravelGrid"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"}

def fetch_merged_prs():
    """Fetch all merged PRs from the repository."""
    prs = []
    page = 1
    while True:
        url = f"https://api.github.com/repos/{REPO}/pulls?state=closed&per_page=100&page={page}"
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        page_prs = response.json()
        if not page_prs:
            break
        prs.extend(page_prs)
        page += 1
    return [pr for pr in prs if pr.get("merged_at")]

def get_pr_labels(pr_number):
    """Fetch labels for a specific PR."""
    url = f"https://api.github.com/repos/{REPO}/issues/{pr_number}/labels"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return [label["name"] for label in response.json()]

def calculate_contributor_scores(prs):
    """Calculate scores and PR counts for each contributor."""
    scores = {}
    for pr in prs:
        user = pr["user"]["login"]
        if user not in scores:
            scores[user] = {
                "level1": 0,
                "level2": 0,
                "level3": 0,
                "total_score": 0,
                "avatar_url": pr["user"]["avatar_url"]
            }
        labels = get_pr_labels(pr["number"])
        if "Level 1" in labels:
            scores[user]["level1"] += 1
            scores[user]["total_score"] += 10
        elif "Level 2" in labels:
            scores[user]["level2"] += 1
            scores[user]["total_score"] += 25
        elif "Level 3" in labels:
            scores[user]["level3"] += 1
            scores[user]["total_score"] += 45
    return scores

def generate_markdown(scores):
    """Generate markdown content for contributor-data.md."""
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    markdown = """# TravelGrid Contributors