import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class ClientsDto extends DtoBase {
    constructor() {
      super();
      this.start_date = new Date(); 
        this.expiry_date = new Date();
     
    }
  
    address_id?: number;
    start_date?: Date;
    expiry_date?: Date ;
    client_key?: string;
    client_name?: string;
    description?: string;
    contact_id?: number;
}