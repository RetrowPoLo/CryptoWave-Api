const express = require('express');
const fs = require('fs');

// Create a new Express app
const app = express();

// Initialize an array to store the names of missing cryptos
let missingCryptos = [];

// Check if the 'missing-cryptos.txt' file exists
if (fs.existsSync('missing-cryptos.txt')) {
	// If the file exists, read the contents and split it into an array of strings
	missingCryptos = fs.readFileSync('missing-cryptos.txt', 'utf8').split('\n');
}

// Set up a route to handle requests for crypto icons
app.get('/cryptowave-api/icon/:symbol', (req, res) => {
	// Get the crypto symbol from the request parameters
	const symbol = req.params.symbol;

	// Construct the path to the crypto icon file
	const filePath = __dirname + '/Icons/' + symbol + '.png';

	// Check if the icon file exists
	if (fs.existsSync(filePath)) {
		// If the file exists, send it as a response
		res.sendFile(filePath);
	} else {
		// If the file does not exist, check if the symbol is already in the missingCryptos array
		if (!missingCryptos.includes(symbol)) {
			// If the symbol is not in the array, add it to the array and write the array to the 'missing-cryptos.txt' file
			missingCryptos.push(symbol);
			fs.writeFileSync('missing-cryptos.txt', missingCryptos.join('\n'));
		}
		// Send the 'generic.png' icon as a response
		res.sendFile(__dirname + '/Icons/generic.png');
	}
});

// Start the server on port 3000
app.listen(3000, () => console.log('CryptoWaveAPI listening on port 3000'));
