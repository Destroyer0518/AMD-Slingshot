const { Pool } = require('pg');

// Initialize the PostgreSQL connection pool using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Cloud Run/production usually require SSL logic here if using external managed DBs.
  // We leave it generic per the environment variable.
});

// Catch and log any idle client errors to prevent server crashes
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  /**
   * Transparent SQL Query Wrapper
   * Wraps the raw pool.query for module export, adding query logging during development
   * to strictly monitor what is hitting the database.
   * 
   * @param {string} text - The parameterized SQL query string
   * @param {Array} params - The array of parameter values corresponding to to the query
   */
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      
      // Enforce absolute transparency in development logic
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed Query:', { 
          text, 
          params, 
          duration_ms: duration, 
          rows_returned: res.rowCount 
        });
      }
      
      return res;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Query Failed:', { text, params, error: error.message });
      }
      throw error;
    }
  },
  
  // Expose the raw pool if a specific service needs to check out a client (e.g. for Transactions)
  pool
};
