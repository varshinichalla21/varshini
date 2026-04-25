import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

export const AUDIO_TRACKS: Track[] = [
  {
    id: 'trk-01',
    title: 'CYBERNETIC_RHYTHM.WAV',
    url: 'https://actions.google.com/sounds/v1/science_fiction/cybernetic_rhythm.ogg',
    duration: '0:45'
  },
  {
    id: 'trk-02',
    title: 'SCI_FI_DRONE_SEQ.WAV',
    url: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_drone.ogg',
    duration: '1:12'
  },
  {
    id: 'trk-03',
    title: 'PULSING_TEXTURE.WAV',
    url: 'https://actions.google.com/sounds/v1/science_fiction/pulsing_sci_fi_texture.ogg',
    duration: '0:58'
  }
];
