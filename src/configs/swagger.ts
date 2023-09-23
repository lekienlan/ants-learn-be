import dotenv from 'dotenv';

dotenv.config();

const SWAGGER_DEFINITION = {
  openapi: '3.0.0',
  info: {
    title: 'Piggies API documentation',
    version: '0.0.1',
    description: 'This is a personal finance management tool'
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/v1`,
      description: 'Development Server'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          name: {
            type: 'string'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin']
          }
        },
        example: {
          id: '5ebac534954b54139806c112',
          email: 'fake@example.com',
          name: 'fake name',
          role: 'user'
        }
      }
    }
  }
};

export default SWAGGER_DEFINITION;
