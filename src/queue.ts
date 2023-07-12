import amqp from 'amqplib';

export class MyQueue<T> {
    public _connection: amqp.Connection | null;

    public _channel: amqp.Channel | null;

    protected _queueName: string;

    private _queueUrl: string;

    constructor(queueUrl: string, queueName: string) {
        this._connection = null;
        this._channel = null;
        this._queueName = queueName;
        this._queueUrl = queueUrl;
    }

    async connectQueue(): Promise<void> {
        try {
            this._connection = await amqp.connect(this._queueUrl);
            this._channel = await this._connection.createChannel();

            await this._channel.assertQueue(this._queueName);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    async disconnectQueue(): Promise<void> {
        if (!this._connection) {
            return;
        }

        this._connection.close();
    }

    async disconnectChannel(): Promise<void> {
        if (!this._channel) {
            return;
        }

        this._channel.close();
    }

    async sendData(data: T): Promise<void> {
        if (!this._connection || !this._channel) {
            return;
        }

        await this._channel.sendToQueue(this._queueName, Buffer.from(JSON.stringify(data)));

        // Imediately disconnect after sending data (only for this example)
        // this.disconnectQueue();
        // this.disconnectChannel();
    }

    async getData(): Promise<T | null> {
        if (!this._connection || !this._channel) {
            return null;
        }

        let data: T | null = null;

        this._channel.consume(this._queueName, (message) => {
            if (!message) {
                return null;
            }

            data = Buffer.from(message.content) as T;
            console.log(`Receive data from queue: ${data}`);
            this._channel?.ack(message);
        });

        return data;
    }
}
