Page model for aboutmde.org
===========================


The aboutmde.org galaxy
-----------------------

-   <http://aboutmde.org>
-   <http://api.aboutmde.org>
-   <http://dingus.aboutmde.org>
-   <http://reminders.aboutmde.org>
-   <http://manifest.aboutmde.org>

The external libraries used fo this template
--------------------------------------------

-   <http://jquery.com>
-   <http://getbootstrap.com>
-   <http://fortawesome.github.io/Font-Awesome/>
-   <http://mynameismatthieu.com/WOW/>

Usage of the model
------------------

Global tags to update in this model:

    {META_TITLE}
    {META_DESCRIPTION}
    {PAGE_TITLE}            // on the basic model: **Markdown** _extended_ (**<strong>MDE</strong>** _<em>dingus</em>_)
    {PAGE_DESCRIPTION}
    {PAGE_FOOTER}
    {PAGE_ACTIVE}           // to show which page is active in the navbar

Contents collection organization:

    {CONTENT_TITLE} 
    {CONTENT_DESCRIPTION} 
    {CONTENT_INTRO}
    {CONTENT}
    {CONTENT_NOTES}

A modal box is embedded, with tags:

    {MODALBOX_LABEL}
    {MODALBOX_DESCRIPTION}
    {MODALBOX_TITLE}
    {MODALBOX_CONTENT}
    {MODALBOX_FOOTER}
    
TODOS
-----

-   add a description to implementation links
-   make (or search) a visible "brand icon" from markdown-mark
