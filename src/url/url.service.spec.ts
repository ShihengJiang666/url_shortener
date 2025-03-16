import {Test, TestingModule} from '@nestjs/testing';
import {UrlService} from './url.service.js';
import {Url} from './entities/url.entity.js';
import {BaseFirestoreRepository} from 'fireorm';
import {Timestamp} from '@google-cloud/firestore';
import * as nanoidModule from 'nanoid';
import dayjs from 'dayjs';
import {getRepositoryToken} from 'nestjs-fireorm';

describe('UrlService', () => {
	let service: UrlService;
	let mockRepository: jest.Mocked<BaseFirestoreRepository<Url>>;

	const originalEnv = process.env;

	beforeEach(async () => {
		process.env = {...originalEnv};
		process.env.PORT = '3000';

		mockRepository = {
			create: jest.fn(),
			findById: jest.fn(),
		} as unknown as jest.Mocked<BaseFirestoreRepository<Url>>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UrlService,
				{
					provide: getRepositoryToken(Url),
					useValue: mockRepository,
				},
			],
		}).compile();

		service = module.get<UrlService>(UrlService);
	});

	afterEach(() => {
		process.env = originalEnv;
		jest.clearAllMocks();
	});

	describe('shortenUrl', () => {
		it('should create a shortened URL with default expiry settings', async () => {
			const originalUrl = 'https://example.com/long-url';
			const expectedShortCode = 'abc123xyz';
			const expectedExpiry = dayjs().add(30, 'days').toDate();

			const result = await service.shortenUrl(originalUrl);

			const createdTimestamp = mockRepository.create.mock.calls[0][0].expiresAt as Timestamp;
			const createdDate = createdTimestamp.toDate();
			expect(nanoidModule.nanoid).toHaveBeenCalledWith(10);
			expect(mockRepository.create).toHaveBeenCalledWith({
				id: expectedShortCode,
				originalUrl,
				shortCode: expectedShortCode,
				expiresAt: expect.any(Timestamp),
			});
			expect(Math.abs(createdDate.getTime() - expectedExpiry.getTime())).toBeLessThan(5000);

			expect(result).toBe(`http://localhost:3000/url/${expectedShortCode}`);
		});

		it('should use custom duration and unit from environment variables', async () => {
			process.env.DURATION = '7';
			process.env.UNIT = 'hours';
			const originalUrl = 'https://example.com/long-url';
			const expectedExpiry = dayjs().add(7, 'hours').toDate();

			await service.shortenUrl(originalUrl);

			const createdTimestamp = mockRepository.create.mock.calls[0][0].expiresAt as Timestamp;
			const createdDate = createdTimestamp.toDate();
			expect(Math.abs(createdDate.getTime() - expectedExpiry.getTime())).toBeLessThan(5000);
		});
	});

	describe('getOriginalUrl', () => {
		it('should return the original URL when short code exists', async () => {
			// Arrange
			const shortCode = 'abc123';
			const expectedUrl = 'https://example.com/long-url';
			mockRepository.findById.mockResolvedValue({
				originalUrl: expectedUrl,
				shortCode,
				id: shortCode,
				expiresAt: Timestamp.now(),
			} as Url);

			const result = await service.getOriginalUrl(shortCode);

			expect(mockRepository.findById).toHaveBeenCalledWith(shortCode);
			expect(result).toBe(expectedUrl);
		});

		it('should return null when short code does not exist', async () => {
			const shortCode = 'notfound';
			mockRepository.findById.mockResolvedValue(null as unknown as Url);

			const result = await service.getOriginalUrl(shortCode);

			expect(mockRepository.findById).toHaveBeenCalledWith(shortCode);
			expect(result).toBeNull();
		});
	});
});
