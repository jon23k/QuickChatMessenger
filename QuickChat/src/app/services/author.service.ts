import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Author } from "../models/author";

@Injectable()
export class AuthorService {

  readonly authorsPath = "authors";
  constructor(private db: AngularFireDatabase) {}

  updateAuthor(authorKey: string, displayName: string, photoUrl: string){
      const author = new Author({
      displayName: displayName,
      photoUrl: photoUrl
    });
    this.db.object(`/${this.authorsPath}/${authorKey}`).set(author);
  }

}
