import { IsNumberString, IsString } from 'class-validator';

class ParamNum {
  @IsNumberString()
  id!: number;
}

class ParamString {
  @IsString()
  param!: string;
}

export { ParamNum as ParamID, ParamNum, ParamString };
