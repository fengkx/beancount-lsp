# GitHub Actions for beancount-lsp

This directory contains GitHub Actions workflows for automating various tasks in the beancount-lsp repository.

## Workflows

### publish-vsix.yml

This workflow builds and publishes the VS Code extension to the Visual Studio Marketplace when a new release is created or manually triggered.

#### Best Practices Implemented

- **Concurrency Control**: Prevents multiple simultaneous workflow runs to avoid conflicting publishes
- **Explicit Permissions**: Limited to only necessary permissions for security
- **Production Environment**: Uses GitHub environments for protected deployments
- **Timeouts**: Prevents hung jobs with explicit timeout limits
- **Modern Tooling**: Uses Node.js 20 LTS and latest GitHub Actions versions (v4)
- **Optimized Caching**: Improved dependency caching for faster builds
- **Artifact Management**: Limited artifact retention period to save storage

#### Setup Instructions

1. Generate a Personal Access Token (PAT) for the Visual Studio Marketplace:
   - Go to https://dev.azure.com/{your-organization}/_usersSettings/tokens
   - Create a new token with the "Marketplace (publish)" scope
   - Save the token for later use

2. Add the token as a repository secret:
   - Go to your GitHub repository settings
   - Navigate to "Secrets and variables" > "Actions"
   - Create a new repository secret named `VSCE_PAT` with the token value

3. Create a "production" environment (for deployment protection):
   - Go to your GitHub repository settings
   - Navigate to "Environments"
   - Create a new environment named "production"
   - (Optional) Add protection rules like required reviewers

4. Trigger the workflow:
   - Automatically: Create a new release in your GitHub repository
   - Manually: Go to the "Actions" tab in your repository, select "Publish Extension" workflow, and click "Run workflow"

## Additional Information

- The workflow builds the extension using pnpm and publishes it to the VS Code Marketplace
- The VSIX file is also uploaded as an artifact in the workflow run, so you can download it manually if needed
- Artifacts are retained for 7 days to save storage space 