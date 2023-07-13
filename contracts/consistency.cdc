pub contract consistency2 {

    pub struct Variables {
        pub var noOfDays: Int
        pub var dataArray: [Int]
        pub var target: Int
        pub var currentDay: Int
        pub var reward: Int

        init(val: Int, tar: Int) {
            self.reward = 0
            self.noOfDays = val
            var a = 0;
            self.dataArray = []
            while a < val {
                self.dataArray.append(0)
                a = a + 1
            }
            self.target = tar
            self.currentDay = 0
        }

        pub fun sendData(val: Int): Int {
            self.dataArray[self.currentDay] = val
            self.currentDay = self.currentDay + 1
            var a = 0
            while a < self.noOfDays {
                if self.dataArray[a] < self.target {
                    return 0
                }
                a = a + 1
            }
            self.reward = self.noOfDays / 2
            return self.reward
        }
    }

    pub var accountVariables: {Address: {String: Variables}}

    init() {
        self.accountVariables = {}
    }

    pub fun createAcc(account: Address, url: String, v: Int, t: Int) {
        if var map2 = self.accountVariables[account] {
            map2[url] = Variables(val: v, tar: t)
            self.accountVariables[account] = map2
        } else {
            self.accountVariables[account] = {url: Variables(val: v, tar: t)}
        }
    }

    pub fun appendValue(account: Address, url: String, value: Int) {
      self.accountVariables[account]![url]!.sendData(val: value)
    }

    pub fun show(account: Address): {String: Variables}? {
        return self.accountVariables[account]
    }
}
