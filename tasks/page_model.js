/**
 * Global aboutmde.org/page-model application
 */

'use strict';

var path    = require('path');
var lib     = require('grunt-nunjucks-render/lib/lib');
var nlib    = require('nunjucks/src/lib');

// global app
var PageModel = function(opts, grunt) {
    var _this           = this;

    this.grunt          = grunt || require('grunt');
    this.user_conf      = 'config.+(json|ya?ml)';
    this.options        = null;
    this.env            = 'prod';
    this.flags          = {};
    this.pages          = {};

    // default cli options
    this.default_args   = {
        dev:            false,
        root:           false,
        maintenance:    false
    };
    // required app paths
    this.req_paths      = [ 'env', 'data', 'page', 'template', 'tmp', 'dest' ];
    // required app extensions
    this.req_exts       = [ 'md', 'data', 'page', 'template', 'dest' ];

    function findUserConfig()
    {
        var file = _this.grunt.file.expand(_this.user_conf);
        if (file==[]) {
            file = _this.grunt.file.expand( lib.slashPath(process.cwd()) + _this.user_conf );
            if (file==[]) {
                throw new Error('No configuration file found (searching "' + _this.user_conf + '")');
            }
        }
        return file;
    };
    this.defaults       = grunt.file.readJSON(findUserConfig());

    // init app with user options
    function init(opts)
    {
        _this.options = lib.merge(_this.defaults, opts);

        // be sure to have all required paths with trailing slash
        for (var p in _this.req_paths) {
            var path = _this.req_paths[p];
            if (_this.options.paths[path]==undefined) {
                throw new Error('You must define app\'s "' + path + '" path');
            }
            _this.options.paths[path] = lib.slashPath(_this.options.paths[path]);
        }

        // be sure to have all required extensions with leading point
        for (var p in _this.req_exts) {
            var ext = _this.req_exts[p];
            if (_this.options.exts[ext]==undefined) {
                throw new Error('You must define app\'s "' + ext + '" file extension');
            }
            _this.options.exts[ext] = lib.dotExtension(_this.options.exts[ext]);
        }

        // be sure to have fully qualified global data array
        _this.options.global.data = nlib.isArray(_this.options.global.data) ? 
            _this.options.global.data.reverse() : [_this.options.global.data];
        for (var i in _this.options.global.data) {
            _this.options.global.data[i] = _this.resolve(_this.options.global.data[i], 'data');
        }

        if (_this.grunt.option('debug')) {
            _this.grunt.log.writeflags(_this.options, 'App options');
        }
    };
    // distribute cli arguments
    function initFlags(defaults)
    {
        var opt;
        for (var index in defaults) {
            opt = _this.grunt.option(index);
            if (opt && opt==1) opt = true;
            _this.flags[index] = opt || defaults[index];
        }
        // env flag
        if (_this.flags.dev==true) {
            _this.env = 'dev';
        }
        if (_this.grunt.option('debug')) {
            _this.grunt.log.writeflags(_this.flags, 'App flags');        
        }
    };
    // prepare pages config
    function initPages(pages)
    {
        var pages   = _this.options.pages;
        var globals = _this.options.global;
        for (var name in pages) {

            // auto-extension ?
            if (pages[name].ext==undefined) {
                pages[name].ext = true;
            }

            // the destination
            if (pages[name].dest==undefined) {
                pages[name].dest = name + _this.options.exts.dest;
            }
            pages[name].dest = _this.resolve(pages[name].dest, 'dest', pages[name].ext);

            // the template entry
            if (pages[name].template==undefined) {
                pages[name].template = globals.template;
            }
            pages[name].template = _this.resolve(pages[name].template, 'template', pages[name].ext);

            // the data entry
            if (pages[name].data!==undefined) {
                pages[name].data = nlib.isArray(pages[name].data) ? pages[name].data : [pages[name].data];
                for (var i in pages[name].data) {
                    pages[name].data[i] = _this.resolve(pages[name].data[i], 'data', pages[name].ext);
                }
            } else {
                pages[name].data = [];
            }
            for (var i in globals.data) {
                pages[name].data.unshift(globals.data[i]);
            }

        }
        _this.pages = pages;
        if (_this.grunt.option('debug')) {
            _this.grunt.log.writeflags(_this.pages, 'App pages');        
        }
    };

    init(opts);
    initFlags(this.default_args);
    initPages(this.options.pages);
}

// resolve an app file path
PageModel.prototype.resolve = function(filepath, type, add_ext)
{
    if (this.options.paths[type]==undefined) {
        throw new Error('Unknown file type "' + type + '"');
    }

    var basedir = this.options.paths[type];
    if (filepath.substr(0, basedir.length) === basedir) {
        filepath = filepath.substr(basedir.length);
    }

    if (add_ext!==false) {
        var ext = this.options.exts[type];
        if (ext && filepath.slice(-(ext.length)) != ext) {
            filepath = filepath + ext;
        }
    }

    return basedir + filepath;
};

// custom data transformation
PageModel.prototype.transformData = function(data)
{
    // current env info
    data.is_dev         = (this.env==='dev');
    data.is_maintenance = (this.flags.maintenance===true);
    data.is_root        = (this.flags.root===true);

    if (data.page==undefined) {
        // user option
        if (this.options.processData && nlib.isFunction(this.options.processData)) {
            data = this.options.processData(data);
        }
        return data;
    }

    // current page
    if (data.page.page_logo == undefined) {
        data.page.page_logo = data.website.logo;
    }
    for (var i=0; i<data.env.menu.length; i++) {
        var slug = data.env.menu[i].slug,
            active = data.page.page_active || '';
        if (slug == active) {
            data.env.menu[i].is_active = true;
            data.page.page_link = data.env.menu[i].url;
            if (data.page.page_title == undefined) {
                data.page.page_title = data.env.menu[i].title;
            }
        } else {
            data.env.menu[i].is_active = false;
        }
    }

    // organize contents
    if (data.page.contents != undefined) {
        for (var j=0; j<data.page.contents.length; j++) {
            // markdown content
            if (data.page.contents[j].markdown != undefined) {
                var filename = data.page.contents[j].markdown,
                    ext = this.getExt('page'),
                    dir = this.getTmpPath('page'),
                    mdfile = dir + filename.replace(ext, '') + ext;
                if (this.grunt.file.exists(mdfile)) {
                    data.page.contents[j].content = this.grunt.file.read(mdfile);
                } else {
                    this.grunt.log.warn('Markdown file "' + mdfile + '" not found');
                }
            }
        }
    }

    // user option
    if (this.options.processData && nlib.isFunction(this.options.processData)) {
        data = this.options.processData(data);
    }

    // always return the full data
    return data;
};

// get a task pages argument list
PageModel.prototype.getTaskPagesList = function(arg)
{
    var page        = arg || 'all';
    var pages       = {};
    var page_names  = page.split(/,/);
    if (page=='all') {
        pages = this.get(page);
    } else {
        for (var p in page_names) {
            pages[page_names[p]] = this.get(page_names[p]);
        }
    }
    return pages;
};

// tasks options
PageModel.prototype.getTaskOptions = function(task_name){
    var _this = this;
    switch(task_name) {
        case 'markdown':
            return {
                template:       this.getPath('template') + this.options.global.md_template,
                htmlExtension:  this.getExt('dest')
            };
            break;
        case 'merge_data':
            return {
            };
            break;
        case 'nunjucks_render':
            return {
                searchPaths:    this.toArray(this.getPath()),
                baseDir:        this.getPath('template'),
                processData:    function(data){ return _this.transformData(data); }
            };
            break;
        default: return null;
    }
};

// tasks files objects
PageModel.prototype.getTaskFiles = function(task_name, page_name){
    var _this = this;
    var page = this.get(page_name);
    switch(task_name) {
        case 'markdown':
            return {
                expand:     true,
                src:        this.getPathGlob('page', 'md'),
                dest:       this.getPath('tmp'),
                ext:        this.getExt('page')
            };
            break;
        case 'merge_data':
            var src = page.data || [];
            src.unshift(this.getEnvConfigPath());
            return {
                src:    src,
                dest:   this.getTmpPath('data', page_name)
            };
            break;
        case 'nunjucks_render':
            return {
                src:    (page.template || null),
                data:   this.getTmpPath('data', page_name),
                dest:   (page.dest || null)
            };
            break;
        case 'clean':
            var paths = [ this.get(page_name, 'dest') ];
            paths.push(this.getPath('tmp'));
            return paths;
            break;
        default: return null;
    }
};

// environment
PageModel.prototype.getEnvConfigPath = function() {
    // user environment ?
    var envfile     = this.options.env_dir + this.env + '/' + this.options.data_env,
        userenvfile = this.options.user_env;
    if (this.env=='dev' && this.grunt.file.exists(userenvfile)) {
        return userenvfile;
    } else {
        if (!this.grunt.file.exists(envfile)) {
            this.grunt.fail.fatal('environment config file "'+envfile+'" not found!');
        }
        return envfile;
    }
};

// get an object as an array of its values
PageModel.prototype.toArray = function(obj)
{
    if (nlib.isObject(obj)) {
        var res = [];
        for (var i in obj) {
            res.push(obj[i]);
        }
        return res;
    } else if (nlib.isArray(obj)) {
        return obj;
    }
    return null;
};

// global pages getter
PageModel.prototype.get = function(item, type)
{
    var _item   = item || 'all';
    var _type   = type || 'all';
    
    // one page
    if (_item!='all') {
        if (this.pages[_item]==undefined) {
            throw new Error('Unknown page "' + _item + '"');
        }
        var page = this.pages[_item];
        if (_type!='all') {
            if (page[_type]==undefined) {
                throw new Error('Unknown page option "' + _type + '"');
            }
            return page[_type];
        }
        return page;
    }

    // all pages
    if (_type!='all') {
        var pages = {};
        for (var p in this.pages) {
            if (this.pages[p][_type]==undefined) {
                throw new Error('Unknown page option "' + _type + '"');
            }
            pages[p] = this.pages[p][_type];
        }
        return pages;
    }

    // the whole pages table
    return this.pages;
};

// get options
PageModel.prototype.getOption = function(name, scope)
{
    var opts = (scope!=undefined ? (this.options[scope] || {}) : this.options);
    return (name!=undefined ? (opts[name] || null) : opts);
};
PageModel.prototype.getPath = function(name)
{
    return this.getOption(name, 'paths');
};
PageModel.prototype.getExt = function(name)
{
    return this.getOption(name, 'exts');
};
PageModel.prototype.getPathGlob = function(name, ext_name)
{
    var path    = this.getOption(name, 'paths');
    var ext     = this.getOption((ext_name || name), 'exts');
    return path + '*' + ext;
};
PageModel.prototype.getTmpPath = function(type, name)
{
    var tmpdir = this.getPath('tmp');
    var typedir = this.getPath(type);
    var typeext = this.getExt(type);
    return (path.normalize(tmpdir + typedir) + (name!=undefined && name!=null ? name + typeext : ''));
};

// app help string
PageModel.help_string = "\
### \n\
usage:    grunt (-d) (-v) [<task = 'default'>] [--dev] [–-root] [--maintenance] \n\
\n\
tasks:    render[:page]     : render all or a list of pages (comma separated) \n\
          cleanup[:page]    : clean all or a list of pages (comma separated) and temporary files \n\
          default           : 'render:all' task \n\
          rebuild           : 'clean:all' + 'render:all' tasks \n\
\n\
options:  --dev             : load the 'dev' environment settings \n\
          --root            : use this for 'root.aboutmde.org' \n\
          --maintenance     : use this to enable the 'maintenance' mode \n\
\n\
Use '--opt1=1 --opt2=1' for multiple flag options.\n\
All customization is stored in the 'Gruntfile.js' and 'config.yml' files. \n\
### \n\
";

module.exports = PageModel;
