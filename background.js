// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var groups = [];
var siteStr = "\ ";

function reloadData() {
siteStr = "\ ";
chrome.storage.local.get(['groups'], function (result) {
        if (result.groups === null || result.groups === undefined) {
            result.groups = [];
            chrome.storage.local.set({groups: result.groups});
        }
        groups = [];
        result.groups.forEach(gp => {
            if (gp.enabled) {
                groups.push(gp);
            }
        });
        groups.forEach(obj => {
            obj.sites.forEach(site => {
                let tempStr = "-site%3A" + site + "+";
                siteStr = siteStr.concat(tempStr);
            })
        });
    })

}

reloadData();
// Bind event:
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // Do something
    reloadData();
});


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        let changingUrl = details.url;
        if (!changingUrl.includes("-site") && changingUrl.includes("google.com/search") && groups.length > 0) {
            let re = new RegExp(/\q(.*?)\&/);

            let queryPart = changingUrl.match(re);
            // queryPart.forEach(que => {
            let len = queryPart[0].length;
            let output = [queryPart[0].slice(0, len - 1), siteStr, queryPart[0].slice(len - 1)].join('');
            changingUrl = changingUrl.replace(queryPart[0].toString(), output);


            // });
            // changingUrl = changingUrl.replace(re, 'q=' + siteStr);
            // if (changingUrl.includes("google.com/search"))
                chrome.tabs.update({url: changingUrl});
        }
    }, {urls: ["<all_urls>"]}
);
