import {AuctionServer} from "./server";
import {db} from "./database";

export const app = new AuctionServer().getApp();

app.get('/getData', (req, res) => {
    res.json({
        participants: Object.fromEntries(db.organizations.orgs)
    });
})
