import { Categorie } from "./categorie";
import { Description } from "./description";

export class Activite{
    id: number;
    theme: string;
    date: string;
    categorie: Categorie;
    descriptions: Description[];
}

export class ActiviteSave{
    id: number;
    theme: string;
    date: string;
    categorie: number;
}