import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Post } from "../models/post";
import { PostService } from "../services/post.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  postBodyText: string;
  constructor(private authService: AuthService, private postService: PostService) { }

  ngOnInit() {
  }

  onSubmit(): void{
    try{
      const post = new Post({
        body: this.postBodyText,
        authorKey: this.authService.userID,
      });
      this.postService.push(post);
      this.postBodyText = "";
    } catch(e){
      console.error("Submit failed");
    }
  }

}
