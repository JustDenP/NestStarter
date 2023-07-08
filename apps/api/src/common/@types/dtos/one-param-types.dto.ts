import { IsNumberString, IsString } from 'class-validator';

class ParamID {
  @IsNumberString()
  id!: number;
}

class ParamNum {
  @IsNumberString()
  param!: number;
}

class ParamString {
  @IsString()
  param!: string;
}

export { ParamID, ParamNum, ParamString };
