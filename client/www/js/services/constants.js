app.constant("ROLE_TYPES",{
	BUSINESS : {
		id : "Business",
		displayName: "בית עסק",
		url: "/myPosts",
		state: "my_posts"
	},
	VOLUNTEER : {
		id : "Charity",
		displayName: "בית תמחוי",
		url: "/collect",
		state: "collect"
	}
});

app.constant("PROD_UNITS", {
	kg : {
		id: 'kg',
		display: 'ק"ג'	
	},
	u : {
		id: 'u',
		display: 'יחידות'
	}
});

app.constant("SERVER", {
	adress: "http://10.0.0.3:3000/api"
});