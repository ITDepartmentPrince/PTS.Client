import { Component } from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-body-notes',
  templateUrl: './body-notes.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class BodyNotesComponent {}
