document.addEventListener("DOMContentLoaded", function() {
    const mohitDiv = document.getElementById("mohit");
    const add = localStorage.getItem("walletAddress");
  
    if (add) {
      const htmlContent = `<p>Wallet Address: ${add}</p>`;
      mohitDiv.innerHTML = htmlContent;
      addUpdateButton();
    } else {
      const htmlContent = `
        <input type="text" id="wallet-address" placeholder="Enter your wallet address">
        <button id="save-button">Save Wallet Address</button>
      `;
      mohitDiv.innerHTML = htmlContent;
  
      const walletAddressInput = document.getElementById("wallet-address");
      const saveButton = document.getElementById("save-button");
  
      saveButton.addEventListener("click", function() {
        const walletAddress = walletAddressInput.value.trim();
        if (walletAddress !== "") {
          localStorage.setItem("walletAddress", walletAddress);
          const updatedContent = `<p>Wallet Address: ${walletAddress}</p>`;
          mohitDiv.innerHTML = updatedContent;
          addUpdateButton();
        }
      });
    }
  });
  
  function addUpdateButton() {
    const updateButton = document.createElement("button");
    updateButton.textContent = "Start Mining Rewards";
    updateButton.id = "update-button";
    const mohitDiv = document.getElementById("mohit");
    mohitDiv.appendChild(updateButton);
  
    updateButton.addEventListener("click", function() {
      setAllData();
    });
  }
  
  function setAllData() {
    var walletAddress = localStorage.getItem('walletAddress')
    if(walletAddress){
        fetch(`http://localhost:3001/urls/${walletAddress}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Data received from the server:', data);
        //   localStorage.setItem('walletAddress', data.address);
          localStorage.setItem('URL1', data.result[0]);
          localStorage.setItem('URL2', data.result[1]);
          localStorage.setItem('URL3', data.result[2]);
          localStorage.setItem('target1', data.target[0]);
          localStorage.setItem('target2', data.target[1]);
          localStorage.setItem('target3', data.target[2]);
        })
        .catch((error) => console.error(error));
    }

}