import { Column, Entity, ManyToOne, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { FeaturesEntity } from "./features.entity";
import { RolesEntity } from "./roles.entity";
import { UsersEntity } from "./users.entity";

@Entity("feature_permissions",{"schema": "platform"})

export class Feature_PermissionsEntity extends EntityBase {
    
    @Column ({ name: "feature_id", nullable: false })
    feature_id?: number;
 
    @Column ({ name: "operation_permitted", nullable: false, type: "json" })
    operation_permitted?: JSON;
 
    @Column ({ name: "role_id", nullable: false })
    role_id?: number;
 
    @Column ({ name: "user_id", nullable: true })
    user_id?: number;
 
    @Column ({ name: "role_feature_security", nullable: false, type: "json" })
    role_feature_security? : JSON;
    @ManyToOne(
      () => FeaturesEntity,
      (features) => features.feature_permissions,
    )
    @JoinColumn({name: "feature_id"})
    features: FeaturesEntity;
    @ManyToOne(
      () => RolesEntity,
      (roles) => roles.feature_permissions,
    )
    @JoinColumn({name: "role_id"})
    roles: RolesEntity[];
    @ManyToOne(
      () => UsersEntity,
      (users) => users.feature_permissions,
    )
    @JoinColumn({name: "user_id"})
    users: UsersEntity;
}