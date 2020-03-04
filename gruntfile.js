const sass = require('node-sass')

module.exports = grunt => {
  require('load-grunt-tasks')(grunt)

  const hostname = grunt.option('hostname') || '192.168.10.7'
  const port = grunt.option('port') || 8015
  let root = grunt.option('root') || '.'

  if (!Array.isArray(root)) root = [root]

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * CENK KILIC PRESENTATION WITH REVEAL JS(<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' */'
    },

    // uglify: {
    // },

    terser: {
      options: { ecma: 2015 },
      main: {
        files: [
          { src: ['js/lib/*.js', 'js/jquery.min.js', 'js/reveal.js', 'js/app.js'], dest: 'dist/js/base.min.js' },
          { src: ['js/include.js'], dest: 'dist/js/include.min.js' }
        ]
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
        src: ['*.sass', '*.scss'],
        dest: 'dist/css/base',
        ext: '.css'
      },
      extend: {
        expand: true,
        cwd: 'css/theme/extend/source',
        src: ['*.sass', '*.scss'],
        dest: 'dist/css/extend',
        ext: '.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie9'
      },
      css: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }],
        print: [{
          expand: true,
          flatten: true,
          cwd: 'css/print',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      },
      fonts: {
        files: [
          { src: 'fonts/hero-fontface/fonts.css', dest: 'dist/css/fonts/hero-fontface.min.css' },
          { src: 'fonts/roboto-fontface/roboto-fontface.css', dest: 'dist/css/fonts/roboto-fontface.min.css' }
        ]
      },
      scss: {
        files: [
          { src: 'dist/css/base/black.css', dest: 'dist/css/black.min.css' },
          { src: 'dist/css/extend/extend.css', dest: 'dist/css/extend.min.css' }
        ]
      }
    },

    copy: {
      fonts: {
        expand: true,
        flatten: true,
        cwd: 'fonts',
        src: '**',
        dest: 'dist/css/fonts',
        filter: 'isFile'
      },
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

    clean: {
      scss: ['dist/css/base', 'dist/css/extend']
    },

    connect: {
      server: {
        options: {
          hostname: hostname,
          port: port,
          base: root,
          livereload: true,
          open: true,
          useAvailablePort: true
        }
      }
    },

    zip: {
      bundle: {
        src: [
          'dist/**',
          'slides/**',
          'template/**',
          '.gitignore',
          'favicon.png',
          'gruntfile.js',
          'README.md',
          'index.html',
          'package.json'
        ],
        dest: 'bundle.zip'
      }
    },

    watch: {
      js: {
        files: ['gruntfile.js', 'js/**/*.js', 'slides/js/**/*.js'],
        tasks: 'js'
      },
      scss: {
        files: [
          'css/theme/**/*.scss',
        ],
        tasks: 'scss'
      },
      css: {
        files: ['css/**/*.css'],
        tasks: 'css'
      },
      html: {
        files: [root.map(path => path + '/*.html'), root.map(path => path + '/template/*.html'), root.map(path => path + '/slides/*.html')]
      },
      markdown: {
        files: root.map(path => path + '/slides/*.md')
      },
      options: {
        livereload: true,
        debounceDelay: 2000
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

  // Default task
  grunt.registerTask('default', ['js', 'scss', 'css', 'fonts', 'assets'])

  // JS task
  grunt.registerTask('js', ['terser'])

  // Fonts
  grunt.registerTask('fonts', ['cssmin:fonts', 'copy:fonts'])

  // Assets
  grunt.registerTask('assets', ['copy:images', 'copy:plugins'])

  // Theme CSS
  grunt.registerTask('scss', ['sass', 'cssmin:scss', 'clean:scss'])
  grunt.registerTask('css', ['cssmin:css'])

  // Package presentation to archive
  grunt.registerTask('package', ['default', 'zip'])

  // Serve presentation locally
  grunt.registerTask('serve', ['default', 'connect', 'watch'])
}
