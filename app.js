const express = require('express');
const fs = require('fs');

// Create a new Express app
const app = express();

// Initialize an array to store the names of missing cryptos
let missingCryptos = [];

if (fs.existsSync('missing-cryptos.txt')) {
	// If the file exists, read the contents and split it into an array of strings
	missingCryptos = fs.readFileSync('missing-cryptos.txt', 'utf8').split('\n');
}

// GET route for the root path
app.get('/', (req, res) => {
	res.send('CryptoWaveAPI is running ✅ ');
});

// GET route for the icon path
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
			// If the file does not exist, check if the symbol is already in the missingCryptos array
			if (!missingCryptos.includes(symbol)) {
				// If the symbol is not in the array, add it to the array and write the array to the 'missing-cryptos.txt' file
				missingCryptos.push(symbol);
				fs.writeFileSync('missing-cryptos.txt', missingCryptos.join('\n'));
			}
			// Send the 'generic.png' icon as a response with cache-control headers set to cache the file for one day
			res.setHeader('Cache-Control', 'public, max-age=86400');
			res.sendFile(__dirname + '/Icons/generic.png');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			error: 'An error occurred while handling the request',
		});
	}
});

// Start the server on port 3000
app.listen(3000, () => console.log('CryptoWaveAPI listening on port 3000'));
