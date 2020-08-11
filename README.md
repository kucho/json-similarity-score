# JSON Object Similarity Score

Score the similarity between two JSON Objects in a range of [0, 1].  

There is a test file that compares all the samples from /data. 

To log the details of each comparison made by the algorithm create an .env file with `VERBOSE=true` in the root directory.


## Main assumptions

- JSON file provided is a valid JSON document
- No value in the JSON document will be an array of arrays
- Position mismatch in object keys are penalized
- Position mismatches in arrays of primitives **are not** penalized (yet!)
- The solution does not have to be optimal

## Design

The score is the result of dividing the points and max points possible that can be awarded. The max points consider the total of entries in the JSON document. Everytime the key, type and value matches one point is awarded.  

## Usage

``` ts
import { compare } from "./SimilarityRanker";

const obj1 = { key1: "key1", key2: "key2", key3: "key3" };
const obj2 = { key2: "key2", key1: "key1", key3: "key3" };

const result = compare(obj1, obj2);

console.log(result) // 1
```

## API

### compare (obj1, obj2): number

#### obj1
Type: `object`

#### obj2
Type: `object`


## Results

|      Scores      | Breweries Master | Sample 1 | Sample 2 | Sample 3 | Sample 4 | Sample 5 |
|:----------------:|:----------------:|:--------:|:--------:|:--------:|:--------:|:--------:|
| Breweries Master |       100%       |   100%   |  62.86%  |  53.03%  |   3.97%  |  77.78%  |
|     Sample 1     |       100%       |   100%   |  62.86%  |  53.03%  |   3.97%  |  77.78%  |
|     Sample 2     |      62.86%      |  62.68%  |   100%   |  33.33%  |   3.23%  |  48.89%  |
|     Sample 3     |      53.03%      |  53.03%  |  33.33%  |   100%   |   3.16%  |  46.05%  |
|     Sample 4     |       3.97%      |   3.97%  |   3.23%  |   3.16%  |   100%   |   3.68%  |
|     Sample 5     |      77.78%      |  77.78%  |  48.89%  |  46.05%  |   3.68%  |   100%   |
