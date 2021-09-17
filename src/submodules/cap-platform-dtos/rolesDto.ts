import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class RolesDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    role_name?: string;
    role_priviledge?: JSON;
}