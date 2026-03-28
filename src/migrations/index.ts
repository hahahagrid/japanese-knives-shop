import * as migration_20260328_142405_init from './20260328_142405_init';

export const migrations = [
  {
    up: migration_20260328_142405_init.up,
    down: migration_20260328_142405_init.down,
    name: '20260328_142405_init'
  },
];
