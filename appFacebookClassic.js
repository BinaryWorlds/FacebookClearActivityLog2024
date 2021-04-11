const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const BLUE = "\x1b[34m";

const tryToEnd = 10;

let ignoredItems = 0;
let deletedCounter = 0;
let forceStop = 0;

function stop() {
  forceStop = 1;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") stop();
});

function log(color, text) {
  console.log(`${color}${text}`);
}

function checkLang() {
  return document.documentElement.lang.match(/en|pl|de/);
}

function checkIgnored(text) {
  const check = /friend|znaj|freund|tag/i;
  if (!checkLang() || (text && text.match(check))) return 1;
}

function findLayer() {
  let button = document.getElementsByClassName("layerConfirm");
  for (let i = button.length; i > 0; i--) button[i - 1].click();
  if (button.length) return 1;

  button = document.getElementsByClassName("layerCancel");
  if (button.length) {
    log(BLUE, "Cancel detected!");
    ignoredItems++;
    for (let i = button.length; i > 0; i--) button[i - 1].click();
  }
}

function findElement(nr = 0) {
  findLayer();
  let button = document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx");
  if (!button.length || button[nr] === undefined) return 0;

  button[nr].click();
  return ++nr;
}

function findRemove() {
  findLayer();
  let button = document.getElementsByClassName("_54nh");
  if (!button.length) return log(BLUE, "No item to click");

  let lastItemNr = button.length - 1;
  let text = button[lastItemNr].innerHTML;
  if (checkIgnored(text)) return ignoredItems++;

  if (text.match(/report|zgłoś|melden|mark|oznacz|spam/i)) return tryDelete(button, lastItemNr);

  log(RED, button[lastItemNr].innerHTML);
  button[lastItemNr].click();
  deletedCounter++;
}

function tryDelete(button, lastItemNr) {
  let temp;
  for (let i = 1; i < 5; i++) {
    temp = button[lastItemNr - i];
    if (temp && temp.innerHTML.match(/delete|usuń|Löschen/i)) {
      log(RED, temp.innerHTML);
      temp.click();
      return deletedCounter++;
    }
  }
  ignoredItems++;
}

function awaitForItems(nr, ignored, tries) {
  log(BLUE, `Await for items! \n${tries} try to end!`);
  scrollBy(0, 1000);
  setTimeout(() => {
    log(BLUE, "Process continued!");
    clean(nr, ignored, tries);
  }, 1000);
}

function clean(nr = 0, ignored = 0, tries = tryToEnd) {
  if (nr < 1) return log(RED, "Invalid number of items to delete!");
  if (!checkLang())
    return log(
      RED,
      "Your current language isn't supported!\nGo to facebook settings and change it to English, Polish or Deutsche!"
    );

  ignoredItems = ignored;
  let objNr = ignored;
  findLayer();
  for (let i = 0; i < nr; i++) {
    if (forceStop || !tries) break;
    if ((objNr = findElement(objNr))) {
      findRemove();
      tries = tryToEnd;
    } else return awaitForItems(nr - i, ignoredItems, --tries);
  }
  log(GREEN, `Waiting for clean!`);
  setTimeout(() => {
    findLayer();
    log(GREEN, `Removed ${deletedCounter} objects \n${ignoredItems} ignored`);
    forceStop = 0;
    deletedCounter = 0;
  }, 3000);
}
