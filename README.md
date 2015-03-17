Page model for aboutmde.org
===========================


The aboutmde.org galaxy
-----------------------

-   <http://aboutmde.org> (landing-page) : www/landing/
-   <http://api.aboutmde.org> : www/api/
-   <http://dingus.aboutmde.org> : www/dingus/
-   <http://reminders.aboutmde.org> : www/reminders/
-   <http://manifest.aboutmde.org> : www/manifest/
-   <http://test-suite.aboutmde.org> : www/test-suite/
-   <http://keys.aboutmde.org> : www/keys/

GPG key: <http://keys.aboutmde.org/aboutmde-pubkey.asc>

For the website draft: <http://preview.aboutmde.org>

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

Usage of the model
------------------

Fill in the `data/page.yml` configuration file for your page (will be generated as `www/index.html`)
and run:

    $ grunt
    # or
    $ grunt --debug --verbose

Classic `.devtools`
-------------------

    DEFAULT_SYNC_METHOD="ftp"
    DEFAULT_SYNC_SERVER="-f .devtools.ftp.conf www/{SUBDIR}"
    DEFAULT_SYNC_FTP_EXCLUDED_FILES=( '.git*' .devtools* )
    DEFAULT_SYNC_FTP_EXCLUDED_DIRS=( '.git/*' 'bin/*' '*/.git/*' )
