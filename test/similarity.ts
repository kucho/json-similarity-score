import { expect } from "chai";
import "mocha";
import { compare } from "../SimilarityRanker";
const masterSample = require("../data/BreweriesMaster.json");
const sample1 = require("../data/BreweriesSample1.json");
const sample2 = require("../data/BreweriesSample2.json");
const sample3 = require("../data/BreweriesSample3.json");
const sample4 = require("../data/BreweriesSample4.json");
const sample5 = require("../data/BreweriesSample5.json");

const samples = { masterSample, sample1, sample2, sample3, sample4, sample5 };

describe("Test deep equality", () => {
  it("equal objects with different key order should return 1", () => {
    const obj1 = { key1: "key1", key2: "key2", key3: "key3" };
    const obj2 = { key2: "key2", key1: "key1", key3: "key3" };
    const result = compare(obj1, obj2);
    expect(result).to.equal(1);
  });

  it("equal objects should return 1", () => {
    const result = compare({ ...masterSample }, { ...masterSample });
    expect(result).to.equal(1);
  });
});

describe("Test similarity in all samples", () => {
  Object.entries(samples).forEach(([name, sample]) => {
    Object.entries(samples).forEach(([otherName, otherSample]) => {
      it(`${name} vs ${otherName} should be 0 <= score <= 1`, () => {
        const result = compare(sample, otherSample);
        console.log(`${name} vs ${otherName} score: ${result}`);
        expect(result).to.be.within(0, 1);
      });
    });
  });
});
