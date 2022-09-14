const { buildFileFromResults } = require("./build-file-from-results");

const SonarqubeReporter = function (
  baseReporterDecorator,
  config,
  logger,
  helper,
  formatError
) {
  const log = logger.create("reporter.sonarqube");
  const sonarqubeConfig = config.sonarqubeReporter ?? {};

  baseReporterDecorator(this);

  /**
   * @type {SpecResults}
   */
  const specResults = [];
  this.onSpecComplete = (_, result) => {
    specResults.push({
      fullName: result.fullName,
      description: result.description,
      skipped: result.skipped,
      disabled: result.disabled,
      success: result.success,
      suite: result.suite[0]?.toLowerCase(),
      rawSuite: result.suite[0],
      time: result.time,
      log: result.log,
      executedExpectationsCount: result.executedExpectationsCount,
      passedExpectations: result.passedExpectations,
      matchedToSuite: false,
    });
  };

  this.onRunComplete = () => {
    buildFileFromResults(log, specResults);
  };

  this.adapters = [
    function (msg) {
      process.stdout.write.bind(process.stdout)(msg + "rn");
    },
  ];
};

SonarqubeReporter.$inject = [
  "baseReporterDecorator",
  "config",
  "logger",
  "helper",
  "formatError",
];

module.exports = {
  "reporter:sonarqube": ["type", SonarqubeReporter],
};
