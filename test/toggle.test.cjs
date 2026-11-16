const vm = require('vm'), fs = require('fs');
const calls = []; const buttons = []; const L = {};
const addL = (t) => (n, f) => { (L[t + n] = L[t + n] || []).push(f); };
const fire = (t, n, e) => (L[t + n] || []).forEach(f => f(e));
const doc = { hidden: false, addEventListener: addL('d') };
const win = { addEventListener: addL('w'), SubwayBuilderAPI: {
  hooks: { onMapReady: (f) => { win.__ready = f; } },
  modifyConstants: (c) => calls.push(JSON.stringify(c)),
  ui: { addToolbarButton: (o) => buttons.push(o) } } };
const ctx = { window: win, document: doc, console: { log() {}, warn() {}, error: console.error } }; ctx.globalThis = ctx;
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
// hold
const n = () => calls.length;
let m = n(); fire('w', 'keydown', { key: 'Alt', repeat: false }); fire('w', 'keydown', { key: 'Alt', repeat: true });
check('hold turns on once', [b.isActive(), calls.slice(m)], [true, ['{"PIXEL_SNAP_THRESHOLD":100}']]);
m = n(); fire('w', 'keyup', { key: 'Alt' });
check('release turns off', [b.isActive(), calls.slice(m)], [false, ['{"PIXEL_SNAP_THRESHOLD":10}']]);
m = n(); b.onClick(); fire('w', 'keydown', { key: 'Alt', repeat: false }); fire('w', 'keyup', { key: 'Alt' });
check('toggle on stays on after hold release', [b.isActive(), calls.slice(m)], [true, ['{"PIXEL_SNAP_THRESHOLD":100}']]);
m = n(); b.onClick();
check('toggle off', [b.isActive(), calls.slice(m)], [false, ['{"PIXEL_SNAP_THRESHOLD":10}']]);
m = n(); fire('w', 'keydown', { key: 'Alt', repeat: false }); fire('w', 'blur', {});
check('blur releases hold', [b.isActive(), calls.slice(m)], [false, ['{"PIXEL_SNAP_THRESHOLD":100}', '{"PIXEL_SNAP_THRESHOLD":10}']]);
m = n(); fire('w', 'mousemove', { altKey: true }); fire('w', 'mousemove', { altKey: true }); fire('w', 'mousemove', { altKey: false });
check('mousemove sync', calls.slice(m), ['{"PIXEL_SNAP_THRESHOLD":100}', '{"PIXEL_SNAP_THRESHOLD":10}']);
m = n(); fire('w', 'keydown', { key: 'Alt', repeat: false }); doc.hidden = true; fire('d', 'visibilitychange', {});
check('hidden releases hold', [b.isActive(), calls.slice(m)], [false, ['{"PIXEL_SNAP_THRESHOLD":100}', '{"PIXEL_SNAP_THRESHOLD":10}']]);
m = n(); fire('w', 'keydown', { key: 'Shift', repeat: false }); fire('w', 'keyup', { key: 'a' });
check('other keys ignored', calls.slice(m), []);
