# Strict Snap

Hold Alt while drawing to increase track and route-waypoint snapping strength by 10x.

The game snaps the cursor to existing track nodes and lines within `PIXEL_SNAP_THRESHOLD` screen pixels (default 10). While Alt is held, this mod sets it to 100 px, and restores 10 px on release, on window blur or when the window is hidden.

## Install
Put `index.js` and `manifest.json` in a folder named `strict-snap` inside the game's mods folder, then enable "Strict Snap" in the mod list.

## Notes
- The game already uses Alt as the road snap toggle, so road snapping flips while Alt is held. To avoid this, change `HOLD_KEY` at the top of `index.js` (for example to `Control`).
- The tutorial uses a fixed 30 px track snap radius and ignores this setting.
- `BASE_PX` and `MULTIPLIER` at the top of `index.js` set the default radius and strength.
