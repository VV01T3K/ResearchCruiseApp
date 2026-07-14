import type { ShipEquipmentDto as GeneratedShipEquipmentDto } from '@/api/generated/schemas';

import type { DeepPresent } from '@/types/utils';

export type ShipEquipmentDto = DeepPresent<GeneratedShipEquipmentDto>;
