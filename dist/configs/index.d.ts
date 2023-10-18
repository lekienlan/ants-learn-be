declare const configs: {
    env: any;
    port: any;
    mongoose: {
        url: any;
        options: {
            useCreateIndex: boolean;
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
        };
    };
    jwt: {
        accessSecretKey: any;
        accessExpirationMinutes: any;
        refreshExpirationDays: any;
    };
    google: {
        clientId: any;
        clientSecret: any;
    };
};
export default configs;
