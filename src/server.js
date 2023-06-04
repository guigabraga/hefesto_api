const app = require('./App')
const dotenv = require('dotenv');

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT

app.listen(SERVER_PORT, () => console.log('Server UP!'));