import { Injectable } from '@nestjs/common';
import { Url } from './entities/url.entity.js';
import { InjectRepository } from 'nestjs-fireorm';
import { nanoid } from 'nanoid';
import { BaseFirestoreRepository } from 'fireorm';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: BaseFirestoreRepository<Url>
  ) {}

  async shortenUrl(originalUrl: string): Promise<string> {
    const shortCode = nanoid(6); // Generates a 6-character unique ID
    const newUrl = await this.urlRepository.create({ originalUrl, shortCode });
    return `http://localhost:3000/url/${shortCode}`;
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const urlEntry = await this.urlRepository.findById(shortCode);
    return urlEntry ? urlEntry.originalUrl : null;
  }
}
