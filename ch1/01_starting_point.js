const plays = require("./plays.json");
const invoices = require("./invoices.json");

function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // add volume credits

    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(appleSauce(invoice))} \n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function appleSauce(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}

function totalAmount(invoice) {
  let result = 0;

  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result;
}

function totalVolumeCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);

  if ("comedy" === playFor(aPerformance).type) {
    result += Math.floor(aPerformance.audience / 5);
  }

  return result;
}

function usd(aNumber) {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);

  return format;
}

function amountFor(aPerformance) {
  let thisAmount = 0;
  switch (playFor(aPerformance).type) {
    case "tragedy":
      thisAmount = 40000;
      if (aPerformance.audience > 30) {
        thisAmount += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (aPerformance.audience > 20) {
        thisAmount += 10000 + 500 * (aPerformance.audience - 20);
      }
      thisAmount += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }
  return thisAmount;
}
// Run the code
const result = statement(invoices[0], plays);
console.log(result);

module.exports = statement;
