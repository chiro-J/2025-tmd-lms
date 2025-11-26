const { Client } = require('pg');

async function seedLearningData() {
  const client = new Client({
    host: process.env.DB_HOST || '192.168.0.203',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'lms',
    user: process.env.DB_USERNAME || 'lms_team',
    password: process.env.DB_PASSWORD || 'monstera',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Find first student user
    const userResult = await client.query(
      "SELECT id, name FROM users WHERE role = 'student' LIMIT 1"
    );

    if (userResult.rows.length === 0) {
      console.error('❌ No student user found. Please create a student user first.');
      return;
    }

    const student = userResult.rows[0];
    console.log(`📚 Using student: ${student.name} (ID: ${student.id})`);

    // Get current date and calculate week dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get Monday of this week
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() + mondayOffset);

    // Get Monday of last week
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);

    // Mock data (in hours) - matching the frontend mock data
    const lastWeekHours = [2.5, 3.2, 1.8, 4.5, 3.0, 1.5, 0.5]; // 월~일
    const thisWeekHours = [1.5, 2.8, 3.5, 0, 0, 0, 0]; // 월~일 (수요일까지만 데이터)

    console.log('\n=== 📊 Seeding Last Week Data ===');
    // Seed last week data
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayLastWeek);
      date.setDate(mondayLastWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const hours = lastWeekHours[i];
      const totalSeconds = Math.round(hours * 3600);

      // Upsert (insert or update)
      await client.query(
        `INSERT INTO daily_learning_summary (user_id, date, total_seconds, session_count)
         VALUES ($1, $2, $3, 1)
         ON CONFLICT (user_id, date)
         DO UPDATE SET total_seconds = $3, session_count = 1`,
        [student.id, dateStr, totalSeconds]
      );

      console.log(`  ✓ ${dateStr}: ${hours} hours (${totalSeconds} seconds)`);
    }

    console.log('\n=== 📊 Seeding This Week Data ===');
    // Seed this week data
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayThisWeek);
      date.setDate(mondayThisWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const hours = thisWeekHours[i];

      // Skip days with 0 hours (no data)
      if (hours === 0) {
        console.log(`  ⊘ ${dateStr}: no data (skipped)`);
        continue;
      }

      const totalSeconds = Math.round(hours * 3600);

      // Upsert (insert or update)
      await client.query(
        `INSERT INTO daily_learning_summary (user_id, date, total_seconds, session_count)
         VALUES ($1, $2, $3, 1)
         ON CONFLICT (user_id, date)
         DO UPDATE SET total_seconds = $3, session_count = 1`,
        [student.id, dateStr, totalSeconds]
      );

      console.log(`  ✓ ${dateStr}: ${hours} hours (${totalSeconds} seconds)`);
    }

    console.log('\n✅ Learning mock data seeded successfully!');
    console.log(`\n📅 Week Summary:`);
    console.log(`   Last week: ${mondayLastWeek.toISOString().split('T')[0]} ~ ${new Date(mondayLastWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
    console.log(`   This week: ${mondayThisWeek.toISOString().split('T')[0]} ~ ${new Date(mondayThisWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
    console.log(`\n💡 You can now test the weekly activity graph with real data!`);

  } catch (error) {
    console.error('❌ Error seeding learning data:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedLearningData();
