import { Injectable } from '@angular/core';
import { Post, PostWithAuthor } from "../models/post";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { AuthorService } from "./author.service";
import 'rxjs/add/observable/combineLatest';
import { Author } from "../models/author";

@Injectable()
export class PostService {
  readonly postsPath = "posts";
  private _postsStream : FirebaseListObservable<Post[]>;
  postsWithAuthorStream : Observable<PostWithAuthor[]>;

  constructor(private db: AngularFireDatabase, private authorService: AuthorService) { 
    this._postsStream = this.db.list(this.postsPath) ;
    this.postsWithAuthorStream = Observable.combineLatest<PostWithAuthor[]>(
      this._postsStream,
      this.authorService.authorMapStream,
      (posts: Post[], authorMap: Map<string, Author>) => {
        const postsWithAuthor: PostWithAuthor[] = [];
        console.log("Posts", posts);
        console.log("Author map: ", authorMap);
        for(let post of posts){
          const postWithAuthor = new PostWithAuthor(post);
          postWithAuthor.author = authorMap[post.authorKey];
          postsWithAuthor.push(postWithAuthor);
        }
        return postsWithAuthor;
      });
  }

  push(post: Post){
    console.log("Pushing the post", post);
    this._postsStream.push(post);

  }
}
