const RED = "RED";
const GREEN = "GREEN";
const ORANGE = "ORANGE";

const OBJECT_ACTION = "n3hqoq4p jvc6uz2b";
const DELETE_BUTTON = "nu7423ey s5oniofx qgrdou9d";
const SCROLL_AREA = "q5bimw55 rpm2j7zs k7i0oixp";
const CONFIRM_LAYER = "k70v3m9n"; // and ERROR_LAYER

const DELETE_NAMES =
  /delete|usuń|Löschen|lubi|like|reak|reac|Gefällt|kosz|Recycle|trash|Papierkorb/i;
const IGNORED_NAMES = /friend|znaj|freund|tag/i;
const SUPPORTED_LANG = /en|pl|de/;

const app = {
  forceStop: false,
  processInProgress: false,
  actionDelay: 100,
  timerId: null,
  ignoredItems: 0,
  deletedCounter: 0,
  tryBeforeEnd: 50,
  tries: 0,
};

function get(className) {
  return document.getElementsByClassName(className);
}

function log(color, text) {
  console.log(`%c${text}`, `color:${color}`);
}

function stop() {
  app.forceStop = true;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") stop();
});

function checkisSupportedLang() {
  return document.documentElement.lang.match(SUPPORTED_LANG);
}

function checkIgnored(text) {
  if (!checkisSupportedLang() || (text && text.match(IGNORED_NAMES))) return 1;
}

function clean(nr = 0, ignored = app.ignoredItems) {
  if (app.processInProgress) return log(RED, "Process in progress!");
  if (nr < 1 || ignored < 0) return log(RED, "Invalid number!");
  if (!checkisSupportedLang())
    return log(
      RED,
      "Your current language isn't supported!\nGo to facebook settings and change it to English, Polish or German!"
    );
  log(
    GREEN,
    "Process started\nclick somewhere on facebook page(background) and press ESC to CANCEL"
  );
  app.forceStop = false;
  app.processInProgress = true;
  app.tries = 0;
  app.toDeleteAmount = nr;
  app.ignoredItems = ignored;
  app.deletedCounter = 0;

  app.timerId = setInterval(findElement, app.actionDelay);
}

function findElement() {
  findLayer();
  const object = get(OBJECT_ACTION);

  if (!object.length || object[app.ignoredItems] === undefined)
    return initMore();

  app.tries = 0;

  clearInterval(app.timerId);
  object[app.ignoredItems].click();

  let counterTries = [0],
    timerId = [];

  timerId[0] = setInterval(
    deleteElement,
    app.actionDelay,
    timerId,
    counterTries
  );
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
      if (text.match(DELETE_NAMES)) {
        log(RED, text);
        buttons[i].click();
        app.deletedCounter++;
        return next();
      }
    }
  }

  if (++counterTries[0] > 5) {
    app.ignoredItems++;
    clearInterval(timerId[0]);
    log(ORANGE, "No delete button!");
    next();
  }
}

function next() {
  if (app.forceStop || app.deletedCounter >= app.toDeleteAmount) {
    app.timerId = setTimeout(findLayer, 500);
    return printResults();
  }
  app.timerId = setInterval(findElement, app.actionDelay);
}

function findLayer() {
  const layer = get(CONFIRM_LAYER);
  if (layer.length) layer[0].click();
}

function initMore() {
  if (app.tries >= app.tryBeforeEnd || app.forceStop) {
    clearInterval(app.timerId);
    return printResults();
  }
  if (app.tries++ === 0) log(ORANGE, `Waiting for load items!`);
  // const scrollArea = get(SCROLL_AREA);
  window.scrollBy(0, 1000);
}

function printResults() {
  log(
    GREEN,
    `Removed ${app.deletedCounter} objects \n${app.ignoredItems} ignored`
  );
  app.processInProgress = false;
}
