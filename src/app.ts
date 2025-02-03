import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Server is running on port ',port);
})

