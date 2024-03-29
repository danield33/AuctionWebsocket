import {Organization, OrganizationObj} from "./Organization";
import {child, getDatabase, onValue, ref, remove, set} from 'firebase/database';
import {app} from "../../firebase";

export class Organizations {

    idIncrement = 0;
    orgs = new Map<string, Organization>();
    private readonly ref = ref(getDatabase(app), 'buyers');

    constructor() {
        this.getDataFromFirebase();
    }

    getDataFromFirebase() {
        onValue(this.ref, (snapshot) => {
            const orgs = snapshot.val();
            if (orgs)
                this.orgs = this.convert(orgs);
        }, {onlyOnce: true});
        onValue(ref(getDatabase(app), 'idIncrement'), snapshot => {
            if (snapshot.val())
                this.idIncrement = snapshot.val();
        }, {onlyOnce: true});

    }

    convert(orgObj: { [id: string]: OrganizationObj }): Map<string, Organization> {
        const entries: Array<any> = Object.entries(orgObj)
            .map(i => {
                const organization = new Organization(i[1]);
                return [i[0], organization]
            });
        return new Map(entries);
    }

    async add(org: OrganizationObj) {
        const id = (this.idIncrement + 1).toString();
        const {image, ...rest} = org;
        const newOrg = new Organization({...rest, id});

        if (org.image) {
            await newOrg.setImage(org.image);
        }
        this.orgs.set(newOrg.id, newOrg);

        this.idIncrement++;
        await set(ref(getDatabase(app), 'idIncrement'), this.idIncrement);
        await newOrg.save();
        return newOrg;
    }

    async delete(orgID: string) {
        const organization = this.orgs.get(orgID);
        this.orgs.delete(organization.id);
        await organization.deleteImage();
        await remove(child(this.ref, orgID));
    }

    async save() {
        await set(this.ref, Object.fromEntries(this.orgs));
    }

}
