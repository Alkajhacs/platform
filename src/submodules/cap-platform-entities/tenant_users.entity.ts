import { Column, Entity, ManyToOne, OneToMany, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { TenantsEntity } from "./tenants.entity";
import { Tenant_User_AppsEntity } from "./tenant_user_apps.entity";
import { UsersEntity } from "./users.entity";
@Entity("tenant_users",{"schema": "platform"})
@Unique(["Id"])
export class Tenant_UsersEntity extends EntityBase {
    
  @Column ({ name: "tenant_id", nullable: false })
  tenant_id?: number;
  
  @Column ({ name: "user_id", nullable: false })
  user_id?: number;
  
  @Column ({ name: "identity_provider_subscriber_id", nullable: false })
  identity_provider_subscriber_id?: string;
  @ManyToOne(
    () => UsersEntity,
    (users) => users.tenant_users,
  )
  @JoinColumn({name: "user_id"})
  users: UsersEntity;
  @ManyToOne(
    (type) => TenantsEntity,
    (tenants) => tenants.tenant_users,
  )
  @JoinColumn({name: "tenant_id"})
  tenants: TenantsEntity;
  @OneToMany(
    (type) => Tenant_User_AppsEntity,
    (tenant_user_apps) => tenant_user_apps.tenant_users,
  )
  tenant_user_apps: Tenant_User_AppsEntity[];
}