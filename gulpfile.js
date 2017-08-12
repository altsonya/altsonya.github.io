var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rigger      = require('gulp-rigger'), 
    browserSync = require("browser-sync"),
    watch       = require('gulp-watch'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cssmin      = require('gulp-minify-css'),
    reload      = browserSync.reload,
    deploy      = require('gulp-gh-pages');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: './build',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/*.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
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
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function () {
        gulp.src(path.src.style) //Выберем наш main.scss
            .pipe(cssmin()) //Сожмем
            .pipe(gulp.dest(path.build.css)) //И в build
            .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
        gulp.src(path.src.img) //Выберем наши картинки
            .pipe(imagemin({ //Сожмем их
                            progressive: true,
                            svgoPlugins: [{removeViewBox: false}],
                            use: [pngquant()],
                            interlaced: true
                        }))
            .pipe(gulp.dest(path.build.img)) //И бросим в build
            .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
        gulp.src(path.src.js) //Найдем наш main файл
            .pipe(rigger()) //Прогоним через rigger
            .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
            .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('build', [
    'html:build',
    'style:build',
    'image:build',
    'js:build'
]);


gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);
