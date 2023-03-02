const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const pipeline = [
          {
            $match: {
              NFTCollection: {
                $elemMatch: {
                  forSale: true
                }
              }
            }
          },
          {
            $project: {
              matchingElements: {
                $filter: {
                  input: "$NFTCollection",
                  as: "nft",
                  cond: {
                    $eq: [ "$$nft.forSale", true ]
                  }
                }
              }
            }
          }
        ];
      
        // Execute the aggregation pipeline
        const results = await collection.aggregate(pipeline).toArray();
          return {
              statusCode: 200,
              body: JSON.stringify(results),
          }
      } catch (error) {
        return { statusCode: 500, body: error.toString() }
      }
}

module.exports = { handler }
