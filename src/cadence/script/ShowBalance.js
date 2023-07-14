import ConsisToken from 0x01

// This script reads the Vault balances of two accounts.
pub fun main() {
    // Get the accounts' public account objects
    let acct1 = getAccount(0x01)
   // let acct2 = getAccount(0x02)

    // Get references to the account's receivers
    // by getting their public capability
    // and borrowing a reference from the capability
    let acct1ReceiverRef = acct1.getCapability<&ConsisToken.Vault{ConsisToken.Balance}>(/public/MainReceiver)
        .borrow()
        ?? panic("Could not borrow a reference to the acct1 receiver")

   // let acct2ReceiverRef = acct2.getCapability<&ConsisToken.Vault{ConsisToken.Balance}>(/public/MainReceiver)
   //     .borrow()
   //     ?? panic("Could not borrow a reference to the acct2 receiver")

    // Read and log balance fields
    log("Account Balance")
    log(acct1ReceiverRef.balance)
    log("Account 2 Balance")
    log(acct2ReceiverRef.balance)
}
