const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'translations', 'translations.js');
let content = fs.readFileSync(filePath, 'utf8');

const newKeys = `
    mobileExistsError: "Mobile number already registered",
    userNotFoundError: "Account not found",
    noDoctorsFound: "No doctors found in your area",
    login: "Login",
    alreadyHaveAccountTile: "Already have account",
`;

// Replace `demoDoctorLogin: "..."` with `demoDoctorLogin: "...",` + newKeys
// for all languages, using regex
const regex = /(demoDoctorLogin\s*:\s*".*?")(,)?/g;
content = content.replace(regex, `$1,
    mobileExistsError: "Mobile number already registered",
    userNotFoundError: "Account not found",
    noDoctorsFound: "No doctors found in your area",
    login: "Login",
    alreadyHaveAccountTile: "Already have account",`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Translations updated.');
