/** Curated film + X-Pro3 frames for the Photos window. */

export const PHOTO_CAMERAS = [
  { id: 'all', label: 'All' },
  { id: 'nikon-f3', label: 'Nikon F3' },
  { id: 'x-pro3', label: 'X-Pro3' },
];

const shot = (id, title, camera, place, orient) => ({
  id,
  src: `/photos/${id}.webp`,
  thumb: `/photos/thumbs/${id}.webp`,
  title,
  camera,
  cameraLabel: camera === 'nikon-f3' ? 'Nikon F3' : 'X-Pro3',
  place,
  orient,
});

export const PHOTOS = [
  shot('utah-peak', 'Golden peak', 'nikon-f3', 'Utah', 'landscape'),
  shot('utah-shack', 'Cliff shack', 'nikon-f3', 'Utah', 'landscape'),
  shot('utah-silhouette', 'Waterline', 'nikon-f3', 'Utah', 'landscape'),
  shot('utah-mesas', 'Red mesas', 'nikon-f3', 'Utah', 'landscape'),
  shot('florida-palms', 'Palm dusk', 'nikon-f3', 'Florida', 'portrait'),
  shot('florida-swans', 'Night swans', 'nikon-f3', 'Florida', 'landscape'),
  shot('florida-railroad', 'Crossing', 'nikon-f3', 'Florida', 'landscape'),
  shot('road-falls', 'Lower Falls', 'nikon-f3', 'Road trip', 'landscape'),
  shot('road-river', 'Turquoise cut', 'nikon-f3', 'Road trip', 'landscape'),
  shot('road-gate', 'Paifang', 'nikon-f3', 'Road trip', 'landscape'),
  shot('road-fog', 'Coast fog', 'nikon-f3', 'Road trip', 'landscape'),
  shot('road-tree', 'Lone tree', 'nikon-f3', 'Road trip', 'landscape'),
  shot('euro-vault', 'Stone vault', 'x-pro3', 'Europe', 'portrait'),
  shot('euro-aqueduct', 'Aqueduct', 'x-pro3', 'Europe', 'landscape'),
  shot('euro-bridge', 'River dusk', 'x-pro3', 'Europe', 'landscape'),
  shot('euro-seine', 'Along the Seine', 'x-pro3', 'Paris', 'landscape'),
  shot('euro-eiffel', 'Tour Eiffel', 'x-pro3', 'Paris', 'portrait'),
  shot('euro-alley', 'Night alley', 'x-pro3', 'Europe', 'landscape'),
  shot('dc-metro', 'Vaulted platform', 'x-pro3', 'Washington, DC', 'landscape'),
  shot('dc-mercedes', 'Green Mercedes', 'x-pro3', 'Street', 'landscape'),
  shot('hall-neon', 'Neon A', 'x-pro3', 'Night', 'landscape'),
  shot('hall-pool', 'Two balls', 'x-pro3', 'Pool hall', 'landscape'),
  shot('hall-church', 'Steeple', 'x-pro3', 'City', 'portrait'),
  shot('trop-villa', 'Villa dusk', 'x-pro3', 'Tropics', 'landscape'),
  shot('trop-jungle', 'Jungle cut', 'x-pro3', 'Tropics', 'portrait'),
  shot('dc-falls', 'Great Falls', 'x-pro3', 'Virginia', 'portrait'),
  shot('zoo-panda', 'Bamboo hour', 'x-pro3', 'National Zoo', 'landscape'),
  shot('zoo-tiger', 'In the pool', 'x-pro3', 'National Zoo', 'landscape'),
  shot('dc-castle', 'Smithsonian', 'x-pro3', 'Washington, DC', 'portrait'),
  shot('dc-dome', 'Oculus', 'x-pro3', 'Washington, DC', 'landscape'),
];
