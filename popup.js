var groupsArray = [];

function focusOrCreateTab(url) {
    chrome.windows.getAll({"populate": true}, function (windows) {
        var existing_tab = null;
        for (var i in windows) {
            var tabs = windows[i].tabs;
            for (var j in tabs) {
                var tab = tabs[j];
                if (tab.url == url) {
                    existing_tab = tab;
                    break;
                }
            }
        }
        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, {"selected": true});
        } else {
            chrome.tabs.create({"url": url, "selected": true});
        }
    });
}

document.getElementById('manage').onclick = function (tab) {
    var manager_url = chrome.extension.getURL("manager.html");
    focusOrCreateTab(manager_url);
};
chrome.storage.local.get(['groups'], function (result) {
    groupsArray = result.groups;
    groupsArray.forEach(obj => {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.checked = obj.enabled;
        checkbox.id = obj.group;
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                obj.enabled = true;
            } else {
                obj.enabled = false;
            }
            chrome.storage.local.set({groups: groupsArray});
            chrome.runtime.sendMessage({greeting: 'hello'});

        });

        var label = document.createElement('label');
        label.htmlFor = "id";
        label.appendChild(document.createTextNode(obj.group));
        let container = document.getElementById('container');
        container.appendChild(checkbox);
        container.appendChild(label);
    })
});

