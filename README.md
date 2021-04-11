# Introduction

New start, new me, new facebook account?
Or maybe it's better to remove all activity from the past?

This piece of code can help you with this.

![work_well](work_well.gif)

**If script didn't work - send me a message or fix it yourself**
(checkout tool/Readme)

## Start

Only English, Polish and Deutsche are supported.
If you use slang or other lang, you must change it.

Your friends will not be removed, but I'm not responsible for any errors.

**For best, run app on fresh page (don't click anywhere to delete).**

## Cancel

You can stop app by enter:

```
stop();
```

or click somewhere on facebook page (background) and

> press ESC.

# For new Facebook layout:

1. Sign in.
2. Go to [activity log](https://www.facebook.com/help/289066827791446).
3. Refresh page.
4. Open DevTool.
   > In chrome press F12.
5. Go to console.
6. Paste all code from [appFacebookNew.js](FacebookNew.js)
7. Clear console (shortcut <kbd>Control</kbd> <kbd>L</kbd>)
8. In console:

```
clean(1000);
```

9. Wait for the process to finish.

Function takes two arguments
clean(nr, ignored);

- nr - maximum number of items to delete,
- ignored - how many objects to ignore, from the beginning of the list; default 0

If you run app again(without second argument), ignored items will be saved.
You can check it by type:

```
app.ignoredItems
```

# For classic Facebook layout:

1. Sign in.
2. Go to [activity log](https://www.facebook.com/help/289066827791446).
3. On the left you can select subcategory.
4. Refresh page.
   > If you don't, running code logout you (if you go to activity log from menu, with logout button)
5. Open DevTool.
   > In chrome press F12.
6. Go to console.
7. Paste all code from [appFacebookClassic.js](appFacebookClassic.js)
8. Clear console (shortcut <kbd>Control</kbd> <kbd>L</kbd>)
9. In console:

```
clean(1000);
```

9. Wait for the process to finish.

Function takes three arguments
clean(nr, ignored, tries);

- nr - maximum number of items to delete,
- ignored - how many objects to ignore, from the beginning of the list; default 0
- tries - how many times in a row, wait for content to load, default 10; Don't change this value.

## Troubleshooting

> If there are no more objects to delete, app ends after the set number of attempts.

If facebook stop loading content, click next year in the timeline (filter: activity log, right-up) or refresh page.

> If you refresh page, app will be removed. You must paste code again.
