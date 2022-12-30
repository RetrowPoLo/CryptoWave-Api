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

#### Get item

```http
  GET https://cryptowave-api.onrender.com/icon/:symbol
```

| Parameter | Type     | Description                       | Example | Response |
| :-------- | :------- | :-------------------------------- | :------- | :------- |
| `symbol`      | `string` | **Required**. Symbol of item to fetch | btc, eth, usdt | PNG |

#### Request example

```http
  GET https://cryptowave-api.onrender.com/icon/btc
```
![Btc logo example](Icons/btc.png)

