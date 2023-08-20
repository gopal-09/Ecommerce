const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
      username: 'nick', // Replace with your Elasticsearch username
      password: 'Gopalreddy@9', // Replace with your Elasticsearch password
    },
  });
// const createIndex = async () => {
//   //const indexName = 'products'; // Define the index name

//   await client.indices.create({
//     index: 'produ',
//     body: {
//       mappings: {
//         properties: {
//           name: { type: 'text' },
//           description: { type: 'text' },
//         },
//       },
//     },
//   });
// };
const createIndex = async (indexName) => {
    await client.indices.create({ index: indexName });

  };
module.exports = { createIndex };
