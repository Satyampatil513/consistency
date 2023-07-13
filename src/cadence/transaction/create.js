export const create = `
import consistency2 from 0x292b0c4a1d0f19a8
transaction(target: Int,hour: Int,addr: Address, url: String) {

  prepare(acct: AuthAccount) {

   consistency2.createAcc(account: addr,url: url, v: target, t: hour)
  }

  execute {
    //log(HelloWorld.hello())
    log("account created")
  }
}

`