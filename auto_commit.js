const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration constants
const START_DATE = new Date('2024-09-21'); // Change to your desired start date
const END_DATE = new Date('2025-01-18'); // Change to your desired end date
const GIT_IGNORE_FILE = '.gitignore';

// Utility to execute shell commands
const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}\nError: ${error.message}`);
  }
};

// Get list of files not ignored by git
const getTrackedFiles = () => {
  const result = execSync('git ls-files --others --exclude-standard').toString();
  return result.split('\n').filter((file) => file.trim() !== '');
};

// Generate a list of commit dates spread between the start and end date
const generateCommitDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    // Increment the date by 1-5 days randomly
    const dayIncrement = Math.floor(Math.random() * 2) + 1;
    currentDate.setDate(currentDate.getDate() + dayIncrement);
  }
  return dates;
};

// Main function
const automateCommits = () => {
  const files = getTrackedFiles();

  if (files.length === 0) {
    console.log('No files to commit.');
    return;
  }

  const commitDates = generateCommitDates(START_DATE, END_DATE);
  let fileIndex = 0;

  for (const date of commitDates) {
    if (fileIndex >= files.length) break;

    // Commit between 1 to 5 files randomly
    const commitCount = Math.min(Math.floor(Math.random() * 5) + 1, files.length - fileIndex);
    const filesToCommit = files.slice(fileIndex, fileIndex + commitCount);
    fileIndex += commitCount;

    // Stage files
    filesToCommit.forEach((file) => runCommand(`git add "${file}"`));

    // Commit with a message
    const commitMessage = `made changes to : ${filesToCommit.join(', ')}`;
    runCommand(`GIT_AUTHOR_DATE="${date.toISOString()}" GIT_COMMITTER_DATE="${date.toISOString()}" git commit -m "${commitMessage}"`);

    console.log(`Committed: ${commitMessage}`);
  }

  console.log('All specified commits are complete.');
};

// Ensure script is run from the correct directory
if (!fs.existsSync(GIT_IGNORE_FILE)) {
  console.error('Please run this script from the root of your git repository.');
  process.exit(1);
}

// Run the commit automation
automateCommits();
