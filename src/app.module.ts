import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UrlModule } from './url/url.module.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    FireormModule.forRoot({
      fireormSettings: { validateModels: true },
      firestoreSettings: { projectId: process.env.PROJECT_ID }
    }),
    UrlModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
