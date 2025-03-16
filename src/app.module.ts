import {Module} from '@nestjs/common';
import {FireormModule} from 'nestjs-fireorm';
import {AppController} from './app.controller.js';
import {AppService} from './app.service.js';
import {UrlModule} from './url/url.module.js';
import {ConfigModule} from '@nestjs/config';

@Module({
	imports: [
		FireormModule.forRoot({
			fireormSettings: {validateModels: true},
			firestoreSettings: {projectId: process.env.PROJECT_ID},
		}),
		ConfigModule.forRoot(),
		UrlModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
