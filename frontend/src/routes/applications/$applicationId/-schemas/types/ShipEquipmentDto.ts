import type { ShipEquipmentDto as GeneratedShipEquipmentDto } from '@/api/generated/schemas';

import type { DeepPresent } from './DeepPresent';

export type ShipEquipmentDto = DeepPresent<GeneratedShipEquipmentDto>;
