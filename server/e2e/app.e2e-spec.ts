import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('App', () => {
    let app: INestApplication;

    const infoService = {
        'activeProfiles': 'no',
        'display-ribbon-on-profiles': 'no',
    };

    const testRequest: any = {};

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET up running info OK', () =>
        request(app.getHttpServer())
            .get('/management/info')
            .expect(200)
            .expect(infoService));

    it('/POST security oauth2 does not perform logout', () =>
        request(app.getHttpServer())
            .post('/api/logout')
            .send(testRequest)
            .expect({})
            .expect(201));

    it('/GET account not logged', () =>
        request(app.getHttpServer())
            .get('/api/account')
            .expect(200)
            .expect({}));

    afterEach(async () => {
        await app.close();
    });
});
