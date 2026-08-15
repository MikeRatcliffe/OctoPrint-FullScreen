# OctoPrint-Fullscreen

> **Note**
> This plugin is a continuation of the impressive work by Paul de Vries.
>
> It is now actively maintained here to ensure compatibility with modern OctoPrint versions.

This plugin will allow you to open the webcam feed in fullscreen mode by double clicking the image. It will show a progress bar at the bottom of the feed and an overlay containing information about print time, remaining time, temperatures and a pause button.

If the DisplayLayerProgress plugin is installed, it will also display the layer progress.

## Screenshots

![Main Screenshot](assets/main-screenshot.jpg)

![Settings Screenshot](assets/settings-screenshot.png)

## Features

- **Draggable Information overlay**: Displays print information including:
  - Print time elapsed
  - Print time remaining
  - Tool temperatures (actual and target)
  - Bed temperature (actual and target)
  - Layer progress (if DisplayLayerProgress plugin is installed)
- **Progress bar**: Shows print progress at the bottom of the fullscreen feed
- **Double-click webcam to fullscreen**: Double-click the webcam feed to open it in fullscreen mode
- **Fullscreen toggle button**: Button to switch between maximized and true fullscreen modes
- **Font size adjustment**: Font size can be changed in the settings dialog
- **Font family selection**: Choose from multiple font families including monospace, serif, and sans-serif options
- **Color adjustments**: Foreground, background and progress bar colors can be changed in the settings dialog
- **Pause/Resume button**: Click to pause/resume your print
- **Preview in settings**: See how the overlay and progress bar will look before saving

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/MikeRatcliffe/OctoPrint-FullScreen/archive/main.zip

## Support browsers (tested)

- IE Edge
- Firefox
- Chrome

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
