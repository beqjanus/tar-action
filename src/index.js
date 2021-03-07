const core = require("@actions/core");
const tar = require("tar");
const fs = require("fs");

try {
  const cwd = core.getInput("cwd");
  const command = core.getInput("command", { required: true });
  const files = core
    .getInput("files", { required: true })
    .split("\n")
    .filter(x => x !== "");
  const outPath = core.getInput("outPath", { require: true });

  const listOfFiles = Array.isArray(files) ? files : [files];

  core.debug("Built tar file with command" + command)
  switch (command) {
    case "z": {
      tar
        .c({ cwd, gzip: true, sync: true }, listOfFiles)
        .pipe(fs.createWriteStream(outPath));
      break;
    }
    case "c": {
      tar
        .c({ cwd, gzip: false, sync: true }, listOfFiles)
        .pipe(fs.createWriteStream(outPath));
      break;
    }
    default:
      throw new Error(`Unsupported command: ${command}`);
  }

  core.debug("Built tar file " + outPath)
  core.setOutput("done", true);
  core.setOutput("tarName", outPath);
} catch (error) {
  core.setFailed(error.message);
}
