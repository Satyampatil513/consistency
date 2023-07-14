// Setup Account

import ConsisToken from 0x01

// This transaction configures an account to store and receive tokens defined by
// the ConsisToken contract.
transaction {
	prepare(acct: AuthAccount) {
		// Create a new empty Vault object
		let vaultA <- ConsisToken.createEmptyVault()
			
		// Store the vault in the account storage
		acct.save<@ConsisToken.Vault>(<-vaultA, to: /storage/MainVault)

    log("Empty Vault stored")

    // Create a public Receiver capability to the Vault
		let ReceiverRef = acct.link<&ConsisToken.Vault{ConsisToken.Receiver, ConsisToken.Balance}>(/public/MainReceiver, target: /storage/MainVault)

    log("References created")
	}

    post {
        // Check that the capabilities were created correctly
        getAccount(0x02).getCapability<&ConsisToken.Vault{ConsisToken.Receiver}>(/public/MainReceiver)
                        .check():  
                        "Vault Receiver Reference was not created correctly"
    }
}
 
