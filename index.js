const puppeter = require("puppeteer");
var stringify = require("fast-json-stable-stringify");
const htmlparser = require("node-html-parser");
const fs = require("fs/promises");
const { error } = require("console");
const urlScraper = require("./urlScraper");
const scrape = urlScraper.scrape;

//const json = require("");

async function books() {
  return await fetch("https://books.toscrape.com/");
}

async function test1() {
  const browser = await puppeter.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.google.com/search?q=knowit+kontakt");
  await page.waitForTimeout(5000);
  const tele = await page.$x(
    "/html/body/div[5]/div/div[12]/div[2]/div[3]/div/div[2]/div/div[3]/div/div/div/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div/span[2]/span/a/span"
  );

  //const text2 = await tele.textContent;
  console.log(tele);
  const text = await page.evaluate(() => {
    const text2 = document.querySelector("body").innerText;

    return text2;
  });

  //console.log(text);
  await browser.close();
}

function ratingConverter(rating) {
  let value;
  switch (rating) {
    case "One":
      value = 1;
      break;
    case "Two":
      value = 2;
      break;
    case "Three":
      value = 3;
      break;
    case "Four":
      value = 4;
      break;
    case "Five":
      value = 5;
  }
  return value;
}

//test();
async function test() {
  const data = await fetch("https://books.toscrape.com").then((response) =>
    response.text()
  );
  htmlparser;
  const root = htmlparser.parse(data);
  root.querySelector(".product_pod");
  const datas = root.querySelectorAll("article");

  /* cards.forEach((card) => {{
    title: card.querySelector("h3").textContent; ,
    price: card.querySelector(".price_color").textContent;
  }  */
  const cards = datas.map((card) => ({
    title: card.querySelector("h3").textContent,
    price: Number(
      card.querySelector(".price_color").textContent.replace("£", "")
    ),
    rating: ratingConverter(card.querySelector("p").classList.value[1]),
  }));
  //)));
  console.log(cards);

  //console.log(cards);
  fs.writeFile("books.json", stringify(cards), (err) => {
    if (error) console.log("error");

    console.log("done");
  });
}

async function amazon(name, link) {
  const data = await fetch(link).then((response) => response.text());
  htmlparser;
  const root = htmlparser.parse(data);
  //console.log(root.querySelector(".puis-card-container").textContent);

  console.log(root.querySelector("body").textContent);

  const datas = root.querySelectorAll(".puis-card-container");
  //console.log(datas[1].querySelector(".a-price a-offscreen"));
  //console.log(datas);
  const products = datas.map((product) => ({
    link: "amazon.se" + product.querySelector("a ").getAttribute("href"),
    title: product.querySelector("h2 span").textContent,
    price: product.querySelector(".a-price .a-price-whole"),
  }));
  //console.log(products);
  fs.writeFile(name + ".json", stringify(products), (err) => {
    if (error) console.log("error");

    console.log("done");
  });
}
//test();

const pepsiurl =
  "https://www.amazon.se/s?k=pepsi&crid=WR9I5A1B58MU&sprefix=pepsi%2Caps%2C92&ref=nb_sb_noss_1";
const godisurl =
  "https://www.amazon.se/s?k=godis&crid=2N83J9638C3WX&sprefix=godi%2Caps%2C92&ref=nb_sb_noss_1;";
const kaffeurl =
  "https://www.amazon.se/s?k=kaffe&crid=2GAVS8UO3T84S&sprefix=kaffe%2Caps%2C123&ref=nb_sb_noss_1";

const pepsi2url =
  "https://www.amazon.se/s?k=cola&crid=3GOM93X2EPPU2&sprefix=col%2Caps%2C148&ref=nb_sb_noss_2";

const bananurl =
  "https://www.amazon.se/s?k=bananer&crid=1Q0VPS78OYE3U&sprefix=bananer%2Caps%2C95&ref=nb_sb_noss_1";

/* amazon(
  "laptop",
  "https://www.amazon.se/s?k=laptop&crid=3G7AD65XGK0SN&sprefix=latop%2Caps%2C122&ref=nb_sb_ss_ts-doa-p_2_5"
);
 */

// Google sök och sparar länkar i links.json
async function searchByName(name) {
  const data = await fetch(
    `https://www.google.com/search?q=${name}+kontakt`
  ).then((response) => response.text());

  const root = htmlparser.parse(data);

  console.log(`https://www.google.com/search?q=${name}+kontakt`);
  const anchors = root.querySelectorAll("a");
  let hrefs = "";
  anchors.forEach((a) => {
    hrefs += a.getAttribute("href");
  });

  //Regexes
  const regex = new RegExp(/^\+46\d{1,3}-?\d{7}$/, "g");
  const swedishPhoneNumberRegex =
    /(\+46\d{1,3}-?\d{7}|0[1-9]\d{1,3}-?\d{2}\s?\d{2}\s?\d{2})/g;

  const swedishPhoneNumberRegex2 =
    /(\+46\d{1,3}-?\d{7}|0[1-9]\d{1,3}-?\d{2}\s?\d{2}\s?\d{2})/g;

  const swedishPhoneNumberRegex3 = /0[1-9]\d{0,3}-\s?\d{2}\s?\d{2}\s?\d{2}/g;

  const inputString = "Some text 08-700 66 00 more text 08-800 77 11";

  const websiteRegex = new RegExp(`\\b${name}\\.(se|com)\\b`, "g");
  const websiteRegex2 = new RegExp(
    `\\bhttps?://www\\.${name}\\.(se|com)\\b`,
    "g"
  );

  const websiteRegex3 = new RegExp(
    `\\bhttps?://(?:\\w+\\.)*?${name}(?:\\.\\w+)*(?:\\.(?:se|com))\\b`,
    "g"
  );

  const websiteRegex4 = new RegExp(
    `\\bhttps?://(?:[^/]+\\.)?${name}(?:\\.\\w+)*(?:\\.(?:se|com))\\b`,
    "g"
  );

  /* const inputString =
    "+4672-2850036 abcd +4632-2850035  08-700 66 00 010-178 60 00";
  const inputString2 = "010-178 60 00".replaceAll(/\s/g, "");
  console.log(inputString2); */

  let match;
  const matches = [];

  while ((match = websiteRegex4.exec(hrefs.replaceAll(/\s/g, ""))) !== null) {
    matches.push(match[0]);
  }
  console.log("Matches" + "\n" + matches);

  //console.log("Nummer för  " + name + "\n", matches + "\n");

  //const div = root.querySelector("body");
  //const as = root.querySelectorAll("a");

  /* as.forEach((a) => {
    try {
      console.log(a.querySelector("span").textContent);
    } catch (error) {
      console.log("error");
    }
  });
  console.log(as.length); */

  //console.log(test.textContent);

  /* const number = root.querySelector(
    ".I6TXqe .zloOqf .LrzXr a span"
  ).textContent; */

  //Uppdaterar links.json och dumpar hemsidans data i en txt fil
  let links = await fs.readFile("links.json");
  var json = JSON.parse(links);
  const value = {
    Link: matches[0],
    Name: name,
  };
  json.push(value);

  await fs.writeFile("links.json", stringify(json));
  console.log("Link added");

  await fs.writeFile(name + ".txt", root.textContent);
  console.log("html dump finnished");
}

async function scrapeCompanySite(url) {
  const data = await fetch(url).then((response) => response.text());

  const root = htmlparser.parse(data);

  // Regex
  const swedishPhoneNumberRegex3 = /0[1-9]\d{0,3}-\s?\d{2}\s?\d{2}\s?\d{2}/g;

  let match;
  const matches = [];

  while (
    (match = swedishPhoneNumberRegex3.exec(
      root.textContent.replaceAll(/\s/g, "")
    )) !== null
  ) {
    matches.push(match[0]);
  }
  console.log(match);
}

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

async function dontspam(names) {
  for (i = 0; i < names.length; i++) {
    searchByName(names[i]);
    await sleep(10000);
  }
}
const names2 = ["booiq"];
const names = ["booiq", "knowit", "sandvik", "alecta", "consid"];

//searchByName("sandvik");

/* searchByName("booiq");
 searchByName("booiq");
searchByName("knowit");
searchByName("Sandvik");
searchByName("alecta");
searchByName("consid");


const searchPatters = "https://www.google.com/search?q=search1+search2"; */

/* const name = "pepsi";
const websiteRegex2 = new RegExp(
  `\\bhttps?://www\\.${name}\\.(se|com)\\b`,
  "g"
);

console.log(
  websiteRegex2.exec(
    "<div>osvosv<h2><h2> <a href=https://www.pepsi.com/miljö.asas/saddddd ><a/>"
  )
);
*/
/* const inputString =
  "Some text http://www.home.variabel.se more text https://www.home.sandvik.se/kontakt another http://www.example.variabel.co.uk";

const company = "sandvik";

const websiteRegex3 = new RegExp(
  `\\bhttps?://(?:\\w+\\.)*?${company}(?:\\.\\w+)*(?:\\.(?:se|com))\\b`,
  "g"
);
const websiteRegex4 = new RegExp(
  `\\bhttps?://(?:[^/]+\\.)?${company}(?:\\.\\w+)*(?:\\.(?:se|com))\\b`,
  "g"
);

console.log(websiteRegex4.exec(inputString));


 */

async function loadLinks() {
  /*  fs.readFile("links.json", function (err, data) {
    var json = JSON.parse(data);
    console.log(json);
  }); */

  const data = await fs.readFile("links.json");
  //console.log(JSON.parse(data));
  return JSON.parse(data);
}

async function number(name) {
  //await searchByName(name);
  const json = await loadLinks();
  console.log(json);
  const links = json.map((link) => ({
    url: link.Link,
    name: link.Name,
  }));

  let urlToCheck = "";
  for (i = 0; i < links.length; i++) {
    if (links[i].name === name) {
      urlToCheck = links[i].url;
      break;
    }
  }
  let urls = [];
  console.log(urlToCheck);
  //urls.concat(urlScrape(urlToCheck));
  //scrape(urlToCheck);
  scrape(urlToCheck);
  //scrapeCompanySite(urlToCheck);

  /*  const data = await fetch(
    `https://www.google.com/search?q=${name}+kontakt`
  ).then((response) => response.text());
  htmlparser;

  const root = htmlparser.parse(data);

  const swedishPhoneNumberRegex3 = /0[1-9]\d{0,3}-\s?\d{2}\s?\d{2}\s?\d{2}/g;

  while ((match = websiteRegex4.exec(hrefs.replaceAll(/\s/g, ""))) !== null) {
    matches.push(match[0]);
  }
  console.log(matches); */
}

scrape("https://www.home.sandvik/se/");
/* const relativePathRegex1 = /\/[^/]+/g;
const relativePathRegex3 = /\/\S+/g;
const relativePathRegex2 = /\/[^/]+/g;

const phoneNumberRegex = /^tel:\+\d{11}$/;
const emailRegex = /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mailtoRegex = /mailto:[^\s]+/g;
const telRegex = /tel:[^\s]+/g;

const name = "xlent";
const websiteRegex6 = new RegExp(
  `\\b(?:https?://(?:[^/]+\\.)?${name}(?:\\.\\w+)*(?:\\.(?:se|com))?|\\b/${name}/?\\w*)\\b`,
  "g"
);
const inputString =
  "Some text /path1 more text /path2/subpath another /path3 and /path4/with/more/levels but also tel:+46851951000 https://www.xlent.no/ / https://facebook.com/xlent.se https://instagram.com/xlentconsultinggroup https://linkedin.com/in/company/-xlent https://xcg.se/  tel:+46851951000' mailto:info@xlent.se   mailto:info@xlent.se";

const text = "/kontakt  godismedkaffe  /omoss  www.facebook.com/xlent";

let match;
const matches = [];

while ((match = telRegex.exec(inputString)) !== null) {
  matches.push(match[0]);
}
console.log(matches);
 */
/* for (i = 0; i < matches.length; i++) {
  clean = true;
  for (j = 0; j < forbidden.length; j++) {
    if (matches[i].contains(forbidden[j])) {
      clean = false;
    }
  }
  if (clean) cleanedLinks.push(matches[i]);
}
console.log(cleanedLinks); */

//searchByName("xlent");
