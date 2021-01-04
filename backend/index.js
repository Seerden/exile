import 'dotenv/config.js';
import express from 'express';
import dayjs from 'dayjs';

const app = express();

import { dbRouter} from './routers/dbRouter';

app.get('/', (req, res) => {
    res.send('/ GET successful')
})

app.use('/db', dbRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server started on port ${port} on ${dayjs(new Date()).format('DD MMMM YYYY, HH:mm:ss')}`));