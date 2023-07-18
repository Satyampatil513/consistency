import logo from './logo.svg';
import './App.css';
import * as fcl from '@onflow/fcl'
// import React,{useState} from 'react'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { create } from './cadence/transaction/create';
import { showUrls } from './cadence/script/showurls';
import { array } from './cadence/script/showarray';
import { days } from './cadence/script/days';
import { target } from './cadence/script/target';
import { reward } from './cadence/script/reward';
import { current } from './cadence/script/current';
import { update } from './cadence/transaction/update';
import { createacc } from './cadence/transaction/createAcc';
import { setup } from './cadence/transaction/setupAcc';
import UrlComponent from './UrlComponent'; 


// import { BarGraph } from './support/graph';
// 0x292b0c4a1d0f19a8
fcl.config()
 .put("app.detail.title", "My Flow NFT DApp")
//  .put("app.detail.icon", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg")
 .put("accessNode.api", "https://rest-testnet.onflow.org")
 .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
function App() {
  const [user,setUser] = useState();
  const [urls,seturls] = useState();
  const [Days,setDays] = useState();
  const [Target,setTarget] = useState();
  const [Array,setArray] = useState();
  const [Current,setCurrent] = useState();
  const [Reward,setReward] = useState();
  const date = new Date().toLocaleDateString();
  const [temp, setTemp] = useState({
    days: 0, // Set initial value for 'days'
    hour: 0,
    url: "",
    val: 0
  });
  const [hai,setHai] = useState();
  const data = [10, 20, 30, 40, 50];
  const logIn = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
    showurl();

  }
  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevent form submission
  
    // Access form data from state
    const days = temp.days;
    const hour = temp.hour;
    const url = temp.url;
  
    console.log(days, hour, url);
    createAcc();
    // Perform necessary actions with the form data
  };
  const createAcc = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(create),
      fcl.args([fcl.arg(parseInt(temp.days),fcl.t.Int),fcl.arg(parseInt(temp.hour),fcl.t.Int),fcl.arg(user.addr,fcl.t.Address),fcl.arg(temp.url,fcl.t.String),fcl.arg(date,fcl.t.String)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }
  const setup2 = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(setup),
      fcl.args(),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }
  const creater = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(createacc),
      fcl.args(),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }
  const updateVal = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(update),
      fcl.args([fcl.arg(user.addr,fcl.t.Address),fcl.arg(temp.url,fcl.t.String),fcl.arg(temp.val,fcl.t.Int)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }


  const showurl = async () => {
    if (!user || !user.addr) {
      // User is not logged in or user.addr is not available yet
      return;
    }
  
    console.log(user.addr);
    const result = await fcl.send([
      fcl.script(showUrls), fcl.args([fcl.arg(user.addr, fcl.t.Address)])
    ]).then(fcl.decode);
  
    seturls(result);
    console.log(result);
  };
  const recieve = () => {
    axios.get('http://localhost:3001/api/sendtofront')
      .then((response) => console.log(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    recieve();
 

    
  }, []);
  

return (
    <div className="App">
      <h1>Earn being consistent</h1>
      <button onClick={()=>logIn()}>Login kr bhai pehle</button>
      <button onClick={()=>creater()}>Create Acc</button>
      <button onClick={()=>setup2()}>Setup Acc</button>

      <h1>Earn being consistent</h1>
      <h3>Your Address: {user && user.addr? user.addr : ''}</h3>
      <h2>Lets Create Target</h2>
     
        <label>No. of Days<input
  type="number"
  id="days"
  value={temp.days}
  onChange={(event) => setTemp({ ...temp, days: event.target.value })}
/></label>
        <br></br>
        <label>No. of Hour per Day<input
  type="number"
  id="hour"
  value={temp.hour}
  onChange={(event) => setTemp({ ...temp, hour: event.target.value })}
/></label>
        <br></br>
        <label> Url <input
  type="text"
  id="url"
  value={temp.url}
  onChange={(event) => setTemp({ ...temp, url: event.target.value })}
/></label>
        <br></br>
        {urls && urls.map((url, index) => (
        <UrlComponent key={index} user={user} url={url} />
      ))}
        
        <button onClick={()=>handleSubmit()}>Submit</button>


        <br></br>
        <label>Update todays Value<input
  type="number"
  id="hour"
  value={temp.val}
  onChange={(event) => setTemp({ ...temp, val: event.target.value })}
/></label>
        <button onClick={()=>updateVal()}> update the values</button>
        <h3>Your Urls: {urls ? urls : ''}</h3>
        <label> kiski chanbin kre<input
  type="text"
  id="url"
  value={temp.url}
  onChange={(event) => setTemp({ ...temp, url: event.target.value })}
/></label>
{/* <button onClick={sendDataToServer}>Add New Data</button> */}
<h3>Target Hour: {Target ? Target : 0}</h3>
<h3>Target Day: {Days ? Days : 0}</h3>
<h3>Current Array: {Array ? Array : []}</h3>
<h3>Current Reward: {Reward ? Reward : 0}</h3>
<h3>Current Day: {Current ? Current : 0}</h3>

      
      <br/>  

    </div>
  );
  }


export default App;
