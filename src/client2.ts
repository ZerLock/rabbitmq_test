import 'dotenv/config';
import express from 'express';
import { MyQueue } from './queue';
import { QueueData } from './queue.interface';

const PORT = Number(process.env.PORT) || 4000;

const queue = new MyQueue<QueueData>(process.env.QUEUE_URL as string, process.env.QUEUE_NAME as string);

queue.connectQueue();

queue.getData();

const app = express();

app.use(express.json());

app.listen(PORT, () => console.log(`Server listening at port: ${PORT}`));
