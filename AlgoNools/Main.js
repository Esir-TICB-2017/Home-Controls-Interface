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

// Correspondance entre nools et ce fichier JS
var nools           = require ('nools');
var ruleFilePath    = __dirname + '/rules.nools';
var flow            = nools.compile(ruleFilePath);
var session         = flow.getSession();


exports.session = session
exports.ruleFilePath = ruleFilePath;

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

/* ==> Changer les id des objets <== */
Nools = function(){
	var Chauffage                            = flow.getDefined('chauffage');
	session.assert(chauffageSdb              = new Chauffage (null, 'id', 'sdb'));
	session.assert(chauffageSalle            = new Chauffage (null, 'id', 'salle'));
	session.assert(chauffageChambre          = new Chauffage (null, 'id', 'chambre'));
	
	var Lumiere                              = flow.getDefined('lumiere');
	session.assert(lumiereChambre            = new Lumiere ('down', '573f2c9ff2763a101b8ac009', 'chambre'));
	session.assert(lumiereSalle              = new Lumiere ('down', '573f2c9ff2763a101b8abffc', 'salle'));
	

	var CaptTemperature                      = flow.getDefined('captTemperature');
	session.assert(captTemperatureIntSdb     = new CaptTemperature(null, 'sdb'));
	session.assert(captTemperatureIntSalle   = new CaptTemperature(null, 'salle'));
	session.assert(captTemperatureIntChambre = new CaptTemperature(null, 'chambre'));
	session.assert(captTemperatureExt        = new CaptTemperature(null, 'exterieur'));

	var CaptLuminosite                       = flow.getDefined('captLuminosite');
	session.assert(captLuminositeExt         = new CaptLuminosite(50, 'exterieur'));
	session.assert(captLuminositeIntSalle    = new CaptLuminosite(null, 'salle'));
	session.assert(captLuminositeIntChambre  = new CaptLuminosite(null, 'chambre'));

	var Volet                                = flow.getDefined('volet');
	session.assert(voletSalle                = new Volet('down', '573f2c9ff2763a101b8abfff', 'salle'));
	session.assert(voletChambre              = new Volet('down', '573f2c9ff2763a101b8ac000', 'chambre'));

	var Consigne                             = flow.getDefined('consigne');
	session.assert(consigneTemp              = new Consigne(consigne_temperature, consigne_temperature, consigne_temperature, 'temperature'));
	session.assert(consigneLum               = new Consigne(consigne_luminosite, consigne_luminosite, consigne_luminosite, 'luminosite'));
	session.assert(consigneCo2               = new Consigne(consigne_co2, consigne_co2, consigne_co2, 'co2'));

	var VMC                                  = flow.getDefined('VMC');
	session.assert(vmc                       = new VMC(2));

	var CaptCO2                              = flow.getDefined('captCO2');
	session.assert(captCO2                   = new CaptCO2(100));

	var Moment                               = flow.getDefined('moment');
	session.assert(moment                    = new Moment('jour'));

	
	// Démarrage du raisonneur
	session.matchUntilHalt().then(
        function(){
            console.log("DONE");
        },
        function(err){
            console.log(err.stack);
        }
    );

}

exports.Nools=Nools;
/*

var obj = "{'consigneTemp':30,'consigneLum':40,'consigneCo2';41,'captLuminositeExt':32,'captTemperatureIntSalle':11,'captTemperatureIntChambre':14,'captTemperatureIntSdb':5,'captLuminositeIntSalle':11,'captTemperatureIntChambre':12,'captLuminositeExt':121,'captCO2':12,'moment':'soir'}";



function run(){
	session.matchUntilHalt();
}

// Redémarrage toutes les 2 secondes pour s'assurer d'avoir le raisonneur en fonctionnement
setInterval(run, 2000);*/