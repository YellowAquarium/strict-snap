# Strict Snap

Click the magnet button in the top toolbar to toggle a 10x increase in track and route-waypoint snapping strength, or hold Alt to apply it only while the key is held.

The game snaps the cursor to existing track nodes and lines within `PIXEL_SNAP_THRESHOLD` screen pixels (default 10). While Strict Snap is on, this mod sets it to 100 px, and turns it back to 10 px when you click the button again or release Alt (also when the window loses focus or is hidden). Holding Alt while the button is on changes nothing, and the button starts off each time the game is launched.

This mod is already packaged with the Japanese Trains Mod (https://github.com/kaicardenas0618/japanese-trains), do not install this mod if you already have JP Trains

## Notes
- The game already uses Alt as the road snap toggle, so road snapping flips while Alt is held. To avoid this, change `HOLD_KEY` at the top of `index.js` (for example to `Control`).
- The tutorial uses a fixed 30 px track snap radius and ignores this setting.
- `BASE_PX`, `MULTIPLIER`, `HOLD_KEY` and `BUTTON_ICON` at the top of `index.js` set the default radius, the strength and the button icon.
