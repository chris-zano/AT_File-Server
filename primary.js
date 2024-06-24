import cluster from "cluster";
import os from "os";
import {dirname} from "path";
import { fileURLToPath } from "url";

const __dirname =  dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;

console.log(`The total number of cpus is ${cpuCount}`);
console.log(`The primary process has a pid of ${process.pid}`);

cluster.setupPrimary({
    exec: __dirname + "/index.js"
});

for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}

cluster.on("exit", (worker, code, signal) => {
    console.log(`A worker with the pid of ${worker.process.pid} has been killed with the code ${code} and signal ${signal}`);
    console.log("starting a new worker");
    cluster.fork();
})