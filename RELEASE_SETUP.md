# Automating npm Releases

This repository uses GitHub Actions to automate npm releases. When you push to the contents of the `main` branch, the workflow will:

1.  Bump the minor version of the package (e.g., `1.0.0` -> `1.1.0`)
2.  Generate a changelog from commit messages
3.  Create a git tag and GitHub release
4.  Publish the package to npm

## 🚀 Setup Required

Before the first release can run, you must configure:

### 1. npm Access Token
1.  Log in to [npmjs.com](https://www.npmjs.com)
2.  Go to **Access Tokens** -> **Generate New Token**
3.  Select **Automation** type
4.  Copy the token string
5.  In this GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**
6.  Click **New repository secret**
7.  Name: `NPM_TOKEN`
8.  Value: (Paste your plain token)

### 2. GitHub Workflow Permissions
1.  Go to **Settings** -> **Actions** -> **General**
2.  Scroll to **Workflow permissions**
3.  Select **Read and write permissions**
4.  Check **Allow GitHub Actions to create and approve pull requests** (optional but recommended)
5.  Click **Save**

## 📦 How to Release

Simply merge your changes into the `main` branch.

```bash
git checkout main
git merge <your-feature-branch>
git push origin main
```

The workflow `Release and Publish` will start automatically.

## 📝 Changelog
The `CHANGELOG.md` file is automatically updated. To ensure clean changelogs, use descriptive commit messages.
