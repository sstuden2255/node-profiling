const fs = require('fs');
var osu = require('node-os-utils');
const { argv } = require('minimist');
const { isRunning } = require('./isRunning');

var cpu = osu.cpu
var mem = osu.mem

// TODO: error Checking - validate parameters - do two letter flags work?
const memUsageFile = argv.mf; //TODO: make sure this is a filename.txt
const cpuUsageFile = argv.cf; //TODO: make sure this is a filename.txt
const cpuIntrvl = arv.ci; //TODO: make sure this is an integer (ms)
const memIntrvl  = argv.mi; //TODO: make sure this is an integer (ms)
const pollIntrvl = argv.pi; //TODO: make sure this is an integer (ms)
const isPolling = argv.p; //TODO: make sure there are no arguments to this flag
const totalRuntime = argv.r; // TODO: make sure this is an integer (ms)

// clear the output file and create an output stream for memory usage baseline
fs.writeFile(memUsageFile, '', () => {});
var memUsage = fs.createWriteStream(memUsageFile, {flags:'a'});

// clear the output file and create an output stream for cpu usage baseline
fs.writeFile(cpuUsageFile, '', () => {});
var cpuUsage = fs.createWriteStream(cpuUsageFile, {flags:'a'});

// function that returns average memory usage over 1 second interval
function getMemUsage() {
  mem.info()
    .then(info => {
      memUsage.write(info.usedMemMb + "\n");
  })
}

// function that returns average cpu usage over a 15 second interval
// TODO: figure out best interval that will work with cpuInterval
function getCPUUsage() {
  cpu.usage(cpuIntrvl)
    .then(info => {
      cpuUsage.write(info + "\n");
  })
}

let memInterval ;
let cpuInterval;
let pollingInterval;

// wait 5 seconds and then start collecting data and writing to output files in intervals defined by user
setTimeout(() => {
  memInterval = setInterval(getMemUsage, memIntrvl);
  cpuInterval = setInterval(getCPUUsage, cpuIntrvl);
}, 5000)

// start polling in interval defined by user
if (isPolling) {
  pollingInterval = setInterval(() => {
    isRunning('zoom.exe', 'zoom.us', 'NA')
  }, pollIntrvl);
}

// stop collecting data
setTimeout(() => {
    clearInterval(memInterval)
  }, totalRuntime);

setTimeout(() => {
      clearInterval(cpuInterval)
  }, totalRuntime);

if (isPolling) {
  setTimeout(() => {
    clearInterval(pollingInterval)
  }, totalRuntime);
}
