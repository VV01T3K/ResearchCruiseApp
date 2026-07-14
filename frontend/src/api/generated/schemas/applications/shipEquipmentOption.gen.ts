import { z as zod } from 'zod';

export const shipEquipmentOptionIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ShipEquipmentOption = zod.object({
  "id": zod.string().regex(shipEquipmentOptionIdRegExp).optional(),
  "name": zod.string().optional()
});

export type ShipEquipmentOption = zod.input<typeof ShipEquipmentOption>;
export type ShipEquipmentOptionOutput = zod.output<typeof ShipEquipmentOption>;
