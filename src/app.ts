import "reflect-metadata";
import {container} from "tsyringe";
import {Car} from "App/Car";

const instance = container.resolve(Car);
console.log(instance);