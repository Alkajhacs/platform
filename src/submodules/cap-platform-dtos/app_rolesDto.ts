import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class App_RolesDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    role_id?: number;
    app_id?: number;
    app_role_permissions?: string;
}