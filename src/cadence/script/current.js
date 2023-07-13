export const current = `
import consistency2 from 0x292b0c4a1d0f19a8
pub fun main(account: Address,url: String): Int {
  return consistency2.show(account: account)![url]!.currentDay
}
`