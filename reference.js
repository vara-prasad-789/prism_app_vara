const insertFiletoStrapi = async () => {
    const outputFile = 'form26as.txt';
    const filePath = `C:/Users/Administrator/strapi/public/uploads/CTXPM_3224_N_5c3dcd62be.txt`;
    const data = await fs.promises.readFile(filePath, 'utf-8');
    // console.log(data);
    const bufferData = Buffer.from(data);
    console.log('buffer data', bufferData)
    fs.writeFile(outputFile, bufferData, async (err) => {
        if (err) {
            console.error('Error occurred while writing the file:', err);
        } else {
            console.log('File saved successfully:', outputFile);
            await sendFileToStrapi();
        }
    });

    const sendFileToStrapi = async () => {
        let data1 = new FormData();
        data1.append('files.file', fs.createReadStream(`${outputFile}`));
        data1.append('data', `{"documentType":"tsr"}`);
        // console.log(data1)

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://ec2-13-234-30-250.ap-south-1.compute.amazonaws.com:1337/api/documents',
            headers: {
                'Authorization': 'Bearer 90a1bd169dc55a1d03cea36cd1e6a1b10a672da5eb2d6d2ceb4896bf5575e78af237dd8172de1be1ba95bef3ddcdc07470af2be3db751e197749b8f4a2f90934fef12c36fe50b110075412978567b1ddd09b9b68be8285bc67f4582afdc8dc44188c74a2b10f66611d6cd78265a46b6aa553822802ec51ba20db0420fa8999af',
                'Content-Type': 'multipart/form-data'
            },
            data: data1
        };

        axios.request(config)
            .then(async (response) => {
                console.log("TSR pdf added to the documents table!!!")
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const app2 = async () => {
            await sleep(1000);
            await fs.unlink(outputFile, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }
        app2()
    };

}
function formatDateOfBirth(timestamp) {
    const dob = new Date(timestamp);
    dob.setDate(dob.getDate() + 1); // Increase the day value by 1
    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0'); // Add +1 to adjust the month value
    const year = dob.getFullYear();
    const dobString = day + month + year;
    return dobString;
}
// insertFiletoStrapi()
const folderPath = 'C:/Users/Administrator/strapi/public/uploads'; // Specify the path to your public uploads folder
let latestFile = null; // Variable to store the path of the latest file

const watcher = chokidar.watch(folderPath, {
    ignored: /^\./, // Ignore dotfiles
    persistent: true, // Keep the watcher active
});

watcher.on('add', async (filePath) => {
    // Handle new file creations
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt === '.txt') {
        // Check if the current file is the latest file
        if (!latestFile || fs.statSync(filePath).mtime > fs.statSync(latestFile).mtime) {
            latestFile = filePath;
        }
    }
});

console.log(`Listening for new file creations in ${folderPath}`);

// Function to process the latest file
function processLatestFile() {
    if (latestFile) {
        // Process the latest file here
        const filePath = 'C:\\Users\\Administrator\\strapi\\public\\uploads\\FVFPM_8433_Q_2023_1468a132c3.txt';

        // Extract the PAN number using substring and regular expression
        const startIndex = filePath.lastIndexOf('\\') + 1; // Find the index of the last backslash
        const endIndex = filePath.lastIndexOf('_'); // Find the index of the last underscore before the suffix

        if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
            const panNumber = filePath.substring(startIndex, endIndex);
            const lastUnderscoreIndex = panNumber.lastIndexOf('_');
            if (lastUnderscoreIndex >= 0) {
                const desiredSubstring = panNumber.substring(0, lastUnderscoreIndex);
                const joinedString = desiredSubstring.replace(/_/g, '');
                console.log(joinedString);
            } else {
                console.log('Underscore not found in the PAN number.');
            }
        } else {
            console.log('PAN number not found in the file path.');
        }

    } else {
        console.log('No new .txt files found.');
    }
}

// Function to start the watcher and schedule the processing at intervals
function startFileWatcher(interval) {
    watcher.on('ready', () => {
        // Run the processLatestFile function initially
        processLatestFile();

        // Run the processLatestFile function at the specified interval
        setInterval(processLatestFile, interval);
    });
}

// Call the startFileWatcher function with the desired interval (in milliseconds)
// startFileWatcher(30000);