import 'dotenv/config';
import express from 'express';
import { MyQueue } from './queue';
import { QueueData } from './queue.interface';

const PORT = Number(process.env.PORT) || 3000;
const app = express();

const queue = new MyQueue<QueueData>(process.env.QUEUE_URL as string, process.env.QUEUE_NAME as string);

queue.connectQueue();

app.use(express.json());

app.get('/send-msg', (req: express.Request, res: express.Response) => {
    const data: QueueData = {
        title: 'Hello',
        message: 'World',
    };

    queue.sendData(data);
    console.log('Data sent to queue:', JSON.stringify(data));
    res.send(`Message sent to queue: ${ JSON.stringify(data) }`);
});

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));