import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { ClientsEntity } from "./clients.entity";
import { Tenant_AppsEntity } from "./tenant_apps.entity";
import { Tenant_UsersEntity } from "./tenant_users.entity";
@Entity("tenants",{"schema": "platform"})
@Unique(["Id"])
export class TenantsEntity extends EntityBase {
    
    
  @Column ({ name: "tenant_name", nullable: false })
  tenant_name?: string;
  
  @Column ({ name: "description", nullable: true })
  description?: string;
  
  @Column ({ name: "alias", nullable: true })
  alias?: string;
  
  @Column ({ name: "published_from", nullable: false })
  published_from?: Date;
  
  @Column ({ name: "published_till", nullable: false })
  published_till?: Date;
  
  @Column ({ name: "is_complete", nullable: false })
  is_complete?: boolean;
  
  @Column ({ name: "site_image_url_path", nullable: true })
  site_image_url_path?: string;
  

  @Column ({ name: "status_id", nullable: false })
  status_id?: number;
  
  @Column ({ name: "client_id", nullable: false })
  client_id?: number;
  
  @Column ({ name: "identity_providers_details", nullable: false , type: "json"})
  identity_providers_details?: JSON;
  
  @Column ({ name: "tenant_admin_email", nullable: false })
  tenant_admin_email?: string;
  @OneToMany(
    (type) => Tenant_UsersEntity,
    (tenant_users) => tenant_users.tenants,
  )
  tenant_users: Tenant_UsersEntity[];
  @OneToMany(
    (type) => Tenant_AppsEntity,
    (tenant_apps) => tenant_apps.tenants,
  )
  tenant_apps: Tenant_AppsEntity[];
  @ManyToOne(
    () => ClientsEntity,
    (clients) => clients.tenants,
  )
  @JoinColumn({name: "client_id"})
  clients: ClientsEntity;
}