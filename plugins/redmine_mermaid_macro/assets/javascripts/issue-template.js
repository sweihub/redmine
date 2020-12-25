// vim: tabstop=4 expandtab shiftwidth=4 
// Copyfree!
// author : Sunding Wei
// date   : 2020-12-25

function checkTracker() {
	var target = document.querySelector("#issue_tracker_id");
	if (!target)
		return;

	var tracker = target.options[target.selectedIndex].text.toLowerCase();
	var edit = document.querySelector("#issue_description");

	// issue templates
	var templates = [
		// 0: user story
		"As a < role >, I want < some goals >, so that < some reasons >.",
		// 1: task
		"",
		// 2: bug
		"***Expect:***\nsuccess\n\n***Result***:\nfailure\n\n***Reproduce:***\n1. \n2. \n3. \n\n***Output:***\n```\noutput or logs here\n```",
		// 3: 需求
		"作为 < 角色 >， 我想要 < 功能 >， 以便于 < 商业价值 >。",
		// 4. 缺陷
		"***期待：***\n成功\n\n***结果：***\n失败\n\n***重现：***\n1. \n2. \n3. \n\n***输出：***\n```\n输出或日志...\n```"
	];

	// tracker changes
	for (var i = 0; i < templates.length; i++) {
		if (edit.value == templates[i]) {
			edit.value = "";
			break;
		}
	}

	// specify templates
	if (edit.value == "") {
		// English
		if (tracker == "user story")
			edit.value = templates[0]

		if (tracker == "task")
			edit.value = templates[1];

		if (tracker == "bug")
			edit.value = templates[2];

		if (tracker == "需求" || tracker == "用户故事")
			edit.value = templates[3];

		if (tracker == "缺陷")
			edit.value = templates[4];
	}
}

// tracker changes
checkTracker();
var container = document.getElementById('all_attributes');
if (container) {
	container.addEventListener('DOMNodeInserted', function (event) {
		checkTracker();
	}, false);
}
