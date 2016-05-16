//	*******************************************************************
//
//	Fichier principal : Démarrage du programme
//			->	Initialisation du programme
//			->	Lancement de nools
//			->	Création des équipements
//
//	*******************************************************************
global.consigne_temperature = 19;
global.consigne_luminosite = 500;
global.consigne_co2 = 300;
global.retour = "";

/*
// Correspondance entre nools et ce fichier JS
var nools           = require ('nools');
var ruleFilePath    = __dirname + '/rules.nools';
var flow            = nools.compile(ruleFilePath);
var session         = flow.getSession();

/*
 *	Création des objets
 *		-> Chauffage   (x3) : SdB, Salle, Chambre 
 *		-> Lumière     (x2)	: 	   Salle, Chambre
 *		-> Température (x4)	: SdB, Salle, Chambre, Extérieur
 *		-> Luminosité  (x3) : 	   Salle, Chambre, Extérieur
 *		-> Volet 	   (x2) : 	   Salle, Chambre
 *		-> CO2         (x1) : 	   Salle
 *		-> VMC 		   (x1) : 	   Salle
 *		-> moment 	   (x1)
 *		-> Consigne    (x3) : Température, Luminosité, CO2
 */

 /* ==> Changer les id des objets <== 
var Chauffage                         = flow.getDefined('chauffage');
session.assert(chauffageSdb           = new Chauffage (consigne_temperature, 'id', 'sdb'));
session.assert(chauffageSalle         = new Chauffage (consigne_temperature, 'id', 'salle'));
session.assert(chauffageChambre       = new Chauffage (consigne_temperature, 'id', 'chambre'));

var Lumiere                           = flow.getDefined('lumiere');
session.assert(lumiereSalle           = new Lumiere ('down', 'id', 'salle'));
session.assert(lumiereChambre         = new Lumiere ('down', 'id', 'chambre'));

var CaptTemperature                   = flow.getDefined('captTemperature');
session.assert(captTemperatureIntSdb     = new CaptTemperature(consigne_temperature, 'sdb'));
session.assert(captTemperatureIntSalle   = new CaptTemperature(consigne_temperature, 'salle'));
session.assert(captTemperatureIntChambre = new CaptTemperature(consigne_temperature, 'chambre'));
session.assert(captTemperatureExt     = new CaptTemperature(consigne_temperature, 'exterieur'));

var CaptLuminosite                    = flow.getDefined('captLuminosite');
session.assert(captLuminositeExt      = new CaptLuminosite(consigne_luminosite, 'exterieur'));
session.assert(captLuminositeIntSalle    = new CaptLuminosite(consigne_luminosite, 'salle'));
session.assert(captLuminositeIntChambre  = new CaptLuminosite(consigne_luminosite, 'chambre'));

var Volet                             = flow.getDefined('volet');
session.assert(voletSalle             = new Volet('up', 'id', 'salle'));
session.assert(voletChambre           = new Volet('up', 'id', 'chambre'));

var Consigne                          = flow.getDefined('consigne');
session.assert(consigneTemp           = new Consigne(consigne_temperature, consigne_temperature, consigne_temperature, 'temperature'));
session.assert(consigneLum            = new Consigne(consigne_luminosite, consigne_luminosite, consigne_luminosite, 'luminosite'));
session.assert(consigneCo2            = new Consigne(consigne_co2, consigne_co2, consigne_co2, 'co2'));

var VMC                               = flow.getDefined('VMC');
session.assert(vmc                    = new VMC(1));

var CaptCO2                           = flow.getDefined('captCO2');
session.assert(captCO2                = new CaptCO2(400));

var Moment							  = flow.getDefined('moment');
session.assert(moment 				  = new Moment('jour'));
/*

function afficherData() {
	console.log("Consigne Température  => "+consigneTemp.getValue('sdb'));
	console.log("Consigne Luminosité => "+consigneLum.getValue('chambre'));
}*/
/*
session.matchUntilHalt().then(function(){});*/
// Démarrage du raisonneur
var Nools=function(){
var nools           = require ('nools');
var ruleFilePath    = __dirname + '/rules.nools';
var flow            = nools.compile(ruleFilePath);
var session         = flow.getSession();
var Chauffage                         = flow.getDefined('chauffage');
session.assert(chauffageSdb           = new Chauffage (consigne_temperature, 'id', 'sdb'));
session.assert(chauffageSalle         = new Chauffage (consigne_temperature, 'id', 'salle'));
session.assert(chauffageChambre       = new Chauffage (consigne_temperature, 'id', 'chambre'));

var Lumiere                           = flow.getDefined('lumiere');
session.assert(lumiereSalle           = new Lumiere ('down', 'id', 'salle'));
session.assert(lumiereChambre         = new Lumiere ('down', 'id', 'chambre'));

var CaptTemperature                   = flow.getDefined('captTemperature');
session.assert(captTemperatureIntSdb     = new CaptTemperature(consigne_temperature, 'sdb'));
session.assert(captTemperatureIntSalle   = new CaptTemperature(consigne_temperature, 'salle'));
session.assert(captTemperatureIntChambre = new CaptTemperature(consigne_temperature, 'chambre'));
session.assert(captTemperatureExt     = new CaptTemperature(consigne_temperature, 'exterieur'));

var CaptLuminosite                    = flow.getDefined('captLuminosite');
session.assert(captLuminositeExt      = new CaptLuminosite(consigne_luminosite, 'exterieur'));
session.assert(captLuminositeIntSalle    = new CaptLuminosite(consigne_luminosite, 'salle'));
session.assert(captLuminositeIntChambre  = new CaptLuminosite(consigne_luminosite, 'chambre'));

var Volet                             = flow.getDefined('volet');
session.assert(voletSalle             = new Volet('up', 'id', 'salle'));
session.assert(voletChambre           = new Volet('up', 'id', 'chambre'));

var Consigne                          = flow.getDefined('consigne');
session.assert(consigneTemp           = new Consigne(consigne_temperature, consigne_temperature, consigne_temperature, 'temperature'));
session.assert(consigneLum            = new Consigne(consigne_luminosite, consigne_luminosite, consigne_luminosite, 'luminosite'));
session.assert(consigneCo2            = new Consigne(consigne_co2, consigne_co2, consigne_co2, 'co2'));

var VMC                               = flow.getDefined('VMC');
session.assert(vmc                    = new VMC(1));

var CaptCO2                           = flow.getDefined('captCO2');
session.assert(captCO2                = new CaptCO2(400));

var Moment							  = flow.getDefined('moment');
session.assert(moment 				  = new Moment('jour'));

session.matchUntilHalt().then(function(){});
};	


exports.Nools=Nools;