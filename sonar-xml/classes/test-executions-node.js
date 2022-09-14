const { FileNode } = require("./file-node");
const { XMLNode } = require("./xml-node");

class TestExecutionsNode {
  /**
   * @type {XMLNode}
   */
  #node;

  constructor() {
    this.#node = new XMLNode("testExecutions", {
      attributes: { version: "1" },
    });
  }

  appendFileNode(filePath) {
    const fileNode = new FileNode(filePath);
    fileNode.appendTo(this.#node);

    return fileNode;
  }

  toXMLString() {
    return this.#node.toXMLString();
  }
}

module.exports = { TestExecutionsNode };
