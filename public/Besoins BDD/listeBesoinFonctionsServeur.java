public interface besoinVueObjet{
    
    //Renvoi le fichier json contenant la liste des objets connectés de la maison
    jSon getListeObjets();
    
    //Renvoi le fichier json contenant la liste des pièces de la maison
    jSon getListePieces();
    
    jSon GetListeScenarios();
    
    void addPiece(String name);
    
    //Ajoute un objet dans la liste des objets d'une pièce
    void addObjetPiece(int idObjet, int idPiece);
    
    //Change un objet de piece
    void moveObjet(int idObjet, int idLastPiece, int idNewPiece);
    
    //Retire un objet d'une pièce
    void deleteObjet(int idObjet, int idPiece);
    
    //Change le nom d'une pièce
    void setNamePiece(string name);
    
    //Change un paramètre d'un objet
    void setParametreObjet(int idObjet,string typeValeurAModifier, string valeur);
    
}

public interface besoinUtilisateurs{
    
    //Renvoi liste des utilisateurs dans un Json
    jSon getListeUtilisateurs();
    
    //Modifie un paramètre d'un utilisateur
    void setParameterUser(int idUser, String parameter, String value);
    
    //Ajoute un utilisateur dans la bdd
    void addUser(String name);
    
    //Supprime un utilisateur
    void deleteUser(int idUser);
}