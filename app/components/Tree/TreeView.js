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
import Link from "./Link";
import Node from "./Node";
import NodePopover from "./NodePopover";
import NodeLevel from "./NodeLevel";
import LevelHunk from "./LevelHunk";
import * as d3 from "d3-hierarchy";
import Dimensions from "react-dimensions";
import { connect } from "react-redux";
import { setActiveNode } from "../../actions";

class TreeView extends React.Component {
  handleNodeSelect(event, index) {
    event.stopPropagation();
    this.props.setActiveNode(index);
  }

  handleNodeDeselect() {
    this.props.setActiveNode(null);
  }

  renderTreeDiagram(tree) {
    const { containerWidth } = this.props;

    // Calculate dimenstions of tree container and diagram
    let treeDiagram = { container: {} };
    let widthOfTree = tree.leaves.length * 100;
    let treeDiagramWidth =
      widthOfTree > containerWidth ? widthOfTree : containerWidth;
    let treeDiagramHeight = 500;
    treeDiagram.container.width = treeDiagramWidth;
    treeDiagram.container.height = 0;

    // Use d3.js to calculate the tree layout and position of nodes
    let treeMap = d3.tree().size([treeDiagramWidth, treeDiagramHeight]);
    let treeNodes = d3.hierarchy(tree);
    treeNodes = treeMap(treeNodes);

    // Set fixed height for links
    let curDepth = -1;
    treeNodes.descendants().forEach(function(d) {
      if (d.depth !== curDepth) {
        treeDiagram.container.height += 120;
        curDepth = d.depth;
      }
      d.y = d.depth * 120;
    });

    // Render the nodes
    treeDiagram.nodes = treeNodes.descendants().map((node, index) => {
      return (
        <Node
          key={index}
          index={index}
          node={node}
          onSelect={this.handleNodeSelect.bind(this)}
          className={`node ${node.data.status} ${node.data.type}`}
        />
      );
    });

    // Render popovers for nodes
    treeDiagram.popovers = treeNodes.descendants().map((node, index) => {
      return (
        <NodePopover
          key={index}
          node={node}
          index={index}
          className="node-popover"
        />
      );
    });

    // Render the links
    treeDiagram.links = treeNodes.links().map((link, key) => {
      return <Link key={key} data={link} />;
    });

    // Render the levels
    treeDiagram.levels = [];
    treeDiagram.hunks = [];

    curDepth = -1;
    treeNodes.descendants().forEach((node, index) => {
      if (node.depth !== curDepth) {
        curDepth = node.depth;

        treeDiagram.levels.push(
          <NodeLevel
            key={index}
            index={index}
            node={node}
            width={treeDiagram.container.width}
          />
        );

        treeDiagram.hunks.push(
          <LevelHunk key={index} node={node} index={index} />
        );
      }
    });

    return treeDiagram;
  }

  render() {
    let treeDiagram = this.props.tree
      ? this.renderTreeDiagram(this.props.tree)
      : null;

    return (
      treeDiagram &&
      <div>
        <svg
          width={treeDiagram.container.width}
          height={treeDiagram.container.height}
          onClick={() => this.handleNodeDeselect()}
        >
          <g transform={`translate(${0}, ${80})`}>
            {treeDiagram.levels}
            {treeDiagram.links}
            {treeDiagram.nodes}
          </g>
        </svg>

        {treeDiagram.popovers}
        {treeDiagram.hunks}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveNode: function(nodeIndex) {
      dispatch(setActiveNode(nodeIndex));
    }
  };
};

const styles = {
  container: {
    position: "relative",
    margin: "0 auto",
    overflowY: "hidden",
    minHeight: "100px",
    backgroundColor: "#eee"
  }
};

export default Dimensions({
  containerStyle: styles.container
})(connect(null, mapDispatchToProps)(TreeView));
