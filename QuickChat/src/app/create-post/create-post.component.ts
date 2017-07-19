import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Post } from "../models/post";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  postBodyText: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(): void{
    try{
      const post = new Post({
        body: this.postBodyText,
        authorKey: this.authService.userID,
      })
      console.log("TODO: Submit the post", post);
      this.postBodyText = "";
    } catch(e){
      console.error("Submit failed");
    }
  }

}
