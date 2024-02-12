import app from 'app';
import { StatusCodes } from 'http-status-codes';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import supertest from 'supertest';
// Replace with the actual path
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

import { historyService } from '.';

describe('histories', () => {
  const historyItem = {
    data: {
      amount: -200000,
      category_id: null,
      currency: null,

      date: null,
      note: null,
      period_id: '654d0696d19cdc3753bb2805'
    },
    id: '654d0699d19cdc3753bb2807',
    state: 'modified',
    user_id: '651e94ef813f47c9080f71b7',
    transaction_id: '654d0697d19cdc3753bb2806',
    updated_at: '2023-11-09T16:19:37.059Z' as unknown as Date,
    created_at: '2023-11-09T16:19:37.059Z' as unknown as Date
  };

  describe('GET /v1/histories', () => {
    it('should return list of histories if data is ok', async () => {
      const fakeResp = {
        total_results: 1,
        limit: 10,
        page: 1,
        results: [historyItem],
        total_pages: 1
      };

      jest.spyOn(tokenService, 'getAccessTokenFromRequest');
      jest.spyOn(userService, 'findByAccessToken');

      (tokenService.getAccessTokenFromRequest as jest.Mock).mockReturnValue(
        'validAccessToken'
      );

      // Mock userService to return a user with an ID
      (userService.findByAccessToken as jest.Mock).mockResolvedValueOnce({
        id: 'userId123'
      });

      // Mock the historyService.findMany method to resolve with sample data
      prismaMock.histories.findMany.mockResolvedValue(fakeResp.results);
      prismaMock.histories.count.mockResolvedValue(1);

      // Use supertest to send a request to the endpoint
      const response = await supertest(app)
        .get('/v1/histories')
        .set('Authorization', `Bearer ${token}`);

      // // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });

    it('should fail to get histories list if user_id is missing', async () => {
      jest.spyOn(userService, 'findByAccessToken');
      (userService.findByAccessToken as jest.Mock).mockResolvedValueOnce(null);

      const response = await supertest(app)
        .get('/v1/histories')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toEqual('user_id not found');
    });
  });

  describe('GET /v1/histories/:id', () => {
    it('should return histories of transaction based on transaction_id', async () => {
      prismaMock.histories.findMany.mockResolvedValue([historyItem]);

      const response = await supertest(app)
        .get('/v1/histories/transaction_id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([historyItem]);
    });

    it('should fail to get histories of transaction if transaction_id not found', async () => {
      prismaMock.histories.findMany.mockResolvedValue([]);

      const response = await supertest(app)
        .get('/v1/histories/transaction_id')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(response.body.message).toEqual('Transaction not found');
    });
  });

  it('should create history if data is ok', async () => {
    prismaMock.histories.create.mockResolvedValue(historyItem);

    const response = await historyService.create({
      data: {
        amount: -200000,
        category_id: null,
        currency: null,

        date: null,
        note: null,
        period_id: '654d0696d19cdc3753bb2805'
      },
      state: 'modified',
      user_id: '651e94ef813f47c9080f71b7',
      transaction_id: '654d0697d19cdc3753bb2806'
    });

    expect(response).toEqual(historyItem);
  });

  it('should delete history if id is correct', async () => {
    prismaMock.histories.delete.mockResolvedValue(historyItem);

    const response = await historyService.remove({
      id: historyItem.id
    });

    expect(response).toEqual(historyItem);
  });
});
