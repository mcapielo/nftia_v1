const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const errorGen = msg => {
    return { statusCode: 500, body: msg };
  };

    
  try {
      const { c_a } = JSON.parse(event.body);
      if (!c_a) {
        return errorGen('Missing Input');
      }
      const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
      const collection = database.collection(process.env.MONGODB_COLLECTION);

      const results = await collection.findOne({ _id: c_a });
      if(results) {
        return {
          statusCode: 200,
          body: JSON.stringify(results),
      }
      }
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    } finally {
      await mongoClient.close();
    } 
}

module.exports = { handler }