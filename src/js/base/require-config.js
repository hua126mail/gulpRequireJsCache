var require = {
	baseUrl : '/',	//相对于定义了data-main的HTML
    paths: {
        'jq' : 'js/lib/jquery-1.11.1.min.js',
        'cal': 'js/base/cal.js'
    },
    shim: {				
    	'jq': { exports: 'jQuery' }
	},
	//urlArgs:"t=" +  (new Date()).getTime()
};
