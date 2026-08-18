# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0

### Added

- Widescreen mode toggle
- Settings dialog with customizable options
- Progress bar color picker
- Font selection dropdown with preview
- Foreground color picker
- Reset buttons for all settings
- Live preview in settings dialog
- Draggable overlay functionality
- GitHub issue and pull request templates
- CONTRIBUTING.md documentation
- Screenshots in README and settings documentation

### Changed

- Moved progress bar to bottom of webcam feed
- Redesigned settings screen for better UX
- Improved CSS class naming to avoid conflicts
- Replaced magic numbers with named constants
- Added feature list to README.md

### Fixed

- Font picker width issue
- CSS class conflicts with font picker
- Scope issue with onceOpenInlineFullscreen function
- Renamed Pickr to ofsPickr to avoid conflicts with other plugins
- Flake8 warnings in Python code

### Refactored

- Converted tabs to spaces across the codebase
- Moved helper functions to separate module
- Improved code organization and maintainability

## [0.0.7] - 2026-08-12

### Added

- Mike Ratcliffe became new maintainer

### Fixed

- Fixed compatibility with newer OctoPrint versions
- Updated dependencies and build tools

## [0.0.6] - 2020-11-22

### Added

- Zoom-in and zoom-out cursors to the webcam stream (via pull request #28 by John Uberbacher)

### Fixed

- Compatibility with OctoPrint 1.5.0 RC

## [0.0.5] - 2020-04-28

### Changed

- Show information vertically for better space utilization
- Auto-open inline fullscreen mode

### Fixed

- Fullscreen functionality in OctoPrint
- Compatibility with dashboard plugin
- Support for Python 3
- Support for DisplayLayerProgress plugin

## [0.0.4] - 2017-12-12

### Fixed

- Double-tap on iOS devices (issue #7)
- Backwards compatibility with OctoPrint 1.3.6

## [0.0.3] - 2017-05-21

### Added

- TouchUI compatibility

### Fixed

- Support for OctoPrint 1.3.3 webcam

## [0.0.2] - 2017-04-16

### Added

- Support for better aspect ratios (issue #3)
- Support for rotation and flipping of webcam (issue #2)

## [0.0.1] - 2016-07-23

### Added

- Initial release
- Fullscreen toggle button
- Information bar with print details
- Progress bar
- Show info for all users
- Support for multiple browsers (IE Edge, Firefox, Chrome)
