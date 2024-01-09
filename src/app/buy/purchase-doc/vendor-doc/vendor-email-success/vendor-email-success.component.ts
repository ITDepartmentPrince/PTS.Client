import { Component } from '@angular/core';
import {IBodyData} from "../../../../shared/interface/IBodyData";

@Component({
  selector: 'app-vendor-email-success',
  templateUrl: './vendor-email-success.component.html'
})
export class VendorEmailSuccessComponent implements IBodyData{
  bodyData: any;
}
