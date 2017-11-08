var firebase = require("firebase");
// INITIALIZE FIREBASE
var fbConfig = {
	apiKey: "AIzaSyAZ_avN1QbSlIF_2DmcwLfzGxPMk0jGS6Q",
	authDomain: "rodrigo-game-f5afa.firebaseapp.com",
	databaseURL: "https://rodrigo-game-f5afa.firebaseio.com",
};
firebase.initializeApp(fbConfig);

function writePlayerData(name) {
	firebase
		.database()
		.ref("players/")
		.push({
			username: name,
			created_at: Date.now(),
			character: "boy",
			current_level: 1,
		});
}

const playersRef = firebase.database().ref("players/");
let playersArr = [];

playersRef.once("value", snapshot => {
	// Add every item in an array
	snapshot.forEach(childSnapshot => {
		playersArr.push(childSnapshot.val());
	});
	// Sort array by created_at
	playersArr.sort((first, second) => {
		first.created_at > second.created_at ? 1 : -1;
	});
});
