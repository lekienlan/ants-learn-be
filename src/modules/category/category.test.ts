import type { category_type_enum } from '@prisma/client';
import app from 'app';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

describe('categories', () => {
  describe('GET /v1/categories', () => {
    it('should return categories list if data is ok', async () => {
      // Mock the categoryService.create method to resolve with a sample category

      const fakeResp = {
        limit: 10,
        page: 1,
        results: [
          {
            id: 'someCategoryId',
            name: 'TestCategory',
            code: 'test',
            type: 'expense' as category_type_enum,
            style: null,
            user_id: 'someUserId',
            updated_at: new Date().toISOString() as unknown as Date,
            created_at: new Date().toISOString() as unknown as Date
          }
        ],
        total_pages: 1
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
    it('should create category if data is ok', async () => {
      // Mock the categoryService.create method to resolve with a sample category
      const fakeResp = {
        id: 'someCategoryId',
        name: 'TestCategory',
        code: 'test',
        type: 'expense' as category_type_enum,
        style: null,
        user_id: 'someUserId',
        updated_at: new Date().toISOString() as unknown as Date,
        created_at: new Date().toISOString() as unknown as Date
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
    });

    it('should fail to create if type or name is missing', async () => {
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

    it('should include user if having user_id', async () => {
      const fakeResp = {
        id: 'someCategoryId',
        name: 'TestCategory',
        code: 'test',
        type: 'expense' as category_type_enum,
        style: null,
        user_id: 'user_id',
        user: { id: 'user_id' },
        updated_at: new Date().toISOString() as unknown as Date,
        created_at: new Date().toISOString() as unknown as Date
      };
      prismaMock.categories.create.mockResolvedValue(fakeResp);

      const response = await supertest(app)
        .post('/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'TestCategory',
          user_id: 'user_id',
          type: 'expense'
        });

      console.log(response);

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('PUT /v1/categories', () => {
    const fakeResp = {
      id: 'cateId',
      name: 'updatedCate',
      code: 'test',
      type: 'income' as category_type_enum,
      style: null,
      user_id: 'someUserId',
      updated_at: new Date().toISOString() as unknown as Date,
      created_at: new Date().toISOString() as unknown as Date
    };

    it('should update category if data is ok', async () => {
      prismaMock.categories.update.mockResolvedValue(fakeResp);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .put('/v1/categories/cateId')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedCate'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });

    it('should fail to update category if request is bad', async () => {
      prismaMock.categories.update.mockImplementation(() => {
        const error: any = new Error('message');
        error.code = 'ERROR_CODE';

        throw error;
      });

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .put('/v1/categories/notValidId')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedCate'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/categories', () => {
    const fakeResp = {
      id: 'cateId',
      name: 'updatedCate',
      code: 'test',
      type: 'income' as category_type_enum,
      style: null,
      user_id: 'someUserId',
      updated_at: new Date().toISOString() as unknown as Date,
      created_at: new Date().toISOString() as unknown as Date
    };

    it('should delete category if id is correct', async () => {
      prismaMock.categories.delete.mockResolvedValue(fakeResp);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .delete('/v1/categories/cateId')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedCate'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });

    it('should fail to delete category if request is bad', async () => {
      prismaMock.categories.update.mockImplementation(() => {
        const error: any = new Error('message');
        error.code = 'YOUR_STATUS_CODE';

        throw error;
      });

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .put('/v1/categories/notValidId')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedCate'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
