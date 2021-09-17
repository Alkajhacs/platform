import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class TenantsDto extends DtoBase {
    constructor() {
      super();
     
    }
    
    tenant_name?: string;
    description?: string;
    alias?: string;
    published_from?: Date;
    published_till?: Date;
    is_complete?: boolean;
    site_image_url_path?: string;
    status_id?: number;
    client_id?: number;
    identity_providers_details?: JSON;
    tenant_admin_email?: string;
}