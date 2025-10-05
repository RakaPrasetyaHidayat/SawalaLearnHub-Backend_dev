import { fetchUsersByDivision } from './src/services/userService.js';

async function run() {
  try {
    console.log('Testing frontend division (counts):');
    const counts = await fetchUsersByDivision('frontend');
    console.log('frontend counts:', counts);
  } catch (e) {
    console.error('frontend error:', e);
  }

  try {
    console.log('Testing ui/ux division (year 2025 - users):');
    const users = await fetchUsersByDivision('ui/ux', 2025);
    console.log('ui/ux users:', users?.length ?? users);
    console.log(users);
  } catch (e) {
    console.error('ui/ux error:', e);
  }
}

run();
