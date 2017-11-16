var firebase = require("firebase");
// INITIALIZE FIREBASE
var fbConfig = {
	apiKey: "AIzaSyAZ_avN1QbSlIF_2DmcwLfzGxPMk0jGS6Q",
	authDomain: "rodrigo-game-f5afa.firebaseapp.com",
	databaseURL: "https://rodrigo-game-f5afa.firebaseio.com",
};
firebase.initializeApp(fbConfig);

export function writePlayerData(name, character, level = 0) {
	firebase
		.database()
		.ref("players/")
		.push({
			username: name,
			created_at: Date.now(),
			character: character,
			current_level: level,
		});
}


export function getPlayers() {
	const playersRef = firebase.database().ref("players/");
	let playersArr = [];

	playersRef.once("value", snapshot => {
		// Add every item in an array
		snapshot.forEach(childSnapshot => {
			playersArr.push(childSnapshot.val());
		});
		// Sort array by created_at
		playersArr.sort((first, second) => {
			return first.created_at + second.created_at;
		});
	});
	return playersArr;
}

