const environments = {
  development: {
    database: {
      host: process.env.DB_HOST || 'vagus-app-mysql-dev.mysql.database.azure.com',
      port: process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'vagusadmin',
      password: process.env.DB_PASSWORD || 'Vagus@2024!',
      database: process.env.DB_NAME || 'vagusdb',
      dialect: 'mysql',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    storage: {
      accountName: process.env.STORAGE_ACCOUNT || 'vagusappstoragedev',
      accountKey: process.env.STORAGE_KEY,
      containerName: 'uploads'
    },
    cors: {
      origin: ['http://localhost:3000', 'https://vagus-app-frontend-dev.azurewebsites.net'],
      credentials: true
    },
    port: process.env.PORT || 5000
  },
  
  production: {
    database: {
      host: process.env.DB_HOST || 'vagus-app-mysql-prod.mysql.database.azure.com',
      port: process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'vagusadmin',
      password: process.env.DB_PASSWORD || 'Vagus@2024!',
      database: process.env.DB_NAME || 'vagusdb',
      dialect: 'mysql',
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    },
    storage: {
      accountName: process.env.STORAGE_ACCOUNT || 'vagusappstorageprod',
      accountKey: process.env.STORAGE_KEY,
      containerName: 'uploads'
    },
    cors: {
      origin: ['https://vagus-app-frontend-prod.azurewebsites.net'],
      credentials: true
    },
    port: process.env.PORT || 5000
  }
};

const currentEnv = process.env.NODE_ENV || 'development';
module.exports = environments[currentEnv]; 