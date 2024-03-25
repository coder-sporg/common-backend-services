// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { setupApp } from './../src/setup';

// import * as pactum from 'pactum';
import * as Spec from 'pactum/src/models/Spec';

describe('AppController (e2e)', () => {
  // let app: INestApplication;

  let spec;
  beforeEach(() => {
    // pactum.request.setBaseUrl('http://localhost:3000');
    spec = global.spec as Spec;
  });

  it('/ (GET)', () => {
    // return request(app.getHttpServer())
    //   .get('/')
    //   .expect(200)
    //   .expect('Hello World!');
    // return (
    //   request(app.getHttpServer())
    //     // baseURL + port
    //     .get('/api/v1/auth')
    //     .expect(200)
    //     .expect('Hello World!')
    // );

    // return pactum
    //   .spec()
    //   .get('/api/v1/auth')
    //   .expectStatus(200)
    //   .expectBodyContains('Hello World!');

    return spec
      .get('/api/v1/auth')
      .expectStatus(200)
      .expectBodyContains('Hello World!');
  });
});
