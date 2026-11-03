import * as migration_20261103_070409_initial from './20261103_070409_initial';
import * as migration_20261103_080000_seed_content from './20261103_080000_seed_content';
import * as migration_20261103_090000_first_admin from './20261103_090000_first_admin';

export const migrations = [
  {
    up: migration_20261103_070409_initial.up,
    down: migration_20261103_070409_initial.down,
    name: '20261103_070409_initial',
  },
  {
    up: migration_20261103_080000_seed_content.up,
    down: migration_20261103_080000_seed_content.down,
    name: '20261103_080000_seed_content',
  },
  {
    up: migration_20261103_090000_first_admin.up,
    down: migration_20261103_090000_first_admin.down,
    name: '20261103_090000_first_admin',
  },
];
