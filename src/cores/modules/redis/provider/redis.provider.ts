import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class Provider {}
import {FactoryProvider} from '@nestjs/common';
import {Redis} from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
	provide: 'RedisClient',
	useFactory: () => {
		const redisInstance = new Redis({
			host: process.env.REDIS_HOST || '127.0.0.1',
			port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
		});

		redisInstance.on('error', e => {
			throw new Error(`Redis connection failed: ${e}`);
		});
		Logger.log('Sucessfully establish connetion with Redis');

		return redisInstance;
	},
	inject: [],
};

export enum RedisPrefix {
	URL = 'url:',
}
