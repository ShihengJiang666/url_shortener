import {Inject, Injectable} from '@nestjs/common';
import {Url} from './entities/url.entity.js';
import {InjectRepository} from 'nestjs-fireorm';
import {nanoid} from 'nanoid';
import {BaseFirestoreRepository} from 'fireorm';
import dayjs, {ManipulateType} from 'dayjs';
import {Timestamp} from '@google-cloud/firestore';
import {RedisService} from '../cores/modules/redis/redis.service.js';

@Injectable()
export class UrlService {
	private static readonly _PRD_URL = `https://url-shortener-${process.env.PROJECT_NUMBER}.us-central1.run.app`;

	constructor(
		@InjectRepository(Url)
		private _urlRepository: BaseFirestoreRepository<Url>,
		@Inject(RedisService) private readonly _redisService: RedisService,
	) {}

	async shortenUrl(originalUrl: string): Promise<string> {
		const shortCode = nanoid(10); // Generates a 6-character unique ID
		const fsExpiresDate = this._getExpiration();
		await this._urlRepository.create({id: shortCode, originalUrl, shortCode, expiresAt: fsExpiresDate});
		await this._redisService.save(shortCode, originalUrl);
		return this._generateUrl(shortCode);
	}

	async getOriginalUrl(shortCode: string): Promise<string | null> {
		const existInCache = await this._redisService.exists(shortCode);
		if (existInCache) {
			return this._redisService.get(shortCode);
		}
		const urlEntry = await this._urlRepository.findById(shortCode);
		return urlEntry ? urlEntry.originalUrl : null;
	}

	private _getExpiration() {
		const duration = process.env.DURATION ? parseInt(process.env.DURATION) : 30;
		const unit = (process.env.UNIT ? process.env.UNIT : 'days') as ManipulateType;
		const expiresDate = dayjs().add(duration, unit).toDate();
		return Timestamp.fromDate(expiresDate);
	}

	private _generateUrl(shortCode: string) {
		const env = String(process.env.NODE_ENV || 'local');
		const isLocal = ['development', 'local'].includes(env);
		return isLocal
			? `http://localhost:${process.env.PORT}/url/${shortCode}`
			: `${UrlService._PRD_URL}/url/${shortCode}`;
	}
}
