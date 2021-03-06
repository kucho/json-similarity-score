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

console.log(result) // 0.666
```

## API

### compare (obj1, obj2): number

#### obj1
Type: `object`

#### obj2
Type: `object`


## Results

|      Scores      	| Breweries Master 	| Sample 1 	| Sample 2 	| Sample 3 	| Sample 4 	| Sample 5 	|
|:----------------:	|:----------------:	|:--------:	|:--------:	|:--------:	|:--------:	|:--------:	|
| Breweries Master 	|       100%       	|  47.14%  	|  65.71%  	|  71.43%  	|   4.82%  	|  89.74%  	|
|     Sample 1     	|      47.14%      	|   100%   	|  32.86%  	|  33.67%  	|   3.95%  	|  42.31%  	|
|     Sample 2     	|      65.71%      	|  32.86%  	|   100%   	|  46.94%  	|   4.09%  	|  58.97%  	|
|     Sample 3     	|      71.43%      	|  33.67%  	|  46.94%  	|   100%   	|   3.87%  	|  66.04%  	|
|     Sample 4     	|       4.82%      	|   3.95%  	|   4.09%  	|   3.87%  	|   100%   	|   4.51%  	|
|     Sample 5     	|      89.74%      	|  42.31%  	|  58.97%  	|  66.04%  	|   4.51%  	|   100%   	||
