---

# Graduation Reminder & Motivation App

A full-stack application that sends personalized graduation countdown notifications and motivational messages to users. The app features user registration, login, and profile completion with dynamic, tailored messages generated via the OpenAI API. It leverages AWS services (Lambda, RDS, SES, CloudWatch, and EventBridge) for scalable, scheduled notifications.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [AWS Deployment](#aws-deployment)
  - [Amazon RDS](#amazon-rds)
  - [AWS Lambda & VPC Setup](#aws-lambda--vpc-setup)
  - [CloudWatch & EventBridge Scheduling](#cloudwatch--eventbridge-scheduling)
  - [SES Configuration](#ses-configuration)
- [OpenAI Integration](#openai-integration)

---

## Features

- **User Onboarding & Authentication**
  - Minimal UI with Sign-Up, Login, and Profile Update screens.
  - Users register with basic details and later complete their profile with graduation date, personal goals, and notification preferences (email and SMS).

- **Backend Services**
  - RESTful API built with Node.js/Express.
  - Sequelize ORM with PostgreSQL (initially local, then hosted on Amazon RDS).
  - Secure password handling with bcrypt.

- **Scheduled Notifications**
  - AWS Lambda function queries the database daily for users who opted in for notifications.
  - Calculates the graduation countdown and generates motivational messages via the OpenAI API.
  - Sends email notifications via Amazon SES and SMS via Amazon SNS (optionally).
  - Uses CloudWatch Logs for monitoring and EventBridge (or CloudWatch Events) to schedule Lambda invocations.

- **Dynamic Motivational Messaging**
  - Personalized messages generated using OpenAI’s API based on user data (e.g., graduation countdown and personal goals).

---

## Architecture

The application comprises:
- A **React** frontend for user interaction.
- A **Node.js/Express** backend providing API endpoints for registration, login, and profile management.
- A **PostgreSQL** database managed with Sequelize.
- **AWS Services** for notifications:
  - **Amazon RDS** hosts the PostgreSQL database.
  - **AWS Lambda** executes a scheduled function for notifications.
  - **CloudWatch & EventBridge** schedule and monitor the Lambda function.
  - **Amazon SES** sends email notifications.
  - **VPC & NAT Gateway** ensure secure connectivity and outbound internet access.

---

## Technologies Used

- **Frontend:** React, React Router, Axios, HTML/CSS
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, bcrypt
- **AWS:** Lambda, RDS, SES, CloudWatch, EventBridge, VPC, NAT Gateway
- **APIs:** OpenAI API for dynamic motivational content

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/)
- A PostgreSQL instance (local for development, Amazon RDS for production)
- AWS account with access to Lambda, RDS, SES, CloudWatch, and EventBridge
- (Optional) AWS CLI for deployment tasks

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/graduation-reminder-app.git
   cd graduation-reminder-app
   ```

2. **Backend Setup:**

   Navigate to the `backend` directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup:**

   Navigate to the `frontend` directory and install dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables (adjust values accordingly):

```env
DB_NAME=your_rds_database_name
DB_USER=postgres
DB_PASS=yourRDSpassword
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
AWS_REGION=us-east-2
SES_SENDER_EMAIL=your-verified-email@yourdomain.com
OPENAI_API_KEY=your_openai_api_key
```

*Note:* In production (e.g., AWS Lambda), set these variables in the function configuration.

### Running Locally

1. **Start the Backend Server:**

   ```bash
   cd backend
   node server.js
   ```

   Verify that the server connects to the database and logs “Database synced successfully.”

2. **Start the Frontend App:**

   ```bash
   cd ../frontend
   npm start
   ```

   Access the app at [http://localhost:3000](http://localhost:3000).

---

## AWS Deployment

### Amazon RDS

- Launch a PostgreSQL instance via Amazon RDS.
- Configure security groups to allow inbound connections from your Lambda and development IP.
- Update your `.env` (or Lambda environment variables) with the RDS endpoint and credentials.

### AWS Lambda & VPC Setup

1. **Create Private Subnets:**
   - In the VPC Console, create private subnets (no direct IGW route).
   - Also, create a public subnet for the NAT Gateway.

2. **Create a NAT Gateway:**
   - In a public subnet, create a NAT Gateway and allocate an Elastic IP.
   - Update the route table for your private subnets to route `0.0.0.0/0` traffic to the NAT Gateway.

3. **Configure Lambda:**
   - In the Lambda Console, create or update your function.
   - Under **Configuration** → **VPC**, assign your Lambda to the private subnets.
   - Set the handler (e.g., `index.handler` if your file is named index.js).
   - Increase the timeout as needed during testing.

### CloudWatch & EventBridge Scheduling

1. **CloudWatch Logs:**
   - Your Lambda function logs are automatically sent to CloudWatch Logs. Monitor logs to troubleshoot and verify execution.

2. **EventBridge (CloudWatch Events):**
   - In the AWS Console, navigate to **Amazon EventBridge** (or **CloudWatch** → **Rules**).
   - Create a new rule with a cron expression (e.g., `cron(0 9 * * ? *)` to trigger daily at 9 AM UTC).
   - Set the target of the rule to your Lambda function.
   - Save and enable the rule.

### SES Configuration

- **SES:**  
  - Verify your sender email or domain in the SES console.
  - If you’re in the SES sandbox, verify recipient emails or request production access.
  
- **IAM Permissions:**  
  - Ensure your Lambda execution role has the appropriate policies (e.g., SES:SendEmail).

---

## OpenAI Integration

- The application integrates with the OpenAI API to generate personalized motivational messages.
- Prompts include user-specific details (name, graduation countdown, personal goals) to create dynamic content.
- Set your `OPENAI_API_KEY` in your environment variables for authentication.

---