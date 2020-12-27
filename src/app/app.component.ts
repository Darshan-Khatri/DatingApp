import { Component, } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DatingApp';
  users: any;


  constructor(private http: HttpClient){}

  ngOnInit(){
    this.GetUser();
  }

  GetUser = () =>{
    this.http.get('http://localhost:50569/api/Users').subscribe((feedback) =>{
      console.log("FeedBack", feedback);
      this.users = feedback;
    },
    err => {
      console.log("Error", err);
    }
    )
  }
}
