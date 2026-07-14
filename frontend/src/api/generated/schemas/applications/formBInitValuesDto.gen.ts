import { z as zod } from 'zod';
import { ShipEquipmentDto } from './shipEquipmentDto.gen.ts';

export const FormBInitValuesDto = zod.object({
  "shipEquipments": zod.array(ShipEquipmentDto).optional()
});

export type FormBInitValuesDto = zod.input<typeof FormBInitValuesDto>;
export type FormBInitValuesDtoOutput = zod.output<typeof FormBInitValuesDto>;
