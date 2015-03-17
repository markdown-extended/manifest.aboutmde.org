module.exports = function(grunt) {
    grunt.initConfig({
        markdown: {
            all: {
                options: {
                    template: './templates/md-template.html'
                },
                files: [{
                    expand: true,
                    src: 'pages/*.md',
                    dest: 'var/',
                    ext: '.html'
                }]
            }
        },
        merge_data: {
            options: {
                data: function (data) {
                    // current page
                    if (data.page.page_logo == undefined) {
                        data.page.page_logo = data.website.logo;
                    }
                    for (var i=0; i<data.website.menu.length; i++) {
                        var slug = data.website.menu[i].slug,
                            active = data.page.page_active || '';
                        if (slug == active) {
                            data.website.menu[i].is_active = true;
                            data.page.page_link = data.website.menu[i].url;
                            data.page.page_title = data.website.menu[i].title;
                        } else {
                            data.website.menu[i].is_active = false;
                        }
                    }
                    // organize contents
                    if (data.page.contents != undefined) {
                        for (var j=0; j<data.page.contents.length; j++) {
                            // markdown content
                            if (data.page.contents[j].markdown != undefined) {
                                var filename = data.page.contents[j].markdown,
                                    mdfile = './var/pages/'+filename.replace('.html', '')+'.html';
                                data.page.contents[j].content = grunt.file.read(mdfile);
                            } else {
                                if (data.page.contents[j].notes && data.page.contents[j].notes.length>0) {
                                    data.page.contents[j].has_notes = true;
                                }
                            }
                            if (j<(data.page.contents.length-1)) {
                                data.page.contents[j].show_hr = true;
                            }
                        }
                    }
                    return data;
                }
            },
            all: {
                src: ['./data/*.yml'],
                dest: './var/config.json'
            }
        },
        mustache_render: {
            options: {
                clear_cache: true,
                escape: false,
                directory: "./templates/"
            },
            all: {
                files : [{
                    data:     './var/config.json',
                    template: './templates/page-model.mustache',
                    dest:     './www/index.html'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-merge-data');
    grunt.loadNpmTasks('grunt-mustache-render');
    grunt.registerTask('default', ['markdown','merge_data','mustache_render']);
};
