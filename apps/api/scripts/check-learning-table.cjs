const { Client } = require('pg');

async function checkTable() {
  const client = new Client({
    host: process.env.DB_HOST || '192.168.0.203',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'lms',
    user: process.env.DB_USERNAME || 'lms_team',
    password: process.env.DB_PASSWORD || 'monstera',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'daily_learning_summary'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Table "daily_learning_summary" does not exist!\n');
      console.log('You may need to run migrations or create the table first.');
      return;
    }

    console.log('✅ Table "daily_learning_summary" exists\n');

    // Get table structure
    console.log('📋 Table Structure:');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'daily_learning_summary'
      ORDER BY ordinal_position;
    `);

    console.table(columns.rows);

    // Count total records
    const count = await client.query('SELECT COUNT(*) FROM daily_learning_summary');
    console.log(`\n📊 Total records: ${count.rows[0].count}\n`);

    // Show sample data (last 5 records)
    const sample = await client.query(`
      SELECT
        id,
        user_id,
        date::text as date,
        total_seconds,
        ROUND(total_seconds::numeric / 3600, 2) as hours,
        session_count
      FROM daily_learning_summary
      ORDER BY date DESC
      LIMIT 5;
    `);

    if (sample.rows.length > 0) {
      console.log('📝 Sample data (last 5 records):');
      console.table(sample.rows);
    } else {
      console.log('⚠️  No data in table yet. Run "npm run db:seed-learning-mock" to insert test data.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTable();
