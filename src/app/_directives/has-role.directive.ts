import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../Models/user';
import { AccountService } from '../Services/account.service';

/**
 * We are using this directive to just show or hide something which is not accessible to Member and only Admin or moderator can see it
 */

@Directive({
  selector: '[appHasRole]' //*ngIf, *ngFor etc called directives, Now we have added new directive so we can use it *appHasRole
  // *appHasRole = '["Admin"]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user:User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
          this.user = user;
      })
     }

  ngOnInit(): void {
    //Clear the view if no roles.
    if(!this.user?.roles || this.user == null){
      this.viewContainerRef.clear();
      return;
    }

    if(this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
