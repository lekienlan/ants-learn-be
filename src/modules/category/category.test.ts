import { describe } from 'node:test';

import type { CategoryType } from '@prisma/client';
import app from 'app';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

describe('GET /v1/categories', () => {
  it('should return 200 if data is ok', async () => {
    // Mock the categoryService.create method to resolve with a sample category

    const fakeResp = {
      limit: 10,
      page: 1,
      results: [
        {
          id: 'someCategoryId',
          name: 'TestCategory',
          code: 'test',
          type: 'expense' as CategoryType,
          style: null,
          userId: 'someUserId',
          updatedAt: new Date().toISOString() as unknown as Date,
          createdAt: new Date().toISOString() as unknown as Date
        }
      ],
      totalPages: 1
    };
    prismaMock.categories.findMany.mockResolvedValue(fakeResp.results);

    // Use supertest to send a request to the create endpoint
    const response = await supertest(app)
      .get('/v1/categories')
      .set('Authorization', `Bearer ${token}`);
    // Assert the response status code and data
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(fakeResp);
  });
});

describe('POST /v1/categories', () => {
  it('should return 201 if data is ok', async () => {
    // Mock the categoryService.create method to resolve with a sample category
    const fakeResp = {
      id: 'someCategoryId',
      name: 'TestCategory',
      code: 'test',
      type: 'expense' as CategoryType,
      style: null,
      userId: 'someUserId',
      updatedAt: new Date().toISOString() as unknown as Date,
      createdAt: new Date().toISOString() as unknown as Date
    };
    prismaMock.categories.create.mockResolvedValue(fakeResp);

    // Use supertest to send a request to the create endpoint
    const response = await supertest(app)
      .post('/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TestCategory',
        type: 'expense'
      });

    // Assert the response status code and data
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toEqual(fakeResp);
    expect(response.body.name).toEqual(fakeResp.name);
  });

  it('should return 400 if type or name is missing', async () => {
    const response1 = await supertest(app)
      .post('/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TestCategory'
      });
    const response2 = await supertest(app)
      .post('/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense'
      });

    // Assert the response status code and data
    expect(response1.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response2.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should include user if having userId', async () => {
    const fakeResp = {
      id: 'someCategoryId',
      name: 'TestCategory',
      code: 'test',
      type: 'expense' as CategoryType,
      style: null,
      userId: 'userId',
      user: { id: 'userId' },
      updatedAt: new Date().toISOString() as unknown as Date,
      createdAt: new Date().toISOString() as unknown as Date
    };
    prismaMock.categories.create.mockResolvedValue(fakeResp);

    const response = await supertest(app)
      .post('/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TestCategory',
        userId: 'userId',
        type: 'expense'
      });

    // Assert the response status code and data
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty('user');
  });
});
