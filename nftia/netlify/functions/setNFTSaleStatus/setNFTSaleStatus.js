const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {

  const errorGen = msg => {
    return { statusCode: 500, body: msg };
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { address } = JSON.parse(event.body);
    const { id } = JSON.parse(event.body);
    const { nftPrice } = JSON.parse(event.body);
    const { setOnSaleStatus } = JSON.parse(event.body);


    if (!address) {
      return errorGen('Missing Input');
    }
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const currentDate = new Date();

    const query = {
      _id: address,
      NFTCollection: {
        $elemMatch: {
          id: id
        }
      }
    };
    
    const update = {
      $set: {
        lastTime: currentDate,
        'NFTCollection.$.price': nftPrice,
        'NFTCollection.$.forSale' : setOnSaleStatus,
      }
    };
    
    const options = {
      returnOriginal: false
    };
        
    const result = await collection.findOneAndUpdate(query, update, options);
    if (result){
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }

}

module.exports = { handler }


