import {injectable} from "tsyringe";
import Pilote from "App/Pilote";

@injectable()
export class Car {
    public constructor(private pilote:Pilote) {
    }

    public build(): void {
        console.log(this.pilote)
        console.log(this.pilote.name)
    }
}