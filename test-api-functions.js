// Test script for the new API functions
// Run with: node test-api-functions.js

const { fetchUsersByDivision, approveUser } = require('./src/services/userService');
const { TasksService } = require('./src/services/tasksService');

async function testAPIs() {
  console.log('Testing API functions...');

  try {
    // Test 1: Get users by division (without year - should return counts)
    console.log('\n1. Testing fetchUsersByDivision (counts)...');
    const divisionId = '00000000-0000-0000-0000-000000000000'; // Replace with real ID
    const counts = await fetchUsersByDivision(divisionId);
    console.log('Counts result:', counts);

    // Test 2: Get users by division (with year - should return users)
    console.log('\n2. Testing fetchUsersByDivision (users for year 2025)...');
    const users = await fetchUsersByDivision(divisionId, 2025);
    console.log('Users result:', users);

    // Test 3: Approve user (this will fail without admin token, but tests the function)
    console.log('\n3. Testing approveUser...');
    try {
      const approveResult = await approveUser('test-user-id', 'SISWA');
      console.log('Approve result:', approveResult);
    } catch (error) {
      console.log('Approve error (expected without auth):', error.message);
    }

    // Test 4: Get task submission
    console.log('\n4. Testing getTaskSubmissionByTaskId...');
    try {
      const submission = await TasksService.getTaskSubmissionByTaskId('test-task-id');
      console.log('Submission result:', submission);
    } catch (error) {
      console.log('Submission error (expected):', error.message);
    }

    // Test 5: Update submission status
    console.log('\n5. Testing updateSubmissionStatus...');
    try {
      const updateResult = await TasksService.updateSubmissionStatus(
        'test-task-id',
        'test-user-id',
        'APPROVED',
        'Good work!'
      );
      console.log('Update result:', updateResult);
    } catch (error) {
      console.log('Update error (expected without auth):', error.message);
    }

    console.log('\nAll tests completed!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPIs();
}

module.exports = { testAPIs };