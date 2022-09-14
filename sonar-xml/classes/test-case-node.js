const { XMLNode } = require("./xml-node");

class TestCaseNode {
  /**
   * @type {XMLNode}
   */
  #node;

  /**
   *
   * @param {string} filePath
   */
  constructor(name, duration) {
    this.#node = new XMLNode("testCase", { attributes: { name, duration } });
  }

  /**
   * @param {XMLNode} node
   */
  appendTo(node) {
    node.append(this.#node);
  }

  /**
   * @param {string} shortMessage
   * @param {string} stacktrace
   * @return {TestCaseNode}
   */
  appendErrorNode(shortMessage, stacktrace = "") {
    return this.#appendTestCaseChild("error", shortMessage, stacktrace);
  }

  /**
   * @param {string} shortMessage
   * @param {string} stacktrace
   * @return {TestCaseNode}
   */
  appendFailureNode(shortMessage, stacktrace = "") {
    return this.#appendTestCaseChild("failure", shortMessage, stacktrace);
  }

  /**
   * @param {string} shortMessage
   * @param {string} stacktrace
   * @return {TestCaseNode}
   */
  appendSkippedNode(shortMessage, stacktrace = "") {
    return this.#appendTestCaseChild("skipped", shortMessage, stacktrace);
  }

  #appendTestCaseChild(nodeType, message, stacktrace) {
    const node = new XMLNode(nodeType, {
      attributes: {
        message,
      },
    });

    node.innerText = stacktrace;

    this.#node.append(node);

    return this;
  }
}

module.exports = { TestCaseNode };
