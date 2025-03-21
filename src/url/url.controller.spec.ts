import {Test, TestingModule} from '@nestjs/testing';
import {UrlController} from './url.controller.js';
import {UrlService} from './url.service.js';

describe('UrlController', () => {
	let controller: UrlController;
	let mockUrlService: jest.Mocked<UrlService>;

	beforeEach(async () => {
		mockUrlService = {
			shortenUrl: jest.fn().mockResolvedValue('http://localhost:3000/url/abc123xyz'),
			getOriginalUrl: jest.fn().mockResolvedValue('https://example.com/original'),
		} as unknown as jest.Mocked<UrlService>;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UrlController],
			providers: [
				{
					provide: UrlService,
					useValue: mockUrlService,
				},
			],
		}).compile();

		controller = module.get<UrlController>(UrlController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
