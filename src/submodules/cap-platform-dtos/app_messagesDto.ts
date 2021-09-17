import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class App_MessagesDto extends DtoBase {
    constructor() {
      super();
     
    }
  
    user_id?: number;
    tenant_id?: number;
    app_id?: number;
    is_notification?: boolean;
    subject?: string;
    message_body?: string;
    is_read?: boolean;
}