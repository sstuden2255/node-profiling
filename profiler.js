const fs = require('fs');
var osu = require('node-os-utils');
const NodeHog = require('nodehog');
const { isRunning } = require('./is-running');

var cpu = osu.cpu
var mem = osu.mem

//isRunning('zoom.exe', 'zoom.us', 'NA').then((v) => console.log(v))

// output stream for memory usage baseline
var memBaseline = fs.createWriteStream("memBasline.txt", {flags:'a'});

// output stream for cpu usage baseline
var cpuBaseline = fs.createWriteStream("cpuBasline.txt", {flags:'a'});

// stress test that stresses the the cpu in 2 second intervals for 5 minutes
function startStressTest() {
    new NodeHog('cpu', 2000, 2000, 75).start();
    new NodeHog('memory', 2000, 2000, 75).start();
}

// function that returns average memory usage over 1 second interval
function getMemUsage() {
  mem.info()
    .then(info => {
      memBaseline.write(info.usedMemMb + "\n");
  })
}

// function that returns average cpu usage over a 15 second interval
function getCPUUsage() {
  cpu.usage(15000)
    .then(info => {
      cpuBaseline.write(info + "\n");
  })
}

// start collecting data and writing to output files every 15 seconds
const memInterval = setInterval(getMemUsage, 15000);
const cpuInterval = setInterval(getCPUUsage, 15000);

// start polling once per minute to see if zoom is an active process
setInterval(() => {
  isRunning('zoom.exe', 'zoom.us', 'NA')
}, 60000);

// start stress test after 5 minutes
// setTimeout(() => {
//     startStressTest()
//   }, 300000)

// stop collecting data
setTimeout(() => {
    clearInterval(memInterval)
  }, 1800000);

setTimeout(() => {
    clearInterval(cpuInterval)
  }, 1800000);
