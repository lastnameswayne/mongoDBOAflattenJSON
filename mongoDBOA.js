/*
Write a program that takes a JSON object as input and outputs a flattened version of the JSON object,
 with keys as the path to every terminal value in the JSON structure. Output should be valid JSON.
*/
function readJsonFromStdin() {
  let stdin = process.stdin;
  let inputChunks = [];

  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", function (chunk) {
    inputChunks.push(chunk);
  });

  return new Promise((resolve, reject) => {
    stdin.on("end", function () {
      let inputJSON = inputChunks.join();
      resolve(JSON.parse(inputJSON));
    });
    stdin.on("error", function () {
      reject(Error("error during read"));
    });
    stdin.on("timeout", function () {
      reject(Error("timout during read"));
    });
  });
}

async function main() {
  let json = await readJsonFromStdin();
  console.log(flattenJSONObj(json));
}

main();

function flattenJSONObj(obj) {
  let res = {};
  flat(obj, "");

  function flat(obj, path) {
    if (obj !== Object(obj)) {
      path = path.slice(0, -1);
      res[path] = obj;
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      flat(value, path + `${key}.`);
    }
  }

  return res;
}
