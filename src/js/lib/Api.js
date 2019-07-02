/* LevelOne
"jumpRight", "runRight", "runLeft",
"runRight", "open", "runRight",
"climb", "runLeft", "kill"
*/

/* LevelTwo
"runRight", "push", "jumpRight", "jumpLeft",
"runLeft", "jumpLeft", "jumpLeft",
"runLeft", "climb", "jumpRight",
"jumpRight", "jumpRight", "jumpRight", "runRight", "kill"
*/

/* LevelThree
"runRight", "climb", "runRight", "open",
"runRight", "open", "runRight", "open",
"runRight", "open", "runRight", "open",
"runRight", "open", "runRight", "runLeft",
"jumpLeft", "runLeft", "jumpLeft", "runLeft",
"runRight", "push", "jumpRight", "runRight",
"push", "jumpRight", "runRight", "open",
"runRight", "runLeft", "runRight", "runLeft",
"runRight", "runLeft", "open", "runLeft",
"jumpLeft", "jumpLeft", "jumpLeft", "runLeft",
"jumpLeft", "runLeft", "jumpLeft", "runLeft",
"runRight", "jumpRight", "jumpRight", "jumpRight",
"runRight", "jumpRight", "jumpRight", "runRight", "kill"
*/

export let getAttempts = async (mapId) => {
	let response = await fetch("https://assets.breatheco.de/apis/kill-the-bug/api/pending_attempts/" + mapId);
	let json = await response.json();
	let data = await json.data;
	return data.pending_attempts;
};

export let getAllLevels = async () => {
	let response = await fetch("https://assets.breatheco.de/apis/kill-the-bug/api/get_levels");
	let json = await response.json();
	let data = await json.data;
	return data;
};

export let addAttempt = async (name, character, mapId) => {
	let response = await fetch("https://assets.breatheco.de/apis/kill-the-bug/api/add_attempt", {
		method: "post",
		headers: new Headers(),
		body: JSON.stringify(
			{
				"username": name,
				"character": character,
				"level": mapId,
				"commands": [],
			}
		),
	});
	let json = await response.json();
	return json;
};

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