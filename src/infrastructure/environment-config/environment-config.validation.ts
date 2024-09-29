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
  API_KEY:string

  @IsString()
  CLIENT_ID:string

  @IsString()
  REDIS_HOST;

  @IsString()
  AWS_S3_REGION;

  @IsString()
  AWS_S3_ACCESSKEYID;

  @IsString()
  AWS_S3_SECRETACCESSKEY;

  @IsString()
  AWS_S3_BUCKET;

  @IsString()
  AWS_S3_ROOT_FOLDER;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  REDIS_DB;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  REDIS_PORT;

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
