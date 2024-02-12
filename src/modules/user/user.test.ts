import app from 'app';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import prismaMock from 'test/prismaMock';
import { token } from 'test/setup';

import { userService } from '.';

describe('user', () => {
  const userData = {
    id: '651ed73162790f0d198ceac0',
    email: 'dphuong0311@gmail.com',
    first_name: 'Do',
    last_name: 'Phuong',
    updated_at: '2023-10-05T15:33:05.492Z' as unknown as Date,
    created_at: '2023-10-05T15:33:05.492Z' as unknown as Date
  };

  describe('GET /v1/users', () => {
    it('should return list of users if data is ok', async () => {
      const fakeResp = {
        limit: 10,
        page: 1,
        results: [userData],
        total_pages: 1
      };
      prismaMock.users.findMany.mockResolvedValue(fakeResp.results);

      // Use supertest to send a request to the create endpoint
      const response = await supertest(app)
        .get('/v1/users')
        .set('Authorization', `Bearer ${token}`);
      // Assert the response status code and data
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(fakeResp);
    });
  });
  it('should return user if id is ok', async () => {
    prismaMock.users.findFirst.mockResolvedValue(userData);
    const res = await userService.findById('651ed73162790f0d198ceac0');

    expect(res).toEqual(userData);
  });

  it('should return user if email is ok', async () => {
    prismaMock.users.findFirst.mockResolvedValue(userData);
    const res = await userService.findByEmail('dphuong0311@gmail.com');

    expect(res).toEqual(userData);
  });
  it('should create user if data is ok', async () => {
    prismaMock.users.create.mockResolvedValue(userData);
    const res = await userService.create({
      email: 'dphuong0311@gmail.com',
      first_name: 'Do',
      last_name: 'Phuong'
    });

    expect(res).toEqual(userData);
  });
  it('should find or create user if data is ok', async () => {
    prismaMock.users.upsert.mockResolvedValue(userData);
    const res = await userService.findOrCreate({
      email: 'dphuong0311@gmail.com',
      first_name: 'Do',
      last_name: 'Phuong'
    });

    expect(res).toEqual(userData);
  });
});
