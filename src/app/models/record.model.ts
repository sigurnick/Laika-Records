import { Extraartist2 } from './../interfaces/record-id-res';
import { Tracklist } from "../interfaces/record-id-res";
import { Artist, Format, IRecordOnDatabase, Label, Video } from "../interfaces/recordOnDatabase";

export class Record implements IRecordOnDatabase{
  constructor(
     public id:number,
     public price : number,
     public year:number,
     public artists : Artist[],
     public artists_sort: string,
     public labels: Label[],
     public series : any[],
     public formats :Format[],
     public title : string,
     public country :string,
     public released :string,
     public notes :string,
     public released_formatted: string,
     public videos : Video[],
     public genres : string[],
     public styles : string[],
     public tracklist : Tracklist[],
     public extraartists: Extraartist2[]
  ){}
}
