# Contributing to OctoPrint-FullScreen

Thank you for your interest in contributing to OctoPrint-FullScreen! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites

- Python 3.x (same version as your OctoPrint installation)
- Node.js and npm (for frontend development)
- OctoPrint development environment (optional but recommended)

### Setting Up the Development Environment

I use the path `~/Desktop/Repositories` for my repositories, update the paths as appropriate.

1. **Fork and clone the repository:**

   First, fork the repository on GitHub to your own account, then clone your fork:

   ```bash
   cd ~/Desktop/Repositories
   git clone https://github.com/YOUR_USERNAME/OctoPrint-FullScreen.git
   cd OctoPrint-FullScreen
   ```

   Add the upstream repository as a remote to keep your fork in sync:

   ```bash
   git remote add upstream https://github.com/MikeRatcliffe/OctoPrint-FullScreen.git
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Install Octoprint inside venv:**

   ```bash
   cd ..
   mkdir Octoprint
   cd Octoprint
   python3 -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

4. **Install the plugin in development mode:**

   ```bash
   pip install --no-build-isolation -e ../OctoPrint-FullScreen/
   ```

   This will create a symlink in your Python environment, allowing changes to take effect immediately without reinstalling.

### Testing Your Development Version

To test your development version of the plugin in OctoPrint:

1. **Using symlinks for quick testing:**

   The `pip install --no-build-isolation -e ../OctoPrint-FullScreen/` command creates a symlink, meaning any changes you make to the code will be immediately available in OctoPrint without needing to reinstall. However, you may need to restart OctoPrint for changes to take effect.

2. After making any changes, restart OctoPrint to see your updates:
   - If running as a service: `sudo service octoprint restart`
   - If running manually: Stop and restart the OctoPrint server
   - In the OctoPrint web interface: Go to Settings → Plugin Manager and reload

3. **Verify your changes:**

   - Check the plugin version in OctoPrint's Plugin Manager
   - Test the specific functionality you've modified
   - Use browser developer tools to inspect frontend changes

## Code Style and Linting

This project uses ESLint and Prettier for maintaining consistent code style in the JavaScript/TypeScript files.

### Running Linters

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Python Code Style

- Follow PEP 8 guidelines for Python code
- Use meaningful variable and function names
- Add docstrings to functions and classes where appropriate

## Development Workflow

### Making Changes

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes following the code style guidelines

3. Test your changes thoroughly

4. Run linting and fix any issues:

   ```bash
   npm run lint:fix
   npm run format
   ```

### Testing

- Test the plugin in a running OctoPrint instance
- Verify that the fullscreen functionality works correctly
- Check that settings changes are properly applied
- Test on multiple browsers if possible (Chrome, Firefox, Edge)

### Submitting Changes

1. Commit your changes with a clear, descriptive message:

   ```bash
   git commit -m "Add feature: your feature description"
   ```

2. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a pull request on GitHub:
   - Use the provided pull request template
   - Include a clear title describing the change
   - Provide a detailed description of what you changed and why
   - Reference any related issues
   - Add screenshots if the change affects the UI
   - Complete the checklist in the template

### Keeping Your Fork in Sync

To keep your fork up to date with the main repository:

```bash
# Fetch the latest changes from upstream
git fetch upstream

# Switch to your main branch
git checkout main

# Merge the upstream changes
git merge upstream/main

# Push the updated main branch to your fork
git push origin main
```

## Reporting Issues

When reporting bugs or requesting features, please:

1. Search existing issues to avoid duplicates
2. Use the appropriate GitHub issue template:
   - **Bug Report**: Use the "Bug report" template for reporting problems
   - **Feature Request**: Use the "Feature request" template for suggesting enhancements
3. Provide as much detail as possible:
   - OctoPrint version
   - Plugin version
   - Browser and version
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Relevant screenshots or logs

## Project Structure

```text
OctoPrint-FullScreen/
├── octoprint_fullscreen/   # Main plugin package
│   ├── __init__.py         # Plugin initialization
│   ├── static/             # Frontend assets (JS, CSS)
│   └── templates/          # Jinja2 templates
├── assets/                 # Documentation images
├── extras/                 # Additional documentation
├── translations/           # Localization files
├── setup.py                # Python package setup
├── package.json            # Node.js dependencies and scripts
└── README.md               # Project documentation
```

## License

By contributing to this project, you agree that your contributions will be licensed under the AGPLv3 license, the same license as the project itself.

## Getting Help

If you need help with contributing:

- Open an issue on GitHub for questions
- Check the [OctoPrint documentation](https://docs.octoprint.org/)
- Join the [OctoPrint community](https://community.octoprint.org/)

## Recognition

Contributors will be acknowledged in the project's contributor list. Thank you for helping improve OctoPrint-FullScreen!
