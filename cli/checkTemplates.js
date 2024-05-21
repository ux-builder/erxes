const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; // MongoDB URL
const dbName = "yourDatabaseName"; // 데이터베이스 이름

async function checkTemplates() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db(dbName);
    const collection = db.collection("templates");

    const templates = await collection.find({}).toArray();
    console.log("Templates:", templates);

    if (templates.length === 0) {
      console.log("No templates found");
    } else {
      console.log(`Found ${templates.length} templates`);
    }
  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

checkTemplates().catch(console.error);
