const xlsx = require('xlsx');

/**
 * This function converts excel file to json
 * 
 * @param {*} xlsxInput Required : Excel file
 * @returns {*}[{}][]
 */
// exports.excelToJSON1 = async (xlsxInput, type) => {
//     console.log("xlsxInput------------------------------>",xlsxInput)
//     if (!xlsxInput) throw new Error("xlsxInput argument is required.")
//     // Read the file using pathname
//     const wb = xlsx.read(xlsxInput, { type: type || "buffer" });
//     // Grab the sheet info from the wb
//     const sheetNames = wb.SheetNames;
//     const totalSheets = sheetNames.length;
//     // Variable to store our data 
//     let sheetsInJSON = [];
//     // Loop through sheets
//     for (let i = 0; i < totalSheets; i++) {
//         // Convert to json using xlsx
//         const jsonSheet = xlsx.utils.sheet_to_json(wb.Sheets[sheetNames[i]], { blankrows: true });
//         // Add the sheet's json to our data array
//         sheetsInJSON.push(jsonSheet);
//     }
//     // call a function to save the data in a json file
//     return sheetsInJSON
// }

exports.excelToJSON = async (xlsxInput, type) => {
    console.log("xlsxInput------------------------------>", xlsxInput)
    if (!xlsxInput) throw new Error("xlsxInput argument is required.")

    // Read the file buffer using xlsx
    const wb = xlsx.read(xlsxInput, { type: type || "buffer" });

    // Grab the sheet info from the workbook
    const sheetNames = wb.SheetNames;
    const totalSheets = sheetNames.length;

    // Variable to store our data 
    let sheetsInJSON = [];

    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
        // Convert to JSON using xlsx
        const jsonSheet = xlsx.utils.sheet_to_json(wb.Sheets[sheetNames[i]], { blankrows: true });
        // Add the sheet's JSON to our data array
        sheetsInJSON.push(jsonSheet);
    }

    // Return the JSON data
    return sheetsInJSON;
}
