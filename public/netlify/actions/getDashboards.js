const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const filePath = path.resolve(__dirname, '../../src/data/dashboards.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to load dashboards' }),
    };
  }
};
