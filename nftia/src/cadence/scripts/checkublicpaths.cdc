 pub fun main(user: Address): [PublicPath] {

     let publicAccount: PublicAccount = getAccount(user)
     return publicAccount.publicPaths

 }