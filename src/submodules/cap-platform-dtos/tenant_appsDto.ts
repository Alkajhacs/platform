import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class Tenant_AppsDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    tenant_id?: number;
    app_id?: number;
    connection_string?: string;
    all_features : boolean=false;
}