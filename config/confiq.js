const fs = require('fs');
const key = fs.readFileSync('D:/data/bootcamp/task2/certs/key.pem');

module.exports = {
    secret: key
}