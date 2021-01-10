import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/Models/member';
import { Message } from 'src/app/Models/message';
import { User } from 'src/app/Models/user';
import { AccountService } from 'src/app/Services/account.service';
import { MembersService } from 'src/app/Services/members.service';
import { MessageService } from 'src/app/Services/message.service';
import { PresenceService } from 'src/app/Services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs' , {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  //for each tab in html we have tabDirectives
  activeTab: TabDirective;

  messages: Message[] = [];
  user: User;

  constructor(
    public presence: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService,
  ) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user;
      })
   }

  ngOnInit(): void {

    //What it does is, It goes to our routeResolver and gets the all required data from their

    /*When someone navigates to this page,
      1- Checks routing in app-routing-module
      2- It finds that its an authorized method so it will look for token in request header
      3- Then finds the routeResolver if it has routerResolver file then it goes to that file(member-detailed-resolver)
      4- From resolver file it load the required data for navigation page before we navigate to page
      5- When resolver gets the required data from server then it allows angular to navigate to page and in navigatePage component's ngOnIt we subscribe to resolver and gets all data immediately
    */
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    //We have used Tab as key of queryParams in member-card to navigate to message tab when user clicks on messageIcon in home page.
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    this.galleryImages = this.getImages();
  }


  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }


  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(fb => {
      this.messages = fb;
      console.log("Messages", this.messages);
    })
  }

  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
