import {Timestamp} from '@google-cloud/firestore';
import {Collection} from 'fireorm';

@Collection('urls')
export class Url {
	id: string;

	originalUrl: string;

	shortCode: string;

	expiresAt: Timestamp;
}
