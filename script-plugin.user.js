/*  Copyright (c) 2017 IBM Corp.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

// ==UserScript==
// @name        patch-porting
// @namespace   joseph.schwarz@ibm.com
// @description Extends debian source package table
// @include     https://security-tracker.debian.org/tracker/*
// @include     https://security-tracker.debian.org/tracker/*/
// @exclude     https://security-tracker.debian.org/tracker/*/*
// @version     1
// @grant       none
// ==/UserScript==

(function() {
  
  fetchData("https://patch-port.mybluemix.net/greasemonkey", function(response) {
    var body = document.getElementsByTagName('body')[0];
    var scriptTag = document.createElement('script');
    scriptTag.innerHTML = response;
    body.appendChild(scriptTag);
  });
  
  // Make get request and send back response data
  function fetchData(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
  }

})();
