# Strict Snap

Click the magnet button in the top toolbar to toggle a 10x increase in track and route-waypoint snapping strength.

The game snaps the cursor to existing track nodes and lines within `PIXEL_SNAP_THRESHOLD` screen pixels (default 10). While the button is active, this mod sets it to 100 px, and clicking it again restores 10 px. The button starts off each time the game is launched.

This mod is already packaged with the Japanese Trains Mod (https://github.com/kaicardenas0618/japanese-trains), do not install this mod if you already have JP Trains

## Notes
- The tutorial uses a fixed 30 px track snap radius and ignores this setting.
- `BASE_PX`, `MULTIPLIER` and `BUTTON_ICON` at the top of `index.js` set the default radius, the strength and the button icon.
