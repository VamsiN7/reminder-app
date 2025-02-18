const AWS = require('aws-sdk');
const { Client } = require('pg');

const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

const dbConfig = {
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { 
    require: true,
    rejectUnauthorized: false
  }
};

const sendEmail = async (user, diffDays) => {
  const params = {
    Destination: {
      ToAddresses: [user.email],
    },
    Message: {
      Body: {
        Text: { Data: `Hi ${user.name},\n\nYour graduation is in ${diffDays} days! Keep pushing forward!` },
      },
      Subject: { Data: 'Graduation Countdown' },
    },
    Source: process.env.SES_SENDER_EMAIL,
  };
  return ses.sendEmail(params).promise();
};

exports.handler = async (event) => {
  console.log("Lambda invoked. Starting database connection...");
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log("Database connected successfully.");

    console.log("Running query...");
    const res = await client.query("SELECT * FROM users WHERE notifyemail = true AND graduationdate IS NOT NULL");
    console.log("Query completed. Number of rows:", res.rows.length);

    const today = new Date();
    for (const user of res.rows) {
      const gradDate = new Date(user.graduationdate);
      const diffTime = gradDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        await sendEmail(user, diffDays);
        console.log(`Email sent to ${user.email} with ${diffDays} days remaining.`);
      }
    }
  } catch (error) {
    console.error("Error in Lambda function:", error);
  } finally {
    try {
      await client.end();
      console.log("Database connection closed.");
    } catch (closeErr) {
      console.error("Error closing database connection:", closeErr);
    }
  }
  return { status: 'Complete' };
};
