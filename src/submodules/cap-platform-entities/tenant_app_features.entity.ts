import { Column, Entity, ManyToOne, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { FeaturesEntity } from "./features.entity";
import { Tenant_AppsEntity } from "./tenant_apps.entity";

@Entity("tenant_app_features",{"schema": "platform"})
@Unique(["Id"])
export class Tenant_App_FeaturesEntity extends EntityBase {
  
  @Column ({ name: "tenant_app_id", nullable: false })
  tenant_app_id?: number;
 
  @Column ({ name: "feature_id", nullable: false })
  feature_id?: number;
  @ManyToOne(
    () => FeaturesEntity,
    (features) => features.tenant_app_features,
  )
  @JoinColumn({name: "feature_id"})
  features: FeaturesEntity;
  @ManyToOne(
    () => FeaturesEntity,
    (tenant_apps) => tenant_apps.tenant_app_features,
  )
  @JoinColumn({name: "tenant_app_id"})
  tenant_apps: Tenant_AppsEntity;
}