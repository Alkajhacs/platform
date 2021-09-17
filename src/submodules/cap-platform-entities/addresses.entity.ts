import { EntityBase } from "./cap-platform-framework/cap-platform-entitybase/entitybase";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { City } from "./cities.entity";
import { State } from "./states.entity";
            
@Entity("addresses",{"schema": "framework"})
@Unique(['Id'])
export class Address extends EntityBase {
    @Column ({ name: "street_address"})
    street_address?: string;
    @Column({ name: "state_id"})
    state_id?: number; 
    @Column ({ name: "zip_code"})
    zip_code?: string;
    @Column ({ name: "address_guid"})
    address_guid?: string;
    @Column ({ name: "description"})
    description?: string;
    @Column ({ name: "city_id"})
    city_id?: number;
              
              
    @ManyToOne(
        () => State,
        (states) => states.Id,
    )
    @JoinColumn({name: "state_id"})
       states: State;
            
    @ManyToOne(
        () => City,
        (cities) => cities.Id,
    )
    @JoinColumn({name: "city_id"})
        cities: City;
    
    }          