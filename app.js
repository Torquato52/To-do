const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const corsConfig = require('./config/corsConfig')
const cors = require('cors');
const path = require('path');

const port = 3000;
const app = express();

app.use(cors(corsConfig));
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
});