import { Column, Entity, ManyToOne, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { AppsEntity } from "./apps.entity";
import { RolesEntity } from "./roles.entity";

@Entity("app_roles",{"schema": "platform"})
@Unique(["Id"])
export class App_RolesEntity extends EntityBase {
    
 @Column({ name: "role_id", nullable: false })
   role_id?: number;
  @Column({ name: "app_id", nullable: false })
    app_id?: number;
  @Column({ name: "app_role_permissions", nullable: false })
    app_role_permissions?: string;

    @ManyToOne(
      () => AppsEntity, 
      (apps) => apps.app_roles,
      
    )
    @JoinColumn({name: "app_id"})
    apps: AppsEntity;
    @ManyToOne(
      () => RolesEntity,
      (roles) => roles.app_roles
    )
    @JoinColumn({name: "role_id"})
    roles: RolesEntity;
}