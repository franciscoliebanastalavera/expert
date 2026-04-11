/**
 * Modelos de datos para los componentes de la biblioteca shared-ui.
 * Adaptado de Nter-lib.
 */

export interface CheckboxOption {
  label: string;
  value: unknown;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  link?: { url: string; label: string };
}

export interface RadioOption {
  label: string;
  value: unknown;
  checked?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  label: string;
  // Valor de la opcion del selector
  value: string | number;
  description?: string;
  // Atributos adicionales opcionales de la opcion
  atributes?: Record<string, unknown>;
  checked?: boolean;
  disabled?: boolean;
}

export interface ToggleOption {
  id: number;
  label: string;
  description?: string;
  isSelected?: boolean;
  value: string;
  iconUrl?: string;
  iconOrientation?: 'left' | 'right';
  isDisabled?: boolean;
}
