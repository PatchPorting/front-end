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

import React from "react";
import Table from "./Table";

const BuildInfoTable = ({ build }) => {
  let header = [];
  let body = [[]];

  header.push(
    "CVE",
    "Source Package",
    "Version",
    "Release",
    "Mode",
    "Patcher Status"
  );

  let cves = build.cves.map(cve => {
    return {
      link: `https://security-tracker.debian.org/tracker/${cve}`,
      value: cve
    };
  });

  let pkgNames = [
    {
      link: `https://security-tracker.debian.org/tracker/source-package/${build.pkgName}`,
      value: build.pkgName
    }
  ];

  let timeSince =
    build.status === "waiting"
      ? build.created
      : build.status === "in progress" ? build.started : null;

  let status = [
    {
      value: build.status
    }
  ];

  if (timeSince) {
    status.push({
      className: "italic",
      value: `(Since ${formatDate(new Date(timeSince))})`
    });
  }

  body[0].push(
    cves,
    pkgNames,
    [{ value: build.pkgVersion }],
    [{ value: build.dist }],
    [{ value: build.mode }],
    status
  );

  return <Table header={header} body={body} />;
};

function formatDate(date) {
  let day = date.getDate();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  return `${month}/${day}/${year}`;
}

export default BuildInfoTable;
