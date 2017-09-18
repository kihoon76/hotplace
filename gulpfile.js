var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var imgmin = require('gulp-imagemin');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var stripDebug = require('gulp-strip-debug');
var del = require('del');
var gutil = require('gulp-util');
var sass = require('gulp-sass');

var resourceDir   = 'src/main/resources/META-INF/resources';
var exVendorsDir  = '!' + resourceDir + '/vendors/**';

gulp.task('sass', function() {
	return gulp.src([resourceDir + '/sass/*.scss'])
		   .pipe(sass.sync().on('error', sass.logError))
		   .pipe(gulp.dest(resourceDir + '/css'));
});

gulp.task('js_min', function() {
	return gulp.src([resourceDir + '/**/*.js', exVendorsDir])
		   .pipe(stripDebug())
		   .pipe(uglify().on('error', function(uglify) {
				console.log(uglify.message);
				this.emit('end');
		   }))
		   .pipe(rename({suffix: '.min'}))
		   .pipe(gulp.dest(resourceDir));
});

gulp.task('css_min', function() {
	return gulp.src([resourceDir + '/**/*.css', exVendorsDir])
		   .pipe(cssmin())
		   .pipe(rename({suffix: '.min'}))
		   .pipe(gulp.dest(resourceDir));
});

gulp.task('img_min', function() {
	return gulp.src([resourceDir + '/img/**/*.*', exVendorsDir])
		   .pipe(imgmin())
		   .pipe(rename({suffix: '.m'}))
		   .pipe(gulp.dest(resourceDir + '/img'));
});

gulp.task('clean', function() {
	return del.sync([resourceDir + '/**/*.min.js', resourceDir + '/**/*.min.css', resourceDir + '/img/**/*.m.*', exVendorsDir]);
});

gulp.task('clean_js', function() {
	return del.sync([resourceDir + '/**/*.min.js', exVendorsDir]);
});

gulp.task('clean_css', function() {
	return del.sync([resourceDir + '/**/*.min.css', exVendorsDir]);
});

gulp.task('clean_img', function() {
	return del.sync([resourceDir + '/img/**/*.m.*', exVendorsDir]);
});

gulp.task('watch', function() {
	livereload.listen();
	var watcher = {
		js     : gulp.watch([resourceDir + '/**/*.js', '!' + resourceDir + '/**/*.min.js','!' + resourceDir + '/**/gulpfile.js', exVendorsDir], ['clean_js' ,'js_min', 'reload']),
		css    : gulp.watch([resourceDir + '/**/*.css', '!' + resourceDir + '/**/*.min.css', exVendorsDir], ['clean_css', 'css_min', 'reload']), 
		images : gulp.watch([resourceDir + '/img/**/*.*', '!' + resourceDir + '/img/**/*.m.*', exVendorsDir], ['clean_img','img_min', 'reload']) 
	};
	
	var notify = function(event) {
		gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
	}
	
	for(var key in watcher) {
		watcher[key].on('change', notify);
	}
});

gulp.task('reload', function() {
	return  gulp.src([resourceDir + '/js/**/*.js', resourceDir + '/img/**/*.*', resourceDir + '/css/**/*.css', exVendorsDir])
			.pipe(livereload());
});

gulp.task('default', ['clean', 'js_min', 'css_min', 'img_min', 'watch', 'reload']);

