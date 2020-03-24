const gulp = require("gulp");
const postcss = require("gulp-postcss");
const postcssimport = require("postcss-import")
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-minify");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const connect = require("gulp-connect");
const babel = require("gulp-babel");


const localJSExtensions = [
    "./node_modules/animejs/lib/anime.min.js"
];

const localCSSExtensions = [
    "./node_modules/animate.css/animate.min.css"
];



function html(next) {
    gulp.src("./src/html/templates/**/*.ejs")
        .pipe(ejs().on("error", err => { console.error(err); }))
        .pipe(rename(function(path) {
            if(path.basename !== "index") {
                path.dirname = path.basename;
                path.basename = "index";
            }

            path.extname = ".html";
        }))
        .pipe(gulp.dest("./dist/"))
        .pipe(connect.reload());

    next();
}

function images(next) {
    gulp.src("./src/assets/images/**/*")
        .pipe(gulp.dest("./dist/assets/images/"))
        .pipe(connect.reload());

    next();
}

function css(next) {
    gulp.src("./src/css/**/*.css")
        .pipe(postcss([
            postcssimport,
            tailwindcss,
            autoprefixer,
        ]))
        .pipe(gulp.dest("./dist/assets/css"))
        .pipe(connect.reload());

    next();
}

function js(next) {
    gulp.src("./src/js/**/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }).on("error", err => console.log(err)))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: true
        }).on("error", err => console.error(err)))
        .pipe(gulp.dest("./dist/assets/js"))
        .pipe(connect.reload());

    next();
}

function assets(next) {
    gulp.src("./src/assets/**/*")
        .pipe(gulp.dest("./dist/assets"))
        .pipe(connect.reload());
    
    next();
}

function copyJSExtensions(next) {
    gulp.src(localJSExtensions)
        .pipe(gulp.dest("./dist/assets/js"));

    next();
}

function copyCSSExtensions(next) {
    gulp.src(localCSSExtensions)
        .pipe(gulp.dest("./dist/assets/css"));

    next();
}


// Watchers
function watchHtml() {
    gulp.watch("./src/html/**/*.ejs", { ignoreInitial: false }, html);
}

function watchImages() {
    gulp.watch("./src/assets/images/**/*", { ignoreInitial: false }, images);
}

function watchCss() {
    gulp.watch("./src/css/**/*.css", { ignoreInitial: false }, css);
}

function watchJs() {
    gulp.watch("./src/js/**/*.js", { ignoreInitial: false }, js);
}

function watchAssets() {
    gulp.watch("./src/assets/**/*", { ignoreInitial: false }, assets);
}


gulp.task("dev", function(next) {
    watchHtml();
    watchImages();
    watchCss();
    watchJs();
    watchAssets();
    copyJSExtensions(next);
    copyCSSExtensions(next);
    
    connect.server({
        livereload: true,
        root: "dist"
    });

    next();
});

gulp.task("build", function(next) {
    html(next);
    images(next);
    css(next);
    js(next);
    assets(next);
    copyJSExtensions(next);
    copyCSSExtensions(next);
    
    
    next();
});