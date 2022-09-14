// description: result.description,
//       skipped: result.skipped,
//       disabled: result.disabled,
//       success: result.success,
//       suite: result.suite[0],
//       time: result.time,
//       log: result.log,
//       executedExpectationsCount: result.executedExpectationsCount,
//       passedExpectations: result.passedExpectations,

/**
 * @typedef {object} Expectation
 * @property {string} matcherName
 * @property {string} message
 * @property {string} stack
 * @property {boolean} passed
 */

/**
 * @typedef {object} SpecResult
 * @property {string} fullName
 * @property {string} description
 * @property {string} suite
 * @property {string} rawSuite
 * @property {string[] | undefined} log
 * @property {boolean} disabled
 * @property {boolean} success
 * @property {boolean} skipped
 * @property {number} time
 * @property {number} executedExpectationsCount
 * @property {Expectation[]} passedExpectations
 * @property {boolean} matchedToSuite
 */

/**
 * @typedef {SpecResult[]} SpecResults
 */

/**
 * @typedef {object} SuiteWithFilePath
 * @property {string} suiteName
 * @property {string} filePath
 */

/**
 * @typedef {object} ResultsWithSuite
 * @property {string} suiteName
 * @property {string} filePath
 * @property {SpecResults} testResults
 */
