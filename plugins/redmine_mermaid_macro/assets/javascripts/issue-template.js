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
		// 1: bug
		"\n\n*Steps:*\n\n\n*Result:*\n\n\n*Suggestion:*\n",
		// 2: 需求
		"作为 < 角色 >， 我想要 < 功能 >， 以便于 < 商业价值 >。",
		// 3. 漏洞
		"\n\n*步骤:*\n\n\n*结果:*\n\n\n*建议:*\n"
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

		if (tracker == "bug")
			edit.value = templates[1];

		if (tracker == "需求" || tracker == "用户故事")
			edit.value = templates[2];

		if (tracker == "漏洞")
			edit.value = templates[3];
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

function getArrow(t) {
    // scope syntax: [ a --> b --> c ]
    t = t.replace(/\[([^\]]+)\]/g, "[<font color='#00008B'><i>$1</i></font>]");
    t = t.replaceAll(/\s*--&gt;\s*/g, " 🡪 ");
    t = t.replaceAll(/\s*--\s*/g, " ➟ ");
    t = t.replaceAll(/\s*&gt;\s*/g, " ⮞ ");
    return t;
}

function setArrows(s) {
    for (var i = 0; i < s.length; i++) {
        var t = s[i].innerHTML;
        s[i].innerHTML = getArrow(t);
    }
}

function setPriorityIcons() {
	var rows = document.querySelectorAll("#roadmap tr.hascontextmenu.issue")
	var colors = ["orange", "red", "black"];

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var p = -1;

		if (row.className.indexOf("priority-3") > -1)
			p = 0;
		else if (row.className.indexOf("priority-4") > -1)
			p = 1;
		else if (row.className.indexOf("priority-5") > -1)
			p = 2;

		if ((p > -1) && (row.className.indexOf("closed") == -1)) {
			let rect = row.getBoundingClientRect();
			let icon = null;
            let id = "dot" + i;

            if (row.getAttribute("dot") == null) {
                row.setAttribute("dot", id);
                icon = document.createElement("font");
                document.body.firstElementChild.appendChild(icon);
                icon.innerHTML = "●";
                icon.color = colors[p];
                icon.style.position = "absolute";
                icon.size = 4;
                icon.style.userSelect = "none";
                icon.setAttribute("id", id);
            }
            else {
                icon = document.querySelector("#" + id);
            }

			icon.style.top = (rect.y + window.scrollY + (row.offsetHeight - icon.offsetHeight) / 2 - 2) + "px";
			icon.style.left = (rect.x + window.scrollX - icon.offsetWidth) + "px";
		}
	}
}

function foldClosedIssues() {
    // each versions
    let versions = document.querySelectorAll("#roadmap .version-article.version-incompleted.version-open");
    let vc = 0;
    for (ver of versions) {
        vc++;
        let tracker = "issue-of-version-" + vc;
        let leaderId = "issue-leader-" + vc;
        let rows = ver.querySelectorAll("tr.hascontextmenu.issue.closed")
        if (rows.length == 0)
            break;
        // how many to remain visible
        let head = 10;
        let n = 0;
        let leader = rows[0];
        if (rows.length > 5)
            leader = rows[head - 1];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            n++;
            if (n > head) {
                row.style.display = "none";
                row.classList.add(tracker);
            }
        }

        // add toggle icon
        let rect = leader.getBoundingClientRect();
        leader.classList.add(leaderId);

        let icon = document.createElement("font");
        document.body.firstElementChild.appendChild(icon);
        icon.innerHTML = "▾";
        icon.size = 5;
        icon.color = "#909090";
        icon.style.position = "absolute";
        icon.style.top = rect.y + window.scrollY + "px";
        icon.style.left = (rect.x + window.scrollX - icon.offsetWidth + 4) + "px";
        icon.style.cursor = "pointer";
        icon.classList.add("fold-icon");
        icon.style.userSelect = "none";
        icon.setAttribute("leader", leaderId);

        icon.onclick = function (e) {
            let issues = document.querySelectorAll("." + tracker);
            for (issue of issues) {
                issue.style.display = (issue.style.display == "none") ? "" : "none";
            }
            this.innerHTML = (this.innerHTML == "▾") ? "▴" : "▾";
            // re-position the icons
            let buttons = document.querySelectorAll(".fold-icon");
            for (btn of buttons) {
                let id = btn.getAttribute("leader");
                let who = document.querySelector("." + id);
                let box = who.getBoundingClientRect();
                btn.style.top = box.y + window.scrollY + "px"; 
            }
            // re-position the dot icons
            setPriorityIcons();
        }
    }
}

function onRendered() {
    var s = document.querySelectorAll(".subject");
    setArrows(s);

    s = document.querySelectorAll(".time-entry td.issue");
    setArrows(s);

    s = document.querySelectorAll(".issue-subject");
    setArrows(s);

    s = document.querySelectorAll(".issue-card .name");
    setArrows(s);

    s = document.querySelectorAll("#activity .icon a");
    setArrows(s);

    // issue with scoped syntax: [a -- b -- c]
    var sections = document.querySelectorAll(".issue .wiki");
    for (var i = 0; i < sections.length; i++) {
        var scopes = sections[i].innerHTML.match(/\[[^\]]*(--|>)+[^\]]*\]/g);
        for (var n = 0; n < scopes.length; n++) {
            var arrow = getArrow(scopes[n]);
            sections[i].innerHTML = sections[i].innerHTML.replaceAll(scopes[n], arrow);
        }
    }

	setPriorityIcons();
	foldClosedIssues();
}

setTimeout(onRendered, 0);

