//	*******************************************************************
//
//	Fichier contenant tous les équipements nécessaires
//			->	Chauffage, Lumière, Volet
//			->	Capteurs (température, luminosité)
//			->	Capteur de CO2
//			->	Consigne
//			-> 	Moment (matin, jour, soir, nuit)
//
//	*******************************************************************

define Moment {
	value : null,

	constructor : function(value){
		this.value = value;
	},

	setValue : function(value){
		this.value = value;
	}, 

	getValue : function(){
		return this.value;
	}
}

define Consigne {
	valueSdb     : null,
	valueSalle   : null,
	valueChambre : null,
	mesure       : null,
	tempSuf      : 22,
	lumSuf       : 500,
	tempFort     : 25,
	lumFort      : 1000,
	jourSuf      : 100,

	constructor : function(val1, val2, val3, mesure){
		this.valueSdb     = val1;
		this.valueSalle   = val2;
		this.valueChambre = val3;
		this.mesure       = mesure;
	},

	getValue : function(piece){
		switch(piece){
			case 'sdb':
				return this.valueSdb;
				break;
			case 'salle':
				return this.valueSalle;
				break;
			case 'chambre':
				return this.valueChambre;
				break;
		}
	},

	setValue : function(val){
		this.valueSdb = val;
		this.valueSalle = val;
		this.valueChambre = val;

	},

	getMesure : function(){
		return this.mesure;
	},

	getValueLumSuf : function(){
		return this.lumSuf;
	},

	getValueTempSuf : function(){
		return this.tempSuf;
	},

	getValueLumFort : function(){
		return this.lumFort;
	},

	getValueTempFort : function(){
		return this.tempFort;
	},

	getValueJourSuf : function(){
		return this.jourSuf;
	}
}

define Chauffage {
	value : null,
	id    : null,
	place : null,
	etat  : null,
 	
 	constructor : function(value, id, place){
		this.id    = id;
		this.value = value;
		this.place = place;
		this.etat  = 'on';
 	},

 	getId : function(){
 		return this.id;
 	},
 	getValue : function(){
 		return this.value;
 	},
 	getPlace : function(){
 		return this.place;
 	},
 	up : function(){
		this.value += 1;
	},
	down : function(){
		this.value -= 1;
	},
	getEtat : function(){
		return this.etat;
	},
	setEtat : function(etat){
		this.etat = etat;
	}
}

define CaptTemperature {
	place : null,
	value : null,

	constructor : function(value, place){
		this.place = place;
		this.value = value;
	},

	getPlace : function(){
		return this.place;
	},

	getValue : function(){
		return this.value;
	},

	setValue : function(value){
		this.value = value;
	}
}

define Volet {
	value : null,
	id    : null,
	place : null,

	constructor : function(value, id, place){
		this.value = value;
		this.id    = id;
		this.place = place;
	},

	getValue : function(){
		return this.value;
	},

	getId : function(){
		return this.id;
	},

	getPlace : function(){
		return this.place;
	},

	up : function(){
		this.value = 'up';
		// api.up(this.id)
	},

	down : function(){
		this.value = 'down';
		// api.down(this.id)
	}
}


define CaptLuminosite {
	place : null,
	value : null,

	constructor : function(value, place){
		this.place = place;
		this.value = value;
	},

	getPlace : function(){
		return this.place;
	},

	getValue : function(){
		return this.value;
	},

	setValue : function(value){
		this.value = value;
	}
}

define Lumiere {
	value : null,
	id    : null,
	place : null,

	constructor : function(value, id, place){
		this.value = value;
		this.id    = id;
		this.place = place;
	},
	
	getValue : function(){
		return this.value;
	},

	getId : function(){
		return this.id;
	},

	getPlace : function(){
		return this.place;
	},

	up : function(){
		this.value = 'up';
		// api.up(this.id)
	},

	down : function(){
		this.value = 'down';
		// api.down(this.id)
	}
}

define CaptCO2 {
	value : null,

	constructor : function(value){
		this.value = value;
	},

	getValue : function(){
		return this.value;
	},

	setValue : function(value){
		this.value = value;
	}
}


define VMC {
	value : null,

	constructor : function(value){
		this.value = value;
	},

	setV1 : function(){
		this.value = 1;
	}, 

	setV2 : function(){
		this.value = 2;
	},

	getValue : function(){
		return this.value;
	}
}

