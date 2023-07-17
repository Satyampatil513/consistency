export const create = `
import consistify from 0x292b0c4a1d0f19a8
transaction(target: Int,hour: Int,addr: Address, url: String, current: String) {

  prepare(acct: AuthAccount) {

   consistify.createAcc(account: addr,url: url, v: target, t: hour,current: current)
  }

  execute {
    //log(HelloWorld.hello())
    log("account created")
  }
}

`