import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { } from 'rxjs/operator';
import { timer } from 'rxjs';

import { TagUsersService } from '../service/tag-users.service';
import { TagListService } from '../service/tag-list.service';

import { MOCK_DATA } from '../mock-data/comment';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {

  readonly notTyping = 0;

  @Input() tagKeyWord = '@';

  @ViewChild('textarea', {static: false}) textarea: ElementRef;
  @ViewChild('userList', {static: false}) userListEle: ElementRef;

  isSearch: boolean = false;
  canSubmit = false;
  hasFocus: boolean;
  typingState: number;
  searchText = '';
  content: string;
  timer;
  keepSelection;

  usersList = [];
  mockMsg: string;

  constructor(public elementRef: ElementRef,
      private tagUsersService: TagUsersService,
      private tagListService: TagListService) {
        for (let i = 0; i < 40 ; ++ i) {
          this.usersList.push({
            id: `${i}`,
            firstName: `Apple ${i}`,
            lastName: 'Chen'
          });
        }
  }
  
  onFocus() {
    this.hasFocus = true;
  }

  onBlur() {
    this.hasFocus = false;
    this.isSearch = false;
  }

  onTextChange($event) {
    if ($event.data === this.tagKeyWord) {
      this.searchText = '';
      this.startSearch();
    }
    this.content = $event.target.innerHTML;
    this.canSubmit = $event.target.childNodes.length > 0;
  }

  onTextareaKeyDown($event) {
    if (($event.code === 'Digit2' && $event.shiftKey) || $event.key === '@') {
      this.searchText = '';
      this.startSearch();
    }

    if ($event.key === 'Backspace') {
      this.tagUsersService.deleteContent($event);
    }

    this.searchTagUsers($event);
  }

  startSearch() {
    if (this.tagUsersService.tagNotAtFirst() || this.tagUsersService.tagAtFirst()) {
      this.tagUsersService.setPreCursorPosition();
      this.isSearch = true;

      setTimeout(() => {
        this.tagListService.openTagList(this.userListEle);
        this.keepSelection = this.tagUsersService.saveSelection(window.getSelection());
      });
    }
  }

  searchTagUsers($event) {
    if (this.isSearch) {
      if ($event.key === 'Enter') {
        $event.preventDefault();
        this.createTag();
      }

      if ($event.key === 'Backspace') {
        this.isSearch = this.tagUsersService.isCloseSearch();
      }

      if ($event.key === 'ArrowDown' || $event.key === 'ArrowUp') {
        $event.preventDefault();
        $event.stopPropagation();
        const sibling = $event.key === 'ArrowDown' ? 'nextSibling' : 'previousSibling';
        this.tagListService.userListActiveHandle(sibling, this.elementRef, this.userListEle);
      }

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchText = this.tagUsersService.getSearchName();
      }, 500);
    }
  }

  createTag() {
    const activeLi = this.elementRef.nativeElement.querySelector('li.active');

    this.tagUsersService.createTag(activeLi);

    this.searchText = '';
    this.isSearch = false;
    this.content = this.textarea.nativeElement.innerHTML;
  }

  // list
  onUserListMouseover($event) {
    $event.stopPropagation();
    this.tagListService.onListHover($event, this.userListEle);
  }

  onUserListClick() {
    this.createTag();
    this.tagUsersService.restoreSelection(this.keepSelection);
  }

  onSendClick() {
    this.mockMsg = JSON.parse(JSON.stringify(MOCK_DATA.content));
    MOCK_DATA.users.forEach(user => {
      this.mockMsg = this.mockMsg.replace(
        new RegExp(`\\{${user.id}\\}`, 'g'),
        `<span class="tag-name">${user.name}</span>`);
    });
  }

  trackUserListId(index: number, id: string): string {
    return id;
  }
}
