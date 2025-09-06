// netlify/functions/getDriveFolders.js

const { google } = require("googleapis");

const ROOT_FOLDER_ID = "1QtC1gALLLlZ1NIZv4ZNa92aKrdAVvq2v";
const serviceAccount = require("./drive-credentials.json");

exports.handler = async function(event, context) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const drive = google.drive({ version: "v3", auth });

    console.log("Fetching folders from Google Drive via Netlify...");
    const res = await drive.files.list({
      q: `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name, mimeType)",
      orderBy: "name",
    });

    const folders = res.data.files || [];
    console.log(`Successfully fetched ${folders.length} folders.`);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
      },
      body: JSON.stringify(folders),
    };

  } catch (error) {
    console.error("Error fetching from Google Drive:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch folders." }),
    };
  }
};