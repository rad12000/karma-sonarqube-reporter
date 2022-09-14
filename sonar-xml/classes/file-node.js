const { TestCaseNode } = require("./test-case-node");
const { XMLNode } = require("./xml-node");

class FileNode {
  /**
   * @type {XMLNode}
   */
  #node;

  /**
   *
   * @param {string} filePath
   */
  constructor(filePath) {
    this.#node = new XMLNode("file", { attributes: { path: filePath } });
  }

  /**
   *
   * @param {string} testName
   * @param {number} testDurationMs
   * @returns {TestCaseNode}
   */
  appendTestCaseNode(testName, testDurationMs) {
    const testCaseNode = new TestCaseNode(testName, testDurationMs);
    testCaseNode.appendTo(this.#node);

    return testCaseNode;
  }

  /**
   * @param {XMLNode} node
   */
  appendTo(node) {
    node.append(this.#node);
  }
}

module.exports = { FileNode };
