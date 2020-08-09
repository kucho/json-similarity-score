import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });

interface Result {
  maxPoints: number;
  points: number;
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
  const result = compare_objects(obj1, obj2);
  return result.points / result.maxPoints;
}

function compare_objects(
  obj1: JSONObject<Object>,
  obj2: JSONObject<Object>
): Result {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqueKeys = new Set(keys1.concat(keys2));
  return [...uniqueKeys].reduce(
    (result, key) => {
      if (keys1.includes(key) && keys2.includes(key)) {
        const comparisonResult = compareTypes(obj1[key], obj2[key]);
        result.points += comparisonResult.points;
        result.maxPoints += comparisonResult.maxPoints;
      } else {
        // If the key is not present in both objects, traverse one object to count the differences
        if (keys1.includes(key)) {
          const comparisonResult = compareTypes(obj1[key], {});
          result.points += comparisonResult.points;
          result.maxPoints += comparisonResult.maxPoints;
        } else {
          const comparisonResult = compareTypes(obj2[key], {});
          result.points += comparisonResult.points;
          result.maxPoints += comparisonResult.maxPoints;
        }
        // increment max score
        result.maxPoints++;
      }
      return result;
    },
    { points: 0, maxPoints: 0 } as Result
  );
}

function compareTypes<T>(type1: T, type2: T): Result {
  const result = { points: 0, maxPoints: 0 } as Result;
  // If you are both objects, but different in the inside
  if (typeof type1 === "object" && typeof type2 === "object") {
    if (Array.isArray(type1) && Array.isArray(type2)) {
      // If you are both arrays
      const comparingResult = compareArrays(type1, type2);
      result.points += comparingResult.points;
      result.maxPoints += comparingResult.maxPoints;
    } else {
      log(`Comparing objects: ${typeof type1} vs ${typeof type2}`);
      const comparingResult = compare_objects(type1 || {}, type2 || {});
      result.points += comparingResult.points;
      result.maxPoints += comparingResult.maxPoints;
    }
  } else {
    log("Comparing other types ->");
    let equal = false;
    if (type1 === type2) {
      equal = true;
      result.points++;
    }
    log(`${type1}<${typeof type1}> === ${type2}<${typeof type2}>: ${equal}`);
    result.maxPoints++;
  }

  return result;
}

function compareArrays<T>(arr1: T[], arr2: T[]): Result {
  const maxSize = Math.max(arr1.length, arr2.length);
  log(`Comparing arrays of maxSize: ${maxSize} ->`);
  const result = { points: 0, maxPoints: 0 } as Result;

  Array.from({ length: maxSize }, (v, k) => k).forEach((index) => {
    log(`Comparing array item -> ${index} `);
    const comparingResult = compare_objects(
      arr1[index] || {},
      arr2[index] || {}
    );
    result.points += comparingResult.points;
    result.maxPoints += comparingResult.maxPoints;
  });

  return result;
}

function log(message: string) {
  if (process.env.VERBOSE === "true") {
    console.log(message);
  }
}
