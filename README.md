# Introduction

Starting anew?
Perhaps a fresh Facebook account beckons, or maybe it's time to wipe the slate clean of past activities.

This piece of code is here to assist you with just that.

![old/work_well](old/work_well.gif)

## Getting Started

This script supports English, Polish, and German languages only. If you use slang or any other language, you'll need to make modifications accordingly.

Your friends won't be removed, but please note that I'm not responsible for any errors.

**For best results, run the app on a fresh page (avoid clicking anywhere to delete).**

## Cancelling Operation

You can stop the app by entering:

```javascript
stop();
```

or by clicking somewhere on the Facebook page (background) and then pressing ESC.

> press ESC.

# For new Facebook layout:

1. Sign in.
2. Create a new post (e.g., 'test' - you can set post visibility to "Only you").
3. Go to the activity log. From the left menu, choose 'Activity History'. You should see '"Full Name" updated his status' in the Activity log.
4. Refresh the page.
5. Open DevTools.
   > In Chrome, press F12.
6. Go to the console.
7. Paste all code from **FacebookClearAcivityLog.js**
8. In the dialog box, type '1' - Record clicks for configuration.
   1. Choose the 'three dots' button.
   2. Click 'Move to bin'.
   3. Select 'Move to recycle bin' in the pop-up window.
      > If you make a mistake, you can click on the Facebook window and press ESC.
9. In the dialog box, type '2'. Your activity will be deleted.
10. Wait for the process to finish.

If you close the menu, you can reopen it by typing:

```javascript
menu();
```

If you have recorded clicks, you can also manually run the 'clean' function.

```javascript
clean(nr, ignored);
```

The function takes two arguments:

- nr - the maximum number of items to delete,
- ignored - how many objects to ignore from the beginning of the list; default is 0.

If you run the app again (without the second argument), ignored items will be saved. You can check it by typing:

```javascript
app.ignoredItems;
```

## Troubleshooting

> If there are no more objects to delete, the app ends after the set number of attempts.

If Facebook stops loading content, click on the next year in the timeline (filter: activity log, upper right) or refresh the page.

> If you refresh the page, the app will be removed. You must paste the code again.
