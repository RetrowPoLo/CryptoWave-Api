const express = require('express');
const fs = require('fs');
const simpleGit = require('simple-git');

// Create a new Express app
const app = express();

// Initialize an array to store the names of missing cryptos
let missingCryptos = [];

if (fs.existsSync('missing-cryptos.txt')) {
	// If the file exists, read the contents and split it into an array of strings
	missingCryptos = fs.readFileSync('missing-cryptos.txt', 'utf8').split('\n');
}

// Async function to switch to the specified branch
async function gitSwitchBranch() {
	await simpleGit().checkout('test-branch');
}

// Async function to pull the latest changes from the specified branch
async function gitPullChanges() {
	await simpleGit().pull();
}

// Async function to add and commit a missing crypto icon file
async function gitAddCommit(crypto) {
	await simpleGit().add('missing-cryptos.txt');
	await simpleGit().commit(`Add missing crypto icons ${crypto}`);
}

// Async function to push the changes to the specified branch
async function gitPushChanges() {
	await simpleGit().push('origin', 'test-branch');
}

// Async Function to handle git actions and catch any errors
async function handleGitAction(gitAction) {
	try {
		await gitAction();
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'Failed to execute git action' });
	}
}

app.get('/icon/:symbol', async (req, res) => {
	try {
		// Get the crypto symbol from the request parameters
		const symbol = req.params.symbol;

		// Construct the path to the crypto icon file
		const filePath = __dirname + '/Icons/' + symbol + '.png';

		// Check if the icon file exists
		if (fs.existsSync(filePath)) {
			// If the file exists, send it as a response with cache-control headers set to cache the file for one day
			res.setHeader('Cache-Control', 'public, max-age=86400');
			res.sendFile(filePath);
		} else {
			// Switch the git branch
			await handleGitAction(gitSwitchBranch);

			// Pull any changes from the current git branch
			await handleGitAction(gitPullChanges);

			// If the file does not exist, check if the symbol is already in the missingCryptos array
			if (!missingCryptos.includes(symbol)) {
				// If the symbol is not in the array, add it to the array and write the array to the 'missing-cryptos.txt' file
				missingCryptos.push(symbol);
				fs.writeFileSync('missing-cryptos.txt', missingCryptos.join('\n'));
			}
			// Send the 'generic.png' icon as a response with cache-control headers set to cache the file for one day
			res.setHeader('Cache-Control', 'public, max-age=86400');
			res.sendFile(__dirname + '/Icons/generic.png');

			// Add and commit file to the branch
			await handleGitAction(gitAddCommit(symbol));

			// Push the change to the branch
			await handleGitAction(gitPushChanges);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'An error occurred while handling the request' });
	}
});

// Start the server on port 3000
app.listen(3000, () => console.log('CryptoWaveAPI listening on port 3000'));
