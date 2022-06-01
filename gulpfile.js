const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
    return gulp.src('src/**/*.ts', 'src/**/*.json')
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'));
})
