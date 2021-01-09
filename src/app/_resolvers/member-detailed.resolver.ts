import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Member } from "../Models/member";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { MembersService } from "../Services/members.service";

@Injectable({
  providedIn:'root'
})
export class MemberDetailedResolver implements Resolve<Member> {

  constructor(private memberService: MembersService){}

  //We don't need to subscribe route resolver it automatically subscribe
  resolve(route: ActivatedRouteSnapshot,): Observable<Member> {
    return this.memberService.getMember(route.paramMap.get('username'));
  }

}
/*With route resolver you can get required data before you construct your template and component */
