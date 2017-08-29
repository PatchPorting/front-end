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

// Encapsulation of shared/common functions
function Patchport() {
  addCss();

  // Adds a custom stylesheet to page
  function addCss() {
    css = ".hidden" + "{display: none;}";
    css += ".bold {font-weight: bold;}";
    css += ".multiple-solution, .single-solution" + "{color: #06a206;}";
    css += ".no-solution, .error" + "{color: #c20404;}";
    css += ".error" + "{color: #f00;}";
    css += ".in-progress, .waiting" + "{color: #0088cc;}";
    css += ".multiple-solution" + "{letter-spacing: -6px; margin-right: 5px;}";
    css += ".icon" + "{padding: 0 3px; font-size: .9em;}";

    var style = document.createElement("style");

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    let script = document.createElement("script");
    script.setAttribute("src", "https://use.fontawesome.com/a3da278475.js");

    document.getElementsByTagName("head")[0].appendChild(style);
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  this.baseUrl = "https://patchport-http.mybluemix.net/api/v0";
  this.appUrl = "https://patch-port.mybluemix.net/#/";
}

Patchport.prototype.getIcon = function(status) {
  var icon = "";
  switch (status) {
    case "in progress":
      icon = '<i class="in-progress fa fa-rotate-left" />';
      break;
    case "waiting":
      icon = '<i class="waiting fa fa-clock-o" />';
      break;
    case "no solution":
      icon = '<i class="no-solution fa fa-times" />';
      break;
    case "single solution":
      icon = '<i class="single-solution fa fa-check"/>';
      break;
    case "multiple solution":
      icon =
        '<span class="multiple-solution"><i class="fa fa-check"></i><i class="fa fa-check"></i></span>';
      break;
    case "error":
      icon = '<i class="error fa fa-exclamation-circle" />';
      break;
  }
  return icon;
};

Patchport.prototype.escapeFilter = function(obj) {
  return encodeURIComponent(JSON.stringify(obj));
};

Patchport.prototype.fetchData = function(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(JSON.parse(xmlHttp.responseText));
    }
    if (xmlHttp.readyState == 4 && xmlHttp.status == 404) {
      callback(null);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
};
