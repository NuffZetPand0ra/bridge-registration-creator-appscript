// Serves the HTML interface.
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index').setTitle("Bridge Registration Creator");
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

// Get the Google Picker OAuth token
function getOAuthToken() {
  return ScriptApp.getOAuthToken();
}

// Main function called by the HTML form via google.script.run.
function createBridgeRegistration(data) {
  // data contains: data.titel, data.dato, data.folderId, data.templateId
  
  // 1. Create the form (using a template if provided, otherwise create a new one).
  var form = createBridgeRegistrationForm(data);
  
  // 2. Create the response spreadsheet and link the form.
  var spreadsheet = createResponseSpreadsheet(data, form);
  
  // 2.1 Remove any extra (default) sheets that were created.
  // We expect the form to add a new sheet named "Form Responses 1" or "Formularsvar 1".
  var sheets = spreadsheet.getSheets();
  for (var i = sheets.length - 1; i >= 0; i--) {
    var sheetName = sheets[i].getSheetName();
    if (sheetName !== "Form Responses 1" && sheetName !== "Formularsvar 1") {
      spreadsheet.deleteSheet(sheets[i]);
    }
  }
  
  // 2.2 Get the responses sheet (which might be in English or Danish) and rename it.
  var responseSheet = spreadsheet.getSheetByName("Form Responses 1") ||
                      spreadsheet.getSheetByName("Formularsvar 1");
  if (responseSheet) {
    responseSheet.setName("FormResponses");
  } else {
    throw new Error("Response sheet not found!");
  }
  
  // 3. Add extra analysis sheets using the correct separator based on locale.
  var analysisSheets = addAnalysisSheets(spreadsheet, "FormResponses");
  
  // 4. Get the form URLs.
  var formPublishedURL = form.getPublishedUrl();
  var shortFormURL = form.shortenFormUrl(formPublishedURL);
  var formEditURL = form.getEditUrl();
  
  // Return links so they can be displayed in the HTML interface.
  return {
    formLink: shortFormURL,
    formEditLink: formEditURL,
    spreadsheetId: spreadsheet.getId()
  };
}

// Helper function: Adds the required fields to the form.
function addFormFields(form) {
  // Delete all existing items in the form.
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }

  // Add the necessary player fields:
  form.addTextItem().setTitle("Dit navn").setRequired(true);
  form.addTextItem().setTitle("Dit DBF Nummer");
  form.addTextItem().setTitle("Makkers navn").setRequired(true);
  form.addTextItem().setTitle("Makkers DBF Nummer");

  form.setConfirmationMessage("Tak for din tilmelding!");

  return form;
}

// Creates a new form based on a template.
function createFormFromTemplate(templateId, newTitle, folderId) {
  var templateFile = DriveApp.getFileById(templateId);
  var folder = DriveApp.getFolderById(folderId);
  var newFormFile = templateFile.makeCopy(newTitle, folder);
  
  var newForm = FormApp.openById(newFormFile.getId());
  newForm.setTitle(newTitle);
  
  // Add fields using the shared helper.
  addFormFields(newForm);
  
  return newForm;
}

// Creates a new form from scratch.
function createNewForm(newTitle, folderId) {
  var form = FormApp.create(newTitle);
  
  // Move the form to the specified folder using moveTo()
  var formFile = DriveApp.getFileById(form.getId());
  var folder = DriveApp.getFolderById(folderId);
  formFile.moveTo(folder);
  
  // Add fields using the shared helper.
  addFormFields(form);
  
  return form;
}

// Uses the template flow to create a form with a new title.
// If a templateId is provided and non-empty, it uses the template;
// otherwise, it creates a new form from scratch.
function createBridgeRegistrationForm(inputData) {
  var title = inputData.titel;
  var date = inputData.dato;
  
  // Format the form filename (YYYY-MM-DD {TournamentName} Form)
  var newFileName = date + " " + title + " Form";
  
  // Format the form display title (Tilmelding til {TournamentName} DD/MM YYYY)
  // Parse the ISO date (YYYY-MM-DD) into a Date object
  var dateObj = new Date(date + "T00:00:00");
  var formattedDate = padZero(dateObj.getDate()) + "/" + padZero(dateObj.getMonth() + 1) + " " + dateObj.getFullYear();
  var formTitle = "Tilmelding til " + title + " " + formattedDate;
  
  if (inputData.templateId && inputData.templateId.trim() !== "") {
    var form = createFormFromTemplate(inputData.templateId, newFileName, inputData.folderId);
    form.setTitle(formTitle); // Set the display title separately
    return form;
  } else {
    var form = createNewForm(newFileName, inputData.folderId);
    form.setTitle(formTitle); // Set the display title separately
    return form;
  }
}

// Helper function to pad single digit numbers with leading zero
function padZero(num) {
  return num < 10 ? "0" + num : num;
}

// Creates the response spreadsheet and links it to the form.
function createResponseSpreadsheet(inputData, form) {
  var title = inputData.titel;
  var date = inputData.dato;
  var sheetTitle = date + " " + title + " Svar";
  var spreadsheet = SpreadsheetApp.create(sheetTitle);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  
  // Move the spreadsheet to the specified folder using moveTo()
  var file = DriveApp.getFileById(spreadsheet.getId());
  var folder = DriveApp.getFolderById(inputData.folderId);
  file.moveTo(folder);
  
  return spreadsheet;
}

// Adds extra analysis sheets using a localized argument separator.
function addAnalysisSheets(spreadsheet, responseSheetName) {
  var locale = spreadsheet.getSpreadsheetLocale();
  var sep = (locale && locale.indexOf("da") === 0) ? ";" : ",";
  
  // Create sheet for DBF numbers.
  var dbfSheet = spreadsheet.insertSheet("DBF-Numre");
  var queryDbf = '=QUERY(\'' + responseSheetName + '\'!A$2:F' + sep + ' "select C, E"' + sep + ' 0)';
  dbfSheet.getRange("A1").setFormula(queryDbf);
  
  // Get information for header
  var title = spreadsheet.getName().split(" ");
  var dateStr = title[0]; // Extract date from spreadsheet name (YYYY-MM-DD format)
  var tournamentName = title.slice(1, -1).join(" "); // Extract title (without date and "Svar")
  
  // Parse the date for formatting
  var dateObj = new Date(dateStr + "T00:00:00");
  var formattedDate = padZero(dateObj.getDate()) + "/" + padZero(dateObj.getMonth() + 1) + " " + dateObj.getFullYear();
  
  // Create sheet for player names (timestamp and names).
  var nameSheet = spreadsheet.insertSheet("Spillernavne");
  
  // Add header row with tournament name and formatted date
  nameSheet.getRange("A1").setValue("Tilmeldinger til " + tournamentName + " " + formattedDate);
  nameSheet.getRange("A1:C1").merge();
  nameSheet.getRange("A1").setFontSize(14).setFontWeight("bold");
  
  // Add row with count of registered pairs
  nameSheet.getRange("A2").setValue("Antal tilmeldte par:");
  // Count unique names and divide by 2 to get number of pairs 
  // Use COUNTA to count non-empty cells in column B and C (names) starting from row 5
  var countFormula = '=COUNTA(B5:C) / 2';
  nameSheet.getRange("B2").setFormula(countFormula).setHorizontalAlignment("left");
  nameSheet.getRange("A2:B2").setFontWeight("bold");
  
  // Add note about update frequency
  nameSheet.getRange("A3").setValue("Bemærk: Arket opdateres automatisk hvert femte minut. Du skal genindlæse siden for at se ændringerne.");
  nameSheet.getRange("A3:C3").merge();
  nameSheet.getRange("A3").setFontStyle("italic").setFontColor("#666666");
  
  // Add player names query starting at row 4 (with header in row 4)
  var queryNames = '=QUERY(\'' + responseSheetName + '\'!A:F' + sep + ' "select A, B, D"' + sep + ' 1)';
  nameSheet.getRange("A4").setFormula(queryNames);
  nameSheet.getRange("A4:C4").setFontWeight("bold");
  
  // Adjust the column widths
  nameSheet.setColumnWidth(1, 150);
  nameSheet.setColumnWidth(2, 250);
  nameSheet.setColumnWidth(3, 250);
  
  return {
    dbfSheet: dbfSheet,
    nameSheet: nameSheet
  };
}
