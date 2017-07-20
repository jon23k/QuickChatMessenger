import { Injectable } from '@angular/core';
import { Post, PostWithAuthor } from "../models/post";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { AuthorService } from "./author.service";
import 'rxjs/add/observable/combineLatest';
import { Author } from "../models/author";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/scan';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PostService {
  readonly postsPath = "posts";
  readonly postBatchSize = 8;
  postsWithAuthorStream : Observable<PostWithAuthor[]>;
  private postIncrementStream: Subject<number>;

  constructor(private db: AngularFireDatabase, private authorService: AuthorService) { 
    this.postIncrementStream = new BehaviorSubject<number>(this.postBatchSize);
    const numPostsStream = this.postIncrementStream.scan<number>
    ((previousTotal : number, currentValue: number) => {
      return previousTotal + currentValue;
    });

    const postsStream : Observable<Post[]> = numPostsStream
    .switchMap<number, Post[]>((numPosts: number ) =>{
      return this.db.list(this.postsPath, {
        query: {
          limitToLast: numPosts,
        }
      });
    });

    this.postsWithAuthorStream = Observable.combineLatest<PostWithAuthor[]>(
      postsStream,
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
    firebase.database().ref().child(this.postsPath).push(post);
  }

  displayMorePosts(){
      this.postIncrementStream.next(this.postBatchSize);
  }
}
