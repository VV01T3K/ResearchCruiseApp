import type { FormBOptions as GeneratedFormBOptions } from '@/api/generated/schemas';
import type { ShipEquipmentOption } from '@/api/client/applications/types/ShipEquipmentOption';

export type FormBOptions = Omit<Required<GeneratedFormBOptions>, 'shipEquipments'> & {
  shipEquipments: ShipEquipmentOption[];
};

export function mapFormBOptions(options: GeneratedFormBOptions): FormBOptions {
  return {
    shipEquipments: (options.shipEquipments ?? []).map((equipment) => ({
      id: equipment.id ?? '',
      name: equipment.name ?? '',
    })),
  };
}
