const fs = require("fs");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

function loadClientSecrets(callback) {
  // Load client secrets from a local file.
  const credentials = {
    installed: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      project_id: process.env.PROJECT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uris: [process.env.REDIRECT_URIS],
    },
  };

  if (
    !credentials.installed.client_id ||
    !credentials.installed.client_secret
  ) {
    console.log(
      "No client secret found. Please ensure that .env file exists and has valid client secrets."
    );
    return;
  }

  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(credentials, callback);
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    scope: process.env.SCOPE,
    token_type: process.env.TOKEN_TYPE,
  };

  if (!token.access_token || !token.refresh_token) {
    console.log(
      "No token found. Please ensure that .env file exists and has valid tokens."
    );
    return;
  }

  oAuth2Client.setCredentials(token);
  callback(oAuth2Client);
}

function storeData(auth, data) {
  const sheets = google.sheets({ version: "v4", auth });
  let values = [
    [
      data.username,
      data.updatesForYesterday,
      data.updatesForToday,
      data.anythingInteresting,
      new Date().toLocaleDateString(),
    ],
  ];
  const resource = {
    values,
  };
  const spreadsheetId = "1NWOi_q7I9a_RVwf7Kt2j--R6naR7eJsgqs7wGeLjKt4"; // Please replace with your actual spreadsheet ID
  sheets.spreadsheets.values.get(
    {
      spreadsheetId,
      range: "Sheet1!A:E",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      let nextEmptyRow = rows ? rows.length + 1 : 1; // If there are no rows, start at 1

      // Write to the next empty row
      sheets.spreadsheets.values.update(
        {
          spreadsheetId,
          range: `Sheet1!A${nextEmptyRow}:E${nextEmptyRow}`,
          valueInputOption: "USER_ENTERED",
          resource,
        },
        (err, result) => {
          if (err) {
            // Handle error
            console.log(err);
          } else {
            console.log("%d cells updated.", result.data.updatedCells);
          }
        }
      );
    }
  );
}

function initiateStoringProcess(data) {
  loadClientSecrets((auth) => {
    storeData(auth, data);
  });
}

module.exports = {
  loadClientSecrets,
  storeData,
  initiateStoringProcess,
};
