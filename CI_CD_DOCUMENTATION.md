# CI/CD Pipeline Documentation

Complete guide for the Continuous Integration and Continuous Deployment pipeline for PowerConsumptionOptimizer.

---

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Code Quality Tools](#code-quality-tools)
- [Setup Instructions](#setup-instructions)
- [Workflow Details](#workflow-details)
- [Badges](#badges)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### CI/CD Features

✅ **Automated Testing**
- Runs on every push to main/develop branches
- Runs on all pull requests
- Tests on multiple Node.js versions (18.x, 20.x)

✅ **Code Quality Checks**
- Solidity linting with Solhint
- JavaScript linting with ESLint
- Code formatting with Prettier

✅ **Code Coverage**
- Automated coverage reports
- Codecov integration
- Coverage artifacts retention

✅ **Build Verification**
- Contract compilation
- Contract size checks
- Artifacts upload

---

## 🔄 GitHub Actions Workflows

### Workflow Files

```
.github/workflows/
├── test.yml       # Main test suite
└── coverage.yml   # Coverage reporting
```

### 1. Test Workflow (`test.yml`)

**Triggers:**
- Push to `main`, `develop`, `master` branches
- Pull requests to `main`, `develop`, `master` branches

**Jobs:**

#### Test Job
- **Matrix Strategy**: Tests on Node.js 18.x and 20.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run Solidity linter
  5. Compile contracts
  6. Run tests
  7. Generate gas report

#### Lint Job
- **Code Quality Checks**:
  1. Run Solhint (Solidity linter)
  2. Check code formatting with Prettier

#### Build Job
- **Build Verification**:
  1. Compile contracts
  2. Check contract sizes
  3. Upload artifacts

### 2. Coverage Workflow (`coverage.yml`)

**Triggers:**
- Push to `main`, `develop`, `master` branches
- Pull requests to `main`, `develop`, `master` branches

**Steps:**
1. Run test coverage
2. Upload coverage to Codecov
3. Generate coverage artifacts
4. Create coverage summary

---

## 🛠️ Code Quality Tools

### 1. Solhint (Solidity Linter)

**Configuration**: `.solhint.json`

**Rules:**
- Compiler version enforcement
- Function visibility checks
- Naming conventions (camelCase)
- Code complexity limits
- Maximum line length (120)
- No unused variables
- No empty blocks

**Usage:**
```bash
# Run Solhint
npm run lint:sol

# Fix auto-fixable issues
npm run lint:sol:fix
```

**Example Output:**
```
contracts/PowerConsumptionOptimizer.sol
  ✓ 0 problems (0 errors, 0 warnings)
```

### 2. ESLint (JavaScript Linter)

**Configuration**: `.eslintrc.json`

**Rules:**
- ES2021 syntax
- Mocha test environment
- No unused variables
- Prefer const over let
- No var declarations

**Usage:**
```bash
# Run ESLint
npm run lint:js

# Fix auto-fixable issues
npm run lint:js:fix
```

### 3. Prettier (Code Formatter)

**Configuration**: `.prettierrc.json`

**Settings:**
- Print width: 120 characters
- Tab width: 2 spaces
- Semicolons: required
- Single quotes: false (double quotes)
- Trailing commas: ES5

**Usage:**
```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

### 4. Hardhat Contract Sizer

**Purpose**: Monitor contract bytecode size

**Usage:**
```bash
npm run size
```

**Output:**
```
·--------------------------------------|---------------------------|-------------|
|  Contract Name                       ·  Size (KB)               ·  Size (%)  │
·--------------------------------------|---------------------------|-------------|
|  PowerConsumptionOptimizer           ·  18.5                    ·  75.0 %    │
·--------------------------------------|---------------------------|-------------|
```

---

## 🚀 Setup Instructions

### 1. Local Setup

```bash
# Install dependencies
npm install

# Run linters
npm run lint

# Run tests
npm test

# Generate coverage
npm run test:coverage

# Format code
npm run format
```

### 2. GitHub Repository Setup

#### Step 1: Enable GitHub Actions

1. Go to repository Settings
2. Navigate to Actions → General
3. Enable "Allow all actions and reusable workflows"

#### Step 2: Configure Codecov (Optional)

1. Visit [codecov.io](https://codecov.io/)
2. Sign up with GitHub
3. Add your repository
4. Copy the upload token
5. Add to GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token

#### Step 3: Add Status Badges

Add to README.md:

```markdown
[![Tests](https://github.com/username/power-consumption-optimizer/actions/workflows/test.yml/badge.svg)](https://github.com/username/power-consumption-optimizer/actions/workflows/test.yml)
[![Coverage](https://github.com/username/power-consumption-optimizer/actions/workflows/coverage.yml/badge.svg)](https://github.com/username/power-consumption-optimizer/actions/workflows/coverage.yml)
[![codecov](https://codecov.io/gh/username/power-consumption-optimizer/branch/main/graph/badge.svg)](https://codecov.io/gh/username/power-consumption-optimizer)
```

---

## 📊 Workflow Details

### Test Workflow Breakdown

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop, master]
  pull_request:
    branches: [main, develop, master]

jobs:
  test:
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linters
      - Compile contracts
      - Run tests
      - Generate gas report
```

### Matrix Strategy

Tests run on multiple Node.js versions:

| Version | Purpose |
|---------|---------|
| 18.x | LTS - Long Term Support |
| 20.x | Current - Latest stable |

### Job Dependencies

```
test (18.x) ──┐
test (20.x) ──┤
lint ─────────┼─→ All pass → Merge allowed
build ────────┘
```

---

## 🎯 CI/CD Best Practices

### 1. Branch Protection

**Recommended Settings:**

```yaml
Branch: main
Protection Rules:
  - Require pull request reviews: 1
  - Require status checks to pass:
    - test (18.x)
    - test (20.x)
    - lint
    - build
  - Require branches to be up to date
  - Include administrators
```

### 2. Commit Standards

**Use Conventional Commits:**

```bash
feat: add optimization analysis function
fix: correct gas estimation in device registration
docs: update deployment guide
test: add edge case tests for consumption updates
chore: update dependencies
```

### 3. PR Workflow

**Standard Process:**

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push branch: `git push origin feature/my-feature`
4. Create Pull Request on GitHub
5. Wait for CI checks to pass
6. Request review
7. Merge after approval

---

## 📈 Monitoring CI/CD

### GitHub Actions Dashboard

**Access:**
- Repository → Actions tab
- View all workflow runs
- Check logs and artifacts

**Status Indicators:**
- ✅ Green checkmark: Success
- ❌ Red X: Failed
- 🟡 Yellow circle: In progress
- ⚪ Gray circle: Queued

### Viewing Logs

```bash
# From GitHub UI
Actions → Select workflow run → Select job → View logs

# Download artifacts
Actions → Workflow run → Artifacts section → Download
```

### Coverage Reports

**Codecov Dashboard:**
- Overall coverage percentage
- Coverage trends over time
- File-by-file breakdown
- Pull request coverage diff

**Local Coverage:**
```bash
npm run test:coverage
open coverage/index.html
```

---

## 🔧 Configuration Files

### `.solhint.json`
```json
{
  "extends": "solhint:recommended",
  "rules": {
    "compiler-version": ["error", "^0.8.0"],
    "max-line-length": ["error", 120],
    "code-complexity": ["error", 10]
  }
}
```

### `.prettierrc.json`
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true
}
```

### `.eslintrc.json`
```json
{
  "env": {
    "node": true,
    "mocha": true
  },
  "extends": ["eslint:recommended", "prettier"]
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Workflow Fails: "npm ci" Error

**Problem**: Dependencies fail to install

**Solution:**
```bash
# Delete package-lock.json and node_modules locally
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Commit updated package-lock.json
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

#### 2. Linting Errors

**Problem**: Solhint or ESLint failures

**Solution:**
```bash
# Check linting locally
npm run lint

# Auto-fix issues
npm run lint:sol:fix
npm run lint:js:fix

# Format code
npm run format
```

#### 3. Test Timeouts

**Problem**: Tests timeout in CI

**Solution:** Update `hardhat.config.js`:
```javascript
mocha: {
  timeout: 300000 // 5 minutes
}
```

#### 4. Coverage Upload Fails

**Problem**: Codecov upload error

**Solution:**
1. Check CODECOV_TOKEN is set correctly
2. Verify repository is added to Codecov
3. Check network connectivity

#### 5. Contract Size Too Large

**Problem**: Contract exceeds size limit

**Solution:**
```bash
# Check contract sizes
npm run size

# Optimize
# 1. Enable optimizer in hardhat.config.js
# 2. Increase optimizer runs
# 3. Refactor contract code
```

---

## 📊 Performance Metrics

### CI/CD Performance

**Target Metrics:**

| Metric | Target | Current |
|--------|--------|---------|
| Test Duration | < 5 min | ~3 min |
| Coverage Generation | < 3 min | ~2 min |
| Linting | < 1 min | ~30 sec |
| Build Time | < 2 min | ~1 min |

### Optimization Tips

1. **Cache Dependencies**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Parallel Jobs**
   - Run test, lint, and build in parallel
   - Use matrix strategy for multiple versions

3. **Selective Testing**
   ```yaml
   on:
     pull_request:
       paths:
         - 'contracts/**'
         - 'test/**'
   ```

---

## 🎓 Advanced Features

### 1. Automated Deployment

**Example**: Deploy on tag push

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Sepolia
        run: npm run deploy
        env:
          SEPOLIA_RPC_URL: ${{ secrets.SEPOLIA_RPC_URL }}
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

### 2. Scheduled Tests

**Example**: Nightly Sepolia tests

```yaml
name: Nightly Tests

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily

jobs:
  sepolia-test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Sepolia Tests
        run: npm run test:sepolia
```

### 3. Security Scanning

**Example**: Add Slither analysis

```yaml
- name: Run Slither
  uses: crytic/slither-action@v0.3.0
  with:
    target: 'contracts/'
```

---

## 📚 Additional Resources

### GitHub Actions
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Marketplace](https://github.com/marketplace?type=actions)

### Code Quality Tools
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Coverage Tools
- [Codecov Documentation](https://docs.codecov.com/)
- [Solidity Coverage](https://github.com/sc-forks/solidity-coverage)

---

## ✅ Checklist

### Initial Setup
- [ ] Enable GitHub Actions
- [ ] Configure Codecov (optional)
- [ ] Add status badges to README
- [ ] Set up branch protection rules

### Before Each Commit
- [ ] Run linters: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Check formatting: `npm run format:check`
- [ ] Review changes

### Pull Request
- [ ] Create descriptive PR title
- [ ] Add PR description
- [ ] Wait for CI checks to pass
- [ ] Request review
- [ ] Address feedback
- [ ] Merge when approved

---

## 🎉 Summary

### What's Implemented

✅ **Automated Testing**
- Multiple Node.js versions
- Comprehensive test suite
- Gas reporting

✅ **Code Quality**
- Solhint for Solidity
- ESLint for JavaScript
- Prettier for formatting

✅ **Coverage Reporting**
- Automated coverage generation
- Codecov integration
- Artifact retention

✅ **Build Verification**
- Contract compilation
- Size checks
- Artifact uploads

### CI/CD Pipeline Status

**Status**: ✅ **FULLY CONFIGURED**

**Workflow Files**: 2
**Code Quality Tools**: 3
**Coverage Integration**: ✅ Configured

---

**Last Updated**: 2024
**Framework**: GitHub Actions
**Status**: Production Ready
