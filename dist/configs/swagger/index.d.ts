declare const SWAGGER_DEFINITION: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        schemas: {
            Error: {
                type: string;
                properties: {
                    code: {
                        type: string;
                    };
                    message: {
                        type: string;
                    };
                };
            };
            User: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    email: {
                        type: string;
                        format: string;
                    };
                    name: {
                        type: string;
                    };
                    role: {
                        type: string;
                        enum: string[];
                    };
                };
                example: {
                    id: string;
                    email: string;
                    name: string;
                    role: string;
                };
            };
        };
        responses: {
            Forbidden: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            code: number;
                            message: string;
                        };
                    };
                };
            };
            NotFound: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            code: number;
                            message: string;
                        };
                    };
                };
            };
            Unauthorized: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            $ref: string;
                        };
                        example: {
                            code: number;
                            message: string;
                        };
                    };
                };
            };
        };
    };
};
export default SWAGGER_DEFINITION;
