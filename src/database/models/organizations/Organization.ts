import {DatabaseReference, getDatabase, ref, set} from "firebase/database";
import {getDownloadURL, getStorage, ref as storeRef, StorageReference, uploadString, deleteObject} from "firebase/storage";

const storage = getStorage();

export interface OrganizationObj {
    name: string;
    id: string;
    image?: string;
    description: string;
}

export class Organization {

    name: string;
    id: string;
    image?: string;
    description?: string;
    private readonly ref: DatabaseReference;
    private readonly storeRef: StorageReference

    constructor(organization: OrganizationObj) {
        this.name = organization.name;
        this.id = organization.id;
        this.description = organization.description;
        this.ref = ref(getDatabase(), 'buyers/'+this.id);
        this.storeRef = storeRef(storage, 'buyer/'+this.id+'.png');

    }

    async save() {

        await set(this.ref, {
            name: this.name,
            id: this.id,
            description: this.description
        });

    }

    async setImage(newImage: string) {//base 64 string
        await uploadString(this.storeRef, newImage, 'data_url');
    }

    async deleteImage() {
        await deleteObject(this.storeRef);
        this.image = null;
    }

    async getImage(): Promise<string|null> {
        if(this.image != null)
            return this.image;
        this.image = await getDownloadURL(this.storeRef);
    }

}
