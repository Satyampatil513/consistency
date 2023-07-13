import logo from './logo.svg';
import './App.css';
import * as fcl from '@onflow/fcl'
import React,{useState} from 'react'

import { create } from './cadence/transaction/create';
import { showUrls } from './cadence/script/showurls';
import { array } from './cadence/script/showarray';
import { days } from './cadence/script/days';
import { target } from './cadence/script/target';
import { reward } from './cadence/script/reward';
import { current } from './cadence/script/current';
import { update } from './cadence/transaction/update';

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
      fcl.args([fcl.arg(parseInt(temp.days),fcl.t.Int),fcl.arg(parseInt(temp.hour),fcl.t.Int),fcl.arg(user.addr,fcl.t.Address),fcl.arg(temp.url,fcl.t.String)]),
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
  const showDays = async () =>{
    console.log(user.addr, temp.url)
    // const array1 = await fcl.send([
    //   fcl.script(array), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    // ]).then(fcl.decode)

    // setArray(array1)
    // console.log(array1)
    const reward1 = await fcl.send([
      fcl.script(days), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    ]).then(fcl.decode)

    setDays(reward1)
    console.log(reward1)

    // const day1 = await fcl.send([
    //   fcl.script(days), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    // ]).then(fcl.decode)

    // setDays(day1)
    // console.log(day1)
  }
  const showurl = async () =>{
    console.log(user.addr)
    const result = await fcl.send([
      fcl.script(showUrls), fcl.args([fcl.arg(user.addr, fcl.t.Address)])
    ]).then(fcl.decode)

    seturls(result)
    console.log(result)
  }
  const showtarget = async () =>{
    console.log(user.addr, temp.url)
    const result = await fcl.send([
      fcl.script(target), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    ]).then(fcl.decode)

    setTarget(result)
    console.log(result)
  }
  const showarray = async () =>{
    console.log(user.addr, temp.url)
    const result = await fcl.send([
      fcl.script(array), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    ]).then(fcl.decode)

    setArray(result)
    console.log(result)
  }
  const showcurrent = async () =>{
    console.log(user.addr, temp.url)
    const result = await fcl.send([
      fcl.script(current), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    ]).then(fcl.decode)

    setCurrent(result)
    console.log(result)
  }
  const showreward = async () =>{
    console.log(user.addr, temp.url)
    const result = await fcl.send([
      fcl.script(reward), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(temp.url, fcl.t.String)])
    ]).then(fcl.decode)

    setReward(result)
    console.log(result)
  }


return (
    <div className="App">
      <h1>Earn being consistent</h1>
      <button onClick={()=>logIn()}>Login kr bhai pehle</button>

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
        <button onClick={()=>handleSubmit()}>Submit</button>
        <button onClick={()=>showurl()}>Get Urls</button>
        <button onClick={()=>showDays()}>Total no of Days</button>
        <button onClick={()=>showtarget()}> Get Target</button>
        <button onClick={()=>showarray()}> get array of particular url</button>
        <button onClick={()=>showcurrent()}> show Current Day</button>
        <button onClick={()=>showreward()}> show Reward</button>
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
