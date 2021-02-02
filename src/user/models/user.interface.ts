
export enum UserRole {
    ADMIN = "admin",
    ChefDivision = "chefDivision",
    DirecteurGeneral = "directeur",
    Formateur = "formateur",
    DirecteurRH = "directeurRh",
    RespFormation = "responsableFormation",
    Candidat = "candidat",
    Apprenant = "apprenant",
    User = "user"
}


export interface User {
    
    id: number;

    email:string;

    password:string;
    
    isActive:boolean;

    role: UserRole;
}   