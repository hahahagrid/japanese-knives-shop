import * as migration_20260328_142405_init from './20260328_142405_init';
import * as migration_20260329_090000_add_youtube_url from './20260329_090000_add_youtube_url';
import * as migration_20260329_112419_add_order_number from './20260329_112419_add_order_number';
import * as migration_20260330_071532_knives_to_products from './20260330_071532_knives_to_products';
import * as migration_20260330_181520_add_performance_indexes from './20260330_181520_add_performance_indexes';
import * as migration_20260402_093827 from './20260402_093827';
import * as migration_20260403_190558_add_seo_fields from './20260403_190558_add_seo_fields';

export const migrations = [
  {
    up: migration_20260328_142405_init.up,
    down: migration_20260328_142405_init.down,
    name: '20260328_142405_init',
  },
  {
    up: migration_20260329_090000_add_youtube_url.up,
    down: migration_20260329_090000_add_youtube_url.down,
    name: '20260329_090000_add_youtube_url',
  },
  {
    up: migration_20260329_112419_add_order_number.up,
    down: migration_20260329_112419_add_order_number.down,
    name: '20260329_112419_add_order_number',
  },
  {
    up: migration_20260330_071532_knives_to_products.up,
    down: migration_20260330_071532_knives_to_products.down,
    name: '20260330_071532_knives_to_products',
  },
  {
    up: migration_20260330_181520_add_performance_indexes.up,
    down: migration_20260330_181520_add_performance_indexes.down,
    name: '20260330_181520_add_performance_indexes',
  },
  {
    up: migration_20260402_093827.up,
    down: migration_20260402_093827.down,
    name: '20260402_093827',
  },
  {
    up: migration_20260403_190558_add_seo_fields.up,
    down: migration_20260403_190558_add_seo_fields.down,
    name: '20260403_190558_add_seo_fields'
  },
];
