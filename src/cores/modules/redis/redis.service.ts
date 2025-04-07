import {Inject, Injectable} from '@nestjs/common';
import {RedisRepository} from './repository/redis.repository.js';
import {RedisPrefix} from './provider/redis.provider.js';

@Injectable()
export class RedisService {
	private static readonly _TTL = process.env.REDIS_TTL_MIN
		? parseInt(process.env.REDIS_TTL_MIN) * 60 * 60
		: 15 * 60 * 60;

	constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}
	async get(urlId: string): Promise<string | null> {
		return this.redisRepository.get(RedisPrefix.URL, urlId);
	}
	async save(urlId: string, originalUrl: string): Promise<void> {
		return this.redisRepository.setWithExpiry(RedisPrefix.URL, urlId, originalUrl, RedisService._TTL);
	}

	async exists(urlId: string): Promise<boolean> {
		return this.redisRepository.exists(RedisPrefix.URL, urlId);
	}
}
