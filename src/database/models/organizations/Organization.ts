const fs = require('fs');
const data = require('../MockData.json');
const atob = require('atob');
const ImageDataURI = require('image-data-uri');

export interface OrganizationObj {
    name: string;
    id: string;
    image: string;
    description: string;
}

export class Organization {

    name: string;
    id: string;
    image?: Promise<string>;
    description?: string;

    constructor(organization: OrganizationObj) {
        this.name = organization.name;
        this.id = organization.id;
        this.description = organization.description;
        if (organization.image?.startsWith("data"))
            this.image = Promise.resolve(organization.image);
        else this.image = this.getImage();

    }

    save() {
        data.participates[this.id] = {
            name: this.name,
            id: this.id,
            description: this.description
        };
        fs.writeFileSync(__dirname + '/../MockData.json', JSON.stringify(data, null, 2), 'utf-8');
        this.saveImage();
    }

    saveImage() {

        this.image.then(img => {
            this.dataURLtoFile(img);
        })
    }

    deleteImage(){
        console.log('delete')
        fs.unlink(this.path, (err) => console.error(err));
    }


    async getImage(): Promise<string> {
        try{
            return await ImageDataURI.encodeFromFile(this.path)
        }catch{
            return Promise.resolve(null);
        }
    }

    setImage(val) {
        this.dataURLtoFile(val);
    }

    private dataURLtoFile(dataURI: string) {
        if(!dataURI) return;
        ImageDataURI.outputFile(dataURI, this.path)
    }

    get path() {
        return __dirname+'/../../../images/' + this.id + '.png'
    }

}
