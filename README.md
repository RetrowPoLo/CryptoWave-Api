![Uptime Robot Status](https://img.shields.io/uptimerobot/status/m793532837-183edab2f183d5b96e8d2653)

# CryptoWave Icons Api

This API allows you to request cryptocurrency icons by symbol.

When you sends a request to the API with a symbol as a parameter, the API looks for an icon file with the same name as the symbol.
If the file exists, it is sent back as a response.
If the file does not exist, the API checks if the symbol has already been recorded in a text file.
If the symbol is not in the text file, it is added to the file.
In either case, a default icon is sent back as a response.

This API could be useful for developers who are building applications that display information about cryptocurrencies and want to include icons for each currency.
It allows you to easily retrieve icons for the cryptocurrencies they are interested in without having to worry about finding and storing the icons yourself.

## API Reference

### Get health

```sh
    GET https://cryptowave-api.onrender.com/
```

| Parameter | Type   | Description                 | Response                    |
| :-------- | :----- | :-------------------------- | :-------------------------- |
| `none`    | `none` | Check if the api is running | CryptoWaveAPI is running ✅ |

### Get item

```sh
  GET https://cryptowave-api.onrender.com/icon/:symbol
```

| Parameter | Type     | Description                           | Example        | Response |
| :-------- | :------- | :------------------------------------ | :------------- | :------- |
| `symbol`  | `string` | **Required**. Symbol of item to fetch | btc, eth, usdt | PNG      |

#### Request example

```sh
  GET https://cryptowave-api.onrender.com/icon/btc
```

![Btc logo example](Icons/btc.png)

## Run Locally

Clone the project

```bash
  git clone https://github.com/RetrowPoLo/CryptoWave-Api.git
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Additional Information

First request may take a bit longer to send a response due to the hosting.

I'm using Render.com free plan to deploy a webservice so after 15mins of inactivity, the service shut down waiting for a new request to process.

So it might take 30s to 1mn to get a response.

## 🛠 Tech Stack

NodeJs, Express
