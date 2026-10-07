require('dotenv').config();
const mssql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: process.env.NODE_ENV === 'development'
    }
};

async function run() {
    try {
        await mssql.connect(config);
        const schemaPath = path.join(__dirname, 'src', 'models', 'sql-schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Handle GO statements by splitting the script
        const batches = schema.split(/^\s*GO\s*$/im);
        for (let batch of batches) {
            batch = batch.trim();
            if (batch) {
                console.log('Executing batch...');
                await mssql.query(batch);
            }
        }
        console.log('Schema initialized successfully!');
    } catch (err) {
        console.error('Error initializing schema:', err);
    } finally {
        await mssql.close();
    }
}

run();
