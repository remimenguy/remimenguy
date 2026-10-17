// Übersicht widget: the clock from the macOS Clocks screen, to sit on top of the Spectrum Wave
// wallpaper. Date and weekday at the top right, time at the bottom right.
// Install: Übersicht menu bar icon → Open Widgets Folder, then drop this file in.

const LOCALE = 'fr-FR';   // 'en-US' for "OCT 17 · SATURDAY"
const TIME_SIZE = 'max(44px, 6vh)';
const TIME_BOTTOM = '120px';   // distance from the bottom of the screen; keeps the time above the Dock

export const refreshFrequency = 1000;
export const command = 'true';

export const className = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  color: #9a958f;
  -webkit-font-smoothing: antialiased;
`;

const meta = {
  position: 'absolute',
  top: 'max(2.6vh, 44px)',   // clears the menu bar
  right: '1.5vw',
  display: 'flex',
  gap: '3vw',
  fontSize: 'max(9px, 0.95vh)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const time = {
  position: 'absolute',
  bottom: TIME_BOTTOM,
  right: '1.5vw',
  fontSize: TIME_SIZE,
  fontWeight: 500,
  letterSpacing: '0.04em',
  color: '#a6a19c',
  fontVariantNumeric: 'tabular-nums',
};

export const render = () => {
  const now = new Date();
  const date = now.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' }).replace('.', '');
  const day = now.toLocaleDateString(LOCALE, { weekday: 'long' });
  const hhmm = now.toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return (
    <div>
      <div style={meta}><span>{date}</span><span>{day}</span></div>
      <div style={time}>{hhmm}</div>
    </div>
  );
};
