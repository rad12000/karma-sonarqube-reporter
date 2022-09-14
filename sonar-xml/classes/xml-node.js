const { JSDOM } = require("jsdom");
const { document } = new JSDOM().window;
var format = require("xml-formatter");

/**
 * @typedef {object} XMLNodeOptions
 * @property {string} namespace
 * @property {Record<string, string>} attributes
 */

class XMLNode {
  /**
   * @type {Element}
   */
  #node;

  /**
   * @type {XMLNodeOptions}
   */
  #options;

  get innerText() {
    return this.#node.textContent;
  }

  set innerText(value) {
    this.#node.textContent = value;
  }

  /**
   * @param {string} nodeName
   * @param {XMLNodeOptions} options
   */
  constructor(nodeName, options = {}) {
    this.#node = document.createElementNS(options.namespace ?? "", nodeName);
    this.#options = options;

    if (typeof options.attributes === "object") {
      for (const [key, value] of Object.entries(options.attributes)) {
        this.#node.setAttributeNS(options.namespace ?? "", key, value);
      }
    }
  }

  /**
   * @param {XMLNode} node
   * @returns {XMLNode}
   */
  append(node) {
    this.#node.append(node.getNativeNode());

    return this;
  }

  /**
   *
   * @param {string} name
   * @param {string} value
   * @returns {XMLNode}
   */
  addAttribute(name, value) {
    this.#node.setAttributeNS(this.#options.namespace ?? "", name, value);

    return this;
  }

  getNativeNode() {
    return this.#node;
  }

  toXMLString() {
    return format(this.#node.outerHTML);
  }
}

module.exports = { XMLNode };
