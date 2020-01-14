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

    terser: {
      options: { ecma: 2015 },
      main: {
        files: [
          { src: 'js/reveal.js', dest: 'js/reveal.min.js' },
          { src: 'js/app.js', dest: 'js/app.min.js' }
        ]
      }
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: false
      },
      core: {
        files: [
          { src: 'css/reveal.scss', dest: 'css/reveal.css' },
          { src: 'css/style.scss', dest: 'css/style.css' }
        ]
      },
      themes: {
        expand: true,
        cwd: 'css/theme/source',
        src: ['*.sass', '*.scss'],
        dest: 'css/theme',
        ext: '.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie9'
      },
      compress: {
        files: [
          { src: 'css/reveal.css', dest: 'css/reveal.min.css' },
          { src: 'css/style.css', dest: 'css/style.min.css' }
        ]
      }
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
          'index.html',
          'slides/**',
          'css/*.min.css',
          'css/reset.css',
          'css/theme/*.css',
          'css/print/*.css',
          'js/**',
          'lib/**',
          'img/**',
          'fonts/**',
          'assets/**',
          'favicon.png'
        ],
        dest: 'dist/cenkkilic-dist-presentation.zip'
      }
    },

    watch: {
      js: {
        files: ['gruntfile.js', 'js/reveal.js', 'js/app.js'],
        tasks: 'js'
      },
      theme: {
        files: [
          'css/theme/source/*.sass',
          'css/theme/source/*.scss',
          'css/theme/template/*.sass',
          'css/theme/template/*.scss'
        ],
        tasks: 'css-themes'
      },
      css: {
        files: ['css/reveal.scss', 'css/style.scss', 'css/variables.scss', 'css/mixins.scss'],
        tasks: 'css-core'
      },
      html: {
        files: [root.map(path => path + '/*.html'), root.map(path => path + '/slides/*.html')]
      },
      markdown: {
        files: root.map(path => path + '/*.md')
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
  grunt.loadNpmTasks('grunt-terser')

  // Default task
  grunt.registerTask('default', ['css', 'js'])

  // JS task
  grunt.registerTask('js', ['terser'])

  // Theme CSS
  grunt.registerTask('css-themes', ['sass:themes'])

  // Core framework CSS
  grunt.registerTask('css-core', ['sass:core', 'cssmin'])

  // All CSS
  grunt.registerTask('css', ['sass', 'cssmin'])

  // Package presentation to archive
  grunt.registerTask('package', ['default', 'zip'])

  // Serve presentation locally
  grunt.registerTask('serve', ['connect', 'watch'])
}
