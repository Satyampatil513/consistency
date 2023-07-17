export const update = `
import consistify from 0x292b0c4a1d0f19a8
transaction(value: Int,addr: Address,url: String, day: Int) {

  prepare(acct: AuthAccount) {

   consistify.appendValue(account: addr,url: url, value: value,day: day)
  }

  execute {
    //log(HelloWorld.hello())
    log("value updated")
  }
}

`