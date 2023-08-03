interface IBaseValidator {
  required?: boolean;
  each?: boolean;
  message?: string;
  default?: string | number;
}

export interface IsStringFieldOptions extends IBaseValidator {
  minLength?: number;
  maxLength?: number;
  sanitize?: boolean;
  trim?: boolean;
}

export interface IsNumberFieldOptions extends IBaseValidator {
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
}

export interface IsMinMaxLengthOptions
  extends Pick<IsStringFieldOptions, 'each'>,
    Pick<IsStringFieldOptions, 'minLength' | 'maxLength'> {}
