// netlify/functions/getDriveFolders.js

const { google } = require("googleapis");

// Credentials will now be stored as environment variables in Netlify
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DRIVE_REFRESH_TOKEN } = process.env;
const ROOT_FOLDER_ID = "1QtC1gALLLlZ1NIZv4ZNa92aKrdAVvq2v";

exports.handler = async function(event, context) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      "http://localhost" // Redirect URI, can be simple for desktop app flow
    );

    oAuth2Client.setCredentials({
      refresh_token: DRIVE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oAuth2Client });

    const res = await drive.files.list({
      q: `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name, mimeType)",
      orderBy: "name",
    });

    const folders = res.data.files || [];

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(folders),
    };

  } catch (error) {
    console.error("Error fetching from Google Drive:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch folders." }),
    };
  }
};