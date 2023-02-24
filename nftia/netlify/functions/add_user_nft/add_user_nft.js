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
    const { name } = JSON.parse(event.body);
    const { prompt } = JSON.parse(event.body);
    const { trxid } = JSON.parse(event.body);
    const { hash } = JSON.parse(event.body);

    if (!address) {
      return errorGen('Missing Input');
    }
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const currentDate = new Date();

    const filter = { _id: address };
    const update =   { $inc: { NFTCounter : 1 }, $set: { lastTime: currentDate },   $push: { NFTCollection: { name: name , prompt: prompt, trxid: trxid, hash: hash }}  };
    const options = { upsert: false, new: false };
    const result = await collection.findOneAndUpdate(filter, update, options);
    if (result){
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  } finally {
    await mongoClient.close();
  }

}

module.exports = { handler }

