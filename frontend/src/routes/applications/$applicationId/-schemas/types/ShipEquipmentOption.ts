import type { ShipEquipmentDto as GeneratedShipEquipment } from '@/api/generated/schemas';

import type { DeepPresent } from '@/types/utils';

export type ShipEquipmentOption = DeepPresent<GeneratedShipEquipment>;
