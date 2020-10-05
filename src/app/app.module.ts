import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AutoCompletePipe } from '../pipe/auto-complete.pipe';

import { TagListService } from '../service/tag-list.service';
import { TagUsersService } from '../service/tag-users.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, AutoCompletePipe ],
  bootstrap:    [ AppComponent ],
  providers: [TagListService, TagUsersService]
})
export class AppModule { }
