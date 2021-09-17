import { DtoBase } from "./cap-platform-common/cap-platform-dtobase/dtobase";

export class FeaturesDto extends DtoBase {
    constructor() {
      super();
     
    }
    feature_name?: string;
    app_id?: number;
    base_feature_id?: number;
    feature_description? : string;
    feature_key? : string;
    operations? :string;
    feature_type? : number;

}