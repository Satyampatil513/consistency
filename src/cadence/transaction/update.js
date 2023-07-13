export const update = `
import consistency2 from 0x292b0c4a1d0f19a8
transaction(value: Int,url: String,addr: Address) {

  prepare(acct: AuthAccount) {

   consistency2.appendValue(account: addr,url: url, value: value)
  }

  execute {
    //log(HelloWorld.hello())
    log("value updated")
  }
}
`