export const del = `
import consistify from 0x292b0c4a1d0f19a8
transaction(addr: Address, url: String) {

  prepare(acct: AuthAccount) {

   consistify.delete(account: addr,url: url)
  }

  execute {
    //log(HelloWorld.hello())
    log("account deleted")
  }
}

`