const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

// Create a new Express app
const app = express();

// Initialize an array to store the names of missing cryptos
let missingCryptos = [];

// Function to switch to the "missing-cryptos" branch
async function gitSwitchBranch() {
	await exec('git checkout test-branch', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
}

// Function to pull the latest changes
async function gitPullChanges() {
	await exec('git pull', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
}

// Function to add and commit the "missing-cryptos.txt" file
async function gitAddCommit() {
	await exec('git add missing-cryptos.txt && git commit -m "Add missing crypto icons"', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
}

// Function to push the changes to the remote repository
async function gitPushChanges() {
	await exec('git push origin test-branch', (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
}

if (fs.existsSync('missing-cryptos.txt')) {
	// If the file exists, read the contents and split it into an array of strings
	missingCryptos = fs.readFileSync('missing-cryptos.txt', 'utf8').split('\n');
}

app.get('/icon/:symbol', (req, res) => {
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
		// If the file does not exist, check if the symbol is already in the missingCryptos array
		if (!missingCryptos.includes(symbol)) {
			// If the symbol is not in the array, add it to the array and write the array to the 'missing-cryptos.txt' file
			missingCryptos.push(symbol);
			fs.writeFileSync('missing-cryptos.txt', missingCryptos.join('\n'));
		}
		// Send the 'generic.png' icon as a response with cache-control headers set to cache the file for one day
		res.setHeader('Cache-Control', 'public, max-age=86400');
		res.sendFile(__dirname + '/Icons/generic.png');

		gitSwitchBranch();
		gitPullChanges();
		gitAddCommit();
		gitPushChanges();
	}
});

// Start the server on port 3000
app.listen(3000, () => console.log('CryptoWaveAPI listening on port 3000'));
