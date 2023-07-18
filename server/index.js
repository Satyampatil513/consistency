const express = require('express');
const bodyParser = require('body-parser');
const fcl = require('@onflow/fcl')
const cors = require('cors');
const app = express();
const port = 3001;
const expressWs = require('express-ws');
expressWs(app);
const { showUrls } = require('../src/cadence/script/showurls.js');
const { target } = require('../src/cadence/script/target.js');
fcl.config()
 .put("app.detail.title", "My Flow NFT DApp")
//  .put("app.detail.icon", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg")
 .put("accessNode.api", "https://rest-testnet.onflow.org")
 .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

app.use(bodyParser.json());
app.use(cors());
const dataToSend = {
    address: '0x9760405165' ,
    url1: 'leetcode.com',
    url2: 'localhost',
    url3: 'www.geeksforgeeks.org'
};
var time ;
var frontend;
app.post('/receive-data/:id', (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    console.log(`Received data from Chrome extension for user with ID ${userId}:`, data);
    time = data;
    app.ws(`/timetrack/${userId}`, (ws, req) => {
        ws.send(JSON.stringify(data));
        console.log(data,'send to frontend');
    });
    res.status(200).json(data);
});

app.get('/urls/:id', async (req, res) => {
    try {
      const addr = req.params.id;
      const result = await fcl.send([
        fcl.script(showUrls),
        fcl.args([fcl.arg(addr, fcl.t.Address)])
      ]);
  
      const decodedResult = await fcl.decode(result);
  
      const target1 = await Promise.all(
        decodedResult.map(async (url) => {
          const targetResult = await fcl.send([
            fcl.script(target),
            fcl.args([fcl.arg(addr, fcl.t.Address), fcl.arg(url, fcl.t.String)])
          ]);
          return await fcl.decode(targetResult);
        })
      );
  
      const responseObj = {
        result: decodedResult,
        target: target1
      };
  
      console.log(target1);
      console.log(decodedResult);
      res.json(responseObj);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      res.status(500).json({ error: 'Error fetching URLs' });
    }
  });
app.get('/api/sendtofront', (req, res) => {
    res.json(time);
    console.log("data sent to front end");
});
app.post('/api/data', (req, res) => {
    const newData = req.body;
    frontend = newData;
    console.log(newData);
    res.json({ message: 'Data received and processed successfully' });
});  
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});