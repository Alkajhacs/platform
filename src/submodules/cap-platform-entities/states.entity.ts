import { Column, Entity, ManyToOne, OneToMany, Unique, JoinColumn } from "typeorm";
import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { City } from "./cities.entity";
import { Country } from "./countries.entity";
import { Address } from "./addresses.entity";

@Entity("states",{"schema": "framework"})
@Unique(['Id'])
export class State extends EntityBase {
  @Column ({ name: "state_name", nullable: false })
  state_name?: string;
    
  @Column({ name: "state_code", nullable: false })
  state_code?: string; 

  @Column({ name: "state_tel_code", nullable: false })
  state_tel_code?: number;
 
  @Column({ name: "country_id", nullable: false })
  country_id?: number;

  
  @ManyToOne(
    () => Country,
    (countries) => countries.states,
  )
  @JoinColumn({name: "country_id"})
  countries: Country;

  @OneToMany(
    () => City,
    (cities) => cities.states,
  )
  cities: City[];

  @OneToMany(
    () => Address,
    (addresses) => addresses.cities,
  )
  addresses: Address[]

}