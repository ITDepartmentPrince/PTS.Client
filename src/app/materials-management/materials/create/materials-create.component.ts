import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {Material} from "../../../models/material";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-create',
  templateUrl: './materials-create.component.html'
})
export class MaterialsCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;

  constructor(private router: Router,
              private materialsService: MaterialsService) {
  }

  ngOnInit(): void {
    this.materialsService.material = new Material();
  }

  onSubmitted() {
    this.isLoading = true;
    this.materialsService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/materials'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          this._error(error);
        }
      });
  }

  private _error(error: any) {
    this.errorMessage = Utils.handleError(error);
    this.error = true;
    this.isLoading = false;
  }
}
