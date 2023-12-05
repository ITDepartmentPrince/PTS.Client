import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import autoTable from "jspdf-autotable";
import {jsPDF as JsPDF} from "jspdf";
import {Operations} from "../operations";
import {AuthPolicy} from "../../auth/auth-policy";

@Component({
  selector: 'app-command-bar',
  templateUrl: './command-bar.component.html',
  styleUrls: ['./command-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CommandBarComponent {
  protected readonly AuthPolicy = AuthPolicy;
  @Input() export: string;
  @Input() reports = false;
  @Input() edit = true;
  @Input() disEdit = false;
  @Input() create = true;
  @Input() view = true;
  @Input() disBtnDel = false;
  @Output() operations = new EventEmitter<Operations>();
  @ViewChild('cbToggler') cbToggler: ElementRef;
  @ViewChild('show') show: ElementRef;

  @HostListener('document:click', ['$event']) toggleShow(event: Event) {
    if (this.cbToggler.nativeElement.contains(event.target))
      this.show.nativeElement.classList.toggle('show');
    else
      this.show.nativeElement.classList.remove('show');
  }

  onCreate() {
    this.operations.emit(Operations.Create);
  }

  onView() {
    this.operations.emit(Operations.View);
  }

  onEdit() {
    this.operations.emit(Operations.Edit);
  }

  onDelete() {
    this.operations.emit(Operations.Delete);
  }

  onExport() {
    const doc = new JsPDF();
    autoTable(doc, { html: `#${this.export}` });
    doc.save(`${this.export}.pdf`)
  }
}
