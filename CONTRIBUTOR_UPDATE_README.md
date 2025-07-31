# Contributor Data Auto-Update System

This repository automatically keeps the `Contributor-data.md` file updated with the latest contributor information from GitHub.

## 🚀 How It Works

### Automatic Updates
- **Daily Schedule**: Runs automatically every day at 2 AM UTC
- **Manual Trigger**: Can be triggered manually from the GitHub Actions tab
- **On Code Changes**: Runs when `UpdateContributors.py` or the workflow file is modified

### What It Does
1. Fetches all contributors from the GitHub repository
2. Retrieves all pull requests (open and closed)
3. Calculates contribution scores based on PR count
4. Updates the `Contributor-data.md` file with live data
5. Commits and pushes changes automatically

## 📁 Files

- `UpdateContributors.py` - Main script that fetches and updates contributor data
- `.github/workflows/update-contributors.yml` - GitHub Actions workflow
- `Contributor-data.md` - Auto-updated file with contributor information
- `requirements.txt` - Python dependencies

## 🔧 Setup

The system uses GitHub's built-in `GITHUB_TOKEN` secret, so no additional configuration is needed for public repositories.

## 📊 Data Structure

The `Contributor-data.md` file contains:
- **Name**: GitHub username
- **GitHub Handle**: @username format
- **PR Link**: Links to all pull requests by the contributor
- **Score**: Number of pull requests contributed

## 🎯 Benefits

- **Always Fresh**: Data is automatically updated daily
- **No Manual Work**: No need to manually update contributor lists
- **Accurate**: Real-time data from GitHub API
- **Transparent**: Clear contribution tracking for all contributors

## 🔍 Monitoring

You can monitor the automatic updates by:
1. Going to the "Actions" tab in your GitHub repository
2. Looking for the "Update Contributors Data" workflow
3. Checking the commit history for commits with "🤖 Auto-update contributor data"

## 🛠️ Manual Update

To manually trigger an update:
1. Go to the "Actions" tab
2. Select "Update Contributors Data" workflow
3. Click "Run workflow" button
4. Select the branch and click "Run workflow" 