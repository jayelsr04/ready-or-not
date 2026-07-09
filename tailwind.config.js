const pantryPreset = require('@ntv360/component-pantry/tailwind-preset.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [pantryPreset],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@ntv360/component-pantry/**/*.{mjs,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        status: {
          'to-read': '#f9f1f7',
          'to-read-strong': '#e4c2da',
          'in-progress': '#fff2db',
          'in-progress-strong': '#ffd485',
          finished: '#f1fdf0',
          'finished-strong': '#9ded98',
          dropped: '#fdf1f1',
          'dropped-strong': '#f7bdbd',
        },
      },
    },
  },
  plugins: [],
};
