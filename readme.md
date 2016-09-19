# Setup
## Install
```
npm install
npm install browserify -g
```
# Use in Browser

## Build
```
npm run-script browser
```
or
```
browserify hd-bitauth.js --standalone bitauth > hd-bitauth-browser.js
```
## Use
```
<script src="hd-bitauth-browser.js" ></script>
```


# Use in Node
```
var hd-bitauth = require("./hd-bitauth.js")
var authenticated = hd-bitauth.bitcoin.message.verify(req.body.address.toString(), JSON.parse(req.body.signature), "SomeMsgToSign", hd-bitauth.bitcoin.networks.bitcoin)
```