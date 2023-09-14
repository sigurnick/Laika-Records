import { IRecordOnDatabase } from './../interfaces/recordOnDatabase';


export class RecordOnCart{
  constructor(
    public item: IRecordOnDatabase,
    public quantity: number
  ){ }
}
