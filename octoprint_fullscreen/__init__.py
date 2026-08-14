# coding=utf-8
from __future__ import absolute_import
import octoprint.plugin # type: ignore

class FullscreenPlugin(octoprint.plugin.SettingsPlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.TemplatePlugin):

    def get_settings_defaults(self):
        return dict(
            font_size=20,
            background_color="rgba(0, 0, 0, 0.25)",
            offset_bottom=10,
            offset_right=10,
        )

    def get_template_vars(self):
        return dict(
            font_size=self._settings.get(["font_size"]),
            background_color=self._settings.get(["background_color"]),
            offset_bottom=self._settings.get(["offset_bottom"]),
            offset_right=self._settings.get(["offset_right"]),
        )

    def get_assets(self):
        return dict(
            js=["js/fullscreen.js", "js/jquery-fullscreen.js", "js/pickr.min.js", "js/helpers.js"],
            css=["css/fullscreen.css", "css/pickr.css"],
            less=[]
        )

    def get_template_configs(self):
        files = [
            dict(type="generic", template="fullscreen.jinja2", custom_bindings=True),
            dict(type="settings", custom_bindings=False)
        ]

        return files


    def get_update_information(self):
        return dict(
            fullscreen=dict(
                displayName="Fullscreen Plugin",
                displayVersion=self._plugin_version,
                type="github_release",
                user="MikeRatcliffe",
                repo="OctoPrint-FullScreen",
                current=self._plugin_version,
                pip="https://github.com/MikeRatcliffe/OctoPrint-FullScreen/archive/{target_version}.zip"
            )
        )

__plugin_name__ = "Fullscreen Plugin"
__plugin_pythoncompat__ = ">=2.7,<4"
def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = FullscreenPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
