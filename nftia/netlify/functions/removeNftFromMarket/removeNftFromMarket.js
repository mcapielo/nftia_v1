const { MongoClient } = require("mongodb");
const { json } = require("react-router-dom");

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
    const { c_address } = JSON.parse(event.body);
    const { id } = JSON.parse(event.body);
    const { s_address } = JSON.parse(event.body);
   

    if (!c_address || !id || !s_address) {
      return errorGen('Missing Input');
    }
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);


    const subelement = await collection.findOneAndUpdate(
      { _id: s_address, 'NFTCollection.id': id },
      { $set: { 'NFTCollection.$.price': "0", 'NFTCollection.$.forSale': false } },
      { returnOriginal: false }
    );
    
    // Remove the subelement from the source document...
    await collection.updateOne(
      { _id: s_address },
      { $pull: { NFTCollection: { id: id } } }
    );
    
    // Get the updated subelement from the subelement.value.NFTCollection array...
    const updatedSubelement = subelement.value.NFTCollection[0];
    
    // Update the fields of the updated subelement...
    updatedSubelement.price = "0";
    updatedSubelement.forSale = false;
    
    // Add the updated subelement to the destination document...
    await collection.updateOne(
      { _id: c_address },
      { $addToSet: { NFTCollection: updatedSubelement } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updatedSubelement),
    }
  
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  } finally {
    await mongoClient.close();
  }

}

module.exports = { handler }

