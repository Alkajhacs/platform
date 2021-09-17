import { Column, Entity, ManyToOne, OneToMany, Unique, JoinColumn } from "typeorm";
import { Address } from "./addresses.entity";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { State } from "./states.entity";

@Entity("cities",{"schema": "framework"})
@Unique(['Id'])
export class City extends EntityBase {

  @Column({ name: "state_id", nullable: false })
  state_id?: number;
 
  @Column({ name: "city_name", nullable: false })
  city_name?: string;

  @ManyToOne(
    () => State,
    (states) => states.cities,
  )
  @JoinColumn({name: "state_id"})
  states: State;

  @OneToMany(
    () => Address,
    (addresses) => addresses.cities,
  )
  addresses: Address[]

}