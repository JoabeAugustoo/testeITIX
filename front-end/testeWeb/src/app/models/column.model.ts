export class Column<T = any> {
  header: string;
  headerClass?: string;
  field?: string;
  valueDisplayFn?: (value: T) => T;
  width?: string;
  tooltipTitle?: string;
  tooltipValue?: (value: T) => string;
  sortable?: boolean;
  editable?: boolean;
  styleClass?: (obj: T) => string | any;
  editConfig?: ColumnEditConfig;
}

export class ColumnEditConfig<T = any> {
  inputType: 'text' | 'dropdown' | 'decimal' | 'checkbox';
  disabled?: (obj: T) => boolean;
  readonly?: (obj: T) => boolean;

  textConfig?: ColumnEditTextConfig;
  dropdownConfig?: ColumnEditDropdownConfig<T>;
  decimalConfig?: ColumnEditDecimalConfig;
  checkboxConfig?: ColumnCheckboxConfig<T>;
}

export class ColumnEditTextConfig {
  maxlength?: number;
  onKeyup?: (text: string) => void;
}

export class ColumnEditDropdownConfig<T = any> {
  options: (obj: T) => T[];
  optionValueField?: string;
  optionLabelField?: string;
  defaultOption?: string;
  filter?: boolean;
  onChange?: (obj: T) => void;
}

export class ColumnEditDecimalConfig<T = any>  {
  options: DecimalOptions;
  onKeyup?: (text: T) => void;
}

export class ColumnCheckboxConfig<T> {
  ngModelChange?: (event: boolean, obj: T) => void;
}

export type DecimalOptions = {
  prefix: string,
  thousands: string,
  decimal: string,
  precision: number,
  align: 'left' | 'right'
};
