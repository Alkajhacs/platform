import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class AppsDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    app_name?: string;
    app_description?: string;
}