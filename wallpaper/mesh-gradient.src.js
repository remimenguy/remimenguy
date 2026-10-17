// Mesh Gradient wallpaper: the "Default" preset of Paper Shaders' MeshGradient, slowed down.
import {
  ShaderMount, meshGradientFragmentShader, getShaderColorFromString, ShaderFitOptions, defaultObjectSizing,
} from '@paper-design/shaders';

const PRESET = {                       // Paper Shaders · MeshGradient · Default
  ...defaultObjectSizing,
  colors: ['#e0eaff', '#241d9a', '#f75092', '#9f50d3'],
  distortion: 0.8,
  swirl: 0.1,
  grainMixer: 0,
  grainOverlay: 0,
};
const SPEED = 0.5;                     // the preset runs at 1; slower suits a desktop
// With four colours every motion in the shader is a multiple of 0.05 rad per unit of its
// internal time (u_time / 2), so the whole animation repeats every 80*PI seconds of u_time.
const PERIOD = 80 * Math.PI;
const LOOP = PERIOD / SPEED;           // seconds in one exported loop (about 8 min 23 s)
const GRAIN = 0;                       // Paper's grain overlay, 0 to 1

const uniforms = {
  u_colors: PRESET.colors.map(getShaderColorFromString),
  u_colorsCount: PRESET.colors.length,
  u_distortion: PRESET.distortion,
  u_swirl: PRESET.swirl,
  u_grainMixer: PRESET.grainMixer,
  u_grainOverlay: GRAIN || PRESET.grainOverlay,
  u_fit: ShaderFitOptions[PRESET.fit],
  u_rotation: PRESET.rotation,
  u_scale: PRESET.scale,
  u_offsetX: PRESET.offsetX,
  u_offsetY: PRESET.offsetY,
  u_originX: PRESET.originX,
  u_originY: PRESET.originY,
  u_worldWidth: PRESET.worldWidth,
  u_worldHeight: PRESET.worldHeight,
};

const render = !!window.__WALLPAPER_RENDER__;
const mount = new ShaderMount(document.getElementById('base'), meshGradientFragmentShader, uniforms,
  render ? { preserveDrawingBuffer: true } : undefined,
  render ? 0 : SPEED, 0,
  render ? 1 : 2, render ? window.innerWidth * window.innerHeight : undefined);

// Frame-exact rendering hook for the video exporter.
window.wallpaper = { LOOP, draw: t => mount.setFrame(t * SPEED * 1000) };
