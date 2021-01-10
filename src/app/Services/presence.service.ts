import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  /*Now we are creating a method to create hub connection, So when user does connect to our application
  and they are authenticated then we gonna a automatically create the hub connection, that gonna connect them to our
  presence hub.*/

  //We need to pass token to server for that we need user, here JwtInterceptor can't help us to send token to server,
  //because we are not using http request here. We are using "WebSocket" protocol which doesn't support authentication header.
  //We will call this method as soon as user log-in to our application.
  createHubConnection(user: User){
    //We have created hub connection.
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

      //Now we gonna a start hub connection.
      this.hubConnection.start()
                        .catch(err => console.log(err));

      //This is event that we used server side in presenceHub class.
      this.hubConnection.on('UserIsOnline', username => {
        this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
          this.onlineUsersSource.next([...usernames, username]);
        })
      })

      this.hubConnection.on('UserIsOffline', username => {
        this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
          this.onlineUsersSource.next([...usernames.filter(x => x !== username)]);
        })
      })

      this.hubConnection.on('GetOnlineUsers', (username: string[]) => {
        this.onlineUsersSource.next(username);
      })

      this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
        this.toastr.info(knownAs + ' has send you a new message!')
          .onTap
          .pipe(take(1))
          .subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'));
      })
  }

  //We will call this method as soon as user log-out from our application.
  stopHubConnection() {
    this.hubConnection.stop().catch(err => console.log(err));
  }
}
