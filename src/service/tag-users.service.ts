import { Injectable, ElementRef } from '@angular/core';

import { timer } from 'rxjs';
import { take } from 'rxjs/operators';


export class CommentTag {
  content: string;
  tagUsers: string[] = [];
}

const NODE_TYPE_IS_TEXT = 3;

@Injectable({
  providedIn: 'root'
})
export class TagUsersService {

  readonly getSelection = window.getSelection();

  range = document.createRange();
  preCursorPosition: number;
  textareaEle: ElementRef;
  keyWord: string = '@';

  constructor() {
    // do nothing
  }

  saveSelection(getSelection) {
    if (getSelection) {
      const selection = window.getSelection();
      if (selection.getRangeAt && selection.rangeCount) {
        return selection.getRangeAt(0);
      }
    }

    return null;
  }

  createTag(chooseUser: HTMLElement) {
    const fragElement = document.createDocumentFragment();
    const elementDiv = document.createElement('span');
    const activeLi = chooseUser;
    const spaceNode = document.createTextNode('\u00A0');

    elementDiv.className = 'tag-name';
    elementDiv.setAttribute('contenteditable', 'false');
    elementDiv.setAttribute('data-id', activeLi.getAttribute('data-id'));
    elementDiv.innerText = activeLi.lastChild.textContent;

    // this.insertTag(fragElement.appendChild(elementDiv));
    elementDiv.innerText = activeLi.textContent;
    fragElement.appendChild(elementDiv);
    fragElement.appendChild(spaceNode);
    this.insertTag(fragElement, spaceNode);

  }

  insertTag(fragElement: DocumentFragment, spaceNode: Text) {
    const anchorNode = this.getSelection.anchorNode;
    const rangeAt = this.getSelection.getRangeAt(0);

    this.range.setStart(anchorNode, (this.preCursorPosition < 0) ? 0 : this.preCursorPosition);
    this.range.setEnd(anchorNode, rangeAt.startOffset);
    this.range.deleteContents();
    this.range.insertNode(fragElement);
    // this.range.setStartAfter(rangeAt.startContainer.nextSibling);
    // this.range.collapse(true);
    // this.restoreSelection(this.range);
    setTimeout(() => {
      // this.textareaEle.nativeElement.focus();
      this.range = this.range.cloneRange();
      this.range.setStartAfter(spaceNode);
      this.range.collapse(true);
      this.restoreSelection(this.range);
    });

  }

  restoreSelection(range) {
    if (range && window.getSelection) {
      this.getSelection.removeAllRanges();
      this.getSelection.addRange(range);
    }
  }

  isCloseSearch() {
    const currentCursorPosition = this.getSelection.getRangeAt(0).startOffset;
    const tagText = this.getSelection.anchorNode.textContent;
    const openSearch = !(tagText.charAt(currentCursorPosition - 1) === this.keyWord);

    return openSearch;
  }

  getSearchName() {
    const currentCursorPosition = this.getSelection.getRangeAt(0).startOffset;
    const tagText = this.getSelection.anchorNode.textContent;

    return tagText.substring(tagText.indexOf(this.keyWord) + 1, tagText.length);
  }

  setPreCursorPosition() {
    timer().pipe(take(1)).subscribe(() => {
      const cursorPosition = this.getSelection.getRangeAt(0).startOffset;
      const preWord = this.getSelection.getRangeAt(0).startContainer.textContent;
      this.preCursorPosition =  (preWord.charAt(preWord.length - 1) === this.keyWord) ?
        cursorPosition - 1 : cursorPosition;
    });

  }

  tagNotAtFirst() {
    const str = this.getSelection.anchorNode.textContent;
    const cursorPosition = this.getSelection.getRangeAt(0).startOffset;
    const whiteSpace = new RegExp(/^\s+$/);

    return whiteSpace.test(str.substr(cursorPosition - 1, 1)) ||
      this.getSelection.anchorNode.lastChild !== null;

  }

  tagAtFirst() {
    return this.getSelection.getRangeAt(0).startOffset === 0;
  }

  extractInputData(textarea: ElementRef, content: string) {
    const tagNameEle = textarea.nativeElement.children;
    const tagNameCount = tagNameEle.length;
    const inputData: CommentTag = new CommentTag;

    inputData.content = content.replace(/\&nbsp\;/gi, ' ');
    for (let i = 0 ; i < tagNameCount ; ++i) {
      if (tagNameEle[i].getAttribute('data-id')) {
        inputData.tagUsers.push(tagNameEle[i].getAttribute('data-id'));
        inputData.content = inputData.content
          .replace(tagNameEle[i].outerHTML, `{${tagNameEle[i].getAttribute('data-id')}}`);
      }
    }

    return inputData;
  }

  deleteContent($event) {
    if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') !== -1) {
      const selection = this.getSelection;
      const currentRange = selection.getRangeAt(selection.rangeCount - 1);
      const nodeType = currentRange.commonAncestorContainer.nodeType;

      if (!selection.isCollapsed || !selection.rangeCount) {

        return;
      }

      if (nodeType === NODE_TYPE_IS_TEXT && currentRange.startOffset > 0) {

        return;
      }

      this.range = document.createRange();
      if (selection.anchorNode !== this.textareaEle.nativeElement) {
        this.range.selectNodeContents(this.textareaEle.nativeElement);
        this.range.setEndBefore(selection.anchorNode);
      } else if (selection.anchorOffset > 0) {
        this.range.setEnd(this.textareaEle.nativeElement, selection.anchorOffset);
      } else {

        return;
      }
      this.range.setStart(this.textareaEle.nativeElement, this.range.endOffset - 1);

      const previousNode = this.range.cloneContents().lastChild;
      if (previousNode) {
        this.range.deleteContents();
        $event.preventDefault();
      }
    }

  }
}
