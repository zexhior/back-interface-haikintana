import { Fb } from "./fb";
import { Mail } from "./mail";
import { Numero } from "./numero";
import { PhotoProfil } from "./photoprofil";
import { Presence } from "./presence";
import { Statut } from "./statut";

export class Membre{
    id: number;
    nom: string;
    prenom: string;
    adr_phys: string;
    date_add: string;
    linkedin: string;
    statut: Statut;
    nummembre: Numero[];
    fbmembre: Fb[];
    mailmembre: Mail[];
    presencemembre: Presence[];
    photoprofil: PhotoProfil;
    mdp: string;
}

export class MembreSave{
    id: number;
    nom: string;
    prenom: string;
    adr_phys: string;
    date_add: string;
    linkedin: string;
    statut: number;
    mdp: string;
}