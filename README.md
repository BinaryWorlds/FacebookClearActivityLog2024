# Introduction
New start, new me, new facebook account?
Or maybe it's better to remove all activity from the past?

This piece of code can help you with this.

## Start
Only English, Polish and Deutch are supported.
If u use slang or other lang, u must change it;

Your friends will not be removed, but I'm not responsible for any errors.

1. Sign in.
2. Go to activity log.
3. On the left u can select subcategory.
4. Open DevTool. 
> In chrome press F12.
5. Go to console.
6. Paste all code from app.js
7. In console:
```
deleteMany(1000);
```
8. Wait for the process to finish.

You can stop it by enter:
```
stop();
```
or  click somewhere on facebook page(background) and 
> press ESC.

Function takes three arguments
deleteMany(nr, ignore, tries);
    
- nr - maxium number of items to delete, 
- ignore - how many objects to ignore, from the beginning of the list; default 0
- tries - how many times in a row, wait for content to load, default 10
