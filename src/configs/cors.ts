import type cors from 'cors';

export const WHITE_LISTS = ['https://example.com', 'https://yourdomain.com'];

export const CORS_OPTION: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (WHITE_LISTS.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true); // Allow the request if it's in the whitelist
    } else {
      callback(new Error('CORS_NOT_ALLOWED')); // Block the request if it's not in the whitelist
    }
  }
};
