const fs = require('fs');
var osu = require('node-os-utils');
const { program } = require('commander');
const NodeHog = require('nodehog');
const { isRunning } = require('./isRunning');

program
  .option('-m, --memoryInterval')
  .option('-c, --cpuInterval')
  .option('-f, --function');

program.parse();

const options = program.opts();
console.log(options);

var cpu = osu.cpu
var mem = osu.mem

//isRunning('zoom.exe', 'zoom.us', 'NA').then((v) => console.log(v))

// clear file and create output stream for memory usage
fs.writeFile('cpuUsage.txt', ' ', () => {});
var memUsage = fs.createWriteStream('memUsage.txt', {flags:'a'});

// clear file and output stream for cpu usage
fs.writeFile('cpuUsage.txt', ' ', () => {});
var cpuUsage = fs.createWriteStream('cpuUsage.txt', {flags:'a'});

// stress test that stresses the the cpu in 2 second intervals for 5 minutes
function startStressTest() {
    new NodeHog('cpu', 2000, 2000, 75).start();
    new NodeHog('memory', 2000, 2000, 75).start();
}

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
  cpu.usage(15000)
    .then(info => {
      cpuUsage.write(info + "\n");
  })
}

// start collecting data and writing to output files every 15 seconds
const memInterval = setInterval(getMemUsage, options.memoryInterval);
const cpuInterval = setInterval(getCPUUsage, options.cpuInterval);

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
