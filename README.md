# Bridge Registration Creator

A Google Apps Script web application for automatically generating registration forms for bridge tournaments with connected analysis spreadsheets.

**[Live Demo](https://script.google.com/macros/s/AKfycbwJkzE_pqQb671gT_LD52CYaQ4F_vmYthFV20r6uOxyRRwxcq60IJ9ycoeR6dFW-n8OmA/exec)**

## 🎯 Purpose

This tool streamlines the process of creating registration forms for bridge tournaments. It:

- Creates a Google Form with standardized registration fields
- Sets up a linked Google Sheet for response collection
- Generates analysis sheets for player names and DBF numbers
- Organizes everything in your specified Google Drive folder

Perfect for bridge clubs and tournament organizers who need a quick setup for participant registration.

## ✨ Features

- **One-Click Form Generation**: Create forms with all necessary fields for bridge tournament registration
- **Spreadsheet Analysis**: Automatically generates specialized sheets for:
  - Player names with timestamps
  - DBF (Danish Bridge Federation) numbers  
  - Automatic pair counting
- **Template Support**: Use an existing Google Form as a template to maintain custom styling
- **Danish Interface**: The application interface is entirely in Danish
- **Mobile-Friendly Interface**: Clean, responsive design with Bootstrap 4
- **Detailed Instructions**: Help modals for finding IDs and publishing guides

## 🚀 Installation

### Option 1: Use the Live Version

Simply use the [live version](https://script.google.com/macros/s/AKfycbwJkzE_pqQb671gT_LD52CYaQ4F_vmYthFV20r6uOxyRRwxcq60IJ9ycoeR6dFW-n8OmA/exec) (version 6) if you don't need to modify the code.

### Option 2: Create Your Own Copy

1. Create a new Google Apps Script project at [script.google.com](https://script.google.com)
2. Copy the files from this repository:
   - Paste the JavaScript code into the default script file (called `Code.gs` in the Apps Script editor, or `Kode.gs` in Danish interfaces)
   - Create an HTML file named `index.html` and paste the HTML code
   - **Note**: You can optionally replace the `appsscript.json` file, but it's not required
3. Save the project (Ctrl+S or ⌘+S)
4. Deploy as a web app:
   - Click **Deploy** → **New deployment**
   - Select **Web app** as the deployment type
   - Set **Execute as** to "User accessing the web app"
   - Set **Who has access** to "Anyone"
   - Click **Deploy**
5. Copy the provided web app URL for sharing

## 📝 Usage

1. Open the web app in your browser
2. Fill in the form:
   - **Tournament title**: Name of your bridge tournament
   - **Tournament date**: When the tournament will take place
   - **Google Drive folder ID**: Where to store the form and spreadsheet (see help modal)
   - **Form template ID** (optional): For using a custom design template
3. Click **Opret tilmeldingsformular** (Create Registration Form) - note that all buttons and labels are in Danish
4. Share the generated links with participants and tournament managers

## 💻 Technical Details

- **Frontend**: HTML, CSS (Bootstrap 4), JavaScript, Handlebars.js
- **Backend**: Google Apps Script (JavaScript)
- **APIs Used**: Google Forms API, Google Sheets API, Google Drive API
- **Language**: Danish UI with some English code comments
- **Dependencies**:  
  - Bootstrap 4.5.2
  - jQuery 3.5.1
  - Handlebars 4.7.7
  - Font Awesome 5.15.3

## 🤝 Contributing

Contributions are more than welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Improvement Ideas

- Add support for more languages (currently Danish only)
- Create custom branding options
- Add more analysis sheet types
- Implement user preferences storage
- Add team registration support (beyond pairs)

## 📄 License

This project is made available as open source. Please provide attribution when using or modifying the code.

## 👨‍💻 Author

Developed and maintained by Esben Tind.  
Contact: [turnering@ballerupbridge.dk](mailto:turnering@ballerupbridge.dk)

---

For any issues or questions, please open an issue on GitHub.
