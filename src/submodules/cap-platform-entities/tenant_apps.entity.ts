import { Column, Entity, ManyToOne, OneToMany, Unique ,JoinColumn} from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { AppsEntity } from "./apps.entity";
import { TenantsEntity } from "./tenants.entity";
import { Tenant_App_FeaturesEntity } from "./tenant_app_features.entity";
import { Tenant_User_AppsEntity } from "./tenant_user_apps.entity";

@Entity("tenant_apps",{"schema": "platform"})
@Unique(["Id"])
export class Tenant_AppsEntity extends EntityBase {
  
  
  @Column ({ name: "tenant_id", nullable: false })
  tenant_id?: number;
  
  @Column ({ name: "app_id", nullable: false })
  app_id?: number;
  
  @Column ({ name: "connection_string", nullable: false })
  connection_string?: string;
  
  @Column ({ name: "all_features", nullable: false })
  all_features : boolean=false;
  @ManyToOne(
    (type) => AppsEntity,
    (apps) => apps.tenant_apps,
  )
  @JoinColumn({name: "app_id"})
  apps: AppsEntity[];
  @ManyToOne(
    () => TenantsEntity,
    (tenants) => tenants.tenant_apps,
  )
  @JoinColumn({name: "tenant_id"})
  tenants: TenantsEntity;
  @OneToMany(
    (type) => Tenant_App_FeaturesEntity,
    (tenant_app_features) => tenant_app_features.tenant_apps,
  )
  tenant_app_features: Tenant_App_FeaturesEntity[];
  @OneToMany(
    (type) => Tenant_User_AppsEntity,
    (tenant_user_apps) => tenant_user_apps.tenant_users,
  )
  tenant_user_apps: Tenant_User_AppsEntity[];
}