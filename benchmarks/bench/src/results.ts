import Table from 'cli-table';
import { readFileSync, readdirSync } from 'fs';
import chalk from 'chalk';
import { resolve } from 'path';

const table = new Table({
  chars: {},
  head: ['Server', 'Requests/s', 'Latency', 'Throughput/Mb'],
});

const dataArray: any[] = [];

let choices = readdirSync(resolve(__dirname, '../results/'))
  .filter(file => file.match(/(.+)\.json$/))
  .sort()
  .map(choice => choice.replace('.json', ''));

choices.forEach(file => {
  const content = readFileSync(resolve(__dirname, `../results/${file}.json`));
  dataArray.push(JSON.parse(content.toString()));
});
dataArray.sort((a, b) => parseFloat(b.requests.mean) - parseFloat(a.requests.mean));

const bold = (writeBold: boolean, str: string) => (writeBold ? chalk.bold(str) : str);

dataArray.forEach((data, i) => {
  if (i === 0) {
    console.log(`duration: ${data.duration}s\nconnections: ${data.connections}\npipelining: ${data.pipelining}`);
    console.log('');
  }
  const beBold = false;
  table.push([
    bold(beBold, chalk.blue(data.title)),
    bold(beBold, data.requests.average.toFixed(1)),
    bold(beBold, data.latency.average.toFixed(2)),
    bold(beBold, (data.throughput.average / 1024 / 1024).toFixed(2)),
  ]);
});

console.log(table.toString());
