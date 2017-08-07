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

// Construct node tree data to confrom to d3 structure
export const constructTree = treeData => {
  let data = treeData.slice();
  if (!data.length) return null;
  let leaves = [];

  // Get root node and remove from array
  var rootNode = null;
  data.forEach((elem, index) => {
    if (elem.data.type === "initial") {
      rootNode = elem.data;
      rootNode.children = [];
      data.splice(index, 1);
    }
  });

  if (!data.length) {
    rootNode.leaves = leaves;
    return rootNode;
  }

  // Hash Ids
  var idToNodeMap = {};
  data.forEach((elem, index) => {
    idToNodeMap[elem.data.id] = elem.data;
  });

  const fillChildren = node => {
    if (!node.children) {
      leaves.push(node);
      return;
    }

    for (var i = 0; i < node.children.length; i++) {
      var id = node.children[i];
      node.children[i] = idToNodeMap[id];
      if (!node.children[i]) {
        node.children.splice(i, 1);
        continue;
      }

      fillChildren(node.children[i]);
    }
  };

  var node = idToNodeMap[0];
  fillChildren(node);
  rootNode.leaves = leaves;
  rootNode.children.push(node);
  return rootNode;
};
