Thank you for contributing to TravelGrid! This guide is short and aimed at first-time contributors (GSSoC'25 friendly).

1. Report an issue
- Prefer opening a new GitHub Issue with a clear title and steps to reproduce.
- Include: what you expected, what happened instead, and any error messages or screenshots.
- Tag the issue with labels like `bug`, `enhancement`, or `question` if available.

2. Fork, clone, and create a pull request
- Fork the repository on GitHub (top-right "Fork").
- Clone your fork locally:
  - git clone https://github.com/<your-username>/TravelGrid.git
  - cd TravelGrid
- Create a feature branch from `main` or `develop`:
  - git checkout -b feat/short-description
- Make changes, run the app and tests (if any), then commit.
- Push your branch: git push origin feat/short-description
- Open a Pull Request to the original repo, describe the change, and link related issues.

3. Branch naming and commit messages
- Use simple branch names: `feat/`, `fix/`, `chore/`, `docs/` + short-description
  - examples: `feat/profile-dropdown`, `fix/login-auth`.
- Commit messages (one-line subject):
  - Use present tense: "Add" not "Added".
  - Prefix with scope when helpful: `auth: fix login redirect`.
  - Keep it short and clear.

4. Code style & formatting
- Follow the existing code style in the project.
- JavaScript/React: prefer consistent spacing, semicolons where the project uses them, and readable names.
- Run linters/formatters if present (e.g., `npm run lint`, `npm run format`).
- Keep changes focused to the issue — small, easy-to-review PRs are best.

5. Tests and verification
- If you add behavior, try to include a simple test or manual verification steps.
- Document any environment variables or setup steps needed to run your change.

6. Be welcome!
- Everyone starts somewhere — ask questions in issues or discussions.
- Be patient, polite, and give context when asking for help.

Thanks for helping make TravelGrid better — we appreciate your time and ideas! 🎉
