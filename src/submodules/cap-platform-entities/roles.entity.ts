import { Column, Entity, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { App_RolesEntity } from "./app_roles.entity";
import { Feature_PermissionsEntity } from "./feature_permissions.entity";
import { Tenant_User_App_RolesEntity } from "./tenant_user_app_roles.entity";

@Entity("roles",{"schema": "platform"})
@Unique(["Id"])
export class RolesEntity extends EntityBase {
    
    @Column ({ name: "role_name", nullable: false })
    role_name?: string;
 
    @Column ({ name: "role_priviledge", nullable: false , type: "json"})
    role_priviledge?: JSON;
    @OneToMany(
      (type) => Feature_PermissionsEntity,
      (feature_permissions) => feature_permissions.roles,
    )
    feature_permissions: Feature_PermissionsEntity [];
    @OneToMany(
      (type) => App_RolesEntity,
      (app_roles) => app_roles.apps,
    )
    app_roles: App_RolesEntity[];
    @OneToMany(
      (type) => Tenant_User_App_RolesEntity,
      (tenant_user_app_roles) => tenant_user_app_roles.roles,
    )
    tenant_user_app_roles: Tenant_User_App_RolesEntity[];
}