import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity.js';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async shortenUrl(originalUrl: string): Promise<string> {
    const shortCode = nanoid(6); // Generates a 6-character unique ID
    const newUrl = this.urlRepository.create({ originalUrl, shortCode });
    await this.urlRepository.save(newUrl);
    return `http://localhost:3000/url/${shortCode}`;
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const urlEntry = await this.urlRepository.findOne({ where: { shortCode } });
    return urlEntry ? urlEntry.originalUrl : null;
  }
}
