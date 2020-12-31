import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../Services/account.service';

@Injectable({
  providedIn: 'root'
})
//When we use guard it automatically subscribe to the service method like async pipe.
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private toastr: ToastrService,){}

  //Here it checks whether any user is currently logged in or not. i.e whether our replySubject has any user inside its buffer.
  //If yes then it returns true else false. We are applying this CanActivate guard in our routing module.
  canActivate(): Observable<boolean>{
    return this.accountService.currentUser$.pipe(
      map(user => {
        // console.log("User login", user);
        if (user) {
          return true;
        }
        this.toastr.error('You shall not pass!');
      })
    );
  }

}
