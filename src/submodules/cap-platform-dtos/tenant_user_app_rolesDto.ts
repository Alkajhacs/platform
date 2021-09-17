import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class Tenant_User_App_RolesDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    tenant_user_app_id?: number;
    role_id?: number;
}