import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../Models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  //This is use to retain logged in user info after we refresh the page or close the browser etc.
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'Account/login', model).pipe(
      map((feedback: User) => {
        const user = feedback;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'Account/register', model).pipe(
      //user inside the map is a response of server API which is of type User.
      //We are storing that user in our localStorage.
      //It also stores are registered user in currentUserSource.
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        //This return is Map method return, Not of the register service.
        return user;
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const userRoles = this.getDecodedToken(user.token).role;
    Array.isArray(userRoles) ? user.roles = userRoles : user.roles.push(userRoles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  /**
   * "atob" is method which would decode are token the middle part which is payload part and from their we will get
   * user roles.
   *
   */
  getDecodedToken(token){
     return JSON.parse(atob(token.split('.')[1]));
  }
}
