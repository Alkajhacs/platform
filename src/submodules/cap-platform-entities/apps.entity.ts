
import { Column, Entity, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { App_MessagesEntity } from "./app_messages.entity";
import { App_RolesEntity } from "./app_roles.entity";
import { FeaturesEntity } from "./features.entity";
import { Tenant_AppsEntity } from "./tenant_apps.entity";

@Entity("apps",{"schema": "platform"})
@Unique(["Id"])
export class AppsEntity extends EntityBase {
    
  @Column ({ name: "app_name", nullable: false })
    app_name?: string;
    
  @Column({ name: "app_description", nullable: true })
    app_description?: string;


    @OneToMany(
      () => App_MessagesEntity,
      (app_message) => app_message.apps,
    )
    app_message: App_MessagesEntity[];
    @OneToMany(
      () => FeaturesEntity,
      (features) => features.apps,
    )
    features: FeaturesEntity[];
    @OneToMany(
      () => App_RolesEntity,
      (app_roles) => app_roles.apps,
    )
    app_roles: App_RolesEntity [];
    @OneToMany(
      () => Tenant_AppsEntity,
      (tenant_apps) => tenant_apps.apps,
    )
    tenant_apps: Tenant_AppsEntity[];
}