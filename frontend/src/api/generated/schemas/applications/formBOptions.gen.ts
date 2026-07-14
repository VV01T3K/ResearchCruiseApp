import { z as zod } from 'zod';
import { ShipEquipmentOption } from './shipEquipmentOption.gen.ts';

export const FormBOptions = zod.object({
  "shipEquipments": zod.array(ShipEquipmentOption).optional()
});

export type FormBOptions = zod.input<typeof FormBOptions>;
export type FormBOptionsOutput = zod.output<typeof FormBOptions>;
