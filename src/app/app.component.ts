import { Component, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './Models/user';
import { AccountService } from './Services/account.service';
import { PresenceService } from './Services/presence.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DatingApp';
  users: any;


  constructor(
    private accountService: AccountService,
    private presence: PresenceService,
  ) { }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(user) {
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }
}
