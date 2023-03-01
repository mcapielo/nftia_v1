import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTIA from 0x19e6fc6fdfde98d5
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868


pub contract NFTIAMarketPlace {

  pub struct SaleItem {
    pub let price: UFix64
    pub let ref: &NFTIA.NFT

    init(_price: UFix64, _ref: &NFTIA.NFT) {
      self.price = _price
      self.ref = _ref
    }
  
  
  }

  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun purchase(id: UInt64, recipientCollection: &NFTIA.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault)
  }

  pub resource SaleCollection: SaleCollectionPublic {
    pub var forSale: {UInt64: UFix64}
    pub let NFTIACollection: Capability<&NFTIA.Collection>
    pub let FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

    pub fun listForSale(id: UInt64, price: UFix64) {
      pre {
        price > 0.0: "it does not make senst to list a token for less than 0.0"
        self.NFTIACollection.borrow()!.getIDs().contains(id): "This SaleCollection owner does not have this NFT"
      }
      self.forSale[id] = price
    }

    pub fun unlistFromSale(id: UInt64) {
      self.forSale.remove(key: id)
    }

    pub fun purchase(id: UInt64, recipientCollection: &NFTIA.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault) {
      pre {
        payment.balance == self.forSale[id]: "The payment is not equal to the price of the NFT"
      }

      recipientCollection.deposit(token: <- self.NFTIACollection.borrow()!.withdraw(withdrawID: id))
      self.FlowTokenVault.borrow()!.deposit(from: <- payment)
    }

    pub fun getPrice(id: UInt64): UFix64 {
     return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init (_NFTIACollection: Capability<&NFTIA.Collection>, _FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}> ){
      self.forSale = {}
      self.NFTIACollection = _NFTIACollection
      self.FlowTokenVault = _FlowTokenVault
    }

  
  }


  pub fun createSaleCollection(NFTIACollection: Capability<&NFTIA.Collection>, FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
    return <- create SaleCollection(_NFTIACollection: NFTIACollection, _FlowTokenVault: FlowTokenVault)
  }

  init () {
  
  
  
  }



}
