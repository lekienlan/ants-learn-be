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
      prismaMock.transactions.create.mockResolvedValue({
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
      });

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
  });
});
