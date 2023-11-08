import {Vendor} from "./vendor";
import {MatlClassification} from "./matl-classification";
import {VendorContact} from "./vendor-contact";
import {OtherCharge} from "./other-charge";
import {Source} from "./source";
import {Material} from "./material";
import {MeasurementUnit} from "./measurement-unit";
import {TaxRate} from "./tax-rate";
import {BatchLot} from "./batchLot";
import {Sponsor} from "./sponsor";
import {Department} from "./department";
import {Shipping} from "./shipping";
import {PayTerm} from "./pay-term";
import {Site} from "./site";

export class RefsList {
  vendors: Vendor[];
  classifications: MatlClassification[];
  sponsors: Sponsor[];
  vendorContacts: VendorContact[];
  otherCharges: OtherCharge[];
  sources: Source[];
  materials: Material[];
  measurementUnits: MeasurementUnit[];
  taxRates: TaxRate[];
  batchesLots: BatchLot[];
  departments: Array<Department>;
  shippings: Array<Shipping>;
  payTerms: Array<PayTerm>;
  sites: Array<Site>;
}
