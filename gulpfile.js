var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var imgmin = require('gulp-imagemin');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var stripDebug = require('gulp-strip-debug');
var del = require('del');
var gutil = require('gulp-util');

var resourceDir = 'src/main/resources/META-INF/resources';

gulp.task('js_min', function() {
	return gulp.src(resourceDir + '/**/*.js')
		   .pipe(stripDebug())
		   .pipe(uglify())
		   .pipe(rename({suffix: '.min'}))
		   .pipe(gulp.dest(resourceDir));
});

gulp.task('css_min', function() {
	return gulp.src(resourceDir + '/**/*.css')
		   .pipe(cssmin())
		   .pipe(rename({suffix: '.min'}))
		   .pipe(gulp.dest(resourceDir));
});

gulp.task('img_min', function() {
	return gulp.src(resourceDir + '/img/**/*.*')
		   .pipe(imgmin())
		   .pipe(rename({suffix: '.m'}))
		   .pipe(gulp.dest(resourceDir + '/img'));
});

gulp.task('clean', function() {
	return del.sync([resourceDir + '/**/*.min.js', resourceDir + '/**/*.min.css', resourceDir + '/img/**/*.m.*']);
});

gulp.task('clean_js', function() {
	return del.sync([resourceDir + '/**/*.min.js']);
});

gulp.task('clean_css', function() {
	return del.sync([resourceDir + '/**/*.min.css']);
});

gulp.task('clean_img', function() {
	return del.sync([resourceDir + '/img/**/*.m.*']);
});

gulp.task('watch', function() {
	livereload.listen();
	var watcher = {
		js     : gulp.watch([resourceDir + '/**/*.js', '!' + resourceDir + '/**/*.min.js'], ['clean_js' ,'js_min', 'reload']),
		css    : gulp.watch([resourceDir + '/**/*.css', '!' + resourceDir + '/**/*.min.css'], ['clean_css', 'css_min', 'reload']), 
		images : gulp.watch([resourceDir + '/img/**/*.*', '!' + resourceDir + '/img/**/*.m.*'], ['clean_img','img_min', 'reload']) 
	};
	
	var notify = function(event) {
		gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
	}
	
	for(var key in watcher) {
		watcher[key].on('change', notify);
	}
});

gulp.task('reload', function() {
	return  gulp.src([resourceDir + '/js/**/*.js', resourceDir + '/img/**/*.*', resourceDir + '/css/**/*.css'])
			.pipe(livereload());
});

gulp.task('default', ['clean', 'js_min', 'css_min', 'img_min', 'watch', 'reload']);

