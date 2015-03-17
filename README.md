Page model for aboutmde.org
===========================


Usage of the model
------------------

First setup your clone to "fork" the original <http://github.com/markdown-extended/page-model>:

    $ git remote add upstream http://github.com/markdown-extended/page-model.git
    $ git remote update
    $ git pull upstream master

Then you can update the following files to customize the page:

    data/page.yml
    templates/page-content.mustache
    templates/page-styles.mustache
    templates/page-scripts.mustache

Then run Grunt:

    $ grunt
    # or
    $ grunt --debug --verbose

The page is finally generated as `www/index.html`.

To auto-synchronize website with DevTools, you MUST update the `.devtools` config file:

    DEFAULT_SYNC_SERVER="-f ../.devtools.ftp.conf www/{SUBDIR}"

The NPM plugins
---------------

-   <http://gruntjs.com/>
-   <https://www.npmjs.com/package/grunt-mustache-render>
-   <https://github.com/janl/mustache.js/>
-   <https://github.com/shinnn/grunt-merge-data>

The external libraries used fo this template
--------------------------------------------

-   <http://jquery.com> (manual: <http://api.jquery.com/>)
-   <http://getbootstrap.com>
-   <http://fortawesome.github.io/Font-Awesome/> (icons list: <http://fortawesome.github.io/Font-Awesome/icons/>)
-   <http://mynameismatthieu.com/WOW/> (animations: <https://github.com/daneden/animate.css>)

Classic `.devtools`
-------------------

    DEFAULT_SYNC_METHOD="ftp"
    DEFAULT_SYNC_SERVER="-f .devtools.ftp.conf www/{SUBDIR}"
    DEFAULT_SYNC_FTP_EXCLUDED_FILES=( '.git*' .devtools* )
    DEFAULT_SYNC_FTP_EXCLUDED_DIRS=( '.git/*' 'bin/*' '*/.git/*' )
