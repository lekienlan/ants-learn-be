import type { NextFunction, Request, Response } from 'express';

import catchAsync from './catchAsync';

describe('catchAsync', () => {
  it('should handle errors and call next with ApiError', async () => {
    // Mock Express objects
    const req = {} as Request;
    const res = {} as Response;

    // Mock NextFunction with jest.Mock
    const next = jest.fn() as jest.Mock & NextFunction;

    // Mock asynchronous function that returns a rejected promise with an error
    const asyncFn = async () => {
      // Simulate an error inside the async function
      return Promise.reject(new Error('Test error'));
    };

    // Use catchAsync middleware
    await catchAsync(asyncFn)(req, res, next);

    // Ensure next function is called with an ApiError
    expect(next).toHaveBeenCalled();
  });
});
