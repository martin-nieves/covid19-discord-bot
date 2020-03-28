import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { EnvConfig } from '../types/env-config.type';

export class ConfigService {

    private readonly envConfig: EnvConfig;

    constructor(filePath: string = '.env') {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = this.validateInput(config);

    }
    
    get botToken(): string {
        return this.envConfig.BOT_TOKEN;
    }

    get botId(): string {
        return this.envConfig.BOT_ID;
    }

    get port(): number {
        return +this.envConfig.PORT;
    }

    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            BOT_TOKEN: Joi.string().required(),
            BOT_ID: Joi.string().required(),
            PORT: Joi.number().default(3000),
        });

        const { error, value: validatedEnvConfig } = Joi.validate(
            envConfig,
            envVarsSchema,
        );

        if (error) throw new Error(`Config validation error: ${error.message}`);

        return validatedEnvConfig;
    }

}