export const claim = `
import ConsisToken2 from 0x5ac7c03ddd8bf0d0

transaction(sender: Address, recipient: Address, amount: Int) {

    let senderVaultRef: &ConsisToken2.Vault{ConsisToken2.Provider}

    prepare(acct: AuthAccount) {
        self.senderVaultRef = acct.borrow<&ConsisToken2.Vault{ConsisToken2.Provider}>(from: /storage/CadenceFungibleTokenTutorialVault)
            ?? panic("Could not borrow a reference to the sender's vault")
    }

    execute {
        // Withdraw the tokens from the sender's vault
        let transferredVault <- self.senderVaultRef.withdraw(amount: amount)

        // Get the recipient's Receiver reference to their vault
        let recipientRef = getAccount(recipient)
            .getCapability<&{ConsisToken2.Receiver}>(
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