import type { status_enum } from '@prisma/client';
import app from 'app';
import { StatusCodes } from 'http-status-codes';
import { userService } from 'modules/user';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

describe('pig', () => {
  const userData = {
    id: '651ed73162790f0d198ceac0',
    email: 'dphuong0311@gmail.com',
    first_name: 'Do',
    last_name: 'Phuong',
    updated_at: '2023-10-05T15:33:05.492Z' as unknown as Date,
    created_at: '2023-10-05T15:33:05.492Z' as unknown as Date
  };

  const pigData = {
    style: null,
    status: 'active' as status_enum,
    id: '652aa067af2b8ebd0748e306',
    name: 'Tiền ăn uống',
    updated_at: '2023-10-14T14:06:31.460Z' as unknown as Date,
    created_at: '2023-10-14T14:06:31.460Z' as unknown as Date,
    user_id: '651e94ef813f47c9080f71b7',
    user: {
      id: '651e94ef813f47c9080f71b7',
      email: 'lekienlan98@gmail.com',
      first_name: 'Lân',
      last_name: 'Lê',
      updated_at: '2023-10-05T10:50:23.101Z' as unknown as Date,
      created_at: '2023-10-05T10:50:23.101Z' as unknown as Date
    },
    periods: [
      {
        id: '6533f8fcf69468807254b754',
        budget: 40000,
        end_date: '2023-10-25T00:00:00.000Z' as unknown as Date,
        expense: -2730000,
        members: ['651e94ef813f47c9080f71b7'],
        repeat: true,
        start_date: '2023-10-21T00:00:00.000Z',
        updated_at: '2023-11-09T16:19:30.915Z' as unknown as Date,
        created_at: '2023-10-21T16:14:52.504Z' as unknown as Date,
        pig_id: '652aa067af2b8ebd0748e306'
      }
    ]
  };

  beforeEach(() => {
    const user = jest.spyOn(userService, 'findByAccessToken');
    user.mockResolvedValue(userData);
  });
  describe('GET /v1/piggies', () => {
    it('should return list of pig if data is ok', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [pigData],
        total_pages: 1
      };

      prismaMock.pigs.findMany.mockResolvedValue(fakeResp.results);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/piggies')
        .set('Authorization', `Bearer ${token}`);
      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });
  });
  describe('GET /v1/piggies/:id', () => {
    it('should return pig detail if data is ok', async () => {
      const pigWithPeriod = {
        ...pigData,
        periods: [
          {
            id: '6533f8fcf69468807254b754',
            budget: 40000,
            end_date: '2023-10-25T00:00:00.000Z' as unknown as Date,
            expense: -2730000,
            members: ['651e94ef813f47c9080f71b7'],
            repeat: true,
            start_date: '2023-10-21T00:00:00.000Z' as unknown as Date,
            updated_at: new Date().toISOString() as unknown as Date,
            created_at: new Date().toISOString() as unknown as Date,
            pig_id: '652aa067af2b8ebd0748e306',
            transactions: [{ amount: 1000 }, { amount: 2000 }]
          }
        ]
      };
      prismaMock.pigs.findFirst.mockResolvedValue(pigWithPeriod);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/piggies/123')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(pigWithPeriod);
    });
  });
  describe('POST /v1/piggies', () => {
    it('should create pig if data is ok', async () => {
      // Mock the categoryService.create method to resolve with a sample category

      const DATA_CREATE = {
        style: null,
        status: 'active' as status_enum,
        id: '6591259da7d876c10808f526',
        name: 'tạo bằng UI',
        updated_at: '2023-12-31T08:26:05.194Z' as unknown as Date,
        created_at: '2023-12-31T08:26:05.194Z' as unknown as Date,
        user_id: '651e94ef813f47c9080f71b7',
        user: {
          id: '651e94ef813f47c9080f71b7',
          email: 'lekienlan98@gmail.com',
          first_name: 'Lân',
          last_name: 'Lê',
          updated_at: '2023-10-05T10:50:23.101Z' as unknown as Date,
          created_at: '2023-10-05T10:50:23.101Z' as unknown as Date
        }
      };

      prismaMock.pigs.create.mockResolvedValue(DATA_CREATE);

      // Use supertest to send a request to the create endpoint
      prismaMock.users.findFirst.mockResolvedValue({
        id: '651e94ef813f47c9080f71b7',
        email: 'lekienlan98@gmail.com',
        first_name: 'Lân',
        last_name: 'Lê',
        updated_at: new Date().toISOString() as unknown as Date,
        created_at: new Date().toISOString() as unknown as Date
      });

      const response = await supertest(app)
        .post('/v1/piggies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Tiền nhà'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toEqual(DATA_CREATE);
    });
    it('should fail to create pig if user not found', async () => {
      const user = jest.spyOn(userService, 'findByAccessToken');
      user.mockResolvedValue(null);

      const response = await supertest(app)
        .post('/v1/piggies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Tiền nhà'
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('User not found');
    });
    it('should fail to create pig if name is not provided', async () => {
      const response = await supertest(app)
        .post('/v1/piggies')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe('"name" is required');
    });
  });
  describe('PUT /v1/piggies/:id', () => {
    it('should update pig if data is ok', async () => {
      // Mock the pigService.update method to resolve with a sample pig
      prismaMock.pigs.update.mockResolvedValue(pigData);

      const response = await supertest(app)
        .put(`/v1/piggies/123`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Provide updated data for the pig
          name: 'Tiền shopping'
        });

      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(pigData);
    });

    it('should fail to update pig if pig not found', async () => {
      // Mock the pigService.update method to reject with an error

      const response = await supertest(app)
        .put('/v1/piggies/nonexistent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Provide updated data for the pig
          name: 'Tiền shopping'
        });

      // Assert the response status code and error message
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe('Pig not found');
    });
  });

  describe('DELETE /v1/piggies/:id', () => {
    it('should remove a pig and return it in the response', async () => {
      prismaMock.pigs.update.mockResolvedValue({
        ...pigData,
        status: 'deleted'
      });

      const response = await supertest(app)
        .delete(`/v1/piggies/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.status).toBe('deleted');
    });
    it('should throw error if pig not found', async () => {
      const response = await supertest(app)
        .delete(`/v1/piggies/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.message).toBe('Pig not found');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
