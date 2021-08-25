import { Categorie } from "./categorie";
import { Description } from "./description";
import { Presence } from "./presence";

export class Activite{
    id: number;
    theme: string;
    date: string;
    categorie: Categorie;
    descriptions: Description[];
    presences: Presence[];
    cloture: boolean;
}

export class ActiviteSave{
    id: number;
    theme: string;
    date: string;
    categorie: number;
    cloture: boolean;
}