pub contract ConsisToken2 {
    pub var totalSupply: Int
    pub resource interface Provider {
        pub fun withdraw(amount: Int): @Vault {
            post {
                 result.balance == amount:
                    "Withdrawal amount must be the same as the balance of the withdrawn Vault"
            }
        }
    }
	pub resource interface Receiver {
        pub fun deposit(from: @Vault) {
            pre {
                from.balance > 0:
                    "Deposit balance must be positive"
            }
        }
    }
    pub resource interface Balance {
        pub var balance: Int
    }
    pub resource Vault: Provider, Receiver, Balance {
        pub var balance: Int
        init(balance: Int) {
            self.balance = balance
        } 
        pub fun withdraw(amount: Int): @Vault {
            self.balance = self.balance - amount
            return <-create Vault(balance: amount)
        }
        pub fun deposit(from: @Vault) {
            self.balance = self.balance + from.balance
            destroy from
        }
    }
    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0)
    }
	pub resource VaultMinter {
		 pub fun mintTokens(amount: Int, recipient: Capability<&AnyResource{Receiver}>) {
            let recipientRef = recipient.borrow()
                ?? panic("Could not borrow a receiver reference to the vault")

            ConsisToken2.totalSupply = ConsisToken2.totalSupply + Int(amount)
            recipientRef.deposit(from: <-create Vault(balance: amount))
        }
    }

   init() {
        self.totalSupply = 10000000
        let vault <- create Vault(balance: self.totalSupply)
        self.account.save(<-vault, to: /storage/CadenceFungibleTokenTutorialVault)
        self.account.save(<-create VaultMinter(), to: /storage/CadenceFungibleTokenTutorialMinter)
        self.account.link<&VaultMinter>(/private/Minter, target: /storage/CadenceFungibleTokenTutorialMinter)
    }
}