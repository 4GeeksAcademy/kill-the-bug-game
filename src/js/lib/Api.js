/* LevelOne
'runRight', 'push', 'jumpRight', 'jumpLeft',
'runLeft', 'jumpLeft', 'jumpLeft',
'runLeft', 'climb', 'jumpRight',
'jumpRight', 'jumpRight', 'jumpRight', 'runRight'
*/

/* LevelTwo
"jumpRight", "jumpRight",
"runRight", "runLeft",
"runRight", "climb", "jumpLeft";
*/

/* LevelThree
'runRight', 'climb', 'runRight', 'open',
'runRight', 'open', 'runRight', 'open',
'runRight', 'open', 'runRight', 'open',
'runRight', 'open', 'runRight', 'runLeft',
'jumpLeft', 'runLeft', 'jumpLeft', 'runLeft',
'runRight', 'push', 'jumpRight', 'runRight',
'push', 'jumpRight', 'runRight', 'open',
'runRight', 'runLeft', 'runRight', 'runLeft',
'runRight', 'runLeft', 'open', 'runLeft',
'jumpLeft', 'jumpLeft', 'jumpLeft', 'runLeft',
'jumpLeft', 'runLeft', 'jumpLeft', 'runLeft',
'runLeft', 'runRight', 'jumpRight', 'runRight',
'jumpRight', 'jumpRight', 'runRight', 'jumpRight',
'jumpRight', 'jumpRight', 'runRight'
*/

export let getAttempts = async () => {
	let response = await fetch("https://assets.breatheco.de/apis/kill-the-bug/api/pending_attempts");
	let json = await response.json();
	let data = await json.data;
	return data.pending_attempts;
};

export function addAttempt(name, character) {

	fetch("https://assets.breatheco.de/apis/kill-the-bug/api/add_attempt", {
		method: "post",
		headers: new Headers(),
		body: JSON.stringify(
			{
				"username": name,
				"character": character,
				"commands": [],
			}
		),
	});
}

export function deleteAttempt(id) {
	fetch("https://assets.breatheco.de/apis/kill-the-bug/api/delete_attempt", {
		method: "post",
		headers: new Headers(),
		body: JSON.stringify(
			{
				"id": id,
			}
		),
	});
}