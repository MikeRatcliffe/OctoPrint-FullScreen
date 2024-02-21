# OctoPrint-Fullscreen

_Originally by [Paul de Vries](https://github.com/BillyBlaze) until 2024. Development was taken over by [Mike Ratcliffe](https://github.com/MikeRatcliffe) in February 2024._

This plugin will allow you to open the webcam feed in fullscreen mode by double clicking the image. It will show a bar at the bottom of the image with information about print time, remaining time, temperatures and a pause button.

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html) or manually using this URL:

```sh
https://github.com/MikeRatcliffe/OctoPrint-FullScreen/archive/master.zip
```

## Other Extensions

If you have the awesome [DisplayLayerProgress](https://plugins.octoprint.org/plugins/DisplayLayerProgress/) plugin, then the layer progress will also be displayed by this plugin.

## Supported Browsers

- IE
- Edge
- Firefox
- Chrome
- Brave

## Development Environment

### Octoprint Dev

> https://docs.octoprint.org/en/master/development/environment.html#mac-os-x

#### Summary

```sh
xcode-select --install
sudo xcodebuild
brew install python
python -m ensurepip --upgrade
pip install virtualenv
```

```shell
cd ~/devel
git clone https://github.com/OctoPrint/OctoPrint.git
cd OctoPrint
virtualenv venv
source venv/bin/activate
pip install --upgrade pip
pip install -e '.[develop,plugins]'
pre-commit install
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

```shell
source ./venv/bin/activate
octoprint serve
```

Listening on `http://0.0.0.0:5000` and `http://[::]:5000`

### Plugin Dev

> https://docs.octoprint.org/en/master/plugins/gettingstarted.html

#### TL:DR

```shell
cd ~/Projects
git clone git@github.com:MikeRatcliffe/OctoPrint-FullScreen.git
cd OctoPrint-FullScreen
source ../OctoPrint/venv/bin/activate
octoprint dev plugin:install
```

#### Test Webcams:

- Kirchhoff Institute for Physics, Germany
  - http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg
- International Center for Hellenic and Mediterranean Studies (DIKEMES), Athens
  - http://view.dikemes.edu.gr/mjpg/video.mjpg
