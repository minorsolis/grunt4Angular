module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  /* ============================================================================== */
  grunt.initConfig({

    gruntConfig: grunt.file.readJSON('grunt/config.json'),

    /* Sass: compress the CSS --------------------------------------------------- */
    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          './application/css/application.min.css': './scss/styles.scss'
        }
      },
      prod: {
        options: {
          style: 'compressed'
        },
        files: {
          './application/css/application.min.css': './scss/styles.scss'
        }
      }
    },

    /* Convert the angular code --------------------------------------------------- */
    ngAnnotate: {
        options: {
            singleQuotes: true
        },
        app: {
            files: {
                './application/js/application.min.js': '<%= gruntConfig.applicationFiles %>'
            }
        }
    },


    /* uglify for JS  -------------------------------------------------------------- */
    uglify: {
      prod: {
        files: {
          './application/js/application.min.js': [ './application/js/application.min.js' ]
        }
      }
    },


    /* scripts in the index.html   ---------------------------------------------------- */
    scriptlinker: {

      dev: {
        options: {
          startTag: '<%= gruntConfig.scriptlinkerOpenTag %>',
          endTag: '<%= gruntConfig.scriptlinkerCloseTag %>',
          fileTmpl: '\n<script src="%s"></script>',
          appRoot: '<%= gruntConfig.scriptlinkerBaseHref %>'
        },
        files: {
          'app/index.html': '<%= gruntConfig.applicationFiles %>'
        },
      },
      prod: {
        options: {
          startTag: '<%= gruntConfig.scriptlinkerOpenTag %>',
          endTag: '<%= gruntConfig.scriptlinkerCloseTag %>',
          fileTmpl: '\n<script src="%s"></script>\n',
          appRoot: '<%= gruntConfig.scriptlinkerBaseHref %>'
        },
        files: {
          'app/index.html': '<%= gruntConfig.applicationFilesProd %>'
        },
      }

    },


    /* browser   -------------------------------------------------------------- */
    browserSync: {
        dev: {
            bsFiles: {
                src : ['./app/**/*.js','./app/**/*.html']
            },
            options: {
                proxy: "local.localhost.com"
            }
        },
        prod: {
            bsFiles: {
                src : './app/**/*.js'
            },
            options: {
                watchTask: true,
                proxy: "local.localhost.com"
            }
        }
    },


    /* Watches files for changes and runs tasks based on the changed files -------------- */
    watch: {
      ngAnnotate: {
        files: ['./app/**/*.js', 'app/{,*/}*.js','app/index.html','grunt/config.json'],
        tasks: ['ngAnnotate','uglify']
      },
      styles: {
        files: ['./scss/styles.scss', './scss/**/*.scss', 'app/styles/{,*/}*.css'],
        tasks: ['sass:prod']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    }


  });

  /* ============================================================================== */
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-scriptlinker');
  
  /* ============================================================================== */
  grunt.registerTask('default', ['sass:prod','ngAnnotate','uglify','scriptlinker:prod','browserSync:prod','watch']);
  grunt.registerTask('build', ['sass:prod','ngAnnotate','uglify','scriptlinker:prod']);
  grunt.registerTask('dev', ['sass:dev','scriptlinker:dev','browserSync:dev','watch']);

};