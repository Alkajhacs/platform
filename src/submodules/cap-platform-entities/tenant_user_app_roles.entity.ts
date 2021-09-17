import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { RolesEntity } from "./roles.entity";
import { Tenant_User_AppsEntity } from "./tenant_user_apps.entity";
@Entity("tenant_user_app_roles",{"schema": "platform"})
@Unique(["Id"])
export class Tenant_User_App_RolesEntity extends EntityBase {
  
  @Column ({ name: "tenant_user_app_id", nullable: false })
  tenant_user_app_id?: number;
 
  @Column ({ name: "role_id", nullable: false })
  role_id?: number;
  @ManyToOne(
    (type) => RolesEntity,
    (roles) => roles.tenant_user_app_roles,
  )
  @JoinColumn({name: "role_id"})
  roles: RolesEntity;
  @ManyToOne(
    () => Tenant_User_AppsEntity,
    (tenant_user_apps) => tenant_user_apps.tenant_user_app_roles,
  )
  @JoinColumn({name: "tenant_user_app_id"})
  tenant_user_apps: Tenant_User_AppsEntity;

}