import {Controller, Post, Get, Body, Param, Res, HttpStatus} from '@nestjs/common';
import {UrlService} from './url.service.js';
import {Response} from 'express';

@Controller('url')
export class UrlController {
	constructor(private readonly urlService: UrlService) {}

	@Post()
	async shorten(@Body('url') originalUrl: string) {
		const shortUrl = await this.urlService.shortenUrl(originalUrl);
		return {shortUrl};
	}

	@Get(':shortCode')
	async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
		const originalUrl = await this.urlService.getOriginalUrl(shortCode);
		if (originalUrl) {
			return res.redirect(originalUrl);
		} else {
			return res.status(HttpStatus.NOT_FOUND).json({message: 'URL not found'});
		}
	}
}
