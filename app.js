const express = require("express");
const app = express();
const axios = require('axios');
const apiKey = 'key_live_tckndBNOkHnwcBGKuWzvBPh2S5odGTVV';
const apiSecret = 'secret_live_Gv3l9FU0H6gn3N3c5nQb61KWClIJSvyU';
const strapiAccessToken = 'Bearer 46f7627949496b15b36aadbbf590db7a079ddfafe33ea2db0b6e25ca525eff20099c19d999cd556972ca316d37cb7a283ad1db9ad5e466d74720b59600769e7393a14bd7023f1da6e9cdc97251a91fd6964caf0d7bdc648ac5e6e0f70ba6074ca776c009b0a1f02ef18738c9a6d291af5403d8d697083a7c54f85265edfcfe87'
const strapiUrl = 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api'
const strapiToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg1OTU5NTMzLCJleHAiOjE2ODg1NTE1MzN9.9pJMNFB1x9cEAfijPYOE1ISLnKx5yTlcU5rygBg-igI'
const bodyParser = require('body-parser');
const { createReadStream } = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const watiUrl = 'https://live-server-105950.wati.io/api/v1'
const watiAuthorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YmU3YWZiOS0wZjAwLTQ0Y2MtYjdlZi03ZjdjYjg5Yjc1N2EiLCJ1bmlxdWVfbmFtZSI6ImFuamliYWJ1QHZpZGVyLmluIiwibmFtZWlkIjoiYW5qaWJhYnVAdmlkZXIuaW4iLCJlbWFpbCI6ImFuamliYWJ1QHZpZGVyLmluIiwiYXV0aF90aW1lIjoiMDUvMTgvMjAyMyAxMzo0NjoxMyIsImRiX25hbWUiOiIxMDU5NTAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.Zj16txwpWMKZjMUjx3bThE4t_pzPrecDeRc0K4RjvmY'
const cron = require('node-cron');
const pool = require('./details.js');

// Parse JSON request bodies
app.use(bodyParser.json());
const FormData = require('form-data');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { request } = require("https");
const { Console } = require("console");
const cheerio = require('cheerio')


const dotenv = require('dotenv');
dotenv.config();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
)

try {
    const creds = fs.readFileSync("creds.json");
    oauth2Client.setCredentials(JSON.parse(creds));

} catch (error) {
    console.log("No creds found")

}
// const PORT = process.env.PORT || 8000;

app.get("/auth/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            'https://www.googleapis.com/auth/drive',
        ]
    });
    res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send("success")
})

app.post('/downloadHtmlFileWithoutpassword', async (req, res) => {

    const postData = req.body; // Access the posted data here

    // Do whatever you want with the posted data
    console.log("data recived", postData);
    const fileName = postData.filePath
    try {

        const readAis = () => {

            const generatePdfData = () => {


                return Promise.resolve().then(() => {
                    console.log('Jai Sri Ram');

                    // Create a new instance of the Google Drive API client
                    const drive = google.drive({ version: 'v3', auth: oauth2Client });

                    // Step 1: Upload the PDF file to Google Drive
                    const uploadFile = () => {
                        console.log(2);
                        // PDF file path
                        const pdfFilePath = fileName;

                        // Read the PDF file content
                        // const fileContent = fs.readFileSync(pdfFilePath);
                        return new Promise((resolve, reject) => {
                            drive.files.create(
                                {
                                    resource: {
                                        name: 'My File',
                                        mimeType: 'application/pdf',
                                        parents: ['1YRx8fLXWmft8IYK70LgD4wCqP0aOrOn3'], // ID of the folder where the file will be inserted
                                    },
                                    media: {
                                        mimeType: 'application/pdf',
                                        body: fs.createReadStream(pdfFilePath),
                                    },
                                    fields: 'id',
                                },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error uploading file:', err);
                                        reject(err);
                                        return;
                                    }

                                    const fileId = response.data.id;
                                    console.log('..............', fileId);
                                    resolve(fileId);
                                }
                            );
                        });
                    };

                    return uploadFile().then((fileId) => {
                        // Step 2: Copy the uploaded file and convert to Google Docs format
                        return new Promise((resolve, reject) => {
                            drive.files.copy(
                                {
                                    fileId: fileId,
                                    resource: {
                                        mimeType: 'application/vnd.google-apps.document',
                                    },
                                    fields: 'id',
                                },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error copying file:', err);
                                        reject(err);
                                        return;
                                    }

                                    const copiedFileId = response.data.id;
                                    console.log(copiedFileId);
                                    resolve(copiedFileId);
                                }
                            );
                        });
                    }).then((copiedFileId) => {
                        // Step 3: Export the copied file as HTML
                        return new Promise((resolve, reject) => {
                            drive.files.export(
                                {
                                    fileId: copiedFileId,
                                    mimeType: 'text/html',
                                },
                                { responseType: 'stream' },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error exporting file:', err);
                                        reject(err);
                                        return;
                                    }

                                    // Step 4: Save the exported HTML file
                                    const htmlFilePath = './output.html';
                                    const writeStream = fs.createWriteStream(htmlFilePath);
                                    response.data
                                        .on('error', (err) => {
                                            console.error('Error reading file stream:', err);
                                            reject(err);
                                        })
                                        .pipe(writeStream);

                                    writeStream.on('finish', () => {
                                        console.log('File downloaded as HTML:', htmlFilePath);
                                        resolve(htmlFilePath);
                                    });
                                }
                            );
                        });
                    });
                });
            };

            generatePdfData()
                .then(() => {
                    console.log(3);
                    const filePath = './output.html';

                    // Read the HTML file asynchronously
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading the file:', err);
                            res.status(500).send('An error occurred');
                            return;
                        }
                        const htmlContent = data;

                        // Print the HTML content

                        const findPan = htmlContent.split('Permanent Account Number (PAN) ');
                        const panNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                        const match = htmlContent.match(panNumberRegex);

                        let panNumber = '';
                        if (match) {
                            panNumber = match[0];
                        } else {
                            console.log('PAN number not found.');
                        }

                        console.log(panNumber);

                        const partB3list = htmlContent.split(`Part B3-Information relating to payment of taxes`);
                        //   console.log(partB3list)
                        const tableB3first = partB3list[1].split(`Part B4-Information relating to demand and refund`)
                        const tableform = tableB3first[0]
                        // console.log(tableform)
                        const tableCheck = tableform.split(`<table`)
                        // console.log(tableCheck.length)
                        let firstTable1 = ''
                        if (tableCheck.length === 2) {
                            // console.log(tableCheck)
                            const tableB3first = tableCheck
                            const endtag = tableB3first[1].split(`</table>`)
                            const first_table = endtag[0]
                            const firstTableHtml = `<table ${first_table} </table>`
                            firstTable1 = firstTableHtml
                        } else {
                            // console.log(tableCheck)
                            // const tableB3first=tableCheck
                            const tableB3first = tableCheck
                            const endtag = tableB3first[1].split(`</table>`)
                            const first_table = endtag[0]
                            const firstTableHtml = `<table ${first_table} `

                            const secondtag = tableB3first[2].split(`</table>`)
                            const second_first_table = secondtag[0]
                            const secondfirstTableHtml = `<table ${second_first_table} </table>`
                            const sec = secondfirstTableHtml.split(`</tr>`)
                            const sectable = sec.slice(1, sec.length)
                            const secondSec = sectable.join("</tr>")
                            const totalTable = firstTableHtml + secondSec
                            firstTable1 = totalTable
                        }
                        const tis = firstTable1.split(`<tr`)
                        let count = 1
                        let list_a = []
                        for (let i of tis) {
                            console.log(i)
                            if (count > 1) {
                                if (count === 2) {
                                    i = ` style="background-color: #ABBFDE"; font-size: 20px; font-weight: 700;` + i
                                }
                                slicelist = i.split(`<td`)
                                const firstpart = slicelist.slice(0, 5)
                                // console.log(firstpart)
                                const secondPart = slicelist.slice(9, 14)
                                const twoparts = firstpart.join(`<td`) + "<td" + secondPart.join(`<td`)
                                // console.log(twoparts) 
                                list_a.push(twoparts)
                            } else {
                                list_a.push(i)
                            }
                            count += 1
                        }

                        const abcd = list_a.join('<tr')


                        partB4list = htmlContent.split(`Part B4-Information relating to demand and refund`)
                        tableB4first = partB4list[1].split(`<table`)
                        secondendtag = tableB4first[1].split(`</table>`)
                        second_table = secondendtag[0]
                        secondTableHtml = `<table ${second_table} </table>`

                        const aisData = {
                            data: {
                                pannumber: panNumber,
                                firstTableHtml: abcd,
                                secondTableHtml
                            }
                        }


                        let strdata = JSON.stringify(aisData);

                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/ais-details',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization:
                                    'Bearer 46f7627949496b15b36aadbbf590db7a079ddfafe33ea2db0b6e25ca525eff20099c19d999cd556972ca316d37cb7a283ad1db9ad5e466d74720b59600769e7393a14bd7023f1da6e9cdc97251a91fd6964caf0d7bdc648ac5e6e0f70ba6074ca776c009b0a1f02ef18738c9a6d291af5403d8d697083a7c54f85265edfcfe87',
                            },
                            data: strdata,
                        };

                        axios
                            .request(config)
                            .then((response) => {
                                console.log(JSON.stringify(response.data));
                                res.send(JSON.stringify(response.data));
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).send('An error occurred');
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    console.log(error)
                    // res.status(500).send('An error occurred');
                });
        }

        readAis()
    } catch (error) {
        console.error(error);
        res.sendStatus(200)
    }
});

app.post('/downloadTisFileWithoutpassword', async (req, res) => {

    const postData = req.body; // Access the posted data here

    // Do whatever you want with the posted data
    console.log("data recived", postData);
    const fileName = postData.filePath
    try {

        const readAis = () => {

            const generatePdfData = () => {


                return Promise.resolve().then(() => {
                    // console.log('Jai Sri Ram');

                    // Create a new instance of the Google Drive API client
                    const drive = google.drive({ version: 'v3', auth: oauth2Client });

                    // Step 1: Upload the PDF file to Google Drive
                    const uploadFile = () => {
                        console.log(2);
                        // PDF file path
                        const pdfFilePath = fileName;

                        // Read the PDF file content
                        // const fileContent = fs.readFileSync(pdfFilePath);
                        return new Promise((resolve, reject) => {
                            drive.files.create(
                                {
                                    resource: {
                                        name: 'My File',
                                        mimeType: 'application/pdf',
                                        parents: ['1YRx8fLXWmft8IYK70LgD4wCqP0aOrOn3'], // ID of the folder where the file will be inserted
                                    },
                                    media: {
                                        mimeType: 'application/pdf',
                                        body: fs.createReadStream(pdfFilePath),
                                    },
                                    fields: 'id',
                                },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error uploading file:', err);
                                        reject(err);
                                        return;
                                    }

                                    const fileId = response.data.id;
                                    console.log('..............', fileId);
                                    resolve(fileId);
                                }
                            );
                        });
                    };

                    return uploadFile().then((fileId) => {
                        // Step 2: Copy the uploaded file and convert to Google Docs format
                        return new Promise((resolve, reject) => {
                            drive.files.copy(
                                {
                                    fileId: fileId,
                                    resource: {
                                        mimeType: 'application/vnd.google-apps.document',
                                    },
                                    fields: 'id',
                                },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error copying file:', err);
                                        reject(err);
                                        return;
                                    }

                                    const copiedFileId = response.data.id;
                                    console.log(copiedFileId);
                                    resolve(copiedFileId);
                                }
                            );
                        });
                    }).then((copiedFileId) => {
                        // Step 3: Export the copied file as HTML
                        return new Promise((resolve, reject) => {
                            drive.files.export(
                                {
                                    fileId: copiedFileId,
                                    mimeType: 'text/html',
                                },
                                { responseType: 'stream' },
                                (err, response) => {
                                    if (err) {
                                        console.error('Error exporting file:', err);
                                        reject(err);
                                        return;
                                    }

                                    // Step 4: Save the exported HTML file
                                    const htmlFilePath = './tis.html';
                                    const writeStream = fs.createWriteStream(htmlFilePath);
                                    response.data
                                        .on('error', (err) => {
                                            console.error('Error reading file stream:', err);
                                            reject(err);
                                        })
                                        .pipe(writeStream);

                                    writeStream.on('finish', () => {
                                        console.log('File downloaded as HTML:', htmlFilePath);
                                        resolve(htmlFilePath);
                                    });
                                }
                            );
                        });
                    });
                });
            };

            generatePdfData()
                .then(() => {
                    console.log(3);
                    const filePath = './tis.html';

                    // Read the HTML file asynchronously
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading the file:', err);
                            res.status(500).send('An error occurred');
                            return;
                        }
                        const htmlContent = data;
                        // console.log(htmlContent)

                        const panNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                        const match = htmlContent.match(panNumberRegex);

                        let panNumber = ""
                        if (match) {
                            panNumber = match[0];

                        } else {
                            console.log("PAN number not found.");
                        }

                        console.log(panNumber)


                        // Load the HTML into Cheerio
                        const $ = cheerio.load(htmlContent);

                        const tables = $('table');

                        // Get the number of tables
                        const numTables = tables.length;

                        console.log('Number of tables:', numTables);
                        // Access the first table
                        const firstTable = $('table').first();

                        const rows = firstTable.find('tr');

                        // Extract the headers from the first row
                        const headers = [];
                        const firstRowCells = $(rows[0]).find('td, th');
                        firstRowCells.each((_, cell) => {
                            const header = $(cell).text().trim();
                            headers.push(header);
                        });

                        // Create an empty list to store the table data
                        const tableData = [];

                        // Iterate over the remaining rows and extract the values
                        for (let i = 0; i < rows.length; i++) {
                            const rowCells = $(rows[i]).find('td, th');
                            const rowData = {};

                            rowCells.each((cellIndex, cell) => {
                                const value = $(cell).text().trim().replace(/[\n\r]+/g, '');
                                let header = headers[cellIndex];
                                if (value.length === 8) {
                                    header = ["SR. NO.", "PART", "INFORMATION DESCRIPTION", "INFORMATION SOURCE", "AMOUNT DESCRIPTION", "REPORTED VALUE", "PROCESSED VALUE", "DERIVED VALUE"]
                                }

                                rowData[header] = value;
                            });

                            tableData.push(rowData);
                        }

                        const abcd = []

                        if (tableData.length >= 1) {
                            for (let tableIndex = 1; tableIndex < tables.length; tableIndex++) {
                                const currentTable = $(tables[tableIndex]);
                                const currentRows = currentTable.find('tr');
                                const currentTableData = [];

                                // Read the remaining rows with 8 cells each
                                for (let rowIndex = 0; rowIndex < currentRows.length; rowIndex++) {
                                    const rowCells = $(currentRows[rowIndex]).find('td, th');
                                    if (rowCells.length === 4) {
                                        const rowData = {};

                                        let rowHeaders = ['SR. NO.', "INFORMATION CATEGORY", 'PROCESSED VALUE', 'DERIVED VALUE']
                                        const rowValues = [];

                                        rowCells.each((cellIndex, cell) => {
                                            const value = $(cell).text().trim().replace(/[\n\r]+/g, '');
                                            // if (value.length === 7) {
                                            //   rowHeaders = ["PART", "INFORMATION DESCRIPTION", "INFORMATION SOURCE", "AMOUNT DESCRIPTION", "REPORTED VALUE", "PROCESSED VALUE", "DERIVED VALUE"]
                                            // }
                                            rowValues.push(value);
                                        });

                                        for (let i = 0; i < rowHeaders.length; i++) {
                                            rowData[rowHeaders[i]] = rowValues[i];
                                        }

                                        currentTableData.push(rowData);

                                    }
                                    if (rowCells.length === 8) {
                                        const rowData = {};

                                        let rowHeaders = ["SR. NO.", "PART", "INFORMATION DESCRIPTION", "INFORMATION SOURCE", "AMOUNT DESCRIPTION", "REPORTED VALUE", "PROCESSED VALUE", "DERIVED VALUE"]
                                        const rowValues = [];

                                        rowCells.each((cellIndex, cell) => {
                                            const value = $(cell).text().trim().replace(/[\n\r]+/g, '');
                                            // if (value.length === 7) {
                                            //   rowHeaders = ["PART", "INFORMATION DESCRIPTION", "INFORMATION SOURCE", "AMOUNT DESCRIPTION", "REPORTED VALUE", "PROCESSED VALUE", "DERIVED VALUE"]
                                            // }
                                            rowValues.push(value);
                                        });

                                        for (let i = 0; i < rowHeaders.length; i++) {
                                            rowData[rowHeaders[i]] = rowValues[i];
                                        }

                                        currentTableData.push(rowData);
                                    }
                                    if (rowCells.length === 7) {
                                        const rowData = {};

                                        let rowHeaders = ["PART", "INFORMATION DESCRIPTION", "INFORMATION SOURCE", "AMOUNT DESCRIPTION", "REPORTED VALUE", "PROCESSED VALUE", "DERIVED VALUE"]
                                        const rowValues = [];

                                        rowCells.each((cellIndex, cell) => {
                                            const value = $(cell).text().trim().replace(/[\n\r]+/g, '');
                                            rowValues.push(value);
                                        });

                                        for (let i = 0; i < rowHeaders.length; i++) {
                                            rowData[rowHeaders[i]] = rowValues[i];
                                        }

                                        currentTableData.push(rowData);
                                    }
                                }
                                // console.log(currentTableData);
                                abcd.push(currentTableData)

                            }
                        }
                        const objData = {
                            data: {
                                pannumber: panNumber,
                                tableData,
                                remainingTableData: abcd
                            }
                        }

                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/tissampletables',
                            headers: {
                                'Authorization': 'Bearer 46f7627949496b15b36aadbbf590db7a079ddfafe33ea2db0b6e25ca525eff20099c19d999cd556972ca316d37cb7a283ad1db9ad5e466d74720b59600769e7393a14bd7023f1da6e9cdc97251a91fd6964caf0d7bdc648ac5e6e0f70ba6074ca776c009b0a1f02ef18738c9a6d291af5403d8d697083a7c54f85265edfcfe87'
                            },
                            data: objData
                        };

                        axios.request(config)
                            .then((response) => {
                                console.log("Data Successfully Inserted")
                                // console.log(JSON.stringify(response.data));
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    console.log(error)
                    // res.status(500).send('An error occurred');
                });
        }

        readAis()
    } catch (error) {
        console.error(error);
        res.sendStatus(200)
    }
});

async function updatePrismuser(prismuserId, incomeTaxPassword, adminUserId) {
    try {
        const apiUrl = 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337';
        const endpoint = `/content-manager/collection-types/api::prismuser.prismuser/${prismuserId}`;

        const payload = {};
        if (incomeTaxPassword) {
            payload.incomeTaxPassword = incomeTaxPassword
        }
        if (adminUserId) {
            payload.admin_user = {
                connect: [{ id: adminUserId }]
            };
        }

        const response = await axios.put(apiUrl + endpoint, payload, {
            headers: {
                Authorization: strapiToken,
                'Content-Type': 'application/json',
            },
        });

        console.log('PUT request successful:', response.data);
    } catch (error) {
        console.error('Error sending PUT request:', error);
    }
}

async function addAdminUserToPrismUser(prismuserId, adminUserId) {
    try {
        const apiUrl = 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337';
        const endpoint = `/content-manager/collection-types/api::prismuser.prismuser/${prismuserId}`;

        const payload = {};
        if (adminUserId) {
            payload.admin_user = {
                connect: [{ id: adminUserId }]
            };
        }

        const response = await axios.put(apiUrl + endpoint, payload, {
            headers: {
                Authorization: strapiToken,
                'Content-Type': 'application/json',
            },
        });

        console.log('PUT request successful:', response.data);
    } catch (error) {
        console.error('Error sending PUT request:', error);
    }
}

async function updateEnterMessageToNull(id) {
    try {
        const data = JSON.stringify({
            "data": {
                "enterMessage": null
            }
        })
        const config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `${strapiUrl}/msgscreens/${id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": strapiAccessToken
            },
            data: data
        }
        const response = await axios(config);
        console.log(JSON.stringify(response.data))
        console.log("enterMessage changed to Null!!")
    } catch (error) {
        console.log(error)
    }
}

async function updatePrismuserField(id, fieldName, fieldValue) {
    try {
        const data = JSON.stringify({
            "data": {
                [fieldName]: fieldValue
            }
        })
        const config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `${strapiUrl}/prismusers/${id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": strapiAccessToken
            },
            data: data
        }
        const response = await axios(config);
        console.log(JSON.stringify(response.data))
        console.log("Prism User Field Updated!!")
    } catch (error) {
        console.log(error)
    }
}

// updatePrismuserField(258,"dob","01021333")

async function addDetailsTOAutomation(endPoint, panNumber, incomeTaxPassword, dob) {
    const newClientData = {
        data: {
            pan: panNumber,
            dob: dob,
            password: incomeTaxPassword,
            Status: "READY"
        },
    };

    try {
        await axios.post(`${strapiUrl}/${endPoint}`, newClientData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: strapiAccessToken,
            },
        });
        console.log("New Client inserted to AUTOMATIONS!!");
    } catch (error) {
        console.log("error", error);
    }
}

const createOrUpdateDocument = async (fileName, panNumber) => {
    try {
        // Make a GET request to retrieve documents
        console.log(fileName, panNumber)
        const config = {
            method: 'get',
            url: `${strapiUrl}/documents`,
            headers: {
                'Authorization': strapiAccessToken,
            },
        };
        const response = await axios(config);
        const list = response.data.data
        const filteredList = list.filter((item) => (item.attributes.panNumber === panNumber) && (item.attributes.filePath === fileName))
        if (filteredList.length) {
            console.log('Document with the given fileName and panNumber already exists.');
        } else {
            // Create a new document
            let data = JSON.stringify({
                "data": {
                    "panNumber": panNumber,
                    "documentType": "form26asFilePath",
                    "filePath": fileName
                }
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/documents',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': strapiAccessToken
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
            console.log('New document created to Documents')
        }
    } catch (error) {
        console.error('Error creating or updating document:', error);
    }
};

async function getClientWhatsappNumber(panNumber) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/prismusers',
            headers: {
                'Authorization': strapiAccessToken
            }
        };

        const response = await axios.request(config);
        const prismUserDetails = response.data.data.find(each => each.attributes.panNumber === panNumber);
        const clientWhatsappNumber = prismUserDetails.attributes.clientNumber;
        console.log(",,,,,,,,,,,,,,,,,,,", clientWhatsappNumber)
        return clientWhatsappNumber;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getPrismUserByClientNumber(clientNumber) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/prismusers',
            headers: {
                'Authorization': strapiAccessToken
            }
        };

        const response = await axios.request(config);
        const prismUserDetails = response.data.data.find(each => each.attributes.clientNumber === clientNumber && each.attributes.status === "Active");
        return prismUserDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function sendFileToClient(filePath, clientNumber) {
    try {
        let data = new FormData();
        data.append('file', fs.createReadStream(filePath));

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${watiUrl}/sendSessionFile/${clientNumber}`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': watiAuthorization,
                'Cookie': 'affinity=1685250986.31.133409.71267|bf8d511e4b8b3863518b0325d212752c',
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.log(error);
    }
}
// const filePath = "C:/Users/Administrator/harish/prism_windows2/public/uploads/basicPlan.jpg"
// sendFileToClient(filePath, "919491679465")

async function sendMsgToProfessionalOrClient(clientMessage, professionalPhoneNumber) {
    try {
        let data = new FormData();
        data.append('messageText', clientMessage);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://live-server-105950.wati.io/api/v1/sendSessionMessage/${professionalPhoneNumber}`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': watiAuthorization,
                'Cookie': 'affinity=1685250986.31.133409.71267|bf8d511e4b8b3863518b0325d212752c',
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.log(error);
    }
}

const getClientMessages = async (clientNumber) => {
    const config = {
        method: 'get',
        url: `https://live-server-105950.wati.io/api/v1/getMessages/${clientNumber}`,
        headers: {
            'Authorization': watiAuthorization,
            'Cookie': 'affinity=1684909422.547.117074.275985|bf8d511e4b8b3863518b0325d212752c',
        },
        params: {
            pageSize: 10,
            pageNumber: 1,
        },
    };

    try {
        const response = await axios(config);
        const messages = response.data.messages.items
        return messages
    } catch (error) {
        console.log(error);
    }
}

const getDataFromStrapiTable = async (endPoint) => {
    try {
        const response = await axios.get(`${strapiUrl}/${endPoint}`, {
            headers: {
                'Authorization': strapiAccessToken
            }
        });
        const strapiData = response.data.data; // Array of documents
        // Iterate over each document
        return strapiData
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

async function getPrismUserByPanNumber(panNumber) {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${strapiUrl}/prismusers`,
            headers: {
                'Authorization': strapiAccessToken
            }
        };

        const response = await axios.request(config);
        const prismUserDetails = response.data.data.find(each => each.attributes.panNumber === panNumber);
        return prismUserDetails;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getUploadData = async () => {
    try {
        const response = await axios.get(`${strapiUrl}/upload/files`, {
            headers: {
                'Authorization': strapiAccessToken
            }
        });
        const strapiData = response.data; // Array of documents
        // Iterate over each document
        return response.data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getDataFromStrapiTableWithPopulate = async (endPoint, id) => {
    try {
        const response = await axios.get(`${strapiUrl}/${endPoint}/${id}?populate=*`, {
            headers: {
                'Authorization': strapiAccessToken
            }
        });
        // const askdocumentsData = {
        //     listofdocuments: response.data.data.attributes.listofdocuments.data,
        //     prismusers: response.data.data.attributes.prismusers.data
        // }
        // console.log(askdocumentsData)
        return response.data.data
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const addPanDetailsToSandbox = async (panNo, userPanDetails, clientName, clientNumber) => {
    try {
        const response = await getDataFromStrapiTable('sandboxes');
        const existingPans = response.map(each => JSON.parse(each?.attributes?.response)?.pan);
        if (!existingPans.includes(panNo)) {
            const sandboxData = {
                data: {
                    request: panNo,
                    response: JSON.stringify(userPanDetails),
                    clientName,
                    clientNumber
                }
            };
            const options = {
                url: `${strapiUrl}/sandboxes`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': strapiAccessToken
                },
                data: sandboxData
            };
            await axios(options);
            console.log('New User Pan Details inserted to sandbox!!');
        }
    } catch (error) {
        console.error(error);
    }
};

async function updateAutomationPassword(panNumber, newPassword) {
    try {
        // Perform GET request to retrieve the automations
        const getStatusUrl = `${strapiUrl}/automations`;
        const getStatusConfig = {
            method: 'get',
            url: getStatusUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': strapiAccessToken
            }
        };

        const getStatusResponse = await axios.request(getStatusConfig);
        const automations = getStatusResponse.data.data;
        const latestAutomation = automations.reverse().find(each => each.attributes.pan === panNumber && each.attributes.Status === "ERROR" && each.attributes.loginError.includes("Invalid Password, Please retry."))
        if (latestAutomation) {
            // Proceed with PUT request to update the password
            const id = latestAutomation.id;
            const data = JSON.stringify({
                data: {
                    password: newPassword,
                    Status: "READY",
                    loginError: ""
                }
            });

            const updateConfig = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `${strapiUrl}/automations/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': strapiAccessToken
                },
                data: data
            };

            const updateResponse = await axios.request(updateConfig);
            console.log(JSON.stringify(updateResponse.data));
        } else {
            console.log('No automation found with the specified PAN number');
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateAutomationDob(panNumber, newDob) {
    try {
        // Perform GET request to retrieve the automations
        const getStatusUrl = `${strapiUrl}/automations`;
        const getStatusConfig = {
            method: 'get',
            url: getStatusUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': strapiAccessToken
            }
        };

        const getStatusResponse = await axios.request(getStatusConfig);
        const automations = getStatusResponse.data.data;
        const latestAutomation = automations.reverse().find(each => each.attributes.pan === panNumber && each.attributes.Status === "ERROR" && each.attributes.Comments === "DOB is Not Valid")
        if (latestAutomation) {
            // Proceed with PUT request to update the password
            const id = latestAutomation.id;
            const data = JSON.stringify({
                data: {
                    dob: newDob,
                    Status: "READY",
                    loginError: ""
                }
            });

            const updateConfig = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `${strapiUrl}/automations/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': strapiAccessToken
                },
                data: data
            };

            const updateResponse = await axios.request(updateConfig);
            console.log(JSON.stringify(updateResponse.data));
        } else {
            console.log('No automation found with the specified PAN number');
        }
    } catch (error) {
        console.log(error);
    }
}

async function sendInteractiveButtonsMessage(clientNumber, message, option1, option2) {
    const data = {
        body: message,
        buttons: [
            {
                text: option1
            }
        ]
    };
    if (option2) {
        data.buttons.push({ text: option2 });
    }

    const url = `${watiUrl}/sendInteractiveButtonsMessage?whatsappNumber=${clientNumber}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': watiAuthorization,
        'Cookie': 'affinity=1685794355.396.24331.730873|bf8d511e4b8b3863518b0325d212752c'
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.log(error);
    }
}

async function addChatMessageToConversation(chatMessage, id) {
    try {
        const existingData = await getDataFromStrapiTable(`msgScreens/${id}`)

        const existingChat = existingData.attributes.chat

        const updatedChat = `${existingChat}\n${chatMessage}`;

        const data = JSON.stringify({
            "data": {
                "chat": updatedChat
            }
        });

        const config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${strapiUrl}/msgscreens/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': strapiAccessToken
            },
            data: data
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error(error);
    }
}

async function updatePrismuserFlowPosition(id, clientFlowPosition) {
    try {
        const data = {
            data: {
                clientFlowPosition: clientFlowPosition
            }
        };

        const config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${strapiUrl}/prismusers/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': strapiAccessToken
            },
            data: JSON.stringify(data)
        };

        const response = await axios(config);
        console.log(JSON.stringify(response.data));
        console.log("Prism User Flow Position Updated!!")
    } catch (error) {
        console.log(error);
    }
}

async function addClientDraftSupportInformation(clientSupportInformation, clientNumber) {
    try {
        const data = {
            data: {
                draftSupportInformation: clientSupportInformation,
                clientNumber: clientNumber
            }
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${strapiUrl}/clientDocuments`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': strapiAccessToken
            },
            data: JSON.stringify(data)
        };

        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.log(error);
    }
}

async function createClientMessage(content, clientName, clientNumber, panNumber, clientFlowPosition, footer) {
    let messageToProfessional = `${content}\n`
    messageToProfessional += "Client Details are:\n\n"
    if (clientFlowPosition) {
        messageToProfessional += `clientFlowPositon - ${clientFlowPosition}\n`
    }
    messageToProfessional += `clientName - ${clientName}\n`
    messageToProfessional += `clientNumber - ${clientNumber}\n`
    if (panNumber) {
        messageToProfessional += `panNumber - ${panNumber}\n\n`
    }
    if (footer) {
        messageToProfessional += `${footer}`
    }
    return messageToProfessional;
}

async function sendTemplateMessage(whatsappNumber, templateName) {
    const options = {
        method: 'POST',
        url: `${watiUrl}/sendTemplateMessage?whatsappNumber=${whatsappNumber}`,
        headers: {
            'content-type': 'text/json',
            Authorization: watiAuthorization,
        },
        data: {
            parameters: [{ name: 'prism', value: 'client' }],
            template_name: templateName,
            broadcast_name: 'whatsapp_broadcast'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(JSON.stringify(response.data));
        console.log("Template Message sent to trigger Next Flow !!")
    } catch (error) {
        console.error(error);
        
    }
}

const checkPanApi = async (pan, aadhar) => {
    try {
        const authResponse = await axios.post(
            "https://api.sandbox.co.in/authenticate",
            null,
            {
                headers: {
                    Accept: "application/json",
                    "x-api-key": apiKey,
                    "x-api-secret": apiSecret,
                    "x-api-version": "1.0",
                    Origin: "*",
                },
            }
        );

        const authorizationToken = authResponse.data.access_token;

        const headers = {
            accept: "application/json",
            Authorization: authorizationToken,
            "x-api-key": apiKey,
            "x-api-version": "1.0",
            "content-type": "application/json",
        };

        const data = { pan: pan, consent: "y", reason: "For%2520KYC%2520of%2520User" };

        const response = await axios.post(
            "https://api.sandbox.co.in/kyc/pan",
            data,
            {
                headers: headers,
            }
        );

        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};

app.post("/clientCheck", async (request, response) => {
    const clientName = request.headers.clientname;
    const clientNumber = request.headers.clientnumber;
    // console.log(clientName,clientNumber)
    // console.log(request.headers)
    const prismClients = await getDataFromStrapiTable("prismusers");
    const clientCheck = prismClients.find((each) => each.attributes.clientNumber === clientNumber)
    // console.log(clientCheck)
    let data = {
        check: ""
    }
    if (clientCheck !== undefined) {
        data.check = "client found"
        console.log("client found");
    } else {
        data.check = "client not found"
        console.log("client not found")
    }
    response.json(data)
})

app.post("/wati", async (request, response) => {
    const requestData = request.body;
    // console.log(requestData);

    if (requestData.eventType === "newContactMessageReceived") {
        const newMessageData = {
            event_type: requestData.eventType,
            contact_id: requestData.id,
            created: requestData.created,
            contact_wa_id: requestData.waId,
            sender_name: requestData.senderName,
            source_id: requestData.sourceId,
            source_url: requestData.sourceUrl,
        };

        console.log("newContactMessageReceived");
        // console.log(newMessageData);

        const newClientData = {
            data: {
                clientNumber: newMessageData.contact_wa_id,
                clientName: newMessageData.sender_name,
            },
        };
        const clientDetails = {
            message: "New Client Message Received",
            clientNumber: newMessageData.contact_wa_id,
            clientName: newMessageData.sender_name,
        };

        try {
            // Logic for handling new contact messages
            await axios.post(`${strapiUrl}/prismusers`, newClientData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: strapiAccessToken,
                },
            });
            console.log("New Client inserted to PRISM USER!!");
            const gateKeeperNumber = "918121181212";
            await sendMsgToProfessionalOrClient(JSON.stringify(clientDetails), gateKeeperNumber);
            response.sendStatus(200);
        } catch (error) {
            console.log("error", error);
            response.sendStatus(200); // Send 500 Internal Server Error response if an error occurs during processing
        }
    } else if (requestData.eventType === "message") {
        const clientMessages = await getClientMessages(requestData.waId);
        // console.log(clientMessages)

        try {
            if (clientMessages[1].owner === true && clientMessages[1].text.includes("Invalid Password, Please retry.")) {
                if (clientMessages[0].text === "Re-Enter Password") {
                    // Logic for handling "Re-Enter Password" message
                    const message = "Please Re-Enter the Income Tax Password.";
                    await sendMsgToProfessionalOrClient(message, requestData.waId);
                    console.log("Re-Enter password message sent to Client!!");
                } else if (clientMessages[0].text === "Reset Password") {
                    // Logic for handling "Reset Password" message
                    const clientName = requestData.senderName;
                    const clientNumber = requestData.waId;
                    const prismUserDetails = await getPrismUserByClientNumber(clientNumber)
                    const professionals = await getDataFromStrapiTable("professionals");
                    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;

                    let message = "Client requested to reset password, details given below:\n\n";
                    message += `clientName - ${clientName}\n`;
                    message += `clientNumber - ${clientNumber}\n`;
                    await sendMsgToProfessionalOrClient(message, professionalPhoneNumber);
                }
            } else if (clientMessages[1].owner === true && clientMessages[1].text === "Please Re-Enter the Income Tax Password.") {
                // Logic for handling re-entered income tax password
                const reEnteredIncomeTaxPassword = clientMessages[0].text;
                const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                const prismUserId = prismUserDetails.id;
                const panNumber = prismUserDetails.attributes.panNumber;
                await updatePrismuser(prismUserId, reEnteredIncomeTaxPassword);
                await updateAutomationPassword(panNumber, reEnteredIncomeTaxPassword);
                console.log("Income tax password updated with the latest one!!");
                const messageToClient = "We have recieved your new income tax password, please wait while we process. We will update your status soon!"
                await sendMsgToProfessionalOrClient(messageToClient, requestData.waId)
            } else if (clientMessages[1].owner === true && clientMessages[1].text.includes("Do you want to Link PAN and Aadhar")) {
                if (clientMessages[0].text === "Yes") {
                    const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                    const { clientName, clientNumber, panNumber } = prismUserDetails.attributes;

                    const clientFlowPosition = "panAadharLink"
                    await updatePrismuserField(prismUserDetails.id, "clientFlowPosition", clientFlowPosition)
                    console.log("clientFlowposition updated to PanAadharLink !!")
                }
            } else if (clientMessages[1].owner === true && clientMessages[1].text.includes("Invalid DOB, Please retry.")) {
                if (clientMessages[0].text === "Re-Enter DOB") {
                    // Logic for handling "Re-Enter Password" message
                    const message = "Please re-enter your date of birth in the format DDMMYYYY.";
                    await sendMsgToProfessionalOrClient(message, requestData.waId);
                    console.log("Re-Enter DOB message sent to Client!!");
                }
            } else if (clientMessages[1].owner === true && clientMessages[1].text === "Please re-enter your date of birth in the format DDMMYYYY.") {
                // Logic for handling re-entered income tax password
                const reEnteredDob = clientMessages[0].text;
                const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                const prismUserId = prismUserDetails.id;
                const panNumber = prismUserDetails.attributes.panNumber;
                await updatePrismuserField(prismUserId, "dob", reEnteredDob);
                await updateAutomationDob(panNumber, reEnteredDob);
                console.log("Income tax DOB updated with the latest one!!");
                const messageToClient = "We have recieved your new DOB, please wait while we process. We will update your status soon!"
                await sendMsgToProfessionalOrClient(messageToClient, requestData.waId)
            } else if (clientMessages[2].owner === true && clientMessages[2].text.includes("Tax Summary Report")) {
                if (clientMessages[0].text === "Yes") {
                    // Logic for handling "Yes" response for Tax Summary Report
                    const messageToClient = "Please Upload the documents";
                    await sendMsgToProfessionalOrClient(messageToClient, requestData.waId);
                } else if (clientMessages[0].text === "No") {
                    // Logic for handling "No" response for Tax Summary Report
                    const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                    const professionals = await getDataFromStrapiTable("professionals");
                    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;

                    let messageToProfessional = "Client has approved Tax Summary Report, Please Select the Plan based on Tax Summary Report, Client Details are: \n\n";
                    const { clientName, clientNumber, panNumber } = prismUserDetails.attributes;
                    messageToProfessional += `clientName - ${clientName}\n`;
                    messageToProfessional += `panNumber - ${panNumber}\n`;
                    messageToProfessional += `clientNumber - ${clientNumber}\n`;
                    await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber);
                }
            } else if (clientMessages[1].owner === true && clientMessages[1].text.includes("Do you Want to Make Any Changes in the Tax Summary Report")) {
                if (clientMessages[0].text === "Yes") {
                    const messageToClient = "Please Upload the documents";
                    await sendMsgToProfessionalOrClient(messageToClient, requestData.waId);
                }
                else if (clientMessages[0].text === "No") {
                    const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                    const professionals = await getDataFromStrapiTable("professionals");
                    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;

                    let messageToProfessional = "Client has approved Tax Summary Report, Please Select the Plan based on Tax Summary Report, Client Details are: \n\n";
                    const { clientName, clientNumber, panNumber } = prismUserDetails.attributes;
                    messageToProfessional += `clientName - ${clientName}\n`;
                    messageToProfessional += `panNumber - ${panNumber}\n`;
                    messageToProfessional += `clientNumber - ${clientNumber}\n`;
                    await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber);
                }
            } else if (clientMessages[0].owner === true && clientMessages[0].text.includes("Do you Want to Make Any Changes in the Tax Summary Report")) {
                if (clientMessages[0].text === "Yes") {
                    const messageToClient = "Please Upload the documents";
                    await sendMsgToProfessionalOrClient(messageToClient, requestData.waId);
                }
                else if (clientMessages[0].text === "No") {
                    const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                    const professionals = await getDataFromStrapiTable("professionals");
                    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;

                    let messageToProfessional = "Client has approved Tax Summary Report, Please Select the Plan based on Tax Summary Report, Client Details are: \n\n";
                    const { clientName, clientNumber, panNumber } = prismUserDetails.attributes;
                    messageToProfessional += `clientName - ${clientName}\n`;
                    messageToProfessional += `panNumber - ${panNumber}\n`;
                    messageToProfessional += `clientNumber - ${clientNumber}\n`;
                    await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber);
                }
            } else if (clientMessages[1].owner === true && clientMessages[1].text.includes("is the Draft Computation")) {
                if (clientMessages[0].text === "Yes") {
                    // Logic for handling "Yes" 
                    const messageToClient = "Please Upload supporting Information to change the Draft Computation";
                    await sendMsgToProfessionalOrClient(messageToClient, requestData.waId);
                } else if (clientMessages[0].text === "No") {
                    // Logic for handling "No" 
                    const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                    const professionals = await getDataFromStrapiTable("professionals");
                    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;

                    let messageToProfessional = "Client has Approved Computation Sheet, Please make Tax payment or File Income Tax return, Client Details are: \n\n";
                    const { clientName, clientNumber, panNumber } = prismUserDetails.attributes;
                    messageToProfessional += `clientName - ${clientName}\n`;
                    messageToProfessional += `panNumber - ${panNumber}\n`;
                    messageToProfessional += `clientNumber - ${clientNumber}\n`;
                    await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber);
                }
            } else if (clientMessages[0].owner === false && clientMessages[0].text !== null) {
                const prismUserDetails = await getPrismUserByClientNumber(requestData.waId);
                if (prismUserDetails) {
                    const { clientName, clientNumber, panNumber, chatStatus, clientFlowPosition } = prismUserDetails.attributes
                    if (chatStatus === "on") {
                        const msgscreenDetails = await getDataFromStrapiTable("msgscreens")
                        const clientDetails = msgscreenDetails.find(each => each.attributes.clientNumber === requestData.waId)
                        const clientChatId = clientDetails.id
                        console.log(clientChatId)

                        const chatMessage = `client - ${requestData.text}`
                        await addChatMessageToConversation(chatMessage, clientChatId)
                        console.log("client message is added to the chat !!")

                        const professionals = await getDataFromStrapiTable("professionals");
                        const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
                        const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;
                        let messageToProfessional = "Client message received. Client details given below:\n\n";
                        messageToProfessional += `${chatMessage}\n\n`;
                        messageToProfessional += `clientName - ${clientName}\n`;
                        messageToProfessional += `panNumber - ${panNumber}\n`;
                        messageToProfessional += `clientNumber - ${clientNumber}\n`;
                        await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber)
                        console.log("client message sent to the professional !!")
                    }
                    if (clientFlowPosition === "draftComputationSent") {
                        const clientSupportInformation = requestData.text
                        await addClientDraftSupportInformation(clientSupportInformation, requestData.waId)
                        console.log("draft support information is added to the client documents !!")
                    }
                }
            }
            response.sendStatus(200);
        } catch (error) {
            console.log("error", error);
            response.sendStatus(200); // Send 500 Internal Server Error response if an error occurs during processing
        }
    } else {
        response.sendStatus(200);
    }
});

app.post("/clientDocuments", upload.single('image'), async (request, response) => {
    try {
        const documentData = request.body;

        if (documentData && documentData.data) {
            if (documentData.type === "document") {
                const { text, data, waId } = documentData;
                const watiFileName = data.split("=");
                const fileName = watiFileName[watiFileName.length - 1];
                const url = 'https://live-server-105950.wati.io/api/v1/getMedia';
                const mediaResponse = await axios.get(`${url}?fileName=${encodeURIComponent(fileName)}`, {
                    headers: {
                        'Authorization': watiAuthorization
                    },
                    responseType: 'arraybuffer'
                });
                const bufferFile = mediaResponse.data;
                await fs.promises.writeFile(`${text}`, bufferFile);
                const formData = new FormData();
                formData.append('files.document', fs.createReadStream(`${text}`));
                formData.append('data', `{"clientNumber":"${waId}"}`);
                const config = {
                    method: 'post',
                    maxContentLength: Infinity,
                    url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/clientdocuments',
                    headers: {
                        'Authorization': strapiAccessToken,
                        ...formData.getHeaders()
                    },
                    data: formData
                };
                await axios.request(config);
                await fs.promises.unlink(`${text}`);
            } else if (documentData.type === "image") {
                const { data, waId } = documentData;
                const watiFileName = data.split("=");
                const fileName = watiFileName[watiFileName.length - 1];
                const url = 'https://live-server-105950.wati.io/api/v1/getMedia';
                const mediaResponse = await axios.get(`${url}?fileName=${encodeURIComponent(fileName)}`, {
                    headers: {
                        'Authorization': watiAuthorization
                    },
                    responseType: 'arraybuffer'
                });
                const bufferFile = mediaResponse.data;
                await fs.promises.writeFile(`image.jpg`, bufferFile);
                const formData = new FormData();
                formData.append('files.document', fs.createReadStream("./image.jpg"));
                formData.append('data', `{"clientNumber":"${waId}"}`);
                const config = {
                    method: 'post',
                    maxContentLength: Infinity,
                    url: `${strapiUrl}/clientdocuments`,
                    headers: {
                        'Authorization': strapiAccessToken,
                        ...formData.getHeaders()
                    },
                    data: formData
                };
                await axios.request(config);
                await fs.promises.unlink(`./image.jpg`);
            }
            response.sendStatus(200);
        } else {
            response.sendStatus(200);
        }
    } catch (error) {
        console.error(error);
        response.sendStatus(200);
    }
});

app.post("/pan", async (request, response) => {
    try {
        const { pan, aadhar } = request.body;
        const clientName = request.headers.clientname;
        const clientNumber = request.headers.clientnumber;
        const prismClients = await getDataFromStrapiTable("prismusers");
        const existingUser = prismClients.find(
            (client) => client.attributes.panNumber === pan
        );
        if (existingUser) {
            const existingUserId = existingUser.id;
            const data = {
                data: {
                    panVerification: true,
                    panNumber: pan,
                    aadharNumber: aadhar,
                    clientName: clientName + "(" + pan + ")"
                },
            };
            const config = {
                method: "put",
                maxBodyLength: Infinity,
                url: `${strapiUrl}/prismusers/${existingUserId}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: strapiAccessToken,
                },
                data: JSON.stringify(data),
            };

            await axios.request(config);
            const flowPosition = "panVerified"
            await updatePrismuserField(existingUserId,"clientFlowPosition", flowPosition)
            console.log("Prism User PAN Verification completed!!");
        }
        const clientId = existingUser.id
        await addAdminUserToPrismUser(clientId, 4)
        console.log("Admin User is added to the Prism User !!")

        const gateKeeperNumber = "918121181212";
        const messageContent = "A new client has been added to PRISM,"
        const footer = "Please assign it to any Professional."
        const clientFlowPosition = "New Client"
        const messageToGateKeeper = await createClientMessage(messageContent, clientName, clientNumber, pan, clientFlowPosition, footer)
        await sendMsgToProfessionalOrClient(messageToGateKeeper, gateKeeperNumber)
        console.log("New client details sent to the GateKeeper!!")

        const authResponse = await axios.post(
            "https://api.sandbox.co.in/authenticate",
            null,
            {
                headers: {
                    Accept: "application/json",
                    "x-api-key": apiKey,
                    "x-api-secret": apiSecret,
                    "x-api-version": "1.0",
                    Origin: "*",
                },
            }
        );
        const authorizationToken = authResponse.data.access_token;

        const headers = {
            accept: "application/json",
            Authorization: authorizationToken,
            "x-api-key": apiKey,
            "x-api-version": "1.0",
            "content-type": "application/json",
        };
        const panDetailsData = { pan: pan, consent: "y", reason: "For%2520KYC%2520of%2520User" };
        const options1 = {
            method: "POST",
            url: "https://api.sandbox.co.in/kyc/pan",
            headers: headers,
            data: panDetailsData,
        };

        const panResponse = await axios.request(options1);
        console.log(panResponse.data.data);

        const userPanDetails = panResponse.data
        await addPanDetailsToSandbox(pan, userPanDetails, clientName, clientNumber);

        const aadharSeedingStatus = panResponse.data.data.aadhaar_seeding_status === "Y" ? "Yes" : "No"
        const panDetailsMessage = `PAN: ${panResponse.data.data.pan}\nName on PAN Card: ${panResponse.data.data.full_name}\nAadhar Seeding Status: ${aadharSeedingStatus}`
        await sendMsgToProfessionalOrClient(panDetailsMessage, clientNumber)
        const seedingStatus = {
            aadharSeedingStatus: aadharSeedingStatus
        }
        // response.sendStatus(200)
        response.json(seedingStatus)
    } catch (error) {
        console.error(error);
        response.status(500).send("Error occurred");
    }
});

app.post("/panAadharLinkStatus", async (request, response) => {
    try {
        const { pan, aadhar } = request.body;
        const clientName = request.headers.clientname;
        const clientNumber = request.headers.clientnumber;

        const authResponse = await axios.post(
            "https://api.sandbox.co.in/authenticate",
            null,
            {
                headers: {
                    Accept: "application/json",
                    "x-api-key": apiKey,
                    "x-api-secret": apiSecret,
                    "x-api-version": "1.0",
                    Origin: "*",
                },
            }
        );
        const authorizationToken = authResponse.data.access_token;

        const headers = {
            accept: "application/json",
            Authorization: authorizationToken,
            "x-api-key": apiKey,
            "x-api-version": "1.0",
            "content-type": "application/json",
        };
        const panAadharStatus = await axios.get(
            `https://api.sandbox.co.in/it-tools/pans/${pan}/pan-aadhaar-status?aadhaar_number=${aadhar}`,
            {
                headers,
            }
        );
        const statusOfPanAadhar = {
            linkStatus: panAadharStatus.data.data.message
        }
        console.log(statusOfPanAadhar)
        response.json(statusOfPanAadhar);
    } catch (error) {
        response.sendStatus(500)
        console.log(error.message)
    }
})

app.post("/incomeTaxPortalRegistration", async (request, response) => {
    const { pan } = request.body
    const prismClients = await getDataFromStrapiTable("prismusers");
    const existingUser = prismClients.find(
        (client) => client.attributes.panNumber === pan
    );
    if (existingUser) {
        await updatePrismuserField(existingUser.id,"clientFlowPosition", "incomeTaxPortalRegistration")
        console.log("Client Flow Position updated to incomeTaxPortalRegistration !!")
    }
    response.sendStatus(200)
})

app.post("/panRegistrationCheck", async (request, response) => {
    const clientName = request.headers.clientname;
    const clientNumber = request.headers.clientnumber;
    const { pan } = request.body
    await addDetailsTOAutomation("automations", pan)
    // const prismUserDetails = await getPrismUserByClientNumber(clientNumber);
    // const professionals = await getDataFromStrapiTable("professionals");
    // const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
    // const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;
    // const content = "The client is unsure whether they are already registered on the Income Tax Portal."
    // const messageToProfessional = await createClientMessage(content, clientName, clientNumber, pan)
    // await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber)
    response.sendStatus(200)
})

app.post("/clientAdd", async (request, response) => {
    // console.log(request.headers)
    const { clientname, clientnumber } = request.headers
    const { panNumber } = request.body
    // console.log(clientname, clientnumber)
    const prismClients = await getDataFromStrapiTable("prismusers");
    const clientNumberCheck = prismClients.find((each) => each.attributes.panNumber === panNumber)
    const filteredClients = prismClients.filter((client) => {
        return (
            client.attributes.clientNumber === clientnumber
        );
    });
    if (clientNumberCheck === undefined) {
        if (filteredClients.length > 0) {
            for (eachClient of filteredClients) {
                await updatePrismuserField(eachClient.id, "status", "Inactive")
            }
        }
        const newClientData = {
            data: {
                clientNumber: clientnumber,
                clientName: clientname,
                panNumber: panNumber,
                status: "Active",
            },
        };

        try {
            await axios.post(`${strapiUrl}/prismusers`, newClientData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: strapiAccessToken,
                },
            });
            console.log("New Client inserted to PRISM USER!!");
        } catch (error) {
            console.log("error", error);
        }
        response.sendStatus(200)
    } else if (clientNumberCheck) {
        // console.log("filtered clients")
        // console.log(filteredClients)
        if (filteredClients.length > 0) {
            for (eachClient of filteredClients) {
                if (eachClient.attributes.panNumber !== panNumber) {
                    await updatePrismuserField(eachClient.id, "status","Inactive")
                }
                else if (clientNumberCheck.attributes.clientNumber !== clientnumber) {
                    console.log("new number with existing pan found...........................")
                }
                else {
                    await updatePrismuserField(eachClient.id,"status", "Active")
                }
            }
            response.sendStatus(201)
        }
    }
    else {
        response.sendStatus(200)
    }
})

app.post("/prismUser", async (request, response) => {
    try {
        const clientName = request.headers.clientname;
        const clientNumber = request.headers.clientnumber;
        const panNo = request.body.pan;
        const prismClients = await getDataFromStrapiTable("prismusers");
        const existingUser = prismClients.find(
            (client) => client.attributes.clientNumber === clientNumber
        );

        if (existingUser) {
            const existingUserId = existingUser.id;
            const data = {
                data: {
                    panVerification: true,
                    panNumber: panNo,
                    clientName: clientName + "(" + panNo + ")"
                },
            };
            const config = {
                method: "put",
                maxBodyLength: Infinity,
                url: `${strapiUrl}/prismusers/${existingUserId}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: strapiAccessToken,
                },
                data: JSON.stringify(data),
            };

            await axios.request(config);
            const flowPosition = "panVerified"
            await updatePrismuserField(existingUserId,"clientFlowPosition", flowPosition)
            console.log("Prism User PAN Verification completed!!");
        }

        response.sendStatus(200);
    } catch (error) {
        console.error(error);
        response.status(500).send("Error occurred");
    }
});

app.post("/incomeTaxPassword", async (request, response) => {
    // console.log(request.body);
    try {
        const incomeTaxPassword = request.body.incomeTaxPassword
        const panNumber = request.body.panNumber

        const prismClients = await getDataFromStrapiTable("prismusers");
        const existingUser = prismClients.find(
            (client) => client.attributes.panNumber === panNumber
        );
        // console.log(existingUser)
        if (existingUser) {
            const existingUserId = existingUser.id;
            await updatePrismuser(existingUserId, incomeTaxPassword);
            console.log("Income Tax Password is Added to Prism User!!");
        }
        response.sendStatus(200);
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Error occurred");
    }
});

app.post("/dob", async (request, response) => {
    // console.log(request.headers.incomeTaxPassword);
    try {
        const dob = request.body.dob
        const panNumber = request.body.panNumber
        const incomeTaxPassword = request.body.incomeTaxPassword

        const prismClients = await getDataFromStrapiTable("prismusers");
        const existingUser = prismClients.find(
            (client) => client.attributes.panNumber === panNumber
        );
        // console.log(existingUser)
        if (existingUser) {
            const existingUserId = existingUser.id;
            await updatePrismuserField(existingUserId, "dob", dob);
            await addDetailsTOAutomation("automations", panNumber, incomeTaxPassword, dob)
            await addDetailsTOAutomation("testautomations", panNumber, incomeTaxPassword, dob)
            console.log("DOB is added to Prism User!!");
            console.log("clientDetails added to AUTOMATIONS!!")
        }
        response.sendStatus(200);
    } catch (error) {
        console.error(error);
        response.status(200).send("Error occurred");
    }
});

app.post("/paymentStatus", async (request, response) => {
    console.log(request.body)
    const { event, payload } = request.body
    if (event === 'payment_link.paid') {
        const { order, payment, payment_link } = payload
        console.log(payment_link)
        const paymentLink = payment_link.entity.short_url
        const paymentsData = await getDataFromStrapiTable('payments')
        const paymentRow = paymentsData.find(each => each.attributes.paymentLink === paymentLink)
        const paymentRowId = paymentRow.id
        try {
            const data = {
                data: {
                    status: "paid"
                },
            };
            const config = {
                method: "put",
                maxBodyLength: Infinity,
                url: `${strapiUrl}/payments/${paymentRowId}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: strapiAccessToken,
                },
                data,
            };

            await axios.request(config);
            console.log("Payment status changed to completed!!");

            response.sendStatus(200);
        } catch (error) {
            console.error(error);
            response.status(500).send("Error occurred");
        }

    }
})

app.post("/sendPlanAndQRForPayment", async (request, response) => {
    // console.log(request.body)
    const { plan, clientNumber } = request.body
    let planPath = `C:/Users/Administrator/harish/prismPlans/${plan}.jpg`
    const qrCodePath = "C:/Users/Administrator/harish/prismPlans/QRcode.jpg"
    let planText = ""
    if (plan === "basic") {
        planText = "We have selected the perfect plan for you i.e., Prism Basic\nPlease the Rs. 499 to our UPI ID: viderbusiness@ybl or through scanning the QR code above."
    } else if (plan === "pro") {
        planText = "We have selected the perfect plan for you i.e., Prism Pro\nPlease the Rs. 999 to our UPI ID: viderbusiness@ybl or through scanning the QR code above."
    } else if (plan === "proMax") {
        planText = "We have selected the perfect plan for you i.e., Prism Pro Max\nPlease the Rs. 1,999 to our UPI ID: viderbusiness@ybl or through scanning the QR code above."
    }

    await sendFileToClient(planPath, clientNumber)
    await sendFileToClient(qrCodePath, clientNumber)
    await sendMsgToProfessionalOrClient(planText, clientNumber)
    const prismUserDetails = await getPrismUserByClientNumber(clientNumber)
    await updatePrismuserField(prismUserDetails.id,"clientFlowPosition","planSelected")
    console.log("Plan and QR code sent to the Client !!")
})

app.post('/generateAndSaveTsrPdf', (req, res) => {
    const postData = req.body; // Access the posted data here
    const headers = {
        'Content-Type': 'application/json',
        Authorization: strapiAccessToken,
    };

    // Do whatever you want with the posted data
    console.log("data recived", postData);
    const panNumber = postData.panNumber
    try {
        async function fetchData(table, panNumber) {
            try {
                // const url=`http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/${table}?filters[pannumber][$eq]=${pannumber}`
                let url = `http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/${table}?filters[pannumber][$eq]=${panNumber}&sort[1]=id:desc&pagination[start]=0&pagination[limit]=1`;
                if (table === 'api/main26aspersonaldetails') {
                    url = `http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/${table}?filters[PermanentAccountNumberPan][$eq]=${panNumber}`;
                } else if (table === 'api/tistabledetails') {
                    url = `http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/${table}?filters[panNamber][$eq]=${panNumber}&sort[1]=id:desc`;
                }
                const response = await axios.get(url, { headers });
                const responseData = response.data;
                //console.log('Received data:', responseData.data);
                return responseData.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        }

        async function fetchDataForAllTables() {
            // const apiTableList = ['api/main26aspersonaldetails', 'api/taxpart1s', 'api/taxpart2s', 'api/taxpart3s', 'api/taxpart4s', 'api/taxpart5s', 'api/taxpart6s', 'api/taxpart7s', 'api/textpart8s', 'api/taxpart9s', 'api/taxpart10s', 'api/tistabledetails', 'api/ais-details']
            const apiTableList = ['api/form26tables', 'api/tistabledetails', 'api/ais-details'];
            // 'api/tissampletables'
            const partsList = [
                { panDetails: "" },
                { part1: "" },
                { part2: "" },
                { part3: "" },
                { part4: "" },
                { part5: "" },
                { part6: "" },
                { part7: "" },
                { part8: "" },
                { part9: "" },
                { part10: "" },
                { tisDetails: "" },
                { aisDetails: "" },
                { tissampletables: "" }
            ];

            for (let table of apiTableList) {
                try {
                    const data = await fetchData(table, panNumber);
                    // console.log(data)

                    if (table === 'api/main26aspersonaldetails') {
                        // console.log(data.length)
                        if (data.length > 0) {
                            const objList = data[0].attributes
                            const excelObject = {
                                fileCreationDate: objList.fileCreationDate,
                                permanentAccountNumberPan: objList.PermanentAccountNumberPan,
                                currentStatusofPAN: objList.currentStatusofPAN,
                                financialYear: objList.financialYear,
                                assessmentYear: objList.assessmentYear,
                                nameofAssessee: objList.nameofAssessee,
                                addressLine1: objList.addressLine1,
                                addressLine2: objList.addressLine2,
                                addressLine3: objList.addressLine3,
                                addressLine4: objList?.addressLine4,
                                addressLine5: objList?.addressLine5,
                                statecode: objList.statecode,
                                pinCode: objList.pinCode,
                            }
                            partsList[0]['panDetails'] = excelObject
                        }

                    }
                    if (table === 'api/taxpart1s') {
                        const section = [
                            '192',
                            '192A',
                            '193',
                            '194',
                            '194A',
                            '194B',
                            '194BB',
                            '194C',
                            '194D',
                            '194DA',
                            '194E',
                            '194EE',
                            '194F',
                            '194G',
                            '194H',
                            '194I(a)',
                            '194I(b)',
                            '194IC',
                            '194JA',
                            '194JB',
                            '194K',
                            '194LA',
                            '194LB',
                            '194LC',
                            '194LBA',
                            '194LBB',
                            '194LBC',
                            '194R',
                            '194LD',
                            '194N',
                            '194O',
                            '194P',
                            '194Q',
                            '195',
                            '196A',
                            '196B',
                            '196C',
                            '196D',
                            '196DA'
                        ];

                        const description = [
                            'Salary',
                            'TDS on PF withdrawal',
                            'Interest on Securities',
                            'Dividends',
                            'Interest other than "Interest on securities"',
                            'Winning from lottery or crossword puzzle',
                            'Winning from horse race',
                            'Payments to contractors and sub-contractors',
                            'Insurance commission',
                            'Payment in respect of life insurance policy',
                            'Payments to non-resident sportsmen or sports associations',
                            'Payments in respect of deposits under National Savings Scheme',
                            'Payments on account of repurchase of units by Mutual Fund or Unit Trust of India',
                            'Commission, price, etc. on sale of lottery tickets',
                            'Commission or brokerage',
                            'Rent on hiring of plant and machinery',
                            'Rent on other than plant and machinery',
                            'Payment under specified agreement',
                            'Fees for technical services',
                            'Fees for professional services or royalty etc',
                            'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India',
                            'Payment of compensation on acquisition of certain immovable',
                            'Income by way of Interest from Infrastructure Debt fund',
                            'Income by way of interest from specified company payable to a non-resident',
                            'Certain income from units of a business trust',
                            'Income in respect of units of investment fund',
                            'Income in respect of investment in securitization trust',
                            'Benefits or perquisites of business or profession',
                            'TDS on interest on bonds / government securities',
                            'Payment of certain amounts in cash',
                            'Payment of certain sums by e-commerce operator to e-commerce participant',
                            'Deduction of tax in case of specified senior citizen',
                            'Deduction of tax at source on payment of certain sum for purchase of goods',
                            'Other sums payable to a non-resident',
                            'Income in respect of units of non-residents',
                            'Payments in respect of units to an offshore fund',
                            'Income from foreign currency bonds or shares of Indian',
                            'Income of foreign institutional investors from securities',
                            'Income of specified fund from securities'
                        ]

                        const sourceofIncome = [
                            'Salary',
                            'Salary',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Other Sources',
                            'Other Sources',
                            'Business/Profession',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Payments to non-resident sportsmen or sports associations',
                            'Payments in respect of deposits under National Savings Scheme',
                            'Payments on account of repurchase of units by Mutual Fund or Unit Trust of India',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'House Property',
                            'Business/Profession | Capital Gain | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India',
                            'Business/Profession | Capital Gain',
                            'Income by way of Interest from Infrastructure Debt fund',
                            'Income by way of interest from specified company payable to a non-resident',
                            'Certain income from units of a business trust',
                            'Income in respect of units of investment fund',
                            'Income in respect of investment in securitization trust',
                            'Business/Profession',
                            'TDS on interest on bonds / government securities',
                            'Payment of certain amounts in cash',
                            'Business/Profession',
                            'Deduction of tax in case of specified senior citizen',
                            'Business/Profession',
                            'House Property | Business/Profession | Capital Gain | Other Sources',
                            'Income in respect of units of non-residents',
                            'Payments in respect of units to an offshore fund',
                            'Income from foreign currency bonds or shares of Indian',
                            'Income of foreign institutional investors from securities',
                            'Income of specified fund from securities'
                        ];

                        console.log(section.length)
                        console.log(description.length)
                        console.log(sourceofIncome.length)
                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        //console.log(data)
                        data.forEach(i => {
                            const objList = i.attributes;
                            if (objList.mainSno === mainno) {
                                const sectionArray = data
                                    .filter(item => item.attributes.mainSno === mainno)
                                    .map(item => item.attributes.Section);
                                const uniqueSections = [...new Set(sectionArray)];
                                // console.log(uniqueSections);
                                if (uniqueSections.length > 1) {
                                    // console.log("section Iteration");
                                    uniqueSections.forEach(sec => {
                                        const index = section.indexOf(sec);
                                        // console.log("Index of section", index);
                                        let totalAmountPaid = 0;
                                        let totalTDSDeposited = 0;
                                        let count = 0;
                                        data.forEach(item => {
                                            if (item.attributes.mainSno === mainno && item.attributes.Section === sec) {
                                                count += 1;
                                                // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                totalAmountPaid += parseFloat(item.attributes.AmountPaidCreditedInRs);
                                                totalTDSDeposited += parseFloat(item.attributes.TDSDepositedInRs);
                                            }
                                        });
                                        const excelObject = {
                                            sno: sno,
                                            section: sec,
                                            description: description[index],
                                            sourceofIncome: sourceofIncome[index],
                                            nameofDeductor: objList.mainNameofDeductor,
                                            TANofDeductor: objList.mainTANofDeductor,
                                            totalAmountPaidorCredited: totalAmountPaid,
                                            totalTaxDeducted: objList.mainTotalTaxDeducted,
                                            totalTDSDeposited: totalTDSDeposited
                                        };
                                        sno += 1;
                                        partSection.push(excelObject);
                                        // console.log("Total Amount Paid: ", totalAmountPaid);
                                        // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                    });
                                } else {
                                    const sectionId = objList.Section;
                                    const index = section.indexOf(sectionId);
                                    //console.log("Index of section", index);
                                    const excelObject = {
                                        sno: sno,
                                        section: sectionId,
                                        description: description[index],
                                        sourceofIncome: sourceofIncome[index],
                                        nameofDeductor: objList.mainNameofDeductor,
                                        TANofDeductor: objList.mainTANofDeductor,
                                        totalAmountPaidorCredited: objList.mainTotalAmountPaid,
                                        totalTaxDeducted: objList.mainTotalTaxDeducted,
                                        totalTDSDeposited: objList.mainTotalTDSDeposited
                                    };
                                    sno += 1;
                                    partSection.push(excelObject);
                                }
                                mainno += 1;
                                //console.log(sectionArray);
                            }
                        });

                        // console.log("excel Object Result :",partSection)
                        partsList[1]['part1'] = partSection
                        //  console.log(partSection)


                    } else if (table === 'api/taxpart2s') {
                        const section = ['192A', '193', '194', '194A', '194D', '194DA', '194EE', '194-I(a)', '194-I(b)', '194k'];
                        const description = [
                            'TDS on PF withdrawal',
                            'Interest on Securities',
                            'Dividends',
                            "Interest other than 'Interest on securities'",
                            'Insurance commission',
                            'Payment in respect of life insurance policy',
                            'Payments in respect of deposits under National Savings Scheme',
                            'Rent on hiring of plant and machinery',
                            'Rent on other than plant and machinery',
                            'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India'
                        ];

                        const sourceofIncome = [
                            'Salary',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Business/Profession | Other Sources',
                            'Payments in respect of deposits under National Savings Scheme',
                            'Business/Profession | Other Sources',
                            'House Property',
                            'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India'
                        ]

                        // console.log(section.length, description.length,sourceofIncome.length)
                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            //console.log(objList)
                            if (objList.mainSno === mainno) {
                                const sectionArray = data
                                    .filter(item => item.attributes.mainSno === mainno)
                                    .map(item => item.attributes.Section);
                                const uniqueSections = [...new Set(sectionArray)];
                                // console.log(uniqueSections);
                                if (uniqueSections.length > 1) {
                                    uniqueSections.forEach(sec => {
                                        const index = section.indexOf(sec);
                                        // console.log("Index of section", index);
                                        let totalAmountPaid = 0;
                                        let totalTDSDeposited = 0;
                                        let count = 0;
                                        data.forEach(item => {
                                            if (item.attributes.mainSno === mainno && item.attributes.Section === sec) {
                                                count += 1;
                                                // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                totalAmountPaid += parseFloat(item.attributes.AmountPaidCreditedRs);
                                                totalTDSDeposited += parseFloat(item.attributes.TDSDepositedRs);
                                            }
                                        });
                                        const excelObject = {
                                            sno: sno,
                                            section: sec,
                                            description: description[index],
                                            sourceofIncome: sourceofIncome[index],
                                            nameofDeductor: objList.mainNameofDeductor,
                                            TANofDeductor: objList.mainTANofDeductor,
                                            totalAmountPaidorCredited: totalAmountPaid,
                                            totalTaxDeducted: objList.mainTotalTaxDeducted,
                                            totalTDSDeposited: totalTDSDeposited
                                        };
                                        sno += 1;
                                        partSection.push(excelObject);
                                        // console.log("Total Amount Paid: ", totalAmountPaid);
                                        // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                    })
                                } else {
                                    const sectionId = objList.Section
                                    const index = await section.indexOf(`${sectionId}`)
                                    //console.log("Index of section", index)
                                    const excelObject = {
                                        sno: sno,
                                        section: sectionId,
                                        description: description[index],
                                        sourceofIncome: sourceofIncome[index],
                                        nameofDeductor: objList.mainNameofDeductor,
                                        TANofDeductor: objList.mainTANofDeductor,
                                        totalAmountPaidorCredited: objList.mainTotalAmountPaidorCredited,
                                        totalTaxDeducted: objList.mainTotalTaxDeducted,
                                        totalTDSDeposited: objList.mainTotalTDSDeposited
                                    }
                                    sno += 1
                                    partSection.push(excelObject)
                                }
                                mainno += 1

                            }
                        }
                        //console.log("excel part2 Object Result :",partSection)
                        partsList[2]['part2'] = partSection
                        //console.log("part 2 section wise",partSection)

                    } else if (table === 'api/taxpart3s') {
                        const section = [
                            'Proviso to section 194B',
                            'First Proviso to Sub-Section (1) of Section 194R',
                            'Proviso to Sub-Section (1) of Section 194S'
                        ];
                        const description = [
                            "Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released",
                            "Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released",
                            "Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released"
                        ];

                        const sourceofIncome = [
                            'Other Sources',
                            'Business/Profession',
                            'Business/Profession | Capital Gain'
                        ]

                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            // console.log(objList)
                            if (objList.mainSno === mainno) {
                                const sectionArray = data
                                    .filter(item => item.attributes.mainSno === mainno)
                                    .map(item => item.attributes.Section);
                                const uniqueSections = [...new Set(sectionArray)];
                                if (uniqueSections.length > 1) {
                                    uniqueSections.forEach(sec => {
                                        const index = section.indexOf(sec);
                                        // console.log("Index of section", index);
                                        let totalAmountPaid = 0;

                                        let count = 0;
                                        data.forEach(item => {
                                            if (item.attributes.mainSno === mainno && item.attributes.Section === sec) {
                                                count += 1;
                                                // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                totalAmountPaid += parseFloat(item.attributes.AmountPaidCreditedRs);

                                            }
                                        });
                                        const excelObject = {
                                            sno: sno,
                                            section: sec,
                                            description: description[index],
                                            sourceofIncome: sourceofIncome[index],
                                            nameofDeductor: objList.mainNameofDeductor,
                                            TANofDeductor: objList.mainTANofDeductor,
                                            totalAmountPaidorCredited: totalAmountPaid,


                                        };
                                        sno += 1;
                                        partSection.push(excelObject);
                                    })
                                } else {

                                    const sectionId = objList.Section
                                    // console.log("sectionId :",sectionId)
                                    const index = await section.indexOf(`${sectionId}`)
                                    //console.log("Index of section", index)
                                    const excelObject = {
                                        sno: sno,
                                        section: sectionId,
                                        description: description[index],
                                        sourceofIncome: sourceofIncome[index],
                                        nameofDeductor: objList.mainNameofDeductor,
                                        TANofDeductor: objList.mainTANofDeductor,
                                        totalAmountPaidorCredited: objList.mainTotalAmountPaidorCredited,
                                    }
                                    sno += 1
                                    partSection.push(excelObject)

                                }

                            }
                            mainno += 1
                        }
                        //console.log("excel part3 Object Result :",partSection)
                        partsList[3]['part3'] = partSection

                    } else if (table === 'api/taxpart4s') {
                        const section = [
                            "194IA",
                            "194IB",
                            "194M",
                            "194S"
                        ];
                        const description = [
                            "TDS on Sale of immovable property",
                            "Payment of rent by certain individuals or Hindu undivided family",
                            "Payment of certain sums by certain individuals or Hindu Undivided Family",
                            "Payment of consideration for transfer of virtual digital asset by persons other than specified persons"
                        ];

                        const sourceofIncome = [
                            'Business/Profession | Capital Gain',
                            'House Property',
                            'Business/Profession',
                            'Business/Profession | Capital Gain'
                        ]

                        //      console.log(section.length, description.length,sourceofIncome.length)
                        let partSection = []
                        let sno = 1
                        let mainno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            // console.log(objList)
                            if (objList.mainSno === mainno) {
                                const sectionArray = data
                                    .filter(item => item.attributes.mainSno === mainno)
                                    .map(item => item.attributes.Section);

                                const uniqueSections = [...new Set(sectionArray)];

                                if (uniqueSections.length > 1) {
                                    uniqueSections.forEach(sec => {
                                        const index = section.indexOf(sec);
                                        // console.log("Index of section", index);
                                        let totalAmountPaid = 0;
                                        let totalTDSDeposited = 0;
                                        let count = 0;
                                        data.forEach(item => {
                                            if (item.attributes.mainSno === mainno && item.attributes.Section === sec) {
                                                count += 1;
                                                // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                totalAmountPaid += parseFloat(item.attributes.TotalAmountDepositedotherthanTDS);
                                                totalTDSDeposited += parseFloat(item.attributes.TDSDeposited);
                                            }
                                        });
                                        const excelObject = {
                                            sno: sno,
                                            section: sec,
                                            description: description[index],
                                            sourceofIncome: sourceofIncome[index],
                                            nameofDeductor: objList.mainNameofDeductee,
                                            pANofDeductor: objList.mainPANofDeductor,
                                            transactionDate: objList.mainTransactionDate,
                                            totalAmountPaidorCredited: totalAmountPaid,

                                            totalTDSDeposited: totalTDSDeposited
                                        };
                                        sno += 1;
                                        partSection.push(excelObject);
                                        // console.log("Total Amount Paid: ", totalAmountPaid);
                                        // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                    })
                                } else {
                                    const sectionId = objList.Section
                                    // console.log("sectionId :",sectionId)
                                    const index = await section.indexOf(`${sectionId}`)
                                    const excelObject = {
                                        sno: sno,
                                        section: sectionId,
                                        description: description[index],
                                        sourceofIncome: sourceofIncome[index],
                                        nameofDeductor: objList.mainNameofDeductee,
                                        pANofDeductor: objList.mainPANofDeductor,
                                        transactionDate: objList.mainTransactionDate,
                                        totalAmountPaidorCredited: objList.mainTotalTransactionAmount,
                                        totalTDSDeposited: objList.mainTotalAmountDepositedotherthanTDS,
                                    }
                                    sno += 1
                                    partSection.push(excelObject)

                                }

                                mainno += 1
                            }

                        }
                        // console.log("excel part4 Object Result :", partSection)
                        partsList[4]['part4'] = partSection

                    } else if (table === 'api/taxpart5s') {

                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            if (objList.mainSno === mainno) {
                                mainno += 1
                                const excelObject = {
                                    sno: sno,
                                    acknowledgementNumber: objList.mainAcknowledgementNumber,
                                    nameofBuyer: objList.mainNameofBuyer,
                                    pANofBuyer: objList.mainPANofBuyer,
                                    transactionDate: objList.mainTransactionDate,
                                    transactionAmount: objList.mainTotalTransactionAmount,

                                }
                                sno += 1
                                partSection.push(excelObject)

                            }
                        }
                        partsList[5]['part5'] = partSection

                    } else if (table === 'api/taxpart6s') {
                        const section = [
                            "206CA",
                            "206CB",
                            "206CC",
                            "206CD",
                            "206CE",
                            "206CF",
                            "206CG",
                            "206CH",
                            "206CI",
                            "206CJ",
                            "206CK",
                            "206CL",
                            "206CM",
                            "206CN",
                            "206CO",
                            "206CP",
                            "206CQ",
                            "206CR"
                        ];
                        const description = [
                            "Collection at source from alcoholic liquor for human",
                            "Collection at source from timber obtained under forest lease",
                            "Collection at source from timber obtained by any mode other than a forest lease",
                            "Collection at source from any other forest produce (not being tendu leaves)",
                            "Collection at source from any scrap",
                            "Collection at source from contractors or licensee or lease relating to parking lots",
                            "Collection at source from contractors or licensee or lease relating to toll plaza",
                            "Collection at source from contractors or licensee or lease relating to mine or quarry",
                            "Collection at source from tendu Leaves",
                            "Collection at source from on sale of certain Minerals",
                            "Collection at source on cash case of Bullion and Jewellery",
                            "Collection at source on sale of Motor vehicle",
                            "Collection at source on sale in cash of any goods (other than bullion/jewelry)",
                            "Collection at source on providing of any services (other than Chapter-XVII-B)",
                            "Collection at source on remittance under LRS for purchase of overseas tour program package",
                            "Collection at source on remittance under LRS for educational loan taken from financial institution mentioned in section 80E",
                            "Collection at source on remittance under LRS for purpose other than for purchase of overseas tour package or for educational loan taken from financial institution",
                            "Collection at source on sale of goods"
                        ];

                        const sourceofIncome = [
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Business/Profession',
                            'Collection at source on sale of Motor vehicle',
                            'Business/Profession',
                            'Business/Profession',
                            'Collection at source on remittance under LRS for purchase of overseas tour program package',
                            'Collection at source on remittance under LRS for educational loan taken from financial institution mentioned in section 80E',
                            'Collection at source on remittance under LRS for purpose other than for purchase of overseas tour package or for educational loan taken from financial institution',
                            'Business/Profession'
                        ]
                        //  console.log(section.length, description.length,sourceofIncome.length)
                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            // console.log(objList)
                            if (objList.mainSno === mainno) {

                                const sectionArray = data
                                    .filter(item => item.attributes.mainSno === mainno)
                                    .map(item => item.attributes.Section);

                                const uniqueSections = [...new Set(sectionArray)];
                                // console.log(uniqueSections)
                                if (uniqueSections.length > 1) {
                                    uniqueSections.forEach(sec => {
                                        const index = section.indexOf(sec);
                                        // console.log("Index of section", index);
                                        let totalAmountPaid = 0;
                                        let totalTDSDeposited = 0;
                                        let count = 0;
                                        data.forEach(item => {
                                            if (item.attributes.mainSno === mainno && item.attributes.Section === sec) {
                                                count += 1;
                                                // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                totalAmountPaid += parseFloat(item.attributes.AmountPaidDebited);
                                                totalTDSDeposited += parseFloat(item.attributes.TCSDepositedRs);
                                            }
                                        });
                                        const excelObject = {
                                            sno: sno,
                                            section: sec,
                                            description: description[index],
                                            sourceofIncome: sourceofIncome[index],
                                            nameofCollector: objList.mainNameofCollector,
                                            tANofCollector: objList.mainTANofCollector,
                                            totalAmountPaidorCredited: totalAmountPaid,

                                            totalTDSorTCSDeposited: totalTDSDeposited
                                        };
                                        sno += 1;
                                        partSection.push(excelObject);
                                        // console.log("Total Amount Paid: ", totalAmountPaid);
                                        // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                    })
                                } else {
                                    const sectionId = objList.Section
                                    //console.log("sectionId :",sectionId)
                                    const index = await section.indexOf(`${sectionId}`)
                                    //  console.log("Index of section", index)
                                    // console.log(objList)
                                    const excelObject = {
                                        sno: sno,
                                        section: sectionId,
                                        description: description[index],
                                        sourceofIncome: sourceofIncome[index],
                                        nameofCollector: objList.mainNameofCollector,
                                        tANofCollector: objList.mainTANofCollector,
                                        totalAmountPaidorCredited: objList.mainTotalAmountPaidDebited,
                                        totalTaxCollectedRs: objList.mainTotalTaxCollectedRs,
                                        totalTDSorTCSDeposited: objList.mainTotalTCSDepositedRs
                                    }
                                    sno += 1
                                    partSection.push(excelObject)

                                }
                                mainno += 1

                            }
                        }
                        // console.log("excel part6 Object Result :", partSection)
                        partsList[6]['part6'] = partSection

                    } else if (table === 'api/taxpart7s') {
                        let partSection = []
                        let sno = 1
                        for (let i of data) {
                            // console.log("part 7 details", i.attributes)
                            const objList = i.attributes
                            const excelObject = {
                                sno: sno,
                                assessmentYear: objList.assessmentYear,
                                mode: objList.mode,
                                refundIssued: objList.refundIssued,
                                natureofRefund: objList.natureofRefund,
                                amountofRefund: objList.amountofRefund,
                                interestRs: objList.interestRs,
                                dateofPayment: objList.dateofPayment,
                                remarks: objList.remarks,
                            }
                            sno += 1
                            partSection.push(excelObject)
                        }
                        // console.log("excel part7 Object Result :",partSection)
                        partsList[7]['part7'] = partSection

                    } else if (table === 'api/textpart8s') {
                        const section = [
                            '194IA',
                            '194IB',
                            '194M',
                            '194S'
                        ]
                        const description = [
                            'TDS on Sale of immovable property',
                            'Payment of rent by certain individuals or Hindu undivided family',
                            'Payment of certain sums by certain individuals or Hindu Undivided Family',
                            'Payment of consideration for transfer of virtual digital asset by persons other than specified persons'
                        ];
                        const sourceofIncome = [
                            'Business/Profession | Capital Gain',
                            'House Property',
                            'Business/Profession',
                            'Business/Profession | Capital Gain'
                        ]

                        let partSection = []
                        let mainno = 1
                        let sno = 1
                        for (let i of data) {
                            console.log("Part 8 data", i)
                            const objList = i.attributes
                            if (objList.mainSno === mainno) {
                                mainno += 1
                                // array1.push(i)
                                const sectionId = objList.section
                                //console.log("sectionId :",sectionId)
                                const index = await section.indexOf(`${sectionId}`)
                                //console.log("Index of section", index)

                                const excelObject = {
                                    sno: sno,
                                    section: sectionId,
                                    description: description[index],
                                    sourceofIncome: sourceofIncome[index],
                                    nameofDeductee: objList.mainNameofDeductee,
                                    pANofDeductee: objList.mainPANofDeductee,
                                    transactionDate: objList.mainTransactionDate,
                                    totalAmountPaidorCredited: objList.mainTotalTransactionAmountRs,
                                    totalTDSorTCSDeposited: objList.mainTotalTDSDepositedRs,

                                }
                                sno += 1
                                partSection.push(excelObject)

                            }
                        }
                        // console.log("excel part8 Object Result :",partSection)

                        partsList[8]['part8'] = partSection

                    } else if (table === 'api/taxpart9s') {

                        let partSection = []
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            // console.log(objList)
                            const excelObject = {
                                sno: sno,
                                acknowledgementNumber: objList.mainAcknowledgementNumber,
                                nameofSeller: objList.mainNameofSeller,
                                pANofSeller: objList.mainPANofSeller,
                                transactionDate: objList.mainTransactionDate,
                                totalTransactionAmount: objList.mainTotalTransactionAmount,
                                totalAmountDepositedotherthanTDS: objList.mainTotalAmountDepositedotherthanTDS,

                            }
                            sno += 1
                            partSection.push(excelObject)


                        }
                        //  console.log("excel part9 Object Result :",partSection)

                        partsList[9]['part9'] = partSection

                    } else if (table === 'api/taxpart10s') {

                        let partSection = []
                        let sno = 1
                        for (let i of data) {
                            const objList = i.attributes
                            //console.log(objList)
                            const excelObject = {
                                sno: sno,
                                financialYear: objList.mainFinancialYear,
                                tANs: objList.TANs,
                                shortPayment: objList.ShortPayment,
                                shortDeductionCollection: objList.ShortDeductionCollection,
                                interestonTDSorTCSPaymentsdefault: objList.InterestonTDSorTCSPaymentsdefault,
                                interestonTDSorTCSDeductionCollection: objList.InterestonTDSorTCSDeductionCollection,
                                lateFilinFee: objList.LateFilinFee,
                                interestus220: objList.Interestus220,
                                totalDefault: objList.TotalDefault,
                            }
                            sno += 1
                            partSection.push(excelObject)


                        }

                        //console.log("excel part10 Object Result :",partSection)
                        partsList[10]['part10'] = partSection


                    } else if (table === 'api/form26tables') {
                        if (data.length > 0) {


                            const mainData = data[0].attributes
                            const formData = mainData["formdata"]
                            const formLength = formData.length
                            console.log(formData)

                            for (let i = 0; i < formLength; i++) {
                                if (i === 0) {
                                    const panDetails = formData[i]['panDetails']
                                    const objList = panDetails[0]['data']
                                    // console.log(objList.fileCreationDate)
                                    const excelObject = {
                                        fileCreationDate: objList.fileCreationDate,
                                        permanentAccountNumberPan: objList.PermanentAccountNumberPan,
                                        currentStatusofPAN: objList.currentStatusofPAN,
                                        financialYear: objList.financialYear,
                                        assessmentYear: objList.assessmentYear,
                                        nameofAssessee: objList.nameofAssessee,
                                        addressLine1: objList.addressLine1,
                                        addressLine2: objList.addressLine2,
                                        addressLine3: objList.addressLine3,
                                        addressLine4: objList?.addressLine4,
                                        addressLine5: objList?.addressLine5,
                                        statecode: objList.statecode,
                                        pinCode: objList.pinCode,
                                    }
                                    partsList[0]['panDetails'] = excelObject
                                    // console.log(excelObject)
                                } else if (i === 1) {
                                    const partDetails = formData[i]['part1']
                                    // console.log(partDetails)

                                    const section = [
                                        '192',
                                        '192A',
                                        '193',
                                        '194',
                                        '194A',
                                        '194B',
                                        '194BB',
                                        '194C',
                                        '194D',
                                        '194DA',
                                        '194E',
                                        '194EE',
                                        '194F',
                                        '194G',
                                        '194H',
                                        '194I(a)',
                                        '194I(b)',
                                        '194IC',
                                        '194JA',
                                        '194JB',
                                        '194K',
                                        '194LA',
                                        '194LB',
                                        '194LC',
                                        '194LBA',
                                        '194LBB',
                                        '194LBC',
                                        '194R',
                                        '194LD',
                                        '194N',
                                        '194O',
                                        '194P',
                                        '194Q',
                                        '195',
                                        '196A',
                                        '196B',
                                        '196C',
                                        '196D',
                                        '196DA'
                                    ];

                                    const description = [
                                        'Salary',
                                        'TDS on PF withdrawal',
                                        'Interest on Securities',
                                        'Dividends',
                                        'Interest other than "Interest on securities"',
                                        'Winning from lottery or crossword puzzle',
                                        'Winning from horse race',
                                        'Payments to contractors and sub-contractors',
                                        'Insurance commission',
                                        'Payment in respect of life insurance policy',
                                        'Payments to non-resident sportsmen or sports associations',
                                        'Payments in respect of deposits under National Savings Scheme',
                                        'Payments on account of repurchase of units by Mutual Fund or Unit Trust of India',
                                        'Commission, price, etc. on sale of lottery tickets',
                                        'Commission or brokerage',
                                        'Rent on hiring of plant and machinery',
                                        'Rent on other than plant and machinery',
                                        'Payment under specified agreement',
                                        'Fees for technical services',
                                        'Fees for professional services or royalty etc',
                                        'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India',
                                        'Payment of compensation on acquisition of certain immovable',
                                        'Income by way of Interest from Infrastructure Debt fund',
                                        'Income by way of interest from specified company payable to a non-resident',
                                        'Certain income from units of a business trust',
                                        'Income in respect of units of investment fund',
                                        'Income in respect of investment in securitization trust',
                                        'Benefits or perquisites of business or profession',
                                        'TDS on interest on bonds / government securities',
                                        'Payment of certain amounts in cash',
                                        'Payment of certain sums by e-commerce operator to e-commerce participant',
                                        'Deduction of tax in case of specified senior citizen',
                                        'Deduction of tax at source on payment of certain sum for purchase of goods',
                                        'Other sums payable to a non-resident',
                                        'Income in respect of units of non-residents',
                                        'Payments in respect of units to an offshore fund',
                                        'Income from foreign currency bonds or shares of Indian',
                                        'Income of foreign institutional investors from securities',
                                        'Income of specified fund from securities'
                                    ]

                                    const sourceofIncome = [
                                        'Salary',
                                        'Salary',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Other Sources',
                                        'Other Sources',
                                        'Business/Profession',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Payments to non-resident sportsmen or sports associations',
                                        'Payments in respect of deposits under National Savings Scheme',
                                        'Payments on account of repurchase of units by Mutual Fund or Unit Trust of India',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'House Property',
                                        'Business/Profession | Capital Gain | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India',
                                        'Business/Profession | Capital Gain',
                                        'Income by way of Interest from Infrastructure Debt fund',
                                        'Income by way of interest from specified company payable to a non-resident',
                                        'Certain income from units of a business trust',
                                        'Income in respect of units of investment fund',
                                        'Income in respect of investment in securitization trust',
                                        'Business/Profession',
                                        'TDS on interest on bonds / government securities',
                                        'Payment of certain amounts in cash',
                                        'Business/Profession',
                                        'Deduction of tax in case of specified senior citizen',
                                        'Business/Profession',
                                        'House Property | Business/Profession | Capital Gain | Other Sources',
                                        'Income in respect of units of non-residents',
                                        'Payments in respect of units to an offshore fund',
                                        'Income from foreign currency bonds or shares of Indian',
                                        'Income of foreign institutional investors from securities',
                                        'Income of specified fund from securities'
                                    ];
                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    partDetails.forEach(i => {
                                        const objList = i.data;
                                        // console.log(typeof(objList.mainSno), typeof(mainno))
                                        if (objList.mainSno == mainno) {
                                            // console.log(objList.mainSno === mainno)

                                            const sectionArray = partDetails
                                                .filter(item => item.data.mainSno === mainno)
                                                .map(item => item.data.Section);
                                            const uniqueSections = [...new Set(sectionArray)];
                                            // console.log(uniqueSections);
                                            if (uniqueSections.length > 1) {
                                                // console.log("section Iteration");
                                                uniqueSections.forEach(sec => {
                                                    const index = section.indexOf(sec);
                                                    // console.log("Index of section", index);
                                                    let totalAmountPaid = 0;
                                                    let totalTDSDeposited = 0;
                                                    let count = 0;
                                                    partDetails.forEach(item => {
                                                        if (item.data.mainSno === mainno && item.data.Section === sec) {
                                                            count += 1;
                                                            // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                            totalAmountPaid += parseFloat(item.data.AmountPaidCreditedInRs);
                                                            totalTDSDeposited += parseFloat(item.data.TDSDepositedInRs);
                                                        }
                                                    });
                                                    const excelObject = {
                                                        sno: sno,
                                                        section: sec,
                                                        description: description[index],
                                                        sourceofIncome: sourceofIncome[index],
                                                        nameofDeductor: objList.mainNameofDeductor,
                                                        TANofDeductor: objList.mainTANofDeductor,
                                                        totalAmountPaidorCredited: totalAmountPaid,
                                                        totalTaxDeducted: objList.mainTotalTaxDeducted,
                                                        totalTDSDeposited: totalTDSDeposited
                                                    };
                                                    sno += 1;
                                                    partSection.push(excelObject);
                                                    // console.log("Total Amount Paid: ", totalAmountPaid);
                                                    // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                                });
                                            } else {
                                                const sectionId = objList.Section;
                                                const index = section.indexOf(sectionId);
                                                //console.log("Index of section", index);
                                                const excelObject = {
                                                    sno: sno,
                                                    section: sectionId,
                                                    description: description[index],
                                                    sourceofIncome: sourceofIncome[index],
                                                    nameofDeductor: objList.mainNameofDeductor,
                                                    TANofDeductor: objList.mainTANofDeductor,
                                                    totalAmountPaidorCredited: objList.mainTotalAmountPaid,
                                                    totalTaxDeducted: objList.mainTotalTaxDeducted,
                                                    totalTDSDeposited: objList.mainTotalTDSDeposited
                                                };
                                                sno += 1;
                                                partSection.push(excelObject);
                                            }
                                            mainno = (parseInt(mainno) + 1).toString();
                                            // console.log(sectionArray);
                                        }
                                    });

                                    // console.log(partSection)
                                    partsList[1]['part1'] = partSection

                                } else if (i === 2) {
                                    const partDetails = formData[i]['part2']
                                    // console.log(partDetails)
                                    const section = ['192A', '193', '194', '194A', '194D', '194DA', '194EE', '194-I(a)', '194-I(b)', '194k'];
                                    const description = [
                                        'TDS on PF withdrawal',
                                        'Interest on Securities',
                                        'Dividends',
                                        "Interest other than 'Interest on securities'",
                                        'Insurance commission',
                                        'Payment in respect of life insurance policy',
                                        'Payments in respect of deposits under National Savings Scheme',
                                        'Rent on hiring of plant and machinery',
                                        'Rent on other than plant and machinery',
                                        'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India'
                                    ];

                                    const sourceofIncome = [
                                        'Salary',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Business/Profession | Other Sources',
                                        'Payments in respect of deposits under National Savings Scheme',
                                        'Business/Profession | Other Sources',
                                        'House Property',
                                        'Income payable to a resident assessee in respect of units of a specified mutual fund or of the units of the Unit Trust of India'
                                    ]

                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    partDetails.forEach(i => {
                                        const objList = i.data;
                                        console.log(typeof (objList.mainSno), typeof (mainno))
                                        if (objList.mainSno == mainno) {
                                            console.log(objList.mainSno === mainno)

                                            const sectionArray = partDetails
                                                .filter(item => item.data.mainSno === mainno)
                                                .map(item => item.data.Section);
                                            const uniqueSections = [...new Set(sectionArray)];
                                            console.log(uniqueSections);
                                            if (uniqueSections.length > 1) {
                                                // console.log("section Iteration");
                                                uniqueSections.forEach(sec => {
                                                    const index = section.indexOf(sec);
                                                    // console.log("Index of section", index);
                                                    let totalAmountPaid = 0;
                                                    let totalTDSDeposited = 0;
                                                    let count = 0;
                                                    partDetails.forEach(item => {
                                                        if (item.data.mainSno === mainno && item.data.Section === sec) {
                                                            count += 1;
                                                            // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                            totalAmountPaid += parseFloat(item.data.AmountPaidCreditedRs);
                                                            totalTDSDeposited += parseFloat(item.data.TDSDepositedRs);
                                                        }
                                                    });
                                                    const excelObject = {
                                                        sno: sno,
                                                        section: sec,
                                                        description: description[index],
                                                        sourceofIncome: sourceofIncome[index],
                                                        nameofDeductor: objList.mainNameofDeductor,
                                                        TANofDeductor: objList.mainTANofDeductor,
                                                        totalAmountPaidorCredited: totalAmountPaid,
                                                        totalTaxDeducted: objList.mainTotalTaxDeducted,
                                                        totalTDSDeposited: totalTDSDeposited
                                                    };
                                                    sno += 1;
                                                    partSection.push(excelObject);
                                                    // console.log("Total Amount Paid: ", totalAmountPaid);
                                                    // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                                });
                                            } else {
                                                const sectionId = objList.Section;
                                                const index = section.indexOf(sectionId);
                                                //console.log("Index of section", index);
                                                const excelObject = {
                                                    sno: sno,
                                                    section: sectionId,
                                                    description: description[index],
                                                    sourceofIncome: sourceofIncome[index],
                                                    nameofDeductor: objList.mainNameofDeductor,
                                                    TANofDeductor: objList.mainTANofDeductor,
                                                    totalAmountPaidorCredited: objList.mainTotalAmountPaidorCredited,
                                                    totalTaxDeducted: objList.mainTotalTaxDeducted,
                                                    totalTDSDeposited: objList.mainTotalTDSDeposited
                                                };
                                                sno += 1;
                                                partSection.push(excelObject);
                                            }
                                            mainno = (parseInt(mainno) + 1).toString();
                                            // console.log(sectionArray);
                                        }
                                    });

                                    console.log(partSection)
                                    partsList[2]['part2'] = partSection

                                } else if (i === 3) {
                                    const partDetails = formData[i]['part3']
                                    // console.log(partDetails)
                                    const section = [
                                        'Proviso to section 194B',
                                        'First Proviso to Sub-Section (1) of Section 194R',
                                        'Proviso to Sub-Section (1) of Section 194S'
                                    ];
                                    const description = [
                                        "Winnings from lotteries and crossword puzzles where consideration is made in kind or cash is not sufficient to meet the tax liability and tax has been paid before such winnings are released",
                                        "Benefits or perquisites of business or profession where such benefit is provided in kind or where part in cash is not sufficient to meet tax liability and tax required to be deducted is paid before such benefit is released",
                                        "Payment for transfer of virtual digital asset where payment is in kind or in exchange of another virtual digital asset and tax required to be deducted is paid before such payment is released"
                                    ];

                                    const sourceofIncome = [
                                        'Other Sources',
                                        'Business/Profession',
                                        'Business/Profession | Capital Gain'
                                    ]

                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    partDetails.forEach(i => {
                                        const objList = i.data;
                                        console.log(typeof (objList.mainSno), typeof (mainno))
                                        if (objList.mainSno == mainno) {
                                            console.log(objList.mainSno === mainno)

                                            const sectionArray = partDetails
                                                .filter(item => item.data.mainSno === mainno)
                                                .map(item => item.data.Section);
                                            const uniqueSections = [...new Set(sectionArray)];
                                            console.log(uniqueSections);
                                            if (uniqueSections.length > 1) {
                                                // console.log("section Iteration");
                                                uniqueSections.forEach(sec => {
                                                    const index = section.indexOf(sec);
                                                    // console.log("Index of section", index);
                                                    let totalAmountPaid = 0;
                                                    let totalTDSDeposited = 0;
                                                    let count = 0;
                                                    partDetails.forEach(item => {
                                                        if (item.data.mainSno === mainno && item.data.Section === sec) {
                                                            count += 1;
                                                            // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                            totalAmountPaid += parseFloat(item.data.AmountPaidCreditedRs);
                                                        }
                                                    });
                                                    const excelObject = {
                                                        sno: sno,
                                                        section: sec,
                                                        description: description[index],
                                                        sourceofIncome: sourceofIncome[index],
                                                        nameofDeductor: objList.mainNameofDeductor,
                                                        TANofDeductor: objList.mainTANofDeductor,
                                                        totalAmountPaidorCredited: totalAmountPaid,
                                                    };
                                                    sno += 1;
                                                    partSection.push(excelObject);
                                                    // console.log("Total Amount Paid: ", totalAmountPaid);
                                                    // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                                });
                                            } else {
                                                const sectionId = objList.Section;
                                                const index = section.indexOf(sectionId);
                                                //console.log("Index of section", index);
                                                const excelObject = {
                                                    sno: sno,
                                                    section: sectionId,
                                                    description: description[index],
                                                    sourceofIncome: sourceofIncome[index],
                                                    nameofDeductor: objList.mainNameofDeductor,
                                                    TANofDeductor: objList.mainTANofDeductor,
                                                    totalAmountPaidorCredited: objList.mainTotalAmountPaidorCredited,
                                                };
                                                sno += 1;
                                                partSection.push(excelObject);
                                            }
                                            mainno = (parseInt(mainno) + 1).toString();
                                            // console.log(sectionArray);
                                        }
                                    });

                                    console.log(partSection)
                                    partsList[3]['part3'] = partSection

                                } else if (i === 4) {
                                    const partDetails = formData[i]['part4']
                                    const section = [
                                        "194IA",
                                        "194IB",
                                        "194M",
                                        "194S"
                                    ];
                                    const description = [
                                        "TDS on Sale of immovable property",
                                        "Payment of rent by certain individuals or Hindu undivided family",
                                        "Payment of certain sums by certain individuals or Hindu Undivided Family",
                                        "Payment of consideration for transfer of virtual digital asset by persons other than specified persons"
                                    ];

                                    const sourceofIncome = [
                                        'Business/Profession | Capital Gain',
                                        'House Property',
                                        'Business/Profession',
                                        'Business/Profession | Capital Gain'
                                    ]


                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    partDetails.forEach(i => {
                                        const objList = i.data;
                                        console.log(typeof (objList.mainSno), typeof (mainno))
                                        if (objList.mainSno == mainno) {
                                            console.log(objList.mainSno === mainno)

                                            const sectionArray = partDetails
                                                .filter(item => item.data.mainSno === mainno)
                                                .map(item => item.data.Section);
                                            const uniqueSections = [...new Set(sectionArray)];
                                            console.log(uniqueSections);
                                            if (uniqueSections.length > 1) {
                                                // console.log("section Iteration");
                                                uniqueSections.forEach(sec => {
                                                    const index = section.indexOf(sec);
                                                    // console.log("Index of section", index);
                                                    let totalAmountPaid = 0;
                                                    let totalTDSDeposited = 0;
                                                    let count = 0;
                                                    partDetails.forEach(item => {
                                                        if (item.data.mainSno === mainno && item.data.Section === sec) {
                                                            count += 1;
                                                            // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                            totalAmountPaid += parseFloat(item.data.TotalAmountDepositedotherthanTDS);
                                                            totalTDSDeposited += parseFloat(item.data.TDSDeposited);
                                                        }
                                                    });
                                                    const excelObject = {
                                                        sno: sno,
                                                        section: sec,
                                                        description: description[index],
                                                        sourceofIncome: sourceofIncome[index],
                                                        nameofDeductor: objList.mainNameofDeductee,
                                                        pANofDeductor: objList.mainPANofDeductor,
                                                        transactionDate: objList.mainTransactionDate,
                                                        totalAmountPaidorCredited: totalAmountPaid,
                                                        totalTDSDeposited: totalTDSDeposited
                                                    };
                                                    sno += 1;
                                                    partSection.push(excelObject);
                                                    // console.log("Total Amount Paid: ", totalAmountPaid);
                                                    // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                                });
                                            } else {
                                                const sectionId = objList.Section;
                                                const index = section.indexOf(sectionId);
                                                //console.log("Index of section", index);
                                                const excelObject = {
                                                    sno: sno,
                                                    section: sectionId,
                                                    description: description[index],
                                                    sourceofIncome: sourceofIncome[index],
                                                    nameofDeductor: objList.mainNameofDeductee,
                                                    pANofDeductor: objList.mainPANofDeductor,
                                                    transactionDate: objList.mainTransactionDate,
                                                    totalAmountPaidorCredited: objList.mainTotalTransactionAmount,
                                                    totalTDSDeposited: objList.mainTotalAmountDepositedotherthanTDS,
                                                };
                                                sno += 1;
                                                partSection.push(excelObject);
                                            }
                                            mainno = (parseInt(mainno) + 1).toString();
                                            // console.log(sectionArray);
                                        }
                                    });

                                    console.log(partSection)
                                    partsList[4]['part4'] = partSection

                                } else if (i === 6) {
                                    const partDetails = formData[i]['part6']
                                    const section = [
                                        "206CA",
                                        "206CB",
                                        "206CC",
                                        "206CD",
                                        "206CE",
                                        "206CF",
                                        "206CG",
                                        "206CH",
                                        "206CI",
                                        "206CJ",
                                        "206CK",
                                        "206CL",
                                        "206CM",
                                        "206CN",
                                        "206CO",
                                        "206CP",
                                        "206CQ",
                                        "206CR"
                                    ];
                                    const description = [
                                        "Collection at source from alcoholic liquor for human",
                                        "Collection at source from timber obtained under forest lease",
                                        "Collection at source from timber obtained by any mode other than a forest lease",
                                        "Collection at source from any other forest produce (not being tendu leaves)",
                                        "Collection at source from any scrap",
                                        "Collection at source from contractors or licensee or lease relating to parking lots",
                                        "Collection at source from contractors or licensee or lease relating to toll plaza",
                                        "Collection at source from contractors or licensee or lease relating to mine or quarry",
                                        "Collection at source from tendu Leaves",
                                        "Collection at source from on sale of certain Minerals",
                                        "Collection at source on cash case of Bullion and Jewellery",
                                        "Collection at source on sale of Motor vehicle",
                                        "Collection at source on sale in cash of any goods (other than bullion/jewelry)",
                                        "Collection at source on providing of any services (other than Chapter-XVII-B)",
                                        "Collection at source on remittance under LRS for purchase of overseas tour program package",
                                        "Collection at source on remittance under LRS for educational loan taken from financial institution mentioned in section 80E",
                                        "Collection at source on remittance under LRS for purpose other than for purchase of overseas tour package or for educational loan taken from financial institution",
                                        "Collection at source on sale of goods"
                                    ];

                                    const sourceofIncome = [
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Collection at source on sale of Motor vehicle',
                                        'Business/Profession',
                                        'Business/Profession',
                                        'Collection at source on remittance under LRS for purchase of overseas tour program package',
                                        'Collection at source on remittance under LRS for educational loan taken from financial institution mentioned in section 80E',
                                        'Collection at source on remittance under LRS for purpose other than for purchase of overseas tour package or for educational loan taken from financial institution',
                                        'Business/Profession'
                                    ]


                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    partDetails.forEach(i => {
                                        const objList = i.data;

                                        console.log(typeof (objList.mainSno), typeof (mainno))
                                        if (objList.mainSno == mainno) {
                                            console.log(objList.mainSno === mainno)
                                            console.log("parts 6 //////////", objList)

                                            const sectionArray = partDetails
                                                .filter(item => item.data.mainSno === mainno)
                                                .map(item => item.data.Section);
                                            const uniqueSections = [...new Set(sectionArray)];
                                            console.log(uniqueSections);
                                            if (uniqueSections.length > 1) {
                                                // console.log("section Iteration");
                                                uniqueSections.forEach(sec => {
                                                    const index = section.indexOf(sec);
                                                    // console.log("Index of section", index);
                                                    let totalAmountPaid = 0;
                                                    let totalTDSDeposited = 0;
                                                    let count = 0;
                                                    partDetails.forEach(item => {
                                                        if (item.data.mainSno === mainno && item.data.Section === sec) {
                                                            count += 1;
                                                            // console.log(item.attributes.mainSno === mainno && item.attributes.Section === sec);
                                                            totalAmountPaid += parseFloat(item.data.AmountPaidDebited);
                                                            totalTDSDeposited += parseFloat(item.data.TCSDepositedRs);
                                                        }
                                                    });
                                                    const excelObject = {
                                                        sno: sno,
                                                        section: sec,
                                                        description: description[index],
                                                        sourceofIncome: sourceofIncome[index],
                                                        nameofCollector: objList.mainNameofCollector,
                                                        tANofCollector: objList.mainTANofCollector,
                                                        totalAmountPaidorCredited: totalAmountPaid,

                                                        totalTDSorTCSDeposited: totalTDSDeposited
                                                    };
                                                    sno += 1;
                                                    partSection.push(excelObject);
                                                    // console.log("Total Amount Paid: ", totalAmountPaid);
                                                    // console.log("Total TDS Deposited: ", totalTDSDeposited);
                                                });
                                            } else {
                                                const sectionId = objList.Section;
                                                const index = section.indexOf(sectionId);
                                                //console.log("Index of section", index);
                                                const excelObject = {
                                                    sno: sno,
                                                    section: sectionId,
                                                    description: description[index],
                                                    sourceofIncome: sourceofIncome[index],
                                                    nameofCollector: objList.mainNameofCollector,
                                                    tANofCollector: objList.mainTANofCollector,
                                                    totalAmountPaidorCredited: objList.mainTotalAmountPaidDebited,
                                                    totalTaxCollectedRs: objList.mainTotalTaxCollectedRs,
                                                    totalTDSorTCSDeposited: objList.mainTotalTCSDepositedRs
                                                };
                                                sno += 1;
                                                partSection.push(excelObject);
                                            }
                                            mainno = (parseInt(mainno) + 1).toString();
                                            // console.log(sectionArray);
                                        }
                                    });

                                    console.log(partSection)
                                    partsList[6]['part6'] = partSection

                                } else if (i === 8) {
                                    const partDetails = formData[i]['part8']
                                    const section = [
                                        '194IA',
                                        '194IB',
                                        '194M',
                                        '194S'
                                    ]
                                    const description = [
                                        'TDS on Sale of immovable property',
                                        'Payment of rent by certain individuals or Hindu undivided family',
                                        'Payment of certain sums by certain individuals or Hindu Undivided Family',
                                        'Payment of consideration for transfer of virtual digital asset by persons other than specified persons'
                                    ];
                                    const sourceofIncome = [
                                        'Business/Profession | Capital Gain',
                                        'House Property',
                                        'Business/Profession',
                                        'Business/Profession | Capital Gain'
                                    ]


                                    let partSection = []
                                    let mainno = (1).toString()
                                    let sno = 1
                                    //console.log(data)
                                    console.log(partDetails)
                                    partDetails.forEach(i => {
                                        const objList = i.data;
                                        console.log(typeof (objList.mainSno), typeof (mainno))
                                        if (objList.mainSno == mainno) {
                                            console.log("part 8", objList)
                                            console.log(objList.mainSno === mainno)
                                            const sectionId = objList.section;
                                            const index = section.indexOf(sectionId);
                                            //console.log("Index of section", index);
                                            const excelObject = {
                                                sno: sno,
                                                section: sectionId,
                                                description: description[index],
                                                sourceofIncome: sourceofIncome[index],
                                                nameofDeductee: objList.mainNameofDeductee,
                                                pANofDeductee: objList.mainPANofDeductee,
                                                transactionDate: objList.mainTransactionDate,
                                                totalAmountPaidorCredited: objList.mainTotalTransactionAmountRs,
                                                totalTDSorTCSDeposited: objList.mainTotalTDSDepositedRs,
                                            };
                                            sno += 1;
                                            partSection.push(excelObject);
                                        }
                                        mainno = (parseInt(mainno) + 1).toString();
                                        // console.log(sectionArray);

                                    });

                                    console.log("///////////////////////", partSection)
                                    partsList[8]['part8'] = partSection

                                }
                            }
                            // console.log(partsList)
                        }

                    } else if (table === 'api/tistabledetails') {
                        if (data.length > 0) {
                            const mainData = data[0].attributes
                            const a = mainData.mainDetails
                            const tableData = mainData.tabelDetails
                            // console.log(a)

                            const objctaData = {
                                panNumber: a.panNumber,
                                aadharNumber: a.aadhaar_number,
                                name: a.name_of_assessee,
                                dob: a.dob,
                                email: a.email,
                                mobileNo: a.mobile_no,
                                address: a.address
                            }

                            const columnLength = 4;
                            const subLists = [];

                            for (let i = 0; i < tableData.length; i += columnLength) {
                                const subList = tableData.slice(i, i + columnLength);
                                subLists.push(subList);
                            }

                            objList = {
                                objctaData,
                                subLists
                            }
                            partsList[11]['tisDetails'] = objList
                        }
                    } else if (table === 'api/ais-details') {
                        // console.log(data)     
                        if (data.length > 0) {
                            const mainData = data[0].attributes
                            // console.log(mainData)
                            partsList[12]['aisDetails'] = mainData
                        }
                    } else if (table === 'api/tissampletables') {
                        // console.log("////////////////////",data)
                        if (data.length > 0) {


                            const mainData = data[0].attributes
                            remainingTables = mainData['remainingTableData']
                            let list_a = []
                            for (let i of partsList[1]['part1']) {
                                const secData = {
                                    section: i.section,
                                    tanNo: i.TANofDeductor,
                                    totalAmount: i.totalAmountPaidorCredited
                                }
                                list_a.push(secData)
                            }
                            for (let i of partsList[2]['part2']) {
                                const secData = {
                                    section: i.section,
                                    tanNo: i.TANofDeductor,
                                    totalAmount: i.totalAmountPaidorCredited
                                }

                                list_a.push(secData)
                            }
                            for (let i of partsList[3]['part3']) {
                                const secData = {
                                    section: i.section,
                                    tanNo: i.TANofDeductor,
                                    totalAmount: i.totalAmountPaidorCredited

                                }

                                list_a.push(secData)
                            }
                            // for (let i of partsList[6]['part6']) {
                            //   const secData = {
                            //     section: i.section,
                            //     tanNo: i.tANofCollector,
                            //     totalAmount: i.totalAmountPaidorCredited

                            //   }

                            //   list_a.push(secData)
                            // }

                            // console.log(list_a)
                            const sectionList = list_a
                            // console.log(sectionList)

                            const list_b = []
                            let List_c = []
                            for (let i of remainingTables) {
                                const length = Object.keys(i[0]).length
                                if (length === 4) {
                                    if (i.length > 1) {
                                        if (i[1]['INFORMATION CATEGORY'] !== 'GST turnover') {
                                            // console.log(i[1]['INFORMATION CATEGORY'])
                                            list_b.push(...i.slice(3))

                                        } else {
                                            List_c.push({
                                                part: i[3]['PART'],
                                                InformationDescription: i[1]['INFORMATION CATEGORY'],
                                                reportedValue: i[1]['PROCESSED VALUE']
                                            })

                                        }
                                    }
                                } else if (length === 8) {
                                    list_b.push(...i.slice(1))
                                }

                            }
                            // console.log(colorCount);
                            // console.log(",,,,,,,,,,,,,,,,,,,", list_b.length)

                            let count = 0
                            const checkInformationDescription = (description) => {
                                for (let i of sectionList) {
                                    if (description.includes(i.section)) {
                                        return true;
                                    }
                                }
                                return false;
                            };

                            const checkInformationSource = (source) => {
                                for (let i of sectionList) {
                                    if (source.includes(i.tanNo)) {
                                        return true
                                    }
                                }
                                return false

                            }

                            const checkReportedValue = (value) => {
                                // console.log(value)
                                for (let i of sectionList) {
                                    if (parseInt(value) === parseInt(i.totalAmount, 10)) {
                                        return true
                                    }
                                }
                                return false
                            }

                            for (let row of list_b) {
                                if (row['PART'] === "TDS/ TCS") {
                                    // console.log("TDS/TCS part", row)
                                    const check = checkInformationDescription(row['INFORMATION DESCRIPTION'])
                                    if (check) {
                                        const check1 = checkInformationSource(row['INFORMATION SOURCE'])
                                        if (check1) {
                                            const check2 = checkReportedValue(row['REPORTED VALUE'].replace(/,/g, ''))
                                            // console.log(check2)
                                            if (check2) {
                                                // console.log(row)
                                            } else {
                                                // console.log(row)
                                                // List_c.push({
                                                //   part:row['PART'],
                                                //   InformationDescription:row['INFORMATION DESCRIPTION'],
                                                //   reportedValue:row['REPORTED VALUE']
                                                // })
                                            }
                                        } else {
                                            // console.log(row)
                                            // List_c.push({
                                            //   part:row['PART'],
                                            //   InformationDescription:row['INFORMATION DESCRIPTION'],
                                            //   reportedValue:row['REPORTED VALUE']
                                            // })
                                        }
                                    } else {
                                        // List_c.push({
                                        //   part:row['PART'],
                                        //   InformationDescription:row['INFORMATION DESCRIPTION'],
                                        //   reportedValue:row['REPORTED VALUE']
                                        // })
                                    }
                                    // for (let i of sectionList){
                                    //   if (row['INFORMATION DESCRIPTION'].includes(i.section)){
                                    //     if (row['INFORMATION SOURCE'].includes(i.tanNo)){
                                    //       if(parseInt(row['REPORTED VALUE'].replace(/,/g, ''))===parseInt(i.totalAmount, 10)){
                                    //         console.log('TDS/TCS',row)
                                    //         count+=1
                                    //       }else{
                                    //         console.log("NOthing")
                                    //       }                            
                                    //     }                        
                                    //   }
                                    // }
                                } else if (row['PART'] === "") {
                                    console.log("hai")

                                } else {
                                    List_c.push({
                                        part: row['PART'],
                                        InformationDescription: row['INFORMATION DESCRIPTION'],
                                        reportedValue: row['REPORTED VALUE']
                                    })

                                }
                            }

                            // console.log(List_c)
                            // console.log(List_c.length)

                            // console.log(list_b)
                            const countReportedValue = {};

                            for (let obj of List_c) {
                                const { InformationDescription, reportedValue } = obj;

                                if (countReportedValue[InformationDescription]) {
                                    countReportedValue[InformationDescription] += parseInt(reportedValue.replace(/,/g, ''), 10);
                                } else {
                                    countReportedValue[InformationDescription] = parseInt(reportedValue.replace(/,/g, ''), 10);
                                }
                            }

                            // console.log(countReportedValue);
                            // for (let key in countReportedValue) {
                            //   if (countReportedValue.hasOwnProperty(key)) {
                            //     console.log(key, countReportedValue[key]);
                            //   }
                            // }
                            partsList[13]['tissampletables'] = countReportedValue

                            // console.log(count)

                        }
                    }

                } catch (error) {
                    // Handle the error for each table
                    console.error('Error fetching data for table', table, ':', error);
                }
            }
            // console.log(partsList)
            console.log("Loading........")
            console.log(partsList)

            app.get('/invoices/:id/preview', (req, res) => {
                // Read the invoice-preview.html file and send it as the response
                fs.readFile('pdf.html', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('An error occurred');
                    } else {
                        res.send(data);
                    }
                });
            });
            //const invoiceId=1
            const pdf = await generatePDF(partsList);

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="receipt.pdf"',
            });

            const outputFile = './TaxSummaryReport.pdf';
            const app2 = async () => {
                await fs.unlink(outputFile, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
            app2()
            const bufferData = Buffer.from(pdf);
            console.log('buffer data', bufferData)
            fs.writeFile(outputFile, bufferData, async (err) => {
                if (err) {
                    console.error('Error occurred while writing the file:', err);
                } else {
                    console.log('File saved successfully:', outputFile);
                    await sendFileToServerAndClient();
                }
            });

            const sendFileToServerAndClient = async () => {
                let data1 = new FormData();
                data1.append('files.file', fs.createReadStream(`${outputFile}`));
                data1.append('data', `{"documentType":"tsr", "panNumber":"${panNumber}"}`);
                // console.log(data1)

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/documents',
                    headers: {
                        'Authorization': strapiAccessToken,
                        'Content-Type': 'multipart/form-data'
                    },
                    data: data1
                };

                axios.request(config)
                    .then(async (response) => {
                        console.log("TSR pdf added to the documents table!!!")
                        console.log(JSON.stringify(response.data));
                        const clientNumber = await getClientWhatsappNumber(panNumber)
                        console.log(",,,,,,,,,,,,,,,,", clientNumber)
                        await sendFileToClient(outputFile, clientNumber)
                        console.log("Tax Report sent to the Client!!!")
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            };

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }



            res.send(pdf)

        };

        // Function to generate the PDF based on the invoice details
        async function generatePDF(partsList) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(`http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:3001/invoices/${partsList.id}/preview`, {
                waitUntil: 'networkidle2',
            });

            // Customize the page content and styling as needed
            await page.evaluate((partsList) => {
                // Modify the page content with the invoice details
                if (partsList[0]?.panDetails !== "") {
                    const panNumber = partsList[0]?.panDetails?.permanentAccountNumberPan
                    const letters = ["A", "B", "C", "F", "G", "H", "L", "J", "P", "T"]
                    const description = ["ASSOCIATION OF PERSONS (AOP)", "BODY OF INDIVIDUALS (BOI)", "COMPANY", "PARTNERSHIP FIRM / LLP", "GOVERNMENT", "HINDU UNDIVIDED FAMILY (HUF)", "LOCAL AUTHORITY", "ARTIFICIAL JURIDICAL PERSON", "INDIVIDUAL", "TRUST"]
                    const categoryValue = panNumber[3]
                    const index = letters.indexOf(`${categoryValue}`)
                    document.getElementById('name').textContent = partsList[0].panDetails.nameofAssessee;
                    //fileCreationDate
                    document.getElementById('date').textContent = partsList[0].panDetails.fileCreationDate;
                    document.getElementById('pan').textContent = partsList[0].panDetails.permanentAccountNumberPan;//
                    document.getElementById('panStatus').textContent = partsList[0].panDetails.currentStatusofPAN;
                    document.getElementById('status').textContent = description[index];
                }
                if (partsList[11]?.['tisDetails'] !== "") {
                    document.getElementById("address").textContent = partsList[11]?.['tisDetails']?.objctaData?.address
                    document.getElementById('dob').textContent = partsList[11]?.['tisDetails']?.objctaData?.dob;
                    document.getElementById('aadhaar').textContent = partsList[11]?.['tisDetails']?.objctaData?.aadharNumber;
                    document.getElementById('mobile').textContent = partsList[11]?.['tisDetails']?.objctaData?.mobileNo;
                    document.getElementById('email').textContent = partsList[11]?.['tisDetails']?.objctaData?.email;
                }


                const result = {};
                const partsData1to4 = partsList.slice(1, 5)
                // console.log("partsData1to4", partsData1to4)
                for (const part of partsData1to4) {
                    for (const key in part) {
                        const items = part[key];
                        if (!Array.isArray(items)) {
                            continue; // Skip to the next iteration if items is not an array
                        }

                        for (const item of items) {
                            if (!item.sourceofIncome) {
                                continue; // Skip the object if sourceofIncome is not present
                            }
                            // console.log(",,,,,,,,,,,,,++++++++++++++", item)

                            const source_of_income = item.sourceofIncome;
                            const amount = parseFloat(item.totalAmountPaidorCredited);

                            const tds_deposited = parseFloat(item.totalTDSDeposited);

                            // Check if the parsed values are valid numbers, if not, set them to 0

                            const valid_tds_deposited = isNaN(tds_deposited) ? 0 : tds_deposited;

                            if (source_of_income in result) {
                                result[source_of_income].totalAmountPaidorCredited += amount;

                                result[source_of_income].totalTDSDeposited += valid_tds_deposited;
                            } else {
                                result[source_of_income] = {
                                    totalAmountPaidorCredited: amount,

                                    totalTDSDeposited: valid_tds_deposited
                                };
                            }
                        }
                    }
                }



                const partsData6and8 = [partsList[6], partsList[8]]
                console.log("partsData6and8", partsData6and8)
                const result6and8 = {};
                for (const part of partsData6and8) {
                    for (const key in part) {
                        const items = part[key];
                        console.log("........................", items)
                        if (!Array.isArray(items)) {
                            continue; // Skip to the next iteration if items is not an array
                        }
                        for (const item of items) {
                            console.log("0000000000000000000000000", item)
                            if (!item.sourceofIncome) {
                                continue; // Skip the object if sourceofIncome is not present
                            }
                            console.log(",,,,,,,,,,,,,++++++++++++++", item)


                            const source_of_income = item.sourceofIncome;
                            const amount = parseFloat(item.totalAmountPaidorCredited);

                            const tds_deposited = parseFloat(item.totalTDSorTCSDeposited);

                            // Check if the parsed values are valid numbers, if not, set them to 0

                            const valid_tds_deposited = isNaN(tds_deposited) ? 0 : tds_deposited;

                            if (source_of_income in result6and8) {
                                result6and8[source_of_income].totalAmountPaidorCredited += amount;

                                result6and8[source_of_income].totalTDSDeposited += valid_tds_deposited;
                            } else {
                                result6and8[source_of_income] = {
                                    totalAmountPaidorCredited: amount,

                                    totalTDSDeposited: valid_tds_deposited
                                };
                            }
                        }
                    }
                }

                // console.log(result6and8)






                const result6 = {};
                const part6details = partsList.slice(6, 7)
                // console.log(part6details)
                for (const part of part6details) {
                    for (const key in part) {
                        const items = part[key];
                        if (!Array.isArray(items)) {
                            continue; // Skip to the next iteration if items is not an array
                        }

                        for (const item of items) {
                            if (!item.sourceofIncome) {
                                continue; // Skip the object if sourceofIncome is not present
                            }

                            const source_of_income = item.sourceofIncome;
                            const amount = parseFloat(item.totalAmountPaidorCredited);

                            const tds_deposited = parseFloat(item.totalTCSDepositedRs);

                            // Check if the parsed values are valid numbers, if not, set them to 0

                            const valid_tds_deposited = isNaN(tds_deposited) ? 0 : tds_deposited;

                            if (source_of_income in result6) {
                                result6[source_of_income].totalAmountPaidorCredited += amount;

                                result6[source_of_income].totalTCSDepositedRs += valid_tds_deposited;
                            } else {
                                result6[source_of_income] = {
                                    totalAmountPaidorCredited: amount,

                                    totalTCSDepositedRs: valid_tds_deposited
                                };
                            }
                        }
                    }
                }



                const incomeTable1 = document.getElementById('income-table-1');
                let part1Sno = 1
                for (const source_of_income in result) {
                    const row = incomeTable1.insertRow();
                    const amount = result[source_of_income].totalAmountPaidorCredited;
                    const formattedAmount = parseInt(amount).toLocaleString('en-IN', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    const amountTDS = result[source_of_income].totalTDSDeposited;
                    const formattedAmountTDS = parseInt(amountTDS).toLocaleString('en-IN', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    row.innerHTML = `
                        <td style="text-align:center">${part1Sno}</td>
                        <td>${source_of_income}</td>
                        <td style="text-align:right">${formattedAmount}</td>
        
                        <td style="text-align:right">${formattedAmountTDS}</td>
                      `;
                    part1Sno += 1
                }




                const incomeTable = document.getElementById('income-table-6');
                let part2Sno = 1
                for (const source_of_income in result6and8) {

                    const row = incomeTable.insertRow();
                    const amount = result6and8[source_of_income].totalAmountPaidorCredited;
                    const formattedAmount = parseInt(amount).toLocaleString('en-IN', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    const amountTDS = result6and8[source_of_income].totalTDSDeposited;
                    const formattedAmountTDS = parseInt(amountTDS).toLocaleString('en-IN', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    row.innerHTML = `
                            <td style="text-align:center">${part2Sno}</td>
                              <td>${source_of_income}</td>
                              <td style="text-align:right">${formattedAmount}</td>
        
                              <td style="text-align:right">${formattedAmountTDS}</td>
                            `;
                    part2Sno += 1
                }

                const part11Deatils = partsList.slice(11, 12)
                const sub = part11Deatils?.[0].tisDetails?.subLists?.slice(1)
                const tistable = document.getElementById('income-table-4');
                if ((sub !== undefined)) {
                    for (let i of sub) {
                        const row = tistable.insertRow();
                        row.innerHTML = `
                              <td  style="text-align:center">${i[0]}</td>
                                <td>${i[1]}</td>              
                                <td style="text-align:right">${i[3]}</td>
                              `;
                        // console.log(i)
                    }
                }
                // const partTisDetails = partsList[13]['tissampletables']
                // const sfttisTable = document.getElementById('income-table-12');

                // let num = 1
                // for (let key in partTisDetails) {
                //     if (partTisDetails.hasOwnProperty(key)) {
                //         const row = sfttisTable.insertRow();
                //         const amount = partTisDetails[key];
                //         const formattedAmount = amount.toLocaleString('en-IN', {
                //             style: 'decimal',
                //             minimumFractionDigits: 2,
                //             maximumFractionDigits: 2
                //         });
                //         row.innerHTML = `
                //       <td style="text-align:center">${num}</td>
                //       <td>${key}</td>              
                //       <td style="text-align:right">${formattedAmount}</td>
                //     `;
                //         num += 1;
                //     }
                // }


                //   for (let i of partTisDetails) {
                //     const row = sfttisTable.insertRow();
                //     row.innerHTML = `
                //               <td  style="text-align:center">${num}</td>
                //                 <td>${i['InformationDescription']}</td>              
                //                 <td style="text-align:right">${i['reportedValue']}</td>
                //               `;

                //   }
                // }


                const part12Deatils = partsList.slice(12, 13)?.[0]?.aisDetails
                const list_a = [part12Deatils.firstTableHtml]
                document.getElementById('ais-first-details').innerHTML = part12Deatils?.firstTableHtml;
                document.getElementById('ais-second-details').innerHTML = part12Deatils?.secondTableHtml;

            }, partsList);

            // Generate the PDF
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            await browser.close();

            return pdf;

        }

        fetchDataForAllTables();
        // res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(200)
    }

});

app.post("/resetOtpOptions", async (request, response) => {
    const { panNumber, resetOtpOptions } = request.body
    const prismUserDetails = await getDataFromStrapiTable("prismusers")
    const foundObject = prismUserDetails.find(obj => obj.attributes.panNumber === panNumber);
    // Extract the clientName and clientNumber if a matching object is found
    const clientName = foundObject ? foundObject.attributes.clientName : null;
    const clientNumber = foundObject ? foundObject.attributes.clientNumber : null;

    const adminUser = prismUserDetails.filter(obj => obj.attributes.panNumber === panNumber)[0].attributes.admin_user;
    const professionals = await getDataFromStrapiTable("professionals")
    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUser.data.attributes.firstname).attributes.phoneNumber;

    let message = "Client requested to reset password, details given below:\n\n"
    message += `clientName - ${clientName}\n`
    message += `clientNumber - ${clientNumber}\n`
    message += `resetOtpOption - ${resetOtpOptions}\n`
    await sendMsgToProfessionalOrClient(message, professionalPhoneNumber)
    response.sendStatus(200)
})

app.post("/knowYourStatus", async (request, response) => {
    // console.log(request.headers)
    const clientName = request.headers.clientname;
    const clientNumber = request.headers.clientnumber;
    // const prismClients = await getDataFromStrapiTable("prismusers");
    // const prismUserDetails = prismClients.find((each) => each.attributes.clientNumber === clientNumber & each.attributes.status === "Active")
    // console.log(prismUserDetails)
    const prismUserDetails = await getPrismUserByClientNumber(clientNumber)
    // console.log(prismUserDetails)
    if (prismUserDetails) {
        const { panNumber, clientFlowPosition } = prismUserDetails.attributes
        let flowPosition = clientFlowPosition === "panVerified" ? "Pan Verification" : clientFlowPosition
        const messageToClient = `Your Current Flow Position is ${flowPosition}`
        await sendMsgToProfessionalOrClient(messageToClient, clientNumber)
        if (clientFlowPosition === "panVerified") {
            //send template message to continue the flow
            await sendTemplateMessage(clientNumber, "after_pan_verification")
            console.log("after_pan_verification template message sent to the client !!")
        }
        else if (clientFlowPosition === "panAadharLink") {
            let messageToClient = "Based on your current application status, our team will verify your documents and provide you with an update soon. If you have not uploaded the following documents, please do so now.\n"
            messageToClient += "\n1.Aadhar Card\n2.PAN\n3.Mobile Number"
            await sendMsgToProfessionalOrClient(messageToClient, clientNumber)
            console.log("after pan aadhar link message sent to the client !!")
        }
        else if (clientFlowPosition === "incomeTaxPortalRegistration") {
            let messageToClient = "Based on your current application status, our team will verify your documents and provide you with an update soon. If you have not uploaded the following documents, please do so now.\n"
            messageToClient += "\n1.Aadhar Card\n2.PAN\n3.Mobile Number\n4.Email"
            await sendMsgToProfessionalOrClient(messageToClient, clientNumber)
            console.log("Income Tax Portal registration message sent to the client !!")
        }
        else if (clientFlowPosition === "taxReportGenerated") {
            let messageContent = "Do you Want to Make Any Changes in the Tax Summary Report\n"
            await sendInteractiveButtonsMessage(clientNumber, messageContent, "Yes", "No")
            console.log("Tax report changes message sent to the client !!")
        }
        // else if (clientFlowPosition === "draftComputationSent") {
        //     let message = "Do you Want to Make Any Changes in the Draft Computation?"
        //     const option1 = "Yes"
        //     const option2 = "No"
        //     await sendInteractiveButtonsMessage(clientNumber,message,option1,option2)
        //     console.log("Draft Computation changes message sent to the client !!")
        // }
    }
    response.sendStatus(200)
});

app.post("/clientFlowPosition", async (request, response) => {
    const clientName = request.headers.clientname;
    const clientNumber = request.headers.clientnumber;
    let data = {
        botMsg: ""
    }
    const clientMessages = await getClientMessages(clientNumber)
    const lastMsg = clientMessages.find(each => each.operatorName === "Bot")
    data.botMsg = lastMsg.text
    console.log(data)
    response.json(data)
})

app.post("/talkWithProfessional", async (request, response) => {
    const clientName = request.headers.clientname;
    const clientNumber = request.headers.clientnumber;
    // console.log(clientName,clientNumber)
    const messageToClient = "Our Professional will get back to you soon."
    await sendMsgToProfessionalOrClient(messageToClient, clientNumber)
    const messageContent = "Client has requested to talk with Professional."
    const messageToProfessional = await createClientMessage(messageContent, clientName, clientNumber)
    const prismUserDetails = await getPrismUserByClientNumber(clientNumber)
    const professionals = await getDataFromStrapiTable("professionals");
    const adminUserName = prismUserDetails.attributes.admin_user.data.attributes.firstname;
    const professionalPhoneNumber = professionals.find(user => user.attributes.name === adminUserName).attributes.phoneNumber;
    if (professionalPhoneNumber) {
        await sendMsgToProfessionalOrClient(messageToProfessional, professionalPhoneNumber)
        console.log("As client requested to talk with Professional, Message Sent to the Professional !!")
    }

    response.sendStatus(200)
})

app.post("/chatgptquestion", async (request, response) => {
    try {
        const { clientphone } = request.headers;
        const professionals = await getDataFromStrapiTable("professionals");
        const professional = professionals.find(
            (each) => each.attributes.phoneNumber === clientphone
        );
        const userId = parseInt(professional.attributes.userId);
        console.log(userId)

        const dueTasks = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM task WHERE organization_id = 136 AND user_id = ${userId} AND due_date = CAST(CURDATE() + INTERVAL 1 DAY AS DATE);`,
                // [337, userId],
                (err, results) => {
                    if (err) {
                        console.error('Error executing the query:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        console.log(dueTasks);
        const noOfDueTasks = dueTasks.length;
        // console.log(noOfDueTasks);
        let messageToClient = `You have ${noOfDueTasks} tasks with due date as tomorrow:\n\n`
        for (let i=0; i< dueTasks.length; i++) {
            messageToClient += `${i+1}. ${dueTasks[i].name}\n`
        } 
        console.log(messageToClient)
        await sendMsgToProfessionalOrClient(messageToClient, clientphone)
        response.sendStatus(200);
    } catch (error) {
        console.log(error);
        response.sendStatus(500);
    }
});

// '*/5 * * * * *'

cron.schedule('0 */12 * * *', async () => {
    const prismClients = await getDataFromStrapiTable("prismusers")
    const filteredClients = prismClients.filter((client) => {
        return (
            client.attributes.clientFlowPosition === 'panAadharLinkCheck' &&
            client.attributes.panAadharLink === 'applied'
        );
    });

    for (eachClient of filteredClients) {
        const { clientName, clientNumber, panNumber, aadharNumber } = eachClient.attributes
        const clientPanAadharLinkStatus = await checkPanApi(panNumber, aadharNumber)
        // console.log(clientPanAadharLinkStatus)
        if (clientPanAadharLinkStatus.message.includes("already linked to given Aadhaar")) {
            await updatePrismuserField(eachClient.id, "clientFlowPosition", "panAadharLinked")
            console.log("Client's Pan and Aadhar Linked !!")
            await sendTemplateMessage(clientNumber, "aadhar_pan_linked_successfully")
            console.log("Pan Link status Template Message sent to the Client !!")
        }
        // console.log(clientPanAadharLinkStatus)
    }
});

// check()
app.listen(3001, () => {
    console.log("Server running at port 3001");
});
