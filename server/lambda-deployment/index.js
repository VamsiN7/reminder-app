const AWS = require('aws-sdk');
const { Client } = require('pg');
const { Configuration, OpenAIApi } = require('openai');

const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' });

const openai = require('./services/openaiService');

// Database config
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

const sendEmail = async (toEmail, body) => {
  const params = {
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: 'Graduation Countdown' },
    },
    Source: process.env.SES_SENDER_EMAIL,
  };
  return ses.sendEmail(params).promise();
};

// 4) Helper to generate a motivational snippet with OpenAI
async function getMotivationalMessage(user) {
  try {
    const userGoal = user.goal || '';
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful motivational coach that provides concise, uplifting messages.'
        },
        {
          role: 'user',
          content: `
        The user's name is ${user.name}.
      Their stated goal is "${userGoal}".
      They graduate soon and need motivation.
      Write a short, positive motivational message to inspire them.
      `
        }
      ],
      max_tokens: 60,
      temperature: 0.7,
    });
    console.log(JSON.stringify(response.choices[0].message, null, 2));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Every day is a new chance to achieve your dreams.";
  }
}

exports.handler = async (event) => {
  console.log("Lambda invoked. Starting database connection...");
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("Database connected successfully.");

    console.log("Running query...");
    const res = await client.query(`
      SELECT * 
      FROM users 
      WHERE notifyemail = true 
        AND graduationdate IS NOT NULL
    `);
    console.log("Query completed. Number of rows:", res.rows.length);

    const today = new Date();

    for (const user of res.rows) {
      const gradDate = new Date(user.graduationdate);
      const diffTime = gradDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        const aiMessage = await getMotivationalMessage(user);

        const emailBody = `
          Hi ${user.name},

          Your graduation is in ${diffDays} days!
          Keep pushing forward and don’t lose sight of your goals.

          ${aiMessage}
        `;

        await sendEmail(user.email, emailBody);
        console.log(`Email sent to ${user.email} with ${diffDays} days remaining and AI message.`);
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

