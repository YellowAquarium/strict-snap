/**
 * Strict Snap for Subway Builder
 * Holding Alt multiplies the track and waypoint snapping radius (default 10x).
 *
 * The game reads RULES.PIXEL_SNAP_THRESHOLD (screen pixels, default 10) every time the cursor
 * moves while drawing, so changing it with api.modifyConstants takes effect immediately.
 * Note: the game's tutorial uses a fixed 30 px radius for track snapping and ignores this rule.
 */
(function () {
  'use strict';

  // ---- settings ---------------------------------------------------------------------------
  var BASE_PX = 10;          // game default for PIXEL_SNAP_THRESHOLD
  var MULTIPLIER = 10;       // snapping strength while the key is held
  var HOLD_KEY = 'Alt';      // KeyboardEvent.key to hold
  // -----------------------------------------------------------------------------------------

  var TAG = '[Strict Snap]';
  var api = window.SubwayBuilderAPI;
  if (!api) {
    console.error(TAG + ' SubwayBuilderAPI not found.');
    return;
  }

  var initialized = false;
  var boosted = false;

  function setBoost(on) {
    if (on === boosted) return;
    if (typeof api.modifyConstants !== 'function') {
      console.warn(TAG + ' modifyConstants not available.');
      return;
    }
    try {
      api.modifyConstants({ PIXEL_SNAP_THRESHOLD: on ? BASE_PX * MULTIPLIER : BASE_PX });
      boosted = on;
    } catch (err) {
      console.error(TAG + ' Failed to set snap threshold:', err);
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    window.addEventListener('keydown', function (e) {
      if (e.key === HOLD_KEY && !e.repeat) setBoost(true);
    }, true);

    window.addEventListener('keyup', function (e) {
      if (e.key === HOLD_KEY) setBoost(false);
    }, true);

    // A key release can be missed (alt-tab, focus loss), so also release on blur and hidden.
    window.addEventListener('blur', function () { setBoost(false); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) setBoost(false);
    });

    // Safety net: keep in sync with the real modifier state while the cursor moves.
    var modifierProp = HOLD_KEY === 'Alt' ? 'altKey'
      : HOLD_KEY === 'Control' ? 'ctrlKey'
      : HOLD_KEY === 'Meta' ? 'metaKey'
      : HOLD_KEY === 'Shift' ? 'shiftKey' : null;
    if (modifierProp) {
      window.addEventListener('mousemove', function (e) {
        var held = !!e[modifierProp];
        if (held !== boosted) setBoost(held);
      }, true);
    }

    console.log(TAG + ' ready: hold ' + HOLD_KEY + ' for ' + MULTIPLIER + 'x snapping (' + BASE_PX * MULTIPLIER + ' px).');
  }

  if (api.hooks && typeof api.hooks.onMapReady === 'function') {
    api.hooks.onMapReady(init);
  } else {
    init();
  }
})();
