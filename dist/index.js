/**
 * Strict Snap for Subway Builder
 * A toolbar button toggles a multiplier (default 10x) on the track and waypoint snapping radius,
 * and holding a key (Alt by default) applies it for as long as the key is down.
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
  var HOLD_KEY = 'Alt';      // KeyboardEvent.key to hold
  var BUTTON_ICON = 'Magnet'; // Lucide icon name of the toolbar button
  // -----------------------------------------------------------------------------------------

  var TAG = '[Strict Snap]';
  var api = window.SubwayBuilderAPI;
  if (!api) {
    console.error(TAG + ' SubwayBuilderAPI not found.');
    return;
  }

  var initialized = false;
  var toggled = false;  // set by the toolbar button
  var held = false;     // set while the hold key is down
  var applied = false;  // what PIXEL_SNAP_THRESHOLD currently reflects

  function sync() {
    var on = toggled || held;
    if (on === applied) return;
    if (typeof api.modifyConstants !== 'function') {
      console.warn(TAG + ' modifyConstants not available.');
      return;
    }
    try {
      api.modifyConstants({ PIXEL_SNAP_THRESHOLD: on ? BASE_PX * MULTIPLIER : BASE_PX });
      applied = on;
    } catch (err) {
      console.error(TAG + ' Failed to set snap threshold:', err);
    }
  }

  function setHeld(value) {
    held = value;
    sync();
  }

  function init() {
    if (initialized) return;
    initialized = true;

    if (api.ui && typeof api.ui.addToolbarButton === 'function') {
      api.ui.addToolbarButton({
        id: 'strict-snap-toggle',
        icon: BUTTON_ICON,
        tooltip: 'Strict Snap: toggle ' + MULTIPLIER + 'x snapping strength (or hold ' + HOLD_KEY + ')',
        onClick: function () { toggled = !toggled; sync(); },
        isActive: function () { return toggled || held; }
      });
    } else {
      console.warn(TAG + ' addToolbarButton not available, toggle disabled.');
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === HOLD_KEY && !e.repeat) setHeld(true);
    }, true);

    window.addEventListener('keyup', function (e) {
      if (e.key === HOLD_KEY) setHeld(false);
    }, true);

    // A key release can be missed (alt-tab, focus loss), so also release on blur and hidden.
    window.addEventListener('blur', function () { setHeld(false); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) setHeld(false);
    });

    // Safety net: keep the hold in sync with the real modifier state while the cursor moves.
    var modifierProp = HOLD_KEY === 'Alt' ? 'altKey'
      : HOLD_KEY === 'Control' ? 'ctrlKey'
      : HOLD_KEY === 'Meta' ? 'metaKey'
      : HOLD_KEY === 'Shift' ? 'shiftKey' : null;
    if (modifierProp) {
      window.addEventListener('mousemove', function (e) {
        var down = !!e[modifierProp];
        if (down !== held) setHeld(down);
      }, true);
    }

    console.log(TAG + ' ready: toolbar button toggles ' + MULTIPLIER + 'x snapping, or hold ' + HOLD_KEY + ' (' + BASE_PX * MULTIPLIER + ' px).');
  }

  if (api.hooks && typeof api.hooks.onMapReady === 'function') {
    api.hooks.onMapReady(init);
  } else {
    init();
  }
})();
