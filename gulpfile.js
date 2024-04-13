"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');  // Minify and Remove Comments
const jshint = require("gulp-jshint");  // checking if JavaScript code complies with coding rules
const babel = require('gulp-babel'); // Babel · The compiler for next generation JavaScript
const jshintStylish = require("jshint-stylish");  // jsHint Reporter that provides formatted output in the terminal with colors and symbols to highlight code issues.
const rimraf = require("rimraf");  // deleting files and directories
const browserSync = require("browser-sync").create();  // live reloading and synchronization of browsers across 

var path = {
    // source paths
    src: {
        theme: "src/theme.json",
        pages: "theme/**/*.html",
        styles: "theme/src/assets/styles/**/*.css",
        scripts: "theme/src/assets/scripts/**/*.js",
        plugins: "theme/src/plugins/**/*",
        public: "theme/src/public/**/*",
    },

    // build paths
    build: {
        dir: "theme/",
        styles: "theme/dist/assets/styles/",
        scripts: "theme/dist/assets/scripts/",
        plugins: "theme/dist/plugins/",
        public: "theme/dist/assets/",
    },
};

// Server 
gulp.task('serve', function() {
    browserSync.init({
        server: {
          baseDir: path.build.dir, // Serve files from the specified directory
        },
        port: 3000, // Specify the port number for BrowserSync server
        notify: false, // Disable notifications
        open: false, // Disable automatic launching of browser window
    });
});

// styles
gulp.task("styles", function () {
    return gulp
        .src(path.src.styles)
        // .pipe(
        //     sass({
        //         outputStyle: "compressed",
        //     }).on("error", sass.logError)
        // ) // Compile Sass to CSS
        .pipe(
            postcss([
                tailwindcss("./tailwind.config.js"),  // Apply Tailwind CSS
                autoprefixer({
                    overrideBrowserslist: [
                        'ie >= 8', // Released in 2009
                        'chrome >= 4', // Released in 2010
                        'firefox >= 3.6', // Released in 2010
                        'safari >= 4', // Released in 2009 
                        'opera >= 10.5' // Released in 2010
                        
                        // 'ie >= 11', // Released in 2013
                        // 'chrome >= 50', // Released in 2016
                        // 'firefox >= 45', // Released in 2016
                        // 'safari >= 9', // Released in 2015
                        // 'opera >= 37' // Released in 2016
                    ]
                  })  // Apply Autoprefixer
            ])
        )
        .pipe(cleanCSS({compatibility: 'ie8', level: {1: {specialComments: 0}}})) // Minify and Remove comments
        .pipe(gulp.dest(path.build.styles))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
});

// scripts
gulp.task("scripts", function () {
  return gulp
    .src(path.src.scripts)
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter(jshintStylish))
    .pipe(
        babel({
            presets: [
                [
                    '@babel/preset-env', 
                    {
                        targets: {
                            browsers: [
                                'ie >= 8', // Released in 2009
                                'chrome >= 4', // Released in 2010
                                'firefox >= 3.6', // Released in 2010
                                'safari >= 4', // Released in 2009 
                                'opera >= 10.5' // Released in 2010
                                
                                // 'ie >= 11', // Released in 2013
                                // 'chrome >= 50', // Released in 2016
                                // 'firefox >= 45', // Released in 2016
                                // 'safari >= 9', // Released in 2015
                                // 'opera >= 37' // Released in 2016
                            ]
                        }
                    }
                ]
            ],
            comments: false, // remove comments
            compact: true, // Uncomment to enable compact output
            minified: true,
        })
    ) // Transpile the scripts using Babel
    .pipe(gulp.dest(path.build.scripts))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Plugins
gulp.task("plugins", function () {
  return gulp
    .src(path.src.plugins)
    .pipe(gulp.dest(path.build.plugins))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// public files
gulp.task('public', function () {
    return gulp
    .src(path.src.public)
    .pipe(gulp.dest(path.build.public));
});

// Clean Theme Folder
gulp.task("clean", function (cb) {
  rimraf(path.build.dir + "dist/", cb);
});

// Watch Task
gulp.task("watch", function () {
    gulp.watch(path.src.pages).on('change', browserSync.reload);
    gulp.watch(path.src.styles, gulp.parallel("styles"));
    gulp.watch(path.src.scripts, gulp.parallel("scripts"));
    gulp.watch(path.src.plugins, gulp.parallel("plugins"));
});

// dev Task
gulp.task(
    "dev",
    gulp.series(
        "clean",
        "styles",
        "scripts",
        "plugins",
        "public",
        gulp.parallel("watch", "serve")
    )
);

// Build Task
gulp.task(
    "build",
    gulp.series("clean", "styles", "scripts", "plugins", "public")
);

// // Deploy Task
// gulp.task(
//     "deploy",
//     gulp.series("styles", "scripts", "plugins", "public")
// );
