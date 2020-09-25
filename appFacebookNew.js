const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const BLUE = "\x1b[34m";

const OBJECT_ACTION = "tv7at329 nhd2j8a9 tdjehn4e";
const DELETE_BUTTON = "sj5x9vvc dwo3fsh8";
const SCROLL_AREA = "q5bimw55 rpm2j7zs k7i0oixp";
const ERROR_LAYER = "s1i5eluu bwm1u5wc";

let app = {
  forceStop: false,
  processInProgress: false,
  actionDelay: 100,
  timerId: null,
  ignoredItems: 0,
  deletedCounter: 0,
  tryBeforeEnd: 200,
  tries: 0,
};

function get(className) {
  return document.getElementsByClassName(className);
}

function log(color, text) {
  console.log(`${color}${text}`);
}

function stop() {
  app.forceStop = true;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") stop();
});

function checkLang() {
  return document.documentElement.lang.match(/en|pl|de/);
}

function checkIgnored(text) {
  const check = /friend|znaj|freund|tag/i;
  if (!checkLang() || (text && text.match(check))) return 1;
}

function clean(nr = 0, ignored = app.ignoredItems) {
  if (app.processInProgress) return log(RED, "Process in progress!");
  if (nr < 1 || ignored < 0) return log(RED, "Invalid number!");
  if (!checkLang())
    return log(
      RED,
      "Your current language isn't supported!\nGo to facebook settings and change it to English, Polish or Deutch!"
    );
  log(
    GREEN,
    "Process started\nclick somewhere on facebook page(background) and press ESC to CANCEL"
  );
  app.forceStop = false;
  app.tries = 0;
  app.toDeleteAmount = nr;
  app.ignoredItems = ignored;
  app.deletedCounter = 0;

  app.timerId = setInterval(findElement, app.actionDelay);
}

function findElement() {
  findLayer();
  const object = get(OBJECT_ACTION);

  if (!object.length || object[app.ignoredItems] === undefined) return initMore();

  app.tries = 0;

  clearInterval(app.timerId);
  object[app.ignoredItems].click();

  let counterTries = [0],
    timerId = [];
  timerId[0] = setInterval(deleteElement, app.actionDelay, timerId, counterTries);
}

function deleteElement(timerId, counterTries) {
  if (app.forceStop) {
    clearInterval(timerId[0]);
    return printResults();
  }

  findLayer();
  const buttons = get(DELETE_BUTTON);

  if (buttons.length) {
    clearInterval(timerId[0]);

    let text;
    for (let i = 0; i < buttons.length; i++) {
      text = buttons[i].innerText;

      if (checkIgnored(text)) {
        next();
        return app.ignoredItems++;
      }

      if (text.match(/delete|usuń|Löschen|lubi|like|reak|reac|Gefällt/i)) {
        log(RED, buttons[i].innerText);
        buttons[i].click();
        app.deletedCounter++;
        return next();
      }
    }
  }

  if (++counterTries[0] > 5) {
    app.ignoredItems++;
    clearInterval(timerId[0]);
    log(BLUE, "No delete button!");
    next();
  }
}

function next() {
  if (app.forceStop || app.deletedCounter >= app.toDeleteAmount) return printResults();
  app.timerId = setInterval(findElement, app.actionDelay);
}

function findLayer() {
  const layer = get(ERROR_LAYER);
  if (layer.length) layer[0].click();
}

function initMore() {
  if (app.tries >= app.tryBeforeEnd || app.forceStop) {
    clearInterval(app.timerId);
    return printResults();
  }
  if (app.tries++ === 0) log(BLUE, `Waiting for load items!`);
  const scrollArea = get(SCROLL_AREA);
  scrollArea[0].scrollBy(0, 1000);
}

function printResults() {
  log(GREEN, `Removed ${app.deletedCounter} objects \n${app.ignoredItems} ignored`);
  app.processInProgress = false;
}
