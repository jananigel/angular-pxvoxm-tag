import { Injectable, ElementRef } from '@angular/core';

const FONT_HEIGHT = 23;
const USER_LI_HEIGHT = 25;
const AT_FONT_WIDTH = 15;
const USER_LIST_PADDING = 6;
const HALF_HEIGHT = 2;

@Injectable({
  providedIn: 'root'
})
export class TagListService {

  readonly getSelection = window.getSelection();

  range = document.createRange();

  constructor() {
    // do nothing
  }

  openTagList(listEle: ElementRef) {
    const userList = listEle.nativeElement;
    const getRangeAt = this.getSelection.getRangeAt(0);
    userList.style.top = `${getRangeAt.getClientRects()[0].top + FONT_HEIGHT}px`;
    userList.style.left = `${getRangeAt.getClientRects()[0].left - AT_FONT_WIDTH}px`;
    userList.style.opacity = 1;
  }

  userListActiveHandle = (nodeSibling: string, typingEle: ElementRef, userListEle: ElementRef) => {
    let currentActiveEle = typingEle.nativeElement.querySelector('li.active');
    const currentActiveIndex = currentActiveEle.getAttribute('data-index');
    const totalLength = userListEle.nativeElement.children.length - 1;
    const limit = nodeSibling === 'previousSibling' ? '0' : String(totalLength);
    const childrenIndex = nodeSibling === 'previousSibling' ? totalLength : 0;

    Array.from(userListEle.nativeElement.children).forEach(
      (li, index) => {
        userListEle.nativeElement.children[index].classList.remove('active');
      }
    );

    if (currentActiveIndex === limit) {
      userListEle.nativeElement.children[childrenIndex].classList.add('active');
      userListEle.nativeElement.scrollTop = childrenIndex * USER_LI_HEIGHT;
    } else {
      currentActiveEle[nodeSibling].classList.add('active');
      currentActiveEle = typingEle.nativeElement.querySelector('li.active');
      const activeLiParent = currentActiveEle.parentNode;

      userListEle.nativeElement.scrollTop =
        currentActiveEle.offsetTop + (currentActiveEle.clientHeight / HALF_HEIGHT) -
        (activeLiParent.clientHeight / HALF_HEIGHT) - USER_LIST_PADDING;
    }
  }

  onListHover($event, userEle: ElementRef) {
    Array.from(userEle.nativeElement.children).forEach(
      (li, index) => {
        userEle.nativeElement.children[index].classList.remove('active');
      }
    );
    $event.target.classList.add('active');
  }
}
