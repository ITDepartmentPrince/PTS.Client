import {AfterViewInit, Component} from '@angular/core';
import {IBodyData} from "../../shared/interface/IBodyData";
import {BatchLot} from "../../models/batchLot";
import {InventoryIntelService} from "../../services/inventory-intel.service";
import {InventoryIntel} from "../../models/inventoryIntel";
import {MatTableDataSource} from "@angular/material/table";
import {ISearch} from "../../shared/interface/ISearch";
import {InventoryIntelSource} from "../../shared/inventory-intel-source";

@Component({
  selector: 'app-inventory-intel',
  templateUrl: './inventory-intel.component.html'
})
export class InventoryIntelComponent implements IBodyData, AfterViewInit {
  displayedColumns: string[] = ['MovementDate', 'CausedBy', 'Qty', 'BalanceAfter'];
  bodyData: any;
  batchLot: BatchLot;
  isLoading = true;
  searchValue = '';
  dataSource = new MatTableDataSource<InventoryIntel>();

  constructor(private invIntelService: InventoryIntelService) {
  }

  ngAfterViewInit(): void {
    this.batchLot = this.bodyData.batchLot;

    this.invIntelService.getAll(this.batchLot.batchLotId, this.batchLot.siteId)
      .subscribe(res => {
        this.balancedAfter(res);

        for (const inv of res) {
          this.causedBy(inv);
        }

        this.isLoading = false;
      });
  }

  onSearch(event: ISearch) {
    this.searchValue = event.value;
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
  }

  private causedBy(invIntel: InventoryIntel) {
    switch (invIntel.source) {
      case InventoryIntelSource.Receiving:
        this.invIntelService.getInvSource(invIntel)
          .subscribe(res => {
            invIntel.causedBy = 'PO ' + res.poNumber;
            invIntel.causedByLink = '/purchase-requisitions/' + res.poNumber;
          });
        break;
      case InventoryIntelSource.StockTransfer:
        invIntel.causedBy = 'ST ' + invIntel.stNumber;
        invIntel.causedByLink = '/stock-transfer/' + invIntel.stNumber;
        break;
    }
  }

  private balancedAfter(inventoryIntels: InventoryIntel[]) {
    this.dataSource.data = inventoryIntels.reverse()
      .map((inv, index, array) => {
        if (index > 0)
          inv.balancedAfter = array[index-1].balancedAfter + inv.qty;
        else
          inv.balancedAfter = inv.qty;
        return inv;
     })
      .reverse();
  }

  inStock() {
    return this.dataSource.data
      .reduce((acc, curr) => acc + curr.qty, 0)
      .toLocaleString();
  }
}
