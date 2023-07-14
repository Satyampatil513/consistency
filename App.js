import './App.css';
import { getTimeForUrlToday } from './webtime-tracker-master/popup.js';
import './webtime-tracker-master/js/config.js'
import './webtime-tracker-master/js/fn.js'
import './webtime-tracker-master/js/storage-local.js'
import './webtime-tracker-master/js/primitive-renderer.js'
// import './webtime-tracker-master/background.js'
import * as fcl from '@onflow/fcl';
import React, { useState, useEffect } from 'react';
// function loadScript(url, callback) {
//   const script = document.createElement('script');
//   script.src = url;
//   script.onload = callback;
//   document.body.appendChild(script);
// }
fcl.config()
  .put("app.detail.title", "My Flow NFT DApp")
  .put("app.detail.icon", "https://raw.githubusercontent.com/ThisIsCodeXpert/Flow-NFT-DApp-Tutorial-Series/main/cats/cat5.svg")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");

function App() {
  const [user, setUser] = useState();
  const [urlInput, setUrlInput] = useState('');
  const [targetDailyTime, setTargetDailyTime] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const [data, setData] = useState([
    // { url: 'https://youtube.com', RealTime: 60, TargetTime: 120, comp: "Not Completed", Days: 12 },
    // { url: 'https://chatgpt.com', RealTime: 60, TargetTime: 120, comp: "Not Completed", Days: 12 },
    // { url: 'https://whatsapp.com', RealTime: 60, TargetTime: 120, comp: "Not Completed", Days: 12 }
  ]);
  const [rew, setRew] = useState([
    // { url: 'https://youtube.com', earning: 60 },
    // { url: 'https://chatgpt.com', earning: 60 },
    // { url: 'https://whatsapp.com', earning: 60 }
  ]);


  useEffect(() => {
    const logIn = async () => {
      await fcl.authenticate();
      fcl.currentUser().subscribe(setUser);
    };

    logIn();
    // loadScript('../popup.js', () => {
    //   // The script has been loaded and executed, you can now use its functions
    //   console.log("bhumesh");
    //   // getTimeForUrlToday('https://example.com');
    // });
    const k = getTimeForUrlToday('https://example.com');
    console.log(k);
    return () => {
      // Clean up any subscriptions or resources if needed
    };
  }, []);
  const handleUrlSubmit = () => {
    if (data.length >= 3) {
      alert('No more URLs can be added.');
      return;
    }

    if (urlInput.trim() === '') {
      alert('Please enter a valid URL.');
      return;
    }

    if (data.some(item => item.url === urlInput)) {
      alert('URL already selected. Please enter a unique URL.');
      return;
    }

    if (targetDailyTime.trim() === '' || isNaN(targetDailyTime)) {
      alert('Please enter a valid target daily time.');
      return;
    }

    if (targetDays.trim() === '' || isNaN(targetDays)) {
      alert('Please enter a valid target days.');
      return;
    }

    setData(prevData => [
      ...prevData,
      {
        url: urlInput,
        RealTime: 0,
        TargetTime: parseInt(targetDailyTime),
        comp: "Not Completed",
        Days: parseInt(targetDays)
      }
    ]);
    setRew(prevRew => [
      ...prevRew,
      {
        url: urlInput,
        earning: 0
      }
    ]);

    setUrlInput('');
    setTargetDailyTime('');
    setTargetDays('');
  };
  return (
    <div className="App">
      {user && user.addr ? (
        <div>
          <h3>Current Address: {user.addr}</h3>
          <h3>Total Earnings</h3>
          <p>Your Net Earning is 500 Consistoken</p>
          <div className="table-container">
          <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Earnings (Consistoken)</th>
            </tr>
          </thead>
          <tbody>
            {rew.map((row, index) => (
              <tr key={index}>
                <td>{row.url}</td>
                <td>{row.earning}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
          <h3>Targets</h3>
          <div className="table-container">
          <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Real Time</th>
              <th>Target Time</th>
              <th>Daily Target</th>
              <th>Days Remaining</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.url}</td>
                <td>{row.RealTime}</td>
                <td>{row.TargetTime}</td>
                <td>{row.comp}</td>
                <td>{row.Days}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
          <h3>Rewards Settings</h3>
          {data.length >= 3 ? (
            <p>No more URLs can be added.</p>
          ) : (
            <div>
            <p>Add URL:</p>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL"
              />
              <br />
              <input
                type="number"
                value={targetDailyTime}
                onChange={(e) => setTargetDailyTime(e.target.value)}
                placeholder="Enter Target Daily Time"
              />
              <br />
              <input
                type="number"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                placeholder="Enter Target Days"
              />
              <br />
              <button onClick={handleUrlSubmit}>Submit</button>
            </div>
          )}
          <p>Warning: Once added, the URL will be deleted after the target number of days.</p>
        </div>
      ) : (
        <h3>Please Login/SignUp for Rewards</h3>
      )}
    </div>
  );
}

export default App;
