const printVersion = () => {
  let manifest = require("./public/manifest.json");
  console.log(manifest.version);
};
printVersion();
