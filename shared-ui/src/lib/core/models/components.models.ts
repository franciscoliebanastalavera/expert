export interface CheckboxOption {
  label: string;
  value: string | number;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  link?: { url: string; label: string };
}

export interface RadioOption {
  label: string;
  value: string | number;
  checked?: boolean;
  disabled?: boolean;
}

export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
  atributes?: Record<string, string | number | boolean>;
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
