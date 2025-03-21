import {Injectable} from '@nestjs/common';
import {Url} from './entities/url.entity.js';
import {InjectRepository} from 'nestjs-fireorm';
import {nanoid} from 'nanoid';
import {BaseFirestoreRepository} from 'fireorm';
import dayjs, {ManipulateType} from 'dayjs';
import {Timestamp} from '@google-cloud/firestore';

@Injectable()
export class UrlService {
	constructor(
		@InjectRepository(Url)
		private urlRepository: BaseFirestoreRepository<Url>,
	) {}

	async shortenUrl(originalUrl: string): Promise<string> {
		const shortCode = nanoid(10); // Generates a 6-character unique ID
		const duration = process.env.DURATION ? parseInt(process.env.DURATION) : 30;
		const unit = (process.env.UNIT ? process.env.UNIT : 'days') as ManipulateType;
		const expiresDate = dayjs().add(duration, unit).toDate();
		const fsExpiresDate = Timestamp.fromDate(expiresDate);
		await this.urlRepository.create({id: shortCode, originalUrl, shortCode, expiresAt: fsExpiresDate});
		return `http://localhost:${process.env.PORT}/url/${shortCode}`;
	}

	async getOriginalUrl(shortCode: string): Promise<string | null> {
		const urlEntry = await this.urlRepository.findById(shortCode);
		return urlEntry ? urlEntry.originalUrl : null;
	}
}
