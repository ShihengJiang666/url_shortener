import {Module} from '@nestjs/common';
import {redisClientFactory} from './provider/redis.provider.js';
import {RedisService} from './redis.service.js';
import {RedisRepository} from './repository/redis.repository.js';

@Module({
	providers: [redisClientFactory, RedisRepository, RedisService],
	exports: [RedisRepository, RedisService],
})
export class RedisModule {}
