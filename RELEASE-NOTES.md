## Version 3.0.16:

* New keyboard option to launch preferences page (Ctrl+Shift+J)

* New keyboard option to launch saved/offline pages (Ctrl+Shift+K)

* Keyboard shortcuts are user customizable and may need to be explicitly
  set by the user from the webpage to avoid conflicts with other extensions.
  Please refer to the webpage at: chrome://extensions/shortcuts

* Fix bug in not reverting to original page when clicking on browser action
  icon (when the URL has a "#" reference

* Ability to view offline pages from the preferences page.  This avoids the
  need to first run the extension on some page before a user can access the
  saved/offline pages

* Added user friendly privacy policy statement and explanation of permissions
  used by the extension

* Convinient link to save a PDF document of the Tranquility Reader view
  for offline reading or sharing with others

* Improve handling of images (fix cases where image width was larger
  than the reading width setting)

* Use CSS settings to identify some extraneous elements so that they
  can be removed from the page during processing

* CSS settings to allow for better print formatting width

* Added an option to change browser action icon to a grayscale version

* Preserve the original zoom setting of the page and restore
  it after exiting the tranquility view

* Updated copyright message

--------------------------------

## Version 3.0.13:

* Fixed problem with TITLE/HEAD elements being removed because their
  default css property of display is "none".  This causes a problem
  when saving a link for offline reading -- saved article shows up
  with a blank name

* Fixed logic for replacing using the contents of the ARTICLE tag as
  proxy for the entire content of the page.  The original solution of
  replacing just the parent was not sufficient to remove a lot of other
  crud.  Now, we replace the entire body of the page with the article
  tag contents

--------------------------------

## Version 3.0.12:

* Attempt to remove all event handlers in the original page to prevent
  them from modifying the processed page

* Fix to handle pages that have windows-1252 encoding

* Ignore links like "mail:" that need not be processed by the addon
  and which caused the addon to freeze while processing pages with such links

* More aggressive removal of hidden elements
  this can cause more images to be removed in the processed view

* Removal of links with onclick events/javascript since they are often
  associated with social media forwarding links/images and clutter the
  processed page

* Minor changes to make code consistent (tag names are now all in uppercase)

--------------------------------

## Version 3.0.11 (unreleased in Chrome -- combined with 3.0.12):

* When a reader click on a link in the tranquility mode, the page
  updates to show the clicked URL contents in the tranquility mode.
  However, the address bar is not updated.

  An icon is provided on the top right corner of the page with a
  link to the URL of the page that is currently processed/displayed.

* Updated copyright message

--------------------------------

## Version 3.0.10:

* Fix to scale images better

* Remove hidden images (based on the computedStyle properties)

* Allow smaller length text content to show more information.
  This can have the side effect of unnecessary material getting
  into the tranquilized view.  So, this is currently experimental.

* Updated copyright message

--------------------------------

## Version 3.0.9:

* Add support to handle #links; Tranquility currently tries to
  reload the entire page and reprocess instead of moving to the
  #link.

* Experimental support to handle images better.  Most images were
  being removed.  Added support for images.  Currently, more images
  than necessary are retained (including some pesky icons) but
  the changes are ready for publishing to a wider audience to
  receive feedback.

--------------------------------

## Version 3.0.8:

* Ability to run Tranquility Reader on a portion of a webpage 
  by selecting/highlighting only the text that you want to read.

* After highlighting text, right click on the highlighted text 
  and select "Tranquilize Selection!" from the context menu. 

* Ability to create user defined presets (for users who have 
  multiple configurations for Tranquility Reader)

* Changes made to Tranquility Reader preferences are instantly 
  reflected on all tabs in the Tranquil Reading Mode as soon 
  as the modified preferences are saved - this allows for 
  easier testing and tuning of the preferences. 

-------------------------------

## Version 3.0.4: 

* Removed popup menu for the browser action; now, clicking on 
  the Tranquility icon will make the page readable. For the 
  other actions provided through the popup menu, users will have 
  to go to the options page or use the Read Later button after 
  running tranquility.

* Added a few "preset" configurations (color schemes and font colors) 
  rather than having to customize each option manually. 
  This is experimental at this time; will explore the option of 
  allowing users to import a configuration file for this in the future.

* Changed the background page to "about:blank" (instead of mozilla.org) 
  when loading offline pages from the options window.

* Minor bug fix to remove the progress bar which was not being removed 
  in some corner cases.

* Bug fix to correctly load original page when toggling Tranquility mode 
  for an offline page.

* Bug fix to handle loading mixed security content pages correctly

* Bug fix to handle pre-formatted pages correctly 
