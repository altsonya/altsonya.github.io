var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rigger      = require('gulp-rigger'), 
    rimraf      = require('rimraf'),
    browserSync = require('browser-sync'),
    watch       = require('gulp-watch'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cssmin      = require('gulp-minify-css'),
    ghPages     = require('gulp-gh-pages'),
    autoprefixer = require('gulp-autoprefixer'),
    reload      = browserSync.reload

var path = {
    build: {
        html: './build',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    notify: false,
   // tunnel: true,
    host: 'localhost',
    port: 9000
};

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages({branch: 'master'}));
});
gulp.task('cname', function () {
    gulp.src(['./src/CNAME']) 
        .pipe(gulp.dest(path.build.html))
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
        gulp.src(path.src.style) 
            .pipe(autoprefixer({
                            browsers: ['last 2 versions'],
                            cascade: false
                        }))
            .pipe(cssmin())
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
        gulp.src(path.src.img) 
            .pipe(imagemin([ 
                    imagemin.gifsicle({interlaced: true}),
                    imagemin.jpegtran({progressive: true}),
                    imagemin.optipng({optimizationLevel: 5}),
                    imagemin.svgo({plugins: [{removeViewBox: true}]})
                        ]))
            .pipe(gulp.dest(path.build.img))
            .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
        gulp.src(path.src.js) 
            .pipe(rigger()) 
            .pipe(gulp.dest(path.build.js))
            .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'style:build',
    'image:build',
    'js:build',
    'cname'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);
