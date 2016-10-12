define(
	[
		'jq',
		'cal'
	],
	function($,cal) {
    	$(".wrapper").html("Good！成功加载index.js");
    	
    	function multiply(price,num){
    		var total = price * num;
    		console.log(total);
    	}
    	
    	multiply(10,5);
    	console.log(cal.add(3,5));
	}

);