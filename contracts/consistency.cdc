pub contract consistify {

    pub struct Variables {
        pub var noOfDays: Int
        pub var dataArray: [Int]
        pub var target: Int
        pub var currentDay: String
        pub var reward: Int

        init(val: Int, tar: Int, current: String) {
            self.reward = 0
            self.noOfDays = val
            var a = 0;
            self.dataArray = []
            while a < val {
                self.dataArray.append(0)
                a = a + 1
            }
            self.target = tar
            self.currentDay = current
        }

        pub fun sendData(val: Int,day: Int): Int {
            self.dataArray[day] = val
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

    pub fun createAcc(account: Address, url: String, v: Int, t: Int, current: String) {
        if var map2 = self.accountVariables[account] {
            map2[url] = Variables(val: v, tar: t, current: current)
            self.accountVariables[account] = map2
        } else {
            self.accountVariables[account] = {url: Variables(val: v, tar: t, current: current)}
        }
    }
    pub fun delete(account: Address, url: String){
         if var map2 = self.accountVariables[account] {
            map2.remove(key: url)
            self.accountVariables[account] = map2
        } 
    }

    pub fun appendValue(account: Address, url: String, value: Int, day: Int) {
        if var map2 = self.accountVariables[account] {
            map2[url]?.sendData(val: value,day: day)
            self.accountVariables[account] = map2
        } 
    }

    pub fun show(account: Address): {String: Variables}? {
        return self.accountVariables[account]
    }
}
