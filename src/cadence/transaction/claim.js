export const claim = `
import ConsisToken from 0x292b0c4a1d0f19a8

transaction(sender: Address, recipient: Address, amount: UFix64) {

    let senderVaultRef: &ConsisToken.Vault{ConsisToken.Provider}

    prepare(acct: AuthAccount) {
        self.senderVaultRef = acct.borrow<&ConsisToken.Vault{ConsisToken.Provider}>(from: /storage/CadenceFungibleTokenTutorialVault)
            ?? panic("Could not borrow a reference to the sender's vault")
    }

    execute {
        // Withdraw the tokens from the sender's vault
        let transferredVault <- self.senderVaultRef.withdraw(amount: amount)

        // Get the recipient's Receiver reference to their vault
        let recipientRef = getAccount(recipient)
            .getCapability<&{ConsisToken.Receiver}>(
                /public/CadenceFungibleTokenTutorialReceiver
            )
            .borrow()
            ?? panic("Could not borrow a reference to the recipient")

        // Deposit the withdrawn tokens into the recipient's vault
        recipientRef.deposit(from: <-transferredVault)

        log("Transfer succeeded!")
    }
}

pub fun main() {}
`