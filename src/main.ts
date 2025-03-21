import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module.js';
import {Logger} from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {bufferLogs: true});
	await app.listen(process.env.PORT ?? 3000);
	Logger.debug(`Server running on port ${process.env.PORT ?? 3000} `);
}
bootstrap();
