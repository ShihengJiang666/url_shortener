import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../entities/url.entity.js';
import { UrlService } from './url.service.js';
import { UrlController } from './url.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
