import { IRecordOnDatabase } from "./recordOnDatabase";

export interface IUser {
email: string;
name: string;
surname: string;
userId: string;
isAdmin: boolean;
wanted: IRecordOnDatabase[]
collection: IRecordOnDatabase[]
orders?: {
  record: IRecordOnDatabase;
  quantity: number;
  price: number;

}
}
