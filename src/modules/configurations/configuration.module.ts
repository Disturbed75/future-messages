import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ConfigurationValidationSchema from './configuration-validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigurationValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigurationsModule {}
