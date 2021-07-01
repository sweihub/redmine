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
    var wrapper = document.querySelector("div.jstEditor > div.textoverlay-wrapper");

    wrapper.style.width = "100%";

	// issue templates
	var templates = [
		// 0: user story
		"As a < role >, I want < some goals >, so that < some reasons >.",
		// 1: task
		"",
		// 2: bug
		"",
		// 3: 需求
		"作为 < 角色 >， 我想要 < 功能 >， 以便于 < 商业价值 >。",
		// 4. 缺陷
		""
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

checkTracker();

// tracker changes
document.addEventListener('change', (event) => {
    // mimic document rendered event
    setTimeout(checkTracker, 0);
});

// subject emoji replacement
// https://fsymbols.com/signs/arrow/

function replaceArrow(s) {
    for (var i = 0; i < s.length; i++) {
        var t = s[i].innerHTML;
        // scope syntax: [ a --> b --> c ]
        t = t.replace(/\[([^\]]+)\]/g, "[<font color='#00008B'><i>$1</i></font>]");
        t = t.replaceAll(/\s*--&gt;\s*/g, " 🡪 ");
        t = t.replaceAll(/\s*--\s*/g, " ➟ ");
        t = t.replaceAll(/\s*&gt;\s*/g, " ⮞ ");
        s[i].innerHTML = t;
    }
}

function onRendered() {
    var s = document.querySelectorAll(".subject");
    replaceArrow(s);

    s = document.querySelectorAll(".issue-subject");
    replaceArrow(s);

    s = document.querySelectorAll(".issue-card .name");
    replaceArrow(s);

    s = document.querySelectorAll("#activity .icon a");
    replaceArrow(s);
}

setTimeout(onRendered, 0);

