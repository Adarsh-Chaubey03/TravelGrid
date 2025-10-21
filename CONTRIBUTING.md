# TravelGrid Contribution Guide (GSSoC'25)

Thank you for contributing to TravelGrid! This guide is short and aimed at first-time contributors.

## 1. Report an Issue

* Open a new GitHub Issue with a clear title and steps to reproduce.
* Include:

  * What you expected
  * What happened instead
  * Any error messages or screenshots
* Tag the issue with labels like `bug`, `enhancement`, or `question` if available.

## 2. Fork, Clone, and Create a Pull Request

* Fork the repository on GitHub (top-right "Fork").
* Clone your fork locally:

  ```bash
  git clone https://github.com/<your-username>/TravelGrid.git
  cd TravelGrid
  ```
* Create a feature branch from `main` or `develop`:

  ```bash
  git checkout -b feat/short-description
  ```
* Make changes, run the app and tests (if any), then commit.
* Push your branch:

  ```bash
  git push origin feat/short-description
  ```
* Open a Pull Request to the original repo, describe the change, and link related issues.

## 3. Branch Naming and Commit Messages

* Use simple branch names: `feat/`, `fix/`, `chore/`, `docs/` + short-description

  * Examples: `feat/profile-dropdown`, `fix/login-auth`
* Commit messages (one-line subject):

  * Use present tense: "Add" not "Added"
  * Prefix with scope when helpful: `auth: fix login redirect`
  * Keep it short and clear

## 4. Code Style & Formatting

* Follow the existing code style in the project.
* JavaScript/React: consistent spacing, semicolons where the project uses them, readable names.
* Run linters/formatters if present (e.g., `npm run lint`, `npm run format`).
* Keep changes focused — small, easy-to-review PRs are best.

## 5. Tests and Verification

* If you add behavior, try to include a simple test or manual verification steps.
* Document any environment variables or setup steps needed to run your change.

## 6. Be Welcome!

* Everyone starts somewhere — ask questions in issues or discussions.
* Be patient, polite, and provide context when asking for help.

Thanks for helping make TravelGrid better — we appreciate your time and ideas! 🎉
