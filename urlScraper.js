var stringify = require("fast-json-stable-stringify");
const htmlparser = require("node-html-parser");
const fs = require("fs/promises");
const { error } = require("console");
let lap = 0;
const forbidden = ["facebook", "linked", "instagram"];
const cleanedLinks = [];

exports.scrape = async function scrape(url, name) {
  const data = await fetch(url).then((response) => response.text());

  const root = htmlparser.parse(data);

  // Regex
  const swedishPhoneNumberRegex3 = /0[1-9]\d{0,3}-\s?\d{2}\s?\d{2}\s?\d{2}/g;

  const websiteRegex4 = new RegExp(
    `\\bhttps?://(?:[^/]+\\.)?${name}(?:\\.\\w+)*(?:\\.(?:se|com))\\b`,
    "g"
  );

  const websiteRegex5 = new RegExp(
    `\\bhttps?://(?:[^/]+\\.)?${name}(?:\\.\\w+)*(?:\\.(?:se|com))?/\\w*\\b`,
    "g"
  );

  const websiteRegex6 = new RegExp(
    `\\b(?:https?://(?:[^/]+\\.)?${name}(?:\\.\\w+)*(?:\\.(?:se|com))?|\\b/${name}/?\\w*)\\b`,
    "g"
  );

  const relativeRegex = new RegExp(/\/\w*/g);
  //const relativePathRegex = /\/.*/g;
  //const relativePathRegex = /\/.*/g;
  const relativePathRegex = /\/[^/]+/g;

  const mailtoRegex = /mailto:[^\s]+/g;
  const telRegex = /tel:[^\s]+/g;

  const anchors = root.querySelectorAll("a");
  console.log(anchors.length);
  let hrefs = "";
  const links = [];
  anchors.forEach((a) => {
    hrefs = a.getAttribute("href");

    if (
      websiteRegex6.exec(hrefs.replaceAll(/\s/g, "")) &&
      !telRegex.exec(hrefs) &&
      !mailtoRegex.exec(hrefs)
    ) {
      links.push(a.getAttribute("href"));
    }
    if (
      relativePathRegex.exec(hrefs.replace(/\s/g, "")) &&
      !telRegex.exec(hrefs) &&
      !mailtoRegex.exec(hrefs)
    ) {
      if (a.getAttribute("href").includes("https:")) {
        links.push(a.getAttribute("href"));
      } else {
        links.push(url + a.getAttribute("href"));
      }
    }
  });

  let clean;
  for (i = 0; i < links.length; i++) {
    clean = true;
    for (j = 0; j < forbidden.length; j++) {
      if (links[i].includes(forbidden[j])) {
        clean = false;
      }
    }
    if (clean) cleanedLinks.push(links[i]);
  }

  //console.log(cleanedLinks);

  //console.log(links);

  /* console.log(anchors.length);
  console.log(hrefs);
 */

  let match;
  const matches = [];

  while ((match = websiteRegex5.exec(hrefs.replaceAll(/\s/g, ""))) !== null) {
    matches.push(match[0]);
  }
  //console.log(matches);
  replacedString = url.replace(/[\/\\:]+|https?/g, "");
  console.log(replacedString);

  try {
    await fs.writeFile(replacedString + +".txt", root.textContent);
    console.log("html dump finnished");
  } catch (error) {
    console.log(error);
  }
  lap++;
  console.log("Links length:" + cleanedLinks.length);

  await sleep(5000);
  if (lap < 3) {
    await scrape(cleanedLinks.pop(), name);
  }
  if (lap >= 3) {
    console.log(cleanedLinks);
  }
};

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
