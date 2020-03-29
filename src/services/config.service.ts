import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { EnvConfig } from '../types/env-config.type';

export class ConfigService {

    constructor(filePath: string = '.env') {
        try {
            const config = dotenv.parse(fs.readFileSync(filePath));
            this.validateInput(config);
        } catch (err) {
            console.log('Cloud variables are being used');
        }
    }

    get botToken(): string {
        return process.env.BOT_TOKEN;
    }

    get botId(): string {
        return process.env.BOT_ID;
    }

    private validateInput(envConfig: EnvConfig) {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            BOT_TOKEN: Joi.string().required(),
            BOT_ID: Joi.string().required(),
        });

        const { error, value: validatedEnvConfig } = Joi.validate(
            envConfig,
            envVarsSchema,
        );

        if (error) throw new Error(`Config validation error: ${error.message}`);

        this.setVariables(validatedEnvConfig);
    }

    private setVariables(config: EnvConfig) {
        process.env['BOT_TOKEN'] = config.BOT_TOKEN;
        process.env['BOT_ID'] = config.BOT_ID;
    }

}