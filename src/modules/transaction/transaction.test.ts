import app from 'app';
import { StatusCodes } from 'http-status-codes';
import { historyService } from 'modules/history';
import { userService } from 'modules/user';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

const periodMockData = {
  id: '6533f8fcf69468807254b754',
  budget: 40000,
  end_date: '2023-10-25T00:00:00.000Z' as unknown as Date,
  expense: -2730000,
  members: ['651e94ef813f47c9080f71b7'],
  repeat: true,
  start_date: '2023-10-21T00:00:00.000Z' as unknown as Date,
  updated_at: new Date().toISOString() as unknown as Date,
  created_at: new Date().toISOString() as unknown as Date,
  pig_id: '652aa067af2b8ebd0748e306'
};

describe('transaction', () => {
  const userData = {
    id: '651ed73162790f0d198ceac0',
    email: 'dphuong0311@gmail.com',
    first_name: 'Do',
    last_name: 'Phuong',
    updated_at: '2023-10-05T15:33:05.492Z' as unknown as Date,
    created_at: '2023-10-05T15:33:05.492Z' as unknown as Date
  };

  const transactionData = {
    id: '65636ee45e81c86731cf9070',
    amount: -311000,
    currency: null,
    date: '2023-11-26T16:14:28.258Z' as unknown as Date,
    note: null,
    period_id: '65636ee25e81c86731cf906f',
    type: 'budget',
    user_id: '651e94ef813f47c9080f71b7',
    category_id: null,
    updated_at: '2023-11-26T16:14:28.258Z' as unknown as Date,
    created_at: '2023-11-26T16:14:28.258Z' as unknown as Date,
    user: {
      id: '651e94ef813f47c9080f71b7',
      email: 'lekienlan98@gmail.com',
      first_name: 'Lân',
      last_name: 'Lê',
      updated_at: '2023-10-05T10:50:23.101Z' as unknown as Date,
      created_at: '2023-10-05T10:50:23.101Z' as unknown as Date
    }
  };

  describe('GET /v1/transactions', () => {
    it('should return list of transactions if user is ok', async () => {
      const fakeResp = {
        totalAmount: 10000,
        limit: 10,
        page: 1,
        results: [transactionData],
        total_pages: 1
      };
      const user = jest.spyOn(userService, 'findByAccessToken');
      user.mockResolvedValue(userData);
      prismaMock.transactions.findMany.mockResolvedValue(fakeResp.results);
      prismaMock.transactions.aggregate.mockResolvedValue({
        _sum: { amount: 10000 },
        _count: {},
        _avg: {},
        _min: {},
        _max: {}
      });

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .query({
          period_id: '123'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });
    it('should throw error if user not found', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [transactionData],
        total_pages: 1
      };
      const user = jest.spyOn(userService, 'findByAccessToken');
      user.mockResolvedValue(null);
      prismaMock.transactions.findMany.mockResolvedValue(fakeResp.results);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${token}`);
      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /v1/transactions', () => {
    it('should create new transaction if data is ok', async () => {
      const user = jest.spyOn(userService, 'findByAccessToken');
      const history = jest.spyOn(historyService, 'create');

      user.mockResolvedValue(userData);
      prismaMock.transactions.create.mockResolvedValue(transactionData);
      prismaMock.periods.findFirst.mockResolvedValue(periodMockData);
      prismaMock.periods.update.mockResolvedValue(periodMockData);

      const response = await supertest(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: -311000,
          date: '2023-11-26T16:14:28.258Z' as unknown as Date,
          period_id: '65636ee25e81c86731cf906f'
        });

      expect(response.body).toEqual(transactionData);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(history).toHaveBeenCalledWith({
        data: {
          amount: -311000,
          category_id: null,
          currency: null,
          date: '2023-11-26T16:14:28.258Z',
          note: null,
          period_id: '65636ee25e81c86731cf906f'
        },
        state: 'original',
        transaction_id: expect.anything(),
        user_id: '651e94ef813f47c9080f71b7'
      });
    });

    it('should update period expense', async () => {
      const user = jest.spyOn(userService, 'findByAccessToken');

      user.mockResolvedValue(userData);
      prismaMock.periods.update.mockResolvedValue(periodMockData);
      prismaMock.periods.findFirst.mockResolvedValue(periodMockData);

      await supertest(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: -20000,
          date: '2023-11-26T16:14:28.258Z' as unknown as Date,
          period_id: '6533f8fcf69468807254b754',
          type: 'expense'
        });

      expect(prismaMock.periods.findFirst).toHaveBeenCalledWith({
        where: { id: '6533f8fcf69468807254b754' },
        include: {
          transactions: true
        }
      });
      expect(prismaMock.periods.update).toHaveBeenCalled();
    });
  });
  describe('GET /v1/transactions/:id', () => {
    it('should get transaction detail', async () => {
      prismaMock.transactions.findFirst.mockResolvedValue(transactionData);
      const response = await supertest(app)
        .get('/v1/transactions/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.body).toEqual(transactionData);
    });
    it('should throw error if transaction id not found', async () => {
      const response = await supertest(app)
        .put('/v1/transactions/123')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('PUT /v1/transactions/:id', () => {
    it('should update transaction if data is ok', async () => {
      prismaMock.transactions.update.mockResolvedValue({
        ...transactionData,
        date: '2023-12-26T16:14:28.258Z' as unknown as Date
      });
      const history = jest.spyOn(historyService, 'create');
      const response = await supertest(app)
        .put('/v1/transactions/123')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: '2023-12-26T16:14:28.258Z' as unknown as Date
        });

      expect(history).toHaveBeenCalledWith({
        data: {
          amount: -311000,
          category_id: null,
          currency: null,
          date: '2023-12-26T16:14:28.258Z',
          note: null,
          period_id: '65636ee25e81c86731cf906f'
        },
        state: 'modified',
        transaction_id: expect.anything(),
        user_id: '651e94ef813f47c9080f71b7'
      });

      expect(response.body).toEqual({
        ...transactionData,
        date: '2023-12-26T16:14:28.258Z' as unknown as Date
      });
    });
    it('should not update transaction if transaction not found', async () => {
      const response = await supertest(app)
        .put('/v1/transactions/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /v1/transactions/:id', () => {
    it('should delete transaction if data is ok', async () => {
      prismaMock.transactions.delete.mockResolvedValue(transactionData);

      const response = await supertest(app)
        .delete('/v1/transactions/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(StatusCodes.OK);
    });
  });
});
