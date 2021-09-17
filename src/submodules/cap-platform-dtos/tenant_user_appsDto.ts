import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class Tenant_User_AppsDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    tenant_user_id?: number;
    tenant_app_id?: number;
    tenant_user_app_permissions?: string;
}