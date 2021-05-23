let OBJECT_ACTION = "tv7at329 nhd2j8a9 thwo4zme";
let DELETE_BUTTON = "sj5x9vvc dwo3fsh8";
let SCROLL_AREA = "q5bimw55 rpm2j7zs k7i0oixp";
let CONFIRM_LAYER = "s1i5eluu ak7q8e6j"; // and ERROR_LAYER

function swap(items, leftIndex, rightIndex) {
  let temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

function partition(items, left, right) {
  const pivot = items[Math.floor((right + left) / 2)].length;
  let i = left;
  let j = right;

  while (i <= j) {
    while (items[i].length < pivot) i++;
    while (items[j].length > pivot) j--;
    if (i <= j) {
      swap(items, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(items, left, right) {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right);
    if (left < index - 1) quickSort(items, left, index - 1);
    if (index < right) quickSort(items, index, right);
  }
}

function get(className) {
  return document.getElementsByClassName(className);
}

function toolFindClass(classList) {
  // e.g. "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 j83agx80 p7hjln8o"
  const list = classList.split(" ");
  const length = list.length;
  const result = [];

  for (let i = 0; i < length; i++) result[i] = [list[i], ...get(list[i])];
  quickSort(result, 0, length - 1);

  return result;
}

function checkMyClass(classList) {
  const result = get(classList);
  if (!result.length)
    console.log(
      "No object found. If object is visible on screen - change input class "
    );
  return result;
}
