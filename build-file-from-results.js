const glob = require("glob");
const fs = require("fs");
const { TestExecutionsNode } = require("./sonar-xml/classes");

/**
 * @param {SpecResults} specResults
 */
function buildFileFromResults(logger, specResults) {
  const files = glob
    .sync("src/**/*.spec.ts", {})
    .filter((file, index, self) => {
      return index === self.indexOf(file);
    });

  /**
   * @type {SuiteWithFilePath[]}
   */
  const testPathBySuite = files.map((filePath) => {
    const lastIndexOfForwardSlash = filePath.lastIndexOf("/");
    const lastIndexOfBackSlash = filePath.lastIndexOf("\\");

    const startIndex =
      Math.max(lastIndexOfBackSlash, lastIndexOfForwardSlash) + 1;

    const suiteName = filePath
      .slice(startIndex)
      .replace(".spec.ts", "")
      .replace(/[^a-zA-Z\d]/g, "")
      .toLowerCase();

    return { suiteName, filePath };
  });

  /**
   * @type {ResultsWithSuite[]}
   */
  const testsBySuite = testPathBySuite.map((pathAndSuite) => {
    const testResults = specResults.filter((result) => {
      const belongsToSuite = result.suite == pathAndSuite.suiteName;
      if (belongsToSuite) {
        result.matchedToSuite = true;
      }

      return belongsToSuite;
    });

    return { ...pathAndSuite, testResults };
  });

  if (handleUnmatchedTests(specResults).hasAny) {
    return;
  }

  const sonarXML = new TestExecutionsNode();

  for (const suite of testsBySuite) {
    const fileNode = sonarXML.appendFileNode(suite.filePath);

    for (const test of suite.testResults) {
      const testNode = fileNode.appendTestCaseNode(test.fullName, test.time);

      if (test.skipped) {
        const message = test.disabled ? "Test is disabled" : "Undeterminable";
        testNode.appendSkippedNode(message);

        continue;
      }

      if (test.success) {
        continue;
      }

      if (!test.log || test.log.length === 0) {
        testNode.appendErrorNode(
          "An unknown error occurred.",
          "The cause for this failure could not be determined."
        );

        continue;
      }

      const errorRegex = /((E|e)rror(:|)|throw(n|)|(E|e)xception)/;
      const isError = errorRegex.test(test.log[0]);

      if (isError) {
        testNode.appendErrorNode(
          "An unhandled error occurred.",
          JSON.stringify(test.log)
        );
      } else {
        testNode.appendFailureNode(
          "Your test failed",
          JSON.stringify(test.log)
        );
      }
    }
  }

  fs.writeFileSync("result.xml", sonarXML.toXMLString());
}

function handleUnmatchedTests(specResults) {
  const unmatchedResults = specResults.filter((res) => !res.matchedToSuite);

  if (unmatchedResults.length === 0) {
    return { hasAny: false };
  }

  const distinctSuites = unmatchedResults
    .filter((res, index, self) => {
      return index === self.findIndex((val) => val.suite == res.suite);
    })
    .map((result) => result.rawSuite);

  const uniqueCount = distinctSuites.length;
  const pluralVerbage = uniqueCount !== 1;
  const logMessage = `\nThere ${pluralVerbage ? "are" : "is"} ${
    distinctSuites.length
  } test suite${pluralVerbage ? "s" : ""} that ${
    pluralVerbage ? "do" : "does"
  } not match ${pluralVerbage ? "their" : "its"} filename${
    pluralVerbage ? "s" : ""
  }.\nPlease look through the following array and rename the appropriate files or rename the suites to match:\n${JSON.stringify(
    distinctSuites,
    null,
    4
  )}`;

  logger.error(logMessage);

  deleteTargetFile();

  return { hasAny: true };
}

function deleteTargetFile() {
  if (fs.existsSync("log.json")) {
    fs.rmSync("log.json");
  }
}

module.exports = { buildFileFromResults };
