const RED = "RED";
const GREEN = "GREEN";
const ORANGE = "ORANGE";

const DELETE_NAMES =
  /delete|usuń|Löschen|lubi|like|reak|reac|Gefällt|kosz|Recycle|trash|Papierkorb|remove/i;
const IGNORED_NAMES = /friend|znaj|freund|tag/i;
const SUPPORTED_LANG = /en|pl|de/;

const CLICKS = [
  { text: "1. Click the three dots button", roleName: "button" },
  { text: "2. Click 'delete' button", roleName: "menuitem" },
  {
    text: "3. Click 'delete' in the popup. If there is no popup, press ESC and try again.",
    roleName: "button",
  },
];

const FACEBOOK_CLEAR_ACTIVITY_LOG_KEY = "FACEBOOK_CLEAR_ACTIVITY_LOG_KEY";
const MAX_DEPTH = 10;

const app = {
  forceStop: false,
  processInProgress: false,
  actionDelay: 100,
  timerId: null,
  ignoredItems: 0,
  deletedCounter: 0,
  tryBeforeEnd: 50,
  tries: 0,
  targets: {
    objectAction: "",
    deleteButton: "",
    confirmDelete: "",
  },
};

function get(className) {
  return document.getElementsByClassName(className);
}

function getFromList(className) {
  return document
    .querySelectorAll('[role="main"]')?.[0]
    ?.getElementsByClassName(className);
}

function log(color, text) {
  console.log(`%c${text}`, `color:${color}`);
}

function stop() {
  app.forceStop = true;
}

function cancelCleanOnESC(event) {
  if (event.key === "Escape") stop();
}

function checkisSupportedLang() {
  return document.documentElement.lang.match(SUPPORTED_LANG);
}

function checkIsIgnored(text) {
  if (!checkisSupportedLang() || (text && text.match(IGNORED_NAMES))) return 1;
}

function printResults() {
  log(
    GREEN,
    `Removed ${app.deletedCounter} objects \n${app.ignoredItems} ignored`
  );
  app.processInProgress = false;
  document.removeEventListener("keydown", cancelCleanOnESC);
  menu();
}

function findConfirmDeleteLayer() {
  const layer = get(app.targets.confirmDelete);
  if (layer.length) layer[0].click();
}

function initMore() {
  if (app.tries >= app.tryBeforeEnd || app.forceStop) {
    clearInterval(app.timerId);
    return printResults();
  }
  if (app.tries++ === 0) log(ORANGE, `Waiting for load items!`);
  window.scrollBy(0, 1000);
}

function findElement() {
  findConfirmDeleteLayer();
  const object = getFromList(app.targets.objectAction);

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

function next() {
  if (app.forceStop || app.deletedCounter >= app.toDeleteAmount) {
    app.timerId = setTimeout(findConfirmDeleteLayer, 500);
    return printResults();
  }
  app.timerId = setInterval(findElement, app.actionDelay);
}

function deleteElement(timerId, counterTries) {
  if (app.forceStop) {
    clearInterval(timerId[0]);
    return printResults();
  }

  findConfirmDeleteLayer();
  const buttons = get(app.targets.deleteButton);

  if (buttons.length) {
    clearInterval(timerId[0]);

    let text;
    for (let i = 0; i < buttons.length; i++) {
      text = buttons[i].innerText;

      if (checkIsIgnored(text)) {
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

function clean(nr = 0, ignored = app.ignoredItems) {
  if (app.processInProgress) return log(RED, "Process in progress!");
  if (nr < 1 || ignored < 0) return log(RED, "Invalid number!");
  if (!checkisSupportedLang())
    return log(
      RED,
      "Your current language is not supported!\nPlease go to Facebook settings and change it to English, Polish, or German.!"
    );
  log(
    GREEN,
    "Process started.\nClick somewhere on the Facebook page (background) and press ESC to CANCEL."
  );
  app.forceStop = false;
  app.processInProgress = true;
  app.tries = 0;
  app.toDeleteAmount = nr;
  app.ignoredItems = ignored;
  app.deletedCounter = 0;

  document.addEventListener("keydown", cancelCleanOnESC);
  app.timerId = setInterval(findElement, app.actionDelay);
}

function saveToLS(target) {
  if (!target) {
    log(RED, "No data to save");
    return;
  }

  try {
    const data = JSON.stringify(target);
    localStorage.setItem(FACEBOOK_CLEAR_ACTIVITY_LOG_KEY, data);
  } catch (e) {
    log(RED, "Recorded clicks cannot be saved to local storage!", e);
  }
}

function getFromLS() {
  try {
    const data = localStorage.getItem(FACEBOOK_CLEAR_ACTIVITY_LOG_KEY);
    if (!data) return;

    return JSON.parse(data);
  } catch {
    log(RED, "Recorded clicks could not be read from local storage!");
  }
}

function checkRole(target, roleName) {
  return target?.attributes?.role?.nodeValue === roleName;
}

function getCorrectTargetClassNames(e, roleName) {
  let currentTarget = e?.target;
  let counter = 0;

  do {
    const isMenuItem = checkRole(currentTarget, roleName);
    if (isMenuItem) return currentTarget?.className;

    currentTarget = currentTarget?.parentElement;
    counter++;
  } while (!!currentTarget && counter < MAX_DEPTH);
}

function recordClicks() {
  let counter = 0;
  const targetsList = [];

  const listenClick = (e) => {
    const targetClassNames = getCorrectTargetClassNames(
      e,
      CLICKS?.[counter]?.roleName
    );

    if (!targetClassNames) {
      log(RED, "Try again");
      return;
    }

    targetsList[counter++] = targetClassNames;

    const info = CLICKS?.[counter]?.text;
    if (info) log(ORANGE, info);

    if (counter === 3) {
      document.removeEventListener("click", listenClick);
      document.removeEventListener("keydown", listenESC);

      const [objectAction, deleteButton, confirmDelete] = targetsList;

      const targets = {
        objectAction,
        deleteButton,
        confirmDelete,
      };

      saveToLS(targets);
      app.targets = targets;

      if (counter === 3) log(GREEN, "Successfully configured!");
      menu();
    }
  };

  const listenESC = (event) => {
    if (event.key !== "Escape") return;

    document.removeEventListener("click", listenClick);
    document.removeEventListener("keydown", listenESC);
    log(ORANGE, "Record canceled");
    menu();
  };

  document.addEventListener("click", listenClick);
  document.addEventListener("keydown", listenESC);

  log(GREEN, "Press ESC to cancel");
  log(ORANGE, CLICKS[0].text);
}

function restoreSavedClicks() {
  const data = getFromLS();
  if (!data) return false;

  const { objectAction, deleteButton, confirmDelete } = data || {};

  if (
    !objectAction ||
    !deleteButton ||
    !confirmDelete ||
    typeof objectAction !== "string" ||
    typeof deleteButton !== "string" ||
    typeof confirmDelete !== "string"
  ) {
    return false;
  }

  app.targets = data;
  return true;
}

function checkIsRecorderClicks() {
  const { objectAction, deleteButton, confirmDelete } = app.targets;

  if (objectAction && deleteButton && confirmDelete) return true;

  return restoreSavedClicks();
}

function removeRecorderClicks() {
  app.targets = {
    objectAction: "",
    deleteButton: "",
    confirmDelete: "",
  };
  try {
    localStorage.removeItem(FACEBOOK_CLEAR_ACTIVITY_LOG_KEY);
  } catch {}
}

function menu() {
  const isRecordedClicks = checkIsRecorderClicks();

  const choice = prompt(
    `What would you like to do?\n1. Record clicks for configuration. Before we begin, please add an empty post (visible only to you). \n${
      isRecordedClicks
        ? "2. Clear activity history on Facebook\n3. Remove recorded clicks\n"
        : ""
    }\n4. Exit`
  );

  switch (choice) {
    case "1":
      recordClicks();
      break;
    case "2":
      if (isRecordedClicks) clean(1000);
      else menu();
      break;
    case "3":
      if (isRecordedClicks) removeRecorderClicks();
      menu();
      break;
    case "4":
      break;
    default:
      if (choice !== null) menu();
      break;
  }
}

console.clear();
menu();
