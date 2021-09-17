import { Column, Entity, ManyToOne, OneToMany, Unique, JoinColumn } from "typeorm";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { AppsEntity } from "./apps.entity";

@Entity("app_messages",{"schema": "platform"})
@Unique(['Id'])
export class App_MessagesEntity extends EntityBase {
  @Column ({ name: "user_id", nullable: false })
  user_id?: number;
    
  @Column({ name: "tenant_id", nullable: false })
  tenant_id?: number;
  
  @ManyToOne(
    () => AppsEntity,
    (apps) => apps.app_message,
  )
  @JoinColumn({name: "app_id"})
  apps: AppsEntity;
 

  @Column({ name: "app_id", nullable: false })
    app_id?: number;
  
  @Column({ name: "is_notification", nullable: false })
    is_notification?: boolean;
  
  @Column({ name: "subject", nullable: true })
    subject?: string;

  @Column({ name: "message_body", nullable: false })
    message_body?: string;
  
  @Column({ name: "is_read", nullable: false })
    is_read?: boolean;
}