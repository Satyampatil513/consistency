const target = `
import consistify from 0x292b0c4a1d0f19a8
pub fun main(account: Address,url: String): AnyStruct {
  return consistify.show(account: account)![url]!.target
}


`
module.exports = { target };