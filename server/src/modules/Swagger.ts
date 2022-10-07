import swaggerJSDoc from 'swagger-jsdoc';
import { JsonObject } from 'swagger-ui-express';

export const swagger = (): JsonObject => {
  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'CV reactoring API',
        contact: {
          name: 'IBA company',
          url: 'https://iba.by/',
        },
      },
      tags: [
        {
          name: 'Resume',
          description: 'Resume router',
        },
        {
          name: 'Environment',
          description: 'Environment router',
        },
        {
          name: 'Errors',
          description: 'Errors router',
        },
      ],
    },
    apis: ['swagger.yaml'],
  };

  return swaggerJSDoc({ ...options });
};
