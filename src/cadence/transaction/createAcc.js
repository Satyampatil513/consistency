export const createacc = `
import ConsisToken2 from 0x5ac7c03ddd8bf0d0

// This transaction creates a capability 
// that is linked to the account's token vault.
// The capability is restricted to the fields in the  interface,
// so it can only be used to deposit funds into the account.
transaction {
  prepare(acct: AuthAccount) {

    // Create a link to the Vault in storage that is restricted to the
    // fields and functions in interfaces, 
    // this only exposes the balance field 
    // and deposit function of the underlying vault.
    //
    acct.link<&ConsisToken2.Vault{ConsisToken2.Receiver, ConsisToken2.Balance}>(/public/CadenceFungibleTokenTutorialReceiver, target: /storage/CadenceFungibleTokenTutorialVault)

    log("Public Receiver reference created!")
  }

  post {
    // Check that the capabilities were created correctly
    // by getting the public capability and checking 
    // that it points to a valid object 
    // that implements the  interface
    getAccount(0x5ac7c03ddd8bf0d0).getCapability<&ConsisToken2.Vault{ConsisToken2.Receiver}>(/public/CadenceFungibleTokenTutorialReceiver)
                    .check():
                    "Vault Receiver Reference was not created correctly"
    }
}
`