const fs = require('fs')

const argv = process.argv.slice(2);
const inputFileName = argv[0]
const outFileName = 'formatted.json'
separator = ","

fs.writeFile(outFileName, '[', function (err) {
    if (err) throw err;
    console.log('Created file: ' + outFileName)
})
let firstRead = false
let headers = {}
const lineReader = require('readline').createInterface({
    input: fs.createReadStream(__dirname + '/' + inputFileName),
    crlfDelay: Infinity
});
lineReader
    .on('line', (line) => {
        if (!firstRead) {
            headers = line.split(separator)
            firstRead = true
            return
        }
        converted = convertData(line)
        saveToFile(converted)
    })
    .on('error', (error) => console.log(error.message))
    .on('close', () => {
        fs.appendFile(outFileName, "]", function (err) {
            if (err) throw err
        });
        console.log("Converting finished")
    })

function convertData(line) {
    let obj = {}
    let properties = line.split(separator)
    for (let j in headers) {
        if (properties[j].includes(", ")) {
            obj[headers[j]] = properties[j]
                .split(",").map(item => item.trim())
        } else obj[headers[j]] = properties[j]
    }
    return obj
}

let os = require('os')

function saveToFile(data) {
    let json = JSON.stringify(data, null, 2);
    let dataInArray = json + ',' + os.EOL
    fs.appendFile(outFileName, dataInArray, function (err) {
        if (err) throw err
    });
}
