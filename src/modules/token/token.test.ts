import configs from 'configs';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import prismaMock from 'test/prismaMock';

import { tokenService } from '.';

describe('token', () => {
  const user_id = 'testUserId';
  const expires = moment().add(1, 'hour');
  const token = tokenService.generate(
    user_id,
    expires,
    configs.jwt.accessSecretKey
  );
  const expiresDate = expires.toDate();
  const tokenResult = {
    id: '',
    blacklisted: false,
    expires: expiresDate,
    token,
    user_id,
    created_at: null,
    updated_at: null
  };
  beforeEach(() => {
    prismaMock.tokens.create.mockResolvedValue(tokenResult);
  });

  it('should generate a token', () => {
    const result = tokenService.generate(
      user_id,
      expires,
      configs.jwt.accessSecretKey
    );
    expect(typeof result).toBe('string');
  });

  it('should decode a token', () => {
    const decodedPayload = {
      sub: user_id,
      iat: moment().unix(),
      exp: expires.unix()
    };

    const result = tokenService.decode(token);
    expect(result).toEqual(decodedPayload);
  });

  it('should create a token in the database', async () => {
    const result = await tokenService.create(token, user_id, expires);
    expect(result).toBeDefined();
    expect(prismaMock.tokens.create).toHaveBeenCalledWith({
      data: { token, user_id, expires: expiresDate, blacklisted: false }
    });
  });

  describe('verify', () => {
    it('should verify a token', async () => {
      // const payload = { sub: user_id };
      prismaMock.tokens.findFirst.mockResolvedValue(tokenResult);

      const result = await tokenService.verify(token);
      expect(result).toBeDefined();
      expect(prismaMock.tokens.findFirst).toHaveBeenCalledWith({
        where: { token, user_id, blacklisted: false }
      });
    });

    it('should throw an error for invalid token', async () => {
      try {
        await tokenService.verify(token);
      } catch (err: any) {
        expect(err.message).toBe('Invalid token');
      }
    });

    it('should throw an ApiError for bad user', async () => {
      try {
        const verify = jest.spyOn(jwt, 'verify');
        verify.mockImplementation(() => () => ({ verified: 'true' }));

        await tokenService.verify(token);
      } catch (err: any) {
        expect(err.message).toBe('User not found');
      }
    });
  });

  it('should generate access and refresh tokens', async () => {
    const user = {
      id: user_id,
      email: 'abc@gmail.com',
      first_name: 'Lan',
      last_name: 'Le',
      created_at: null,
      updated_at: null
    };

    const result = await tokenService.generateTokens(user);
    expect(result).toHaveProperty('access.token');
    expect(result).toHaveProperty('refresh.token');
    expect(prismaMock.tokens.create).toHaveBeenCalled();
  });

  describe('getAccessTokenFromRequest', () => {
    it('should get access token from request header', () => {
      const request = { headers: { authorization: 'Bearer testToken' } };

      const result = tokenService.getAccessTokenFromRequest(request as Request);
      expect(result).toBe('testToken');
    });

    it('should handle missing authorization header', () => {
      const request = { headers: {} };
      const result = tokenService.getAccessTokenFromRequest(request as Request);
      expect(result).toBe('');
    });
  });

  it('should remove a token from the database', async () => {
    prismaMock.tokens.delete.mockResolvedValue(tokenResult);

    await tokenService.remove('testTokenId');
    expect(prismaMock.tokens.delete).toHaveBeenCalledWith({
      where: { id: 'testTokenId' }
    });
  });
});
