import {Component, OnInit} from '@angular/core';
import {IBodyData} from "../../../shared/interface/IBodyData";

@Component({
  selector: 'app-user-notes',
  template: '<div>{{notes}}</div>'

})
export class UserNotesComponent implements IBodyData, OnInit {
  bodyData: any;
  notes: string;

  ngOnInit(): void {
    this.notes = this.bodyData.notes;
  }
}
