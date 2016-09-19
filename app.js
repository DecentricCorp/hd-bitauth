$(".auth").click(function(){
	var email = $("[name='email']").val()
	var password = $("[name='pass']").val()
	loginFlow(email,password, function(token, address, err){
        $(".address").text("Address: "+address)
        if (!err) {
            doAlert("Authenticated Sucessfully", "success")
        } else {
            doAlert(err, "error")
        }
	})
}) 

function loginFlow(email, password, cb) {
	var keyPair, nonce, signature
	var email = email
    var cb = cb
	generateKeyPair(email, password, function(key){		
		keyPair = key
		getNonce(keyPair.getAddress(), email, function(challenge){
			nonce = challenge
			signMsg(nonce, keyPair, function(sig){
				signature = sig		
				getToken(keyPair.getAddress(), email, JSON.stringify(signature), function(token, error, msg){
					if (!error) {
						authToken = token
						return cb(authToken, keyPair.getAddress(), null)
					} else {
                        return cb(null, keyPair.getAddress(), msg.statusText + " : "+ msg.responseText)
						
					}						
				})
			})
		})
	})
}

function getNonce(address, email, cb) {
	$.ajax({
			method: "POST",
			url: "/nonce",
			data: { address: address, email: email}
		}).done(function (msg) {
			return cb(msg)
		})
}

function getToken(address, email, signature, cb) {
	$.ajax({
			method: "POST",
			url: "/auth",
			data: { address: address, email: email, signature: signature},
			statusCode: {
				401: function(msg) {
					return cb(null, true, msg)
				}, 
				500: function(msg) {
					return cb(null, true, msg)
				}
			}
		}).done(function (msg) {
			return cb(msg, false, "success")
		})
}

function generateKeyPair(email, password, cb) {
	var hash = bitauth.bitcoin.crypto.sha256(email+":"+password)
	var d = bitauth.BigInteger.fromBuffer(hash)
	var keyPair = new bitauth.bitcoin.ECPair(d)
	return cb(keyPair)
}

function signMsg(msg, keyPair, cb) {	
	var signature = bitauth.bitcoin.message.sign(keyPair, msg, bitauth.bitcoin.networks.bitcoin)
	return cb(signature)
}

function doAlert(msg, alertType){
    $(".alert .msg").text(msg)
    if (alertType === "error") {
        $(".alert").show()
        $(".alert").addClass("alert-danger")
        $(".alert").removeClass("alert-success")
    } else {
        $(".alert").show()
        $(".alert").addClass("alert-success")
        $(".alert").removeClass("alert-danger")
    }
    
}