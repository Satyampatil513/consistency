export const showUrls = `
import consistency2 from 0x292b0c4a1d0f19a8
pub fun main(account: Address):  [String]? {
  return consistency2.show(account: account)?.keys
}
`