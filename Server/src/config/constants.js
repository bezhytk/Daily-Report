export default {
    PORT: process.env.PORT || 8000,
    DB_URL : 'mongodb://localhost/daily-report-application',
    GRAPHQL_PATH: '/graphql',
    JWT_SECRET: 'mysecret123',
    SUBSCRIPTIONS_PATH: '/subscriptions'
};