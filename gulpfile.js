var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var frontnote = require('gulp-frontnote');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var minifyHtml = require('gulp-minify-html');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var notify = require('gulp-notify');
var pug = require('gulp-pug');


gulp.task('sass',function(){
    gulp.src(['src/sass/**/*.sass'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(frontnote({
            out: 'docs/css'
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream:true}))
        .pipe(notify('css task finished'))
});



gulp.task('js',function(){
    gulp.src(['src/js/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(browserify())
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload())
          .pipe(notify('js task finished'))
});


gulp.task('jade',function(){
    gulp.src(['src/jade/*.pug'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug({
                pretty: true}
            ))
        //.pipe(minifyHtml())
        .pipe(gulp.dest('dist/'))
        // .pipe(reload())
        // .pipe(notify('html task finished'))
});


gulp.task('image',function(){
    gulp.src(['src/images/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload())
        .pipe(notify('image task finished'))
});


gulp.task('iconfont', function(){
    gulp.src(['src/fonts/**/*.svg'])
        .pipe(iconfont({
            fontName: 'myicon'
        }))
        .on('codepoints', function(codepoints) {
            var options = {
                glyphs: codepoints,
                fontName: 'myicon',
                fontFamily: 'myicon',
                className: 'icon',
                timestamp: Date.now()
            };

            gulp.src('src/fonts/template/**/*.css')
                .pipe(consolidate('lodash', options))
                .pipe(rename({
                    basename:'myicon'
                }))
                .pipe(gulp.dest('dist/fonts/template'));

            gulp.src('src/fonts/template/**/*.html')
                .pipe(consolidate('lodash', options))
                .pipe(rename({
                    basename:'myicon'
                }))
                .pipe(gulp.dest('dist/fonts/template'));
        })
        .pipe(gulp.dest('dist/fonts'))
        .pipe(reload())
});



gulp.task( 'browserSync', function() {
    browserSync.init(['dist/css/*.css',  'dist/*.html'], {
        server: {
          baseDir: "dist/"
        }
    }); 
});


gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js',['js']);
    gulp.watch('src/sass/**/*.sass',['sass']);
    gulp.watch('src/jade/**/*.pug',['jade']);
    gulp.watch('src/images/**/*',['image']);
    gulp.watch('src/fonts/**/*.svg',['iconfont']);
});


// gulp.task('default',function(){
//     browserSync.init({
//         server: {
//           baseDir: "dist/"
//         }
//         //server: "./"
//     });
//     gulp.watch('src/js/**/*.js',['js']);
//     gulp.watch('src/sass/**/*.sass',['sass']);
//     gulp.watch('src/jade/**/*.pug',['jade']);
//     gulp.watch('src/images/**/*',['image']);
//     gulp.watch('src/fonts/**/*.svg',['iconfont']);
// });


gulp.task('default', ['browserSync', 'jade', 'watch']);