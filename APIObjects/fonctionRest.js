//ajout d'xmlhttprequest
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttpGet = new XMLHttpRequest();
var xmlHttpPut = new XMLHttpRequest();
//url : requete rest que vous souhaitez intéroger
//paramASend : parametre que vous voulez put 
//paramAReturn : parametre que l'on veut chercher dans la reponse retourée par le serveur 
function changerEtat(url, paramASend,callback) {
    xmlHttpPut.open("PUT", url, false);
    xmlHttpPut.send(paramASend);
    var rep = xmlHttpPut.responseText;
    if(rep.search('val=')!=-1){
        var posStart = 5 + rep.indexOf("val=");
        var posEnd = -1 + rep.indexOf(">", posStart);
        callback( rep.substring(posStart, posEnd));
    }
    else{
        callback('error');
    }
   
}
//fichier avec mes fonctions 
//url: requete rest que vous souhaitez intéroger
//resultat : le parametre que vous souhaitez retourner 
function getEtat(url,callback) {
    xmlHttpGet.open("GET", url, false);
    xmlHttpGet.send(null);
    var rep = xmlHttpGet.responseText;
    if(rep.search('val=')!=-1){
        var posStart = 5 + rep.indexOf("val=");
        var posEnd = -1 + rep.indexOf(">", posStart);
        callback( rep.substring(posStart, posEnd));
    }
    else{
        callback('error');
    }
}
exports.changerEtat = changerEtat;
exports.getEtat = getEtat;