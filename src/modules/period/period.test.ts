import app from 'app';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

describe('period', () => {
  const periodData = {
    id: '6533f8fcf69468807254b754',
    budget: 40000,
    endDate: '2023-10-25T00:00:00.000Z' as unknown as Date,
    expense: -2730000,
    members: ['651e94ef813f47c9080f71b7'],
    repeat: true,
    startDate: '2023-10-21T00:00:00.000Z' as unknown as Date,
    updatedAt: new Date().toISOString() as unknown as Date,
    createdAt: new Date().toISOString() as unknown as Date,
    pigId: '652aa067af2b8ebd0748e306'
  };

  const transactionData = {
    id: '653559bad21c4b196cf3a4c6',
    amount: -40000,
    currency: null,
    date: '2023-10-21T00:00:00.000Z' as unknown as Date,
    note: 'ăn cơm',
    periodId: '6533f8fcf69468807254b754',
    type: 'expense',
    userId: '651e94ef813f47c9080f71b7',
    categoryId: '65256e69c8511c542ee97fa5',
    updatedAt: '2023-10-22T17:19:51.834Z' as unknown as Date,
    createdAt: '2023-10-22T17:19:51.834Z' as unknown as Date
  };

  describe('GET /v1/categories', () => {
    it('should return list of period if data is ok', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [periodData],
        totalPages: 1
      };
      prismaMock.periods.findMany.mockResolvedValue(fakeResp.results);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/periods')
        .set('Authorization', `Bearer ${token}`);
      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });
  });
  describe('POST /v1/periods', () => {
    it('should create period if data is ok', async () => {
      // Mock the categoryService.create method to resolve with a sample category

      prismaMock.periods.create.mockResolvedValue(periodData);

      // Use supertest to send a request to the create endpoint
      prismaMock.users.findFirst.mockResolvedValue({
        id: '651e94ef813f47c9080f71b7',
        email: 'lekienlan98@gmail.com',
        firstName: 'Lân',
        lastName: 'Lê',
        updatedAt: new Date().toISOString() as unknown as Date,
        createdAt: new Date().toISOString() as unknown as Date
      });
      prismaMock.transactions.create.mockResolvedValue(transactionData);

      const response = await supertest(app)
        .post('/v1/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: '2023-10-16',
          endDate: '2023-10-18',
          budget: 200000,
          pigId: '652aa067af2b8ebd0748e306'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(periodData);
    });
    it('should fail to create period if user not found', async () => {
      const response = await supertest(app)
        .post('/v1/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: '2023-10-16',
          endDate: '2023-10-18',
          budget: 200000,
          pigId: '652aa067af2b8ebd0748e306'
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('User not found');
    });

    it('should fail to create period if pigId or budget not found', async () => {
      const response1 = await supertest(app)
        .post('/v1/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: '2023-10-16',
          endDate: '2023-10-18',
          budget: 200000
        });
      const response2 = await supertest(app)
        .post('/v1/periods')
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDate: '2023-10-16',
          endDate: '2023-10-18',
          pigId: '123'
        });
      expect(response1.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response1.body.message).toBe('"pigId" is required');
      expect(response2.body.message).toBe('"budget" is required');
    });
  });

  describe('PUT /v1/periods/:id', () => {
    it('should update period if data is ok', async () => {
      // Mock the periodService.update method to resolve with a sample period
      prismaMock.periods.update.mockResolvedValue(periodData);

      // Mock the transactionService.findOne and transactionService.update methods
      prismaMock.transactions.findFirst.mockResolvedValue(transactionData);
      prismaMock.transactions.update.mockResolvedValue(transactionData);

      const response = await supertest(app)
        .put(`/v1/periods/123`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Provide updated data for the period
          startDate: '2023-10-16',
          endDate: '2023-10-20',
          budget: 250000,
          pigId: '652aa067af2b8ebd0748e306'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(periodData);
    });

    it('should fail to update period if period not found', async () => {
      // Mock the periodService.update method to reject with an error

      const response = await supertest(app)
        .put('/v1/periods/nonexistent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Provide updated data for the period
          startDate: '2023-10-16',
          endDate: '2023-10-20',
          budget: 250000,
          pigId: '652aa067af2b8ebd0748e306'
        });

      // Assert the response status code and error message
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Period not found');
    });

    it('should create transaction history when budget is updated', async () => {
      // Mock the periodService.update method to resolve with a sample period
      prismaMock.periods.update.mockResolvedValue(periodData);

      // Mock the transactionService.findOne and transactionService.update methods
      prismaMock.transactions.findFirst.mockResolvedValue(transactionData);
      prismaMock.transactions.update.mockResolvedValue(transactionData);

      const response = await supertest(app)
        .put(`/v1/periods/123`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Provide updated data for the period
          startDate: '2023-10-16',
          endDate: '2023-10-20',
          budget: 250000,
          pigId: '652aa067af2b8ebd0748e306'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(periodData);

      expect(prismaMock.histories.create).toHaveBeenCalled();
    });
  });

  describe('DELETE /v1/periods/:id', () => {
    it('should remove a period and return it in the response', async () => {
      prismaMock.periods.delete.mockResolvedValue(periodData);

      const response = await supertest(app)
        .delete(`/v1/periods/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
    });
    it('should throw error if period not found', async () => {
      const response = await supertest(app)
        .delete(`/v1/periods/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.message).toBe('Period not found');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('GET /v1/periods/:id', () => {
    it('should get period detail', async () => {
      prismaMock.periods.findFirst.mockResolvedValue(periodData);

      const response = await supertest(app)
        .get(`/v1/periods/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(periodData);
    });
  });
});
