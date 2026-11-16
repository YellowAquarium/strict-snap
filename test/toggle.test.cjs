const vm = require('vm'), fs = require('fs');
const calls = []; const buttons = [];
const win = { SubwayBuilderAPI: {
  hooks: { onMapReady: (f) => { win.__ready = f; } },
  modifyConstants: (c) => calls.push(JSON.stringify(c)),
  ui: { addToolbarButton: (o) => buttons.push(o) } } };
const ctx = { window: win, console: { log() {}, warn() {}, error: console.error } }; ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync(__dirname + '/../index.js', 'utf8'), ctx);
win.__ready(); win.__ready();
const check = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.log('FAIL', name, got, want); process.exitCode = 1; }
  else console.log('ok', name);
};
check('one button registered', buttons.length, 1);
const b = buttons[0];
check('button id and icon', [b.id, b.icon], ['strict-snap-toggle', 'Magnet']);
check('off at start', b.isActive(), false);
check('no constants changed at start', calls, []);
b.onClick();
check('on after click', [b.isActive(), calls], [true, ['{"PIXEL_SNAP_THRESHOLD":100}']]);
b.onClick();
check('off after second click', [b.isActive(), calls.slice(1)], [false, ['{"PIXEL_SNAP_THRESHOLD":10}']]);
b.onClick(); b.onClick();
check('stays consistent', [b.isActive(), calls.length], [false, 4]);
