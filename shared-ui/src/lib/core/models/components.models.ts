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
  value: any;
  description?: string;
  atributes?: any;
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
