const showUrls = `
import consistify from 0x292b0c4a1d0f19a8
pub fun main(account: Address):  [String]? {
  return consistify.show(account: account)?.keys
}
`
module.exports = { showUrls };