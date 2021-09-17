import { Column, Entity, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { Feature_PermissionsEntity } from "./feature_permissions.entity";
import { TenantsEntity } from "./tenants.entity";
import { Tenant_UsersEntity } from "./tenant_users.entity";

@Entity("users",{"schema": "platform"})
@Unique(["Id"])
export class UsersEntity extends EntityBase {
    
  @Column ({ name: "login_name", nullable: false })
  login_name?: string;
  
  @Column ({ name: "birth_date", nullable: true })
  birth_date?: Date;
  
  @Column ({ name: "date_of_joining", nullable: true })
  date_of_joining?: Date;
    
    @Column ({ name: "first_name", nullable: false })
    first_name?: string;
  
    @Column ({ name: "last_name", nullable: true })
    last_name?: string;
  
    @Unique(['email'])
    @Column ({ name: "email", nullable: false })
    email?: string;
  
    @Unique(['phone'])
    @Column ({ name: "phone", nullable: false })
    phone?: string;
  
    @Column ({ name: "marital_status", nullable: false })
    marital_status?: string;

    @OneToMany(
      () => Tenant_UsersEntity,
      (tenant_users) => tenant_users.users,
    )
    tenant_users: Tenant_UsersEntity[];
    @OneToMany(
      () => Feature_PermissionsEntity,
      (feature_permissions) => feature_permissions.users,
    )
    feature_permissions: Feature_PermissionsEntity[];
}