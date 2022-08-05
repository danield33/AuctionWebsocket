import {createServer, Server} from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import {db} from "./database";
import {OrganizationObj} from "./database/models/organizations/Organization";

const io = require('socket.io');
const cors = require('cors');

export class AuctionServer {

    public static readonly PORT: number = 8080;
    private readonly app: express.Application;
    private readonly server: Server;
    private io: SocketIO.Socket;
    private readonly port: string | number;

    constructor() {
        this.app = express();
        this.app.use(cors({
            origin: ['http://localhost:4000']
        }));

        this.port = process.env.PORT || AuctionServer.PORT;
        this.server = createServer(this.app);
        this.io = io(this.server, {
            cors: {origin: '*'},
            maxHttpBufferSize: 10e6
        });
        this.listen();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private listen() {

        this.server.listen(this.port, () => {
            console.log(`Listening on http://localhost:${this.port}`);
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            console.log(`Connected client on port ${this.port}`);

            socket.on('displayNewWinner', (winners: string[]) => {
                this.io.emit('displayNewWinners', winners)
            });

            socket.on('addNewOrg', async (m: OrganizationObj) => {
                const org = db.organizations.add(m);
                await org.save();
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                })
            });

            socket.on('deleteOrg', async (orgID: string) => {
                await db.organizations.delete(orgID);
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                })
            })

            socket.on('updateOrg', async (m: OrganizationObj) => {
                if (!m.id) return;
                const organization = db.organizations.orgs.get(m.id);
                organization.name = m.name;
                organization.description = m.description;
                await organization.setImage(m.image);
                await organization.save();
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                });
                this.io.emit('imageUpdate', m.id);

            })

            socket.on('deleteImage', async (fromOrgID: string) => {
                if (!fromOrgID) return;
                await db.organizations.orgs.get(fromOrgID).deleteImage();
                this.io.emit('imageUpdate', fromOrgID);
            })

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })

        })

    }

}
