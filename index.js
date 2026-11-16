/**
 * Strict Snap for Subway Builder
 * A toolbar button toggles a multiplier (default 10x) on the track and waypoint snapping radius.
 *
 * The game reads RULES.PIXEL_SNAP_THRESHOLD (screen pixels, default 10) every time the cursor
 * moves while drawing, so changing it with api.modifyConstants takes effect immediately.
 * Note: the game's tutorial uses a fixed 30 px radius for track snapping and ignores this rule.
 */
(function () {
  'use strict';

  // ---- settings ---------------------------------------------------------------------------
  var BASE_PX = 10;          // game default for PIXEL_SNAP_THRESHOLD
  var MULTIPLIER = 10;       // snapping strength while Strict Snap is on
  var BUTTON_ICON = 'Magnet'; // Lucide icon name of the toolbar button
  // -----------------------------------------------------------------------------------------

  var TAG = '[Strict Snap]';
  var api = window.SubwayBuilderAPI;
  if (!api) {
    console.error(TAG + ' SubwayBuilderAPI not found.');
    return;
  }

  var initialized = false;
  var enabled = false;

  function setEnabled(on) {
    if (on === enabled) return;
    if (typeof api.modifyConstants !== 'function') {
      console.warn(TAG + ' modifyConstants not available.');
      return;
    }
    try {
      api.modifyConstants({ PIXEL_SNAP_THRESHOLD: on ? BASE_PX * MULTIPLIER : BASE_PX });
      enabled = on;
    } catch (err) {
      console.error(TAG + ' Failed to set snap threshold:', err);
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    if (!api.ui || typeof api.ui.addToolbarButton !== 'function') {
      console.warn(TAG + ' addToolbarButton not available.');
      return;
    }
    api.ui.addToolbarButton({
      id: 'strict-snap-toggle',
      icon: BUTTON_ICON,
      tooltip: 'Strict Snap: toggle ' + MULTIPLIER + 'x snapping strength',
      onClick: function () { setEnabled(!enabled); },
      isActive: function () { return enabled; }
    });

    console.log(TAG + ' ready: toolbar button toggles ' + MULTIPLIER + 'x snapping (' + BASE_PX * MULTIPLIER + ' px).');
  }

  if (api.hooks && typeof api.hooks.onMapReady === 'function') {
    api.hooks.onMapReady(init);
  } else {
    init();
  }
})();
