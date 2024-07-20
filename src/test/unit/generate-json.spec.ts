import { generateReport } from "../../generate-report.js";
import { describe, it, expect } from "vitest";
import fs from "fs-extra";
import path from "path";

const REPORT_PATH = "./.tmp/";

describe.skip("generate-report.js", () => {
  describe("Happy flows", () => {
    it("should create a report from the merged found json files without provided custom data", () => {
      fs.removeSync(REPORT_PATH);
      generateReport({
        dir: "./test/unit/data/json",
        reportPath: REPORT_PATH,
        saveCollectedJson: true,
        displayDuration: true,
      });

      expect(
        fs
          .statSync(`${path.join(process.cwd(), REPORT_PATH, "index.html")}`)
          .isFile(),
        "Index file exists"
      ).toEqual(true);
      expect(function () {
        fs.statSync(
          `${path.join(
            process.cwd(),
            REPORT_PATH,
            "features/happy-flow-v2.html"
          )}`
        );
      }).toThrow();
      expect(
        fs
          .statSync(
            `${path.join(process.cwd(), REPORT_PATH, "merged-output.json")}`
          )
          .isFile(),
        "merged-output.json file exists"
      ).toEqual(true);
      expect(
        fs
          .statSync(
            `${path.join(process.cwd(), REPORT_PATH, "enriched-output.json")}`
          )
          .isFile(),
        "temp-output.json file exists"
      ).toEqual(true);
    });
    it("should create a report with the report time", () => {
      fs.removeSync(REPORT_PATH);
      generateReport({
        dir: "./test/unit/data/json",
        reportPath: REPORT_PATH,
        saveCollectedJson: true,
        displayDuration: true,
        displayReportTime: true,
      });

      expect(
        fs
          .statSync(`${path.join(process.cwd(), REPORT_PATH, "index.html")}`)
          .isFile(),
        "Index file exists"
      ).toEqual(true);
      expect(
        fs.readFileSync(
          `${path.join(process.cwd(), REPORT_PATH, "index.html")}`,
          "utf8"
        )
      ).toContain(">Date</th>");
    });
    it("should create a report from the merged found json files with custom data with static file paths", () => {
      fs.removeSync(REPORT_PATH);
      generateReport({
        dir: "./test/unit/data/json",
        reportPath: REPORT_PATH,
        staticFilePath: true,
        saveCollectedJson: true,
        reportName: "You can adjust this report name",
        customData: {
          title: "Run info",
          data: [
            { label: "Project", value: "Custom project" },
            { label: "Release", value: "1.2.3" },
            { label: "Cycle", value: "B11221.34321" },
            {
              label: "Execution Start Time",
              value: "Nov 19th 2017, 02:31 PM EST",
            },
            {
              label: "Execution End Time",
              value: "Nov 19th 2017, 02:56 PM EST",
            },
          ],
        },
        displayDuration: true,
        durationInMs: true,
      });

      expect(
        fs
          .statSync(`${path.join(process.cwd(), REPORT_PATH, "index.html")}`)
          .isFile(),
        "Index file exists"
      ).toEqual(true);
      expect(
        fs
          .statSync(
            `${path.join(
              process.cwd(),
              REPORT_PATH,
              "features/happy-flow-v2.html"
            )}`
          )
          .isFile(),
        "uuid free feature exists"
      ).toEqual(true);
      expect(
        fs
          .statSync(
            `${path.join(process.cwd(), REPORT_PATH, "merged-output.json")}`
          )
          .isFile(),
        "merged-output.json file exists"
      ).toEqual(true);
      expect(
        fs
          .statSync(
            `${path.join(process.cwd(), REPORT_PATH, "enriched-output.json")}`
          )
          .isFile(),
        "temp-output.json file exists"
      ).toEqual(true);
    });
    it("should create a report from the merged found json files with custom metadata", () => {
      fs.removeSync(REPORT_PATH);
      generateReport({
        dir: "./test/unit/data/custom-metadata-json/",
        reportPath: REPORT_PATH,
        customMetadata: true,
      });

      expect(
        fs
          .statSync(`${path.join(process.cwd(), REPORT_PATH, "index.html")}`)
          .isFile(),
        "Index file exists"
      ).toEqual(true);
    });

    it("should create a report from the merged found json files and with array of embedded items", () => {
      fs.removeSync(REPORT_PATH);
      generateReport({
        dir: "./test/unit/data/embedded-array-json/",
        reportName: "Embedded array of various mimeType",
        reportPath: REPORT_PATH,
        customStyle: path.join(__dirname, "../my.css"),
        customMetadata: false,
      });

      expect(
        fs
          .statSync(`${path.join(process.cwd(), REPORT_PATH, "index.html")}`)
          .isFile(),
        "Index file exists"
      ).toEqual(true);
    });
  });

  describe("failures", () => {
    it("should throw an error when no options are provided", () => {
      expect(() => generateReport()).toThrowError(
        "Options need to be provided."
      );
    });

    it("should throw an error when the json folder does not exist", () => {
      expect(() => generateReport({})).toThrowError(
        `A path which holds the JSON files should be provided.`
      );
    });

    it("should throw an error when the report folder is not provided", () => {
      expect(() =>
        generateReport({
          dir: "./test/unit/data/json",
        })
      ).toThrowError(
        `An output path for the reports should be defined, no path was provided.`
      );
    });
  });
});
