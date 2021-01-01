import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/Models/member';
import { User } from 'src/app/Models/user';
import { AccountService } from 'src/app/Services/account.service';
import { MembersService } from 'src/app/Services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  //This access our browser events, and we are handling browser window change event
  @HostListener('window:beforeunload',['$event']) unloadNotification($event: any){
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private toastr: ToastrService,) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(data => this.user = data);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(memberReturn => {
      this.member = memberReturn;
    });
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      console.log("Updated member",this.member);
      this.toastr.success('Profile updated successfully !');
      this.editForm.reset(this.member);
    });
  }
}
