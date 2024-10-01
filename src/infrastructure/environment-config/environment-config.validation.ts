import { Transform, plainToClass } from '@nestjs/class-transformer';
import {
  IsBoolean,
  IsString,
  IsNumber,
  IsEnum,
  validateSync,
} from '@nestjs/class-validator';

enum Environment {
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
  Local = 'local',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  TELEGRAM_TOKEN:string

  @IsString()
  DB_CONNECTION_URL:string

  @IsString()
  ADMIN_SECRET:string

 

}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
