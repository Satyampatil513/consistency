import React, { useState, useEffect, useRef } from 'react';
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

const UrlComponent = ({ user, url ,time}) => {
  const [Days, setDays] = useState();
  const [Target, setTarget] = useState();
  const [Array,setArray] = useState();
  const [Current,setCurrent] = useState(1);
  const [Reward,setReward] = useState();
  const [diff, setDiff] = useState();
  const [Status,setStatus] = useState();
  console.log(url,time);
  const barChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
      },
    },
    maintainAspectRatio: false, // This property will prevent the chart from maintaining the aspect ratio, allowing you to manually set the width and height.
    responsive: false, // This property will prevent the chart from being responsive to its container.
    aspectRatio: 1, // Set the aspect ratio to 1 to enforce a square-shaped chart.
    width: 200, // Set the width of the chart to 200 pixels.
    height: 200, // Set the height of the chart to 200 pixels.
  };

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
      fcl.args([fcl.arg(parseInt(time),fcl.t.Int),fcl.arg(user.addr,fcl.t.Address),fcl.arg(url,fcl.t.String),fcl.arg(parseInt(diff),fcl.t.Int)]),
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
          fcl.arg('0x5ac7c03ddd8bf0d0', fcl.t.Address),
          fcl.arg(user.addr, fcl.t.Address),
          fcl.arg(Reward, fcl.t.Int),
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
  const barChartRef = useRef(null);

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
    if (barChartRef.current) {
      barChartRef.current.resize(3,4); // Step 3: Call resize after rendering
    }
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
          ref={barChartRef}
          data={{
            labels: Array.map((_, index) => index + 1),
            datasets: [
              {
                label: 'Your Daily updates',
                data: Array,
                backgroundColor: 'green',
              },
            ],
          }}
          options={barChartOptions} // Attach the options to the Bar component
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
