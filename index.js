import express from 'express'
import cors from 'cors';
import userrouter from './routes/user.routes.js';
import connectDB from './db/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import DistributorRouter from './routes/distributor.routes.js';

const app = express();

dotenv.config();

app.use(cors({ origin: ["http://localhost:1234", "https://grubexpress.vercel.app/"], credentials: true, }));
app.use(express.json());
app.use(cookieParser());

connectDB();
app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/api/user', userrouter);
app.use('/api/distributor', DistributorRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})