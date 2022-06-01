import {createServer, Server} from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import {db} from "./database";
const io = require('socket.io');
const cors = require('cors');

export class AuctionServer{

    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Socket;
    private port: string|number;

    constructor() {
        this.app = express();
        this.app.use(cors({
            origin: ['http://localhost:4000']
        }))
        this.port = process.env.PORT || AuctionServer.PORT;
        this.server = createServer(this.app);
        this.io = io(this.server, {
            cors: {origin: '*'}
        });
        this.listen();
    }

    private listen(){
        this.server.listen(this.port, () => {
            console.log(`Listening on http://localhost:${this.port}`);
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            console.log(`Connected client on port ${this.port}`);

            socket.on('displayNewWinner', (m: string[]) => {

            });

            socket.on('message', (m) => {
                console.log(`[server](message): ${JSON.stringify(m)}`);
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })

        })

    }


    public getApp(): express.Application{
        return this.app;
    }

}
