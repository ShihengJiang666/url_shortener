import {Module} from '@nestjs/common';
import {Url} from './entities/url.entity.js';
import {FireormModule} from 'nestjs-fireorm';
import {UrlService} from './url.service.js';
import {UrlController} from './url.controller.js';
import {RedisModule} from '../cores/modules/index.js';

@Module({
	imports: [FireormModule.forFeature([Url]), RedisModule],
	controllers: [UrlController],
	providers: [UrlService],
})
export class UrlModule {}
