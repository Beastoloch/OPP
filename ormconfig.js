module.exports = {
    type: 'postgres',
    host: '192.168.99.100',
    port: 5433,
    username: 'rasem0n',
    password: '123456',
    database: 'postgre-nest-fund',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    cli: {
        migrationsDir: 'src/migrations',
    },
}