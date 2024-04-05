const fs = require("fs");
const { google } = require("googleapis");

function loadClientSecrets(callback) {
  // Load client secrets from a local file.
  fs.readFile("client_secret.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), callback);
  });
}

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile("token.json", (err, token) => {
    if (err) {
      console.log(
        "No token found. Please ensure that token.json file exists and has a valid token."
      );
      return;
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
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
