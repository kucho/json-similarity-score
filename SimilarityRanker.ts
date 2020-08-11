import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });

class Result {
  public maxPoints = 0;
  public points = 0;

  public addResult(result: Result, divisor: number = 1) {
    this.points += result.points / divisor;
    this.maxPoints += result.maxPoints;
  }

  public score() {
    return this.points / this.maxPoints;
  }
}

interface JSONObject<T> {
  [key: string]: T;
}

export function compare(
  obj1: JSONObject<Object>,
  obj2: JSONObject<Object>
): number {
  // Direct equivalence check
  if (obj1 === obj2) {
    log("Objects are exactly the same");
    return 1;
  }
  log("Objects are different");
  return compareObjects(obj1, obj2).score();
}

function compareObjects(
  obj1: JSONObject<Object>,
  obj2: JSONObject<Object>
): Result {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqueKeys = new Set(keys1.concat(keys2));
  return [...uniqueKeys].reduce((result, key) => {
    if (keys1.includes(key) && keys2.includes(key)) {
      // Penalize position mismatch by a divisor
      const mismatchDivisor =
        keys1.findIndex((value) => value === key) ===
        keys2.findIndex((value) => value === key)
          ? 1
          : 2;
      if (mismatchDivisor > 1) {
        log(`[-] Penalizing position mismatch in key: ${key}`);
      }
      result.addResult(compareTypes(obj1[key], obj2[key]), mismatchDivisor);
    } else {
      // If the key is not present in both objects, traverse one object to count the differences
      const comparisonResult = keys1.includes(key)
        ? compareTypes(obj1[key], {})
        : compareTypes(obj2[key], {});
      // increment max score
      result.addResult(comparisonResult);
    }
    log(result);
    return result;
  }, new Result());
}

function compareTypes<T>(type1: T, type2: T): Result {
  const result = new Result();
  // If you are both objects, but different in the inside
  if (typeof type1 === "object" && typeof type2 === "object") {
    if (Array.isArray(type1) && Array.isArray(type2)) {
      // If you are both arrays
      result.addResult(compareArrays(type1, type2));
    } else {
      log(`Comparing objects: ${typeof type1} vs ${typeof type2}`);
      result.addResult(compareObjects(type1 || {}, type2 || {}));
    }
  } else {
    result.addResult(compareMismatchesAndPrimitives(type1, type2));
  }

  return result;
}

function compareMismatchesAndPrimitives<T>(prim1: T, prim2: T): Result {
  log("Comparing primitives and mismatches ->");
  const result = new Result();
  result.maxPoints = 1;
  let grade;

  if (prim1 === prim2) {
    result.points = 1;
    grade = "equal";
  } else if (prim1 == prim2) {
    result.points = 0.5;
    grade = "equivalent";
  }

  log(`${prim1}<${typeof prim1}> === ${prim2}<${typeof prim2}>: ${grade}`);
  return result;
}

function compareArrays<T>(arr1: T[], arr2: T[]): Result {
  const maxSize = Math.max(arr1.length, arr2.length);
  log(`Comparing arrays of maxSize: ${maxSize} ->`);
  const result = new Result();

  Array.from({ length: maxSize }, (v, i) => i).forEach((index) => {
    log(`Comparing array item -> ${index} `);

    if (typeof arr1[index] === "object" || typeof arr2[index] === "object") {
      result.addResult(compareObjects(arr1[index] || {}, arr2[index] || {}));
    } else {
      result.addResult(
        compareMismatchesAndPrimitives(arr1[index], arr2[index])
      );
    }
  });

  return result;
}

function log<T>(message: T) {
  if (process.env.VERBOSE === "true") {
    console.log(message);
  }
}
