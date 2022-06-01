import {createServer, Server} from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';

export class AuctionServer{

    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string|number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || AuctionServer.PORT;
        this.server = createServer(this.app);
        this.io = new SocketIO.Server(this.server);
        this.listen();
    }

    private listen(){
        this.server.listen(this.port, () => {
            console.log('Running server on port: ' + this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log(`Connected client on port ${this.port}`);
            socket.on('message', (m: any) => {
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
