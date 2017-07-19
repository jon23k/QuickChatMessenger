import { FirebaseFileSnapshot } from "./firebase-file-snapshot";

export class Post extends FirebaseFileSnapshot {
    public authorKey: string;
    public body: string;

    constructor(obj?:any){
        super(obj);
        this.authorKey = obj && obj.authorKey || "";
        this.body = obj && obj.body || "";
    }
}