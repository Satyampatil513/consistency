import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
// import BarGraph from './Histogram';

import { array } from './cadence/script/showarray';
import { days } from './cadence/script/days';
import { target } from './cadence/script/target';
import { reward } from './cadence/script/reward';
import { del } from './cadence/transaction/delete';
import { update } from './cadence/transaction/update';
import { current } from './cadence/script/current';
import { Bar } from "react-chartjs-2";
import { claim } from './cadence/transaction/claim';
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Legend,
Title,
Tooltip
);

const UrlComponent = ({ user, url }) => {
  const [Days, setDays] = useState();
  const [Target, setTarget] = useState();
  const [Array,setArray] = useState();
  const [Current,setCurrent] = useState(1);
  const [Reward,setReward] = useState();
  const [diff, setDiff] = useState();
  const [Status,setStatus] = useState();


  const dele = async () => {
    const transactionId = await fcl.send([
      fcl.transaction(del),
      fcl.args([fcl.arg(5,fcl.t.Int),fcl.arg(user.addr,fcl.t.Address),fcl.arg(url,fcl.t.String)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }

  const upd = async () => {
    setDiff(calculateDifferenceInDays());
    const transactionId = await fcl.send([
      fcl.transaction(update),
      fcl.args([fcl.arg(7,fcl.t.Int),fcl.arg(user.addr,fcl.t.Address),fcl.arg(url,fcl.t.String),fcl.arg(parseInt(diff),fcl.t.Int)]),
      fcl.payer(fcl.authz),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(9999)
    ]).then(fcl.decode)
    console.log(transactionId)
    
  }

  const claimReward = async () => {
    try {
      const transactionId = await fcl.send([
        fcl.transaction(claim),
        fcl.args([
          fcl.arg(0x292b0c4a1d0f19a8, fcl.t.Address),
          fcl.arg(user.addr, fcl.t.Address),
          fcl.arg(Reward, fcl.t.UFix64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
      
      console.log('Reward claimed:', transactionId);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };
  

  const calculateDifferenceInDays = () => {
    const created = new Date(Current);
    const today = new Date().toLocaleDateString();
    const day2 = new Date(today);
    const differenceInTime =  Math.abs(day2 - created);
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays; // Round down to get an integer value
  };
  const fetchDataForUrl = async () => {
    try {
        
        console.log(user.addr, url)
        const curr = await fcl.send([
            fcl.script(current), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(url, fcl.t.String)])
          ]).then(fcl.decode)
      
          setCurrent(curr)
          console.log(curr)
        const reward1 = await fcl.send([
          fcl.script(days), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(url, fcl.t.String)])
        ]).then(fcl.decode)
    
        setDays(reward1)
        console.log(reward1)
      // Fetch data for each URL using the 'url' parameter
      console.log(user.addr, url)
      const rew = await fcl.send([
        fcl.script(reward), fcl.args([fcl.arg(user.addr, fcl.t.Address),fcl.arg(url, fcl.t.String)])
      ]).then(fcl.decode)
  
      setReward(rew)
      console.log(rew)
      console.log(user.addr, url)
      const arr = await fcl.send([
        fcl.script(array),
        fcl.args([fcl.arg(user.addr, fcl.t.Address), fcl.arg(url, fcl.t.String)])
      ]).then(fcl.decode);

      const formattedData = arr.map((str) => parseInt(str, 10));
      setArray(formattedData);
      console.log(formattedData)
      const tar = await fcl.send([
        fcl.script(target),
        fcl.args([fcl.arg(user.addr, fcl.t.Address), fcl.arg(url, fcl.t.String)])
      ]).then(fcl.decode);

      setTarget(tar);
      // ... Fetch other data specific to the URL ...

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataForUrl();

  }, []);
  return (
    <div>
      <h2>URL: {url}</h2>
      <p>Target Hours per Day: {Target}</p>
      <p>Total Days: {Days}</p>
      <p>Status {Array}</p>
      <p> Reward : {Reward}</p>
      {Reward > 0 && <button onClick={claimReward}>Claim Reward</button>}
      <p> Task Created on: {Current}</p>
      {Array && Array.length > 0 ? (
        <Bar
          data={{
            labels: Array.map((_, index) => index + 1),
            datasets: [
              {
                label: 'Your Daily updates',
                data: Array,
                backgroundColor: 'green',
              }
            ],
          }}
        />
      ) : (
        <p>No data available for the bar chart.</p>
      )}
      <button onClick={()=>upd()}>Update todays hours</button>
      <button onClick={()=>dele()}>Delete Task</button>
      {/* Display other data specific to the URL */}
    </div>
  );
};

export default UrlComponent;
