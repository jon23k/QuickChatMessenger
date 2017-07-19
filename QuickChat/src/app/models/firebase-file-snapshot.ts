export class FirebaseFileSnapshot {

    public $key: string;
    constructor(obj?: any){
        if (obj & obj.$key){
            this.$key = obj.$key;
        }
    }
}
