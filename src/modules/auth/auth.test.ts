import { StatusCodes } from 'http-status-codes';
import ApiError from 'middlewares/error/ApiError';
import { tokenService } from 'modules/token';
import { userService } from 'modules/user';
import moment from 'moment';
import prismaMock from 'test/prismaMock';

import { authService } from '.';
import authMiddleware from './auth.middleware';

describe('auth', () => {
  const tokenResult = {
    id: '',
    blacklisted: false,
    expires: moment().add(1, 'hour').toDate(),
    token: '',
    user_id: '123',
    created_at: null,
    updated_at: null
  };
  const userData = {
    id: '123',
    email: 'abc@gmail.com',
    first_name: 'Lan',
    last_name: 'Le',
    created_at: null,
    updated_at: null
  };

  describe('loginWithEmail function', () => {
    it('should throw ApiError with UNAUTHORIZED status for incorrect email', async () => {
      try {
        prismaMock.users.findFirst.mockResolvedValue(null);
        await authService.loginWithEmail('aaaaa@gmail.com');
      } catch (err: any) {
        expect(err.message).toBe('Incorrect email');
      }
    });

    it('should return user for a valid email', async () => {
      prismaMock.users.findFirst.mockResolvedValue(userData);

      const result = await authService.loginWithEmail('abc@gmail.com');

      expect(result).toEqual(userData);
    });

    it('should refresh token', async () => {
      prismaMock.tokens.findFirst.mockResolvedValue(tokenResult);

      const generateTokens = jest.spyOn(tokenService, 'generateTokens');
      const verify = jest.spyOn(tokenService, 'verify');
      const user = jest.spyOn(userService, 'findById');

      verify.mockResolvedValue(tokenResult);
      user.mockResolvedValue(userData);
      generateTokens.mockResolvedValue({
        access: {
          token: 'abc',
          expires: moment('2023-10-21T00:00:00.000Z').toDate()
        },
        refresh: {
          token: 'def',
          expires: moment('2023-10-21T00:00:00.000Z').toDate()
        }
      });

      const result = await authService.refresh('refreshToken');

      expect(result).toEqual({
        user: userData,
        tokens: {
          access: {
            token: 'abc',
            expires: moment('2023-10-21T00:00:00.000Z').toDate()
          },
          refresh: {
            token: 'def',
            expires: moment('2023-10-21T00:00:00.000Z').toDate()
          }
        }
      });
    });
  });

  describe('authMiddleware', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;

    beforeEach(() => {
      mockRequest = {
        body: {},
        query: {},
        headers: {}
      };
      mockResponse = {};
      mockNext = jest.fn();
    });

    it('should call next without an error if a valid token is provided in the body', async () => {
      mockRequest.body.token = 'validToken';

      await authMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next with an error for missing token', async () => {
      await authMiddleware(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'A token is required for authentication'
        )
      );
    });
  });
});
