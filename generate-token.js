// generate-token.js
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'oauth-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  console.log('Authorize this app by visiting this url:');
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log(authUrl);

  console.log('\nEnter the code from that page here: ');
  // This part requires you to manually provide the code in the terminal
  // For simplicity, we'll use a text prompt. For a real app, you would use a library.
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question('', async (code) => {
    readline.close();
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('\nSUCCESS! Here is your refresh token. Copy this entire line:');
    console.log(tokens.refresh_token);
    console.log('\nSave this token securely. You will add it to Netlify.');
  });
}

authorize().catch(console.error);