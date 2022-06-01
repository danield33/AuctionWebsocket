import {AuctionServer} from "./server";
import {db} from "./database";

export const app = new AuctionServer().getApp();

app.get('/getData', (req, res) => {
    res.json({
        participants: Object.fromEntries(db.organizations.orgs)
    });
})

app.get('/images', (req, res) => {
    if(!req.query['id']) res.send(null);
    console.log(req.query)
    const {id} = req.query;
    const organization = db.organizations.orgs.get(id as string);
    organization.getImage().then(r => {
        res.json(r);
    })
})
