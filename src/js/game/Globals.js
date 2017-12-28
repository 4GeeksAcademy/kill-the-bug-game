document.querySelectorAll(".action__button").forEach(function (button) {
	const actionData = button.dataset.action;
	actionsArray = [];
	button.addEventListener("click", function () {
		if (["runRight", "runLeft", "jumpRight", "jumpLeft", "climb"].includes(actionData) && playerAlive) {
			actionsArray.push(actionData);
			actionList.innerHTML += `<li class="action-list__item action-list__item--${actionData}"></li>`;
		} else {
			if (actionsArray.length > 0) {
				disableButtons();
				play();
			}
		}
	});
});