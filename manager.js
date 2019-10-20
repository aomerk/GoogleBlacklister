// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var groupsArray = [];

// Shorthand for document.querySelector.
function select(selector) {
  return document.querySelector(selector);
}

// A simple Timer class.
function Timer() {
  this.start_ = new Date();

  this.elapsed = function() {
    return (new Date()) - this.start_;
  }

  this.reset = function() {
    this.start_ = new Date();
  }
}

// An object used for caching data about the browser's cookies, which we update
// as notifications come in.





function resetTable() {
  var table = select("#sites");
  while (table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
  }
}

var reload_scheduled = false;

function scheduleReloadCookieTable() {
  if (!reload_scheduled) {
    reload_scheduled = true;
    setTimeout(reloadTable, 250);
  }
}

function reloadTable() {
  chrome.runtime.sendMessage({greeting: 'hello'});

  reload_scheduled = false;
  let groups = [];
  chrome.storage.local.get(['groups'],function (result) {
    groupsArray = result.groups;

    resetTable();
    let table = select("#sites");
    if(groupsArray === null || groupsArray === undefined)return;
    groupsArray.forEach( function (obj) {
      let sites = obj.sites;
      let group = obj.group;
      let row = table.insertRow(-1);
      row.insertCell(-1).innerText = group;
      var cell = row.insertCell(-1);
      cell.innerText = sites;

      var button = document.createElement("button");
      button.innerText = "delete";
      button.onclick = (function(dom){
        return function() {
          removeGroup(dom);
        };
      }(obj));
      var cell = row.insertCell(-1);
      cell.appendChild(button);
      cell.setAttribute("class", "button");
    })
  });
}

function addNewGroup() {

 let groupName =  document.getElementById('new_group').value;
 let sites = document.getElementById('new_sites').value.toString().split(',');
  chrome.storage.local.get(['groups'],function (result) {
    let tempArr = result.groups;
    let newObj = {group: groupName, sites: sites, enabled: true};
    tempArr.push(newObj);
    chrome.storage.local.set({groups: tempArr});
    reloadTable();

  });
}

function listener(info) {
  cache.remove(info.cookie);
  if (!info.removed) {
    cache.add(info.cookie);
  }
  scheduleReloadCookieTable();
}


function onload() {

  reloadTable();
}

function removeGroup(gp) {
  let tempArr = [];
  groupsArray.forEach(gpObj => {
    if(gpObj.group !== gp.group){
      tempArr.push(gpObj);
    }
  });
  chrome.storage.local.set({groups: tempArr});
  reloadTable();
}

document.addEventListener('DOMContentLoaded', function() {
  onload();
  // document.body.addEventListener('click', focusFilter);
  // document.querySelector('#remove_button').addEventListener('click', removeAll);
  document.querySelector('#new_button').addEventListener('click', addNewGroup);
  // document.querySelector('#filter_div input').addEventListener(
  //     'input', reloadTable);
  // document.querySelector('#filter_div button').addEventListener(
  //     'click', resetFilter);
});
