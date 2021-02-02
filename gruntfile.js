const sass = require('node-sass')

module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt)

  const hostname = grunt.option('hostname') || '0.0.0.0'
  const port = grunt.option('port') || 8015
  const target = process.env.NODE_ENV || 'development'
  console.log(`Running for target: ${target}`)
  let root = grunt.option('root') || '.'

  if (!Array.isArray(root)) root = [ root ]

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*!\n' + ' * CENK KILIC PRESENTATION WITH REVEAL JS(<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' + ' */'
    },

    terser: {
      options: { ecma: 2015 },
      main: {
        files: [ { src: [ 'js/lib/*.js', 'node_modules/jquery/dist/jquery.min.js', 'js/reveal.js', 'js/app.js' ], dest: 'dist/js/base.min.js' } ]
      }
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: false
      },
      base: {
        expand: true,
        cwd: 'css/theme/base/source',
        src: [ '*.sass', '*.scss' ],
        dest: 'dist/css/temp/base',
        ext: '.css'
      },
      extend: {
        expand: true,
        cwd: 'css/theme/extend/source',
        src: [ '*.sass', '*.scss' ],
        dest: 'dist/css/temp/extend',
        ext: '.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie11'
      },
      css: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'css',
            src: [ '*.css', '!*.min.css' ],
            dest: 'dist/css/temp',
            ext: '.min.css'
          },
          {
            expand: true,
            flatten: true,
            cwd: 'css/print',
            src: [ '*.css', '!*.min.css' ],
            dest: 'dist/css/print',
            ext: '.min.css'
          }
        ]
      },
      scss: {
        files: [
          { src: 'dist/css/temp/base/black.css', dest: 'dist/css/temp/black.min.css' },
          { src: 'dist/css/temp/extend/extend.css', dest: 'dist/css/temp/extend.min.css' }
        ]
      },
      concat: {
        files: {
          'dist/css/base.min.css': [
            'dist/css/temp/reset.css',
            'dist/css/temp/bootstrap.min.css',
            'dist/css/temp/black.min.css',
            'dist/css/temp/extend.min.css',
            'dist/css/temp/monokai.min.css',
            'dist/css/temp/fonts/open-sans.min.css',
            'dist/css/temp/fonts/roboto.min.css'
          ]
        }
      }
    },

    embedFonts: {
      all: {
        files: {
          'dist/css/temp/fonts/open-sans.min.css': [ 'node_modules/@fontsource/open-sans/index.css' ],
          'dist/css/temp/fonts/roboto.min.css': [ 'node_modules/@fontsource/roboto/index.css' ]
        }
      }
    },

    copy: {
      images: {
        expand: true,
        flatten: true,
        cwd: 'css/img',
        src: '**',
        dest: 'dist/css/img',
        filter: 'isFile'
      },
      plugins: {
        expand: true,
        flatten: false,
        cwd: 'js/plugins',
        src: '**',
        dest: 'dist/js/plugins',
        filter: 'isFile'
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/js/base.min.js': [ 'dist/js/base.min.js' ]
        },
        options: {
          replacements: [
            {
              pattern: /\{OUTPUT_DIR\}/gi,
              replacement: target === 'production' ? 'node_modules/@cenk1cenk2/reveal-presentation/' : ''
            }
          ]
        }
      }
    },

    clean: {
      css: [ 'dist/css/temp' ]
    },

    connect: {
      server: {
        options: {
          hostname,
          port,
          base: root,
          livereload: true,
          open: true,
          useAvailablePort: true
        }
      }
    },

    zip: {
      bundle: {
        src: [ 'dist/**', 'slides/**', 'template/**', '.gitignore', 'favicon.png', 'gruntfile.js', 'README.md', 'index.html', 'package.json' ],
        dest: 'bundle.zip'
      }
    },

    watch: {
      js: {
        files: [ 'gruntfile.js', 'js/**/*.js', 'slides/js/**/*.js' ],
        tasks: [ 'js', 'assets' ]
      },
      scss: {
        files: [ 'css/theme/**/*.scss' ],
        tasks: [ 'scss', 'css' ]
      },
      css: {
        files: [ 'css/**/*.css' ],
        tasks: 'css'
      },
      html: {
        files: [ './*.html', 'template/*.html', 'slides/*.html' ]
      },
      markdown: {
        files: [ 'slides/*.md', 'slides/markdown/*.md', 'slides/notes/*.md' ]
      },
      assets: {
        files: [ 'slides/assets/**/*' ]
      },
      options: {
        livereload: true,
        debounceDelay: 2000,
        event: [ 'changed', 'added', 'deleted' ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-zip')
  grunt.loadNpmTasks('grunt-contrib-uglify-es')
  grunt.loadNpmTasks('grunt-terser')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-embed-fonts')
  grunt.loadNpmTasks('grunt-string-replace')

  // Default task
  grunt.registerTask('default', [ 'js', 'scss', 'css', 'assets' ])

  // JS task
  grunt.registerTask('js', [ 'terser', 'string-replace' ])

  // Fonts
  grunt.registerTask('fonts', [ 'embedFonts' ])

  // Assets
  grunt.registerTask('assets', [ 'copy:images', 'copy:plugins' ])

  // Theme CSS
  grunt.registerTask('scss', [ 'sass', 'cssmin:scss' ])
  grunt.registerTask('css', [ 'fonts', 'cssmin:css', 'cssmin:concat', 'clean:css' ])

  // Package presentation to archive
  grunt.registerTask('package', [ 'default', 'zip' ])

  // Serve presentation locally
  grunt.registerTask('serve', [ 'default', 'connect', 'watch' ])
}
