# coding=utf-8
from __future__ import absolute_import
import octoprint.plugin


class FullscreenPlugin(
    octoprint.plugin.SettingsPlugin,
    octoprint.plugin.AssetPlugin,
    octoprint.plugin.TemplatePlugin,
):

    def get_assets(self):
        return dict(
            js=["js/colorpicker.js", "js/fullscreen.js", "js/fullscreen_settings.js"],
            css=["css/colorpicker.css", "css/fullscreen.css"],
            less=[],
        )

    def get_settings_defaults(self):
        return dict(
            installed_version=self._plugin_version,
            font_size="14px",
            font_sizes=[
                "10px",
                "12px",
                "14px",
                "16px",
                "18px",
                "20px",
                "22px",
                "24px",
                "26px",
                "28px",
                "30px",
            ],
            position="topleft",
            positions=[
                {"name": "Top Left", "value": "topleft"},
                {"name": "Top Middle", "value": "topmiddle"},
                {"name": "Top Right", "value": "topright"},
                {"name": "Bottom Right", "value": "bottomright"},
                {"name": "Bottom Middle", "value": "bottommiddle"},
                {"name": "Bottom Left", "value": "bottomleft"},
            ],
            color_fg="rgba(255, 255, 255, 1)",
            color_bg="rgba(0, 0, 0, 0.25)",
            color_border="rgba(68, 68, 68, 1)",
            has_border=True,
        )

    def get_template_vars(self):
        return dict(
            installed_version=self._settings.get(["installed_version"]),
            font_size=self._settings.get(["font_size"]),
            font_sizes=self._settings.get(["font_sizes"]),
            position=self._settings.get(["position"]),
            positions=self._settings.get(["positions"]),
            color_fg=self._settings.get(["color_fg"]),
            color_bg=self._settings.get(["color_bg"]),
            color_border=self._settings.get(["color_border"]),
            has_border=self._settings.get(["has_border"]),
        )

    def get_template_configs(self):
        files = [
            dict(
                type="generic",
                template="fullscreen.jinja2",
                custom_bindings=True,
            ),
            dict(type="settings", custom_bindings=False),
        ]

        return files

    def get_update_information(self):
        return dict(
            fullscreen=dict(
                displayName="Fullscreen Plugin",
                displayVersion=self._plugin_version,
                type="github_release",
                current=self._plugin_version,
                user="MikeRatcliffe",
                repo="OctoPrint-FullScreen",
                pip="https://github.com/MikeRatcliffe/OctoPrint-FullScreen/archive/{target_version}.zip",
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
