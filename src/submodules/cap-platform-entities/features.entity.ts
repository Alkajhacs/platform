import { Column, Entity, ManyToOne, OneToMany, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { AppsEntity } from "./apps.entity";
import { Feature_PermissionsEntity } from "./feature_permissions.entity";
import { Tenant_App_FeaturesEntity } from "./tenant_app_features.entity";
@Entity("features",{"schema": "platform"})
@Unique(["Id"])
export class FeaturesEntity extends EntityBase {
 
    @Column ({ name: "feature_name", nullable: false })
    feature_name?: string;
 
    @Column ({ name: "app_id", nullable: false })
    app_id?: number;
 
    @Column ({ name: "base_feature_id", nullable: true })
    base_feature_id?: number;
 
    @Column ({ name: "feature_description", nullable: false })
    feature_description? : string;
 
    @Column ({ name: "feature_key", nullable: false })
    feature_key? : string;
 
    @Column ({ name: "operations", nullable: true })
    operations? :string;
 
    @Column ({ name: "feature_type", nullable: false })
    feature_type? : number;
    
    @ManyToOne(
      () => AppsEntity,
      (apps) => apps.features,
    )
    @JoinColumn({name: "app_id"})
    apps: AppsEntity[];
    @OneToMany(
      () => Feature_PermissionsEntity,
      (feature_permissions) => feature_permissions.features,
    )
    feature_permissions: Feature_PermissionsEntity[]
    @OneToMany(
      () => Tenant_App_FeaturesEntity,
      (tenant_app_feature) => tenant_app_feature.features,
    )
    tenant_app_features: Tenant_App_FeaturesEntity[]

}