import { z as zod } from 'zod';

export const shipEquipmentDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ShipEquipmentDto = zod.object({
  "id": zod.string().regex(shipEquipmentDtoIdRegExp).optional(),
  "name": zod.string().optional()
});

export type ShipEquipmentDto = zod.input<typeof ShipEquipmentDto>;
export type ShipEquipmentDtoOutput = zod.output<typeof ShipEquipmentDto>;
