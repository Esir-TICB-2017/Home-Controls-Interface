//fonction KNX
function toggleLight(adresse,value) {
    connection.Action(adresse, value);
    //
}
function setknx(adresse,value,vitesse){
	connection.Connect(function () {
	    setTimeout(toggleLight(adresse,value, vitesse));  
	    setTimeout(function () {
	        connection.Disconnect();
	    }, 700);
	});
}