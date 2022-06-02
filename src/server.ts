import {createServer, Server} from 'http';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import {db} from "./database";
import {Organization, OrganizationObj} from "./database/models/organizations/Organization";
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

            socket.on('addNewOrg', (m: OrganizationObj) => {
                const org = db.organizations.add(m);
                org.save();
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                })
            });

            socket.on('deleteOrg', (orgID: string) => {
                db.organizations.delete(orgID);
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                })
            })

            socket.on('updateOrg', (m: OrganizationObj) => {
                if(!m.id) return;
                const organization = db.organizations.orgs.get(m.id);
                organization.name = m.name;
                organization.description = m.description;
                organization.image = Promise.resolve(m.image);

                organization.save();
                this.io.emit('dataUpdate', {
                    participants: Object.fromEntries(db.organizations.orgs)
                })

                this.io.emit('imageUpdate', m.id);

            })

            socket.on('deleteImage', (fromOrgID: string) => {
                if(!fromOrgID) return;
                db.organizations.orgs.get(fromOrgID).deleteImage();
                this.io.emit('imageUpdate', fromOrgID);
            })

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            })

        })

    }


    public getApp(): express.Application{
        return this.app;
    }

}
