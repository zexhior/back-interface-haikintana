import { Fb } from "./fb";
import { Mail } from "./mail";
import { Numero } from "./numero";
import { PhotoProfil } from "./photoprofil";
import { Presence } from "./presence";
import { Statut } from "./statut";

export class Membre{
    id:number;
    username: string;
    first_name:string;
    last_name:string;
    adr_phys: string;
    date_add: string;
    linkedin: string;
    statut: Statut;
    password: string;
    ref: number;
    email: string;
    nummembre: Numero[];
    fbmembre: Fb[];
    mailmembre: Mail[];
    presencemembre: Presence[];
    photoprofil: PhotoProfil;
}

export class MembreSave{
    id:number;
    username: string;
    first_name:string;
    last_name:string;
    adr_phys: string;
    date_add: string;
    linkedin: string;
    statut: number;
    ref: number;
}