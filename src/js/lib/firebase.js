var firebase = require("firebase");
// INITIALIZE FIREBASE
var fbConfig = {
	apiKey: "AIzaSyAZ_avN1QbSlIF_2DmcwLfzGxPMk0jGS6Q",
	authDomain: "rodrigo-game-f5afa.firebaseapp.com",
	databaseURL: "https://rodrigo-game-f5afa.firebaseio.com",
};
firebase.initializeApp(fbConfig);

export function writePlayerData(name, character) {
	firebase
		.database()
		.ref("players/")
		.push({
			username: name,
			created_at: Date.now(),
			character: character,
			played: false,
			moves: [],
		});
}

// LevelOne
// 'runRight', 'push', 'jumpRight', 'jumpLeft',
// 'runLeft', 'jumpLeft', 'jumpLeft',
// 'runLeft', 'climb', 'jumpRight',
// 'jumpRight', 'jumpRight', 'jumpRight', 'runRight'

// LeveñTwo
// 'jumpRight', 'jumpRight',
// 'runRight', 'runLeft',
// 'runRight', 'climb', 'jumpLeft'

export function getPlayers() {
	const playersRef = firebase.database().ref("players/");
	let playersArr = [];

	playersRef.once("value", snapshot => {
		// Add every item in an array
		snapshot.forEach(childSnapshot => {
			if (childSnapshot.val().played) {
				childSnapshot.ref.remove();
			} else {
				playersArr.unshift(childSnapshot.val());
			}
		});
		// Sort array by created_at
		// playersArr.sort((first, second) => {
		// 	return first.created_at + second.created_at;
		// });
	});
	return playersArr;
}

export function setPlayerPlayed(id) {
	const playersRef = firebase.database().ref("players/");
	playersRef.orderByChild('created_at').equalTo(id).on("value", function (childSnapshot) {
		childSnapshot.forEach(function (data) {
			firebase.database().ref('players/' + data.key).update({
				played: true,
			});
		});
	});
}