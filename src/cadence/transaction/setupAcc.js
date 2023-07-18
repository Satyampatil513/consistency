export const setup = `

import ConsisToken2 from 0x5ac7c03ddd8bf0d0

// This transaction configures an account to store and receive tokens defined by
// the ConsisToken contract.
transaction {
	prepare(acct: AuthAccount) {
		// Create a new empty Vault object
		let vaultA <- ConsisToken2.createEmptyVault()
			
		// Store the vault in the account storage
		acct.save<@ConsisToken2.Vault>(<-vaultA, to: /storage/CadenceFungibleTokenTutorialVault)

    log("Empty Vault stored")

    // Create a public Receiver capability to the Vault
		let ReceiverRef = acct.link<&ConsisToken2.Vault{ConsisToken2.Receiver, ConsisToken2.Balance}>(/public/CadenceFungibleTokenTutorialReceiver, target: /storage/CadenceFungibleTokenTutorialVault)

    log("References created")
	}

    post {
        // Check that the capabilities were created correctly
        getAccount(0x5ac7c03ddd8bf0d0).getCapability<&ConsisToken2.Vault{ConsisToken2.Receiver}>(/public/CadenceFungibleTokenTutorialReceiver)
                        .check():  
                        "Vault Receiver Reference was not created correctly"
    }
}
`