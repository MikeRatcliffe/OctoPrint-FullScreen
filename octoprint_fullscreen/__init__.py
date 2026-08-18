import octoprint.plugin


class FullscreenPlugin(octoprint.plugin.SettingsPlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.TemplatePlugin):

    def get_settings_defaults(self):
        return {
            "font": "Arial",
            "font_size": 25,
            "foreground_color": "rgba(255, 255, 255, 1)",
            "background_color": "rgba(0, 0, 0, 0.25)",
            "progress_bar_color": "rgba(33, 150, 243, 1)",
            "offset_left_maximised": -1,
            "offset_top_maximised": -1,
            "offset_left_fullscreen": -1,
            "offset_top_fullscreen": -1,
            "widecreen_mode": False,
        }

    def get_template_vars(self):
        return {
            "font": self._settings.get(
                ["font"]
            ),
            "font_size": self._settings.get(
                ["font_size"]
            ),
            "foreground_color": self._settings.get(
                ["foreground_color"]
            ),
            "background_color": self._settings.get(
                ["background_color"]
            ),
            "progress_bar_color": self._settings.get(
                ["progress_bar_color"]
            ),
            "offset_left_maximised": self._settings.get(
                ["offset_left_maximised"]
            ),
            "offset_top_maximised": self._settings.get(
                ["offset_top_maximised"]
            ),
            "offset_left_fullscreen": self._settings.get(
                ["offset_left_fullscreen"]
            ),
            "offset_top_fullscreen": self._settings.get(
                ["offset_top_fullscreen"]
            ),
            "widecreen_mode": self._settings.get(
                ["widecreen_mode"]
            ),
        }

    def get_assets(self):
        return {
            "js": [
                "js/fullscreen.js",
                "js/jquery-fullscreen.js",
                "js/pickr.min.js",
                "js/helpers.js",
            ],
            "css": [
                "css/fullscreen.css",
                "css/pickr.css",
            ],
            "less": [],
        }

    def get_template_configs(self):
        files = [
            {"type": "generic", "template": "fullscreen.jinja2",
             "custom_bindings": True},
            {"type": "settings", "custom_bindings": False}
        ]

        return files

    def get_update_information(self):
        return {
            "fullscreen": {
                "displayName": "Fullscreen Plugin",
                "displayVersion": self._plugin_version,
                "type": "github_release",
                "user": "MikeRatcliffe",
                "repo": "OctoPrint-FullScreen",
                "current": self._plugin_version,
                "pip": "https://github.com/MikeRatcliffe/"
                       "OctoPrint-FullScreen/archive/{target_version}.zip"
            }
        }


__plugin_name__ = "Fullscreen Plugin"
__plugin_pythoncompat__ = ">=2.7,<4"


def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = FullscreenPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config":
            __plugin_implementation__.get_update_information
    }
