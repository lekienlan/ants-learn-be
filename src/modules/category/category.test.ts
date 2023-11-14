import { describe } from 'node:test';

import type { CategoryType } from '@prisma/client';
import app from 'app';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';

let token: string;
beforeEach(() => {
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTFlOTRlZjgxM2Y0N2M5MDgwZjcxYjciLCJpYXQiOjE2OTkzNjI4MzAsImV4cCI6MTcyNTI4MjgzMH0.y0FHFbMxLHVXVHFcytF2UNLyDdzaIEf2-CLJA6PageE';
});

describe('category', () => {
  describe('POST /v1/categories', () => {
    it('should create a new category and return 201 status code', async () => {
      // Mock the categoryService.create method to resolve with a sample category
      const mockCategory = {
        id: 'someCategoryId',
        name: 'TestCategory',
        code: 'test',
        type: 'expense' as CategoryType,
        style: null,
        userId: 'someUserId',
        updatedAt: new Date().toISOString() as unknown as Date,
        createdAt: new Date().toISOString() as unknown as Date
      };
      prismaMock.categories.create.mockResolvedValue(mockCategory);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .post('/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'TestCategory',
          type: 'expense'
        })
        .set('Content-Type', 'application/json');

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(mockCategory);
      expect(response.body.name).toEqual(mockCategory.name);
    });
  });
});
