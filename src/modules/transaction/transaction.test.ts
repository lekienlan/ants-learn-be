import app from 'app';
import { StatusCodes } from 'http-status-codes';
import { historyService } from 'modules/history';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

describe('transaction', () => {
  const userData = {
    id: '651ed73162790f0d198ceac0',
    email: 'dphuong0311@gmail.com',
    firstName: 'Do',
    lastName: 'Phuong',
    updatedAt: '2023-10-05T15:33:05.492Z' as unknown as Date,
    createdAt: '2023-10-05T15:33:05.492Z' as unknown as Date
  };

  const transactionData = {
    id: '65636ee45e81c86731cf9070',
    amount: -311000,
    currency: null,
    date: '2023-11-26T16:14:28.258Z' as unknown as Date,
    note: null,
    periodId: '65636ee25e81c86731cf906f',
    type: 'budget',
    userId: '651e94ef813f47c9080f71b7',
    categoryId: null,
    updatedAt: '2023-11-26T16:14:28.258Z' as unknown as Date,
    createdAt: '2023-11-26T16:14:28.258Z' as unknown as Date,
    user: {
      id: '651e94ef813f47c9080f71b7',
      email: 'lekienlan98@gmail.com',
      firstName: 'Lân',
      lastName: 'Lê',
      updatedAt: '2023-10-05T10:50:23.101Z' as unknown as Date,
      createdAt: '2023-10-05T10:50:23.101Z' as unknown as Date
    }
  };

  describe('GET /v1/transactions', () => {
    it('should return list of transactions if user is ok', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [transactionData],
        totalPages: 1
      };
      const user = jest.spyOn(userService, 'findByAccessToken');
      user.mockResolvedValue(userData);
      prismaMock.transactions.findMany.mockResolvedValue(fakeResp.results);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/transactions')
        .set('Authorization', `Bearer ${token}`);
      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });
    it('should throw error if user not found', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [transactionData],
        totalPages: 1
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
      const accessToken = jest.spyOn(tokenService, 'getAccessTokenFromRequest');
      const user = jest.spyOn(userService, 'findByAccessToken');
      const history = jest.spyOn(historyService, 'create');
      accessToken.mockReturnValue('validToken');
      user.mockResolvedValue(userData);
      prismaMock.transactions.create.mockResolvedValue(transactionData);

      const response = await supertest(app)
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: -311000,
          date: '2023-11-26T16:14:28.258Z' as unknown as Date,
          periodId: '65636ee25e81c86731cf906f'
        });

      expect(response.body).toEqual(transactionData);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(history).toHaveBeenCalledWith({
        data: {
          amount: -311000,
          categoryId: null,
          currency: null,
          date: '2023-11-26T16:14:28.258Z',
          note: null,
          periodId: '65636ee25e81c86731cf906f'
        },
        state: 'original',
        transactionId: expect.anything(),
        userId: '651e94ef813f47c9080f71b7'
      });
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
          categoryId: null,
          currency: null,
          date: '2023-12-26T16:14:28.258Z',
          note: null,
          periodId: '65636ee25e81c86731cf906f'
        },
        state: 'modified',
        transactionId: expect.anything(),
        userId: '651e94ef813f47c9080f71b7'
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
