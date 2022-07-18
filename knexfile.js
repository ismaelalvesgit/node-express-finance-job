require("@babel/register");
const env = require("./src/env");

module.exports = {
    local:{
        client: "mysql2",
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: env.default.db.database,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        pool:{
            afterCreate: function(connection, callback) {
                connection.query(`SET time_zone = "${env.default.timezone}";`, function(err) {
                    callback(err, connection);
                });
            },
            min: 1,
            max: 10
        },
        debug: env.default.db.debug
    },
    test:{
        client: "mysql2",
        connection: {
            host: env.default.db.host,
            port: env.default.db.port,
            user: env.default.db.user,
            password: env.default.db.password,
            database: `test_${env.default.db.database}`,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true,
        },
        pool:{
            min: 1,
            max: 10
        },
    }
};