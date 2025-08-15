import * as nodePath from "path";
import gulp from "gulp";
import browsersync from "browser-sync";
import fileinclude from "gulp-file-include";
import del from "del";
import autoprefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import uglify from "gulp-uglify-es";
import gcmq from 'gulp-group-css-media-queries';
import clean_css from "gulp-clean-css";
import newer from "gulp-newer";
import imagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import imageminOptipng from "imagemin-optipng";
import webp  from "gulp-webp";
import webpHTML from "gulp-webp-html-nosvg";
import webpcss from "gulp-webpcss";
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from "gulp-ttf2woff2";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);
let project_folder = nodePath.basename(nodePath.resolve());
let source_folder = "#src";
export let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    jsmain: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
    media: project_folder + "/media/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    plugincss: source_folder + "/css/*.css",
    js: source_folder + "/js/**",
    jsmain: source_folder + "/js/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|jpeg|svg|ico|gif|webp)",
    fonts: source_folder + "/fonts/*.ttf",
    media: source_folder + "/media/**"
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    plugincss: source_folder + "/css/*.css",
    js: source_folder + "/js/**/**",
    jsmain: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|jpeg|gif|ico|svg|webp)",
    media: source_folder + "/media/**"
  },
  clean: "./" + project_folder + "/"
}
let src = gulp.src,
    dest = gulp.dest
//let { src, dest } = require("gulp"),
  //gulp = require("gulp"),
  //browsersync = require('browser-sync').create(),
 // fileinclude = require("gulp-file-include"),
 // del = require("del"),
  //scss = require('gulp-sass')(require('sass')),
 // autoprefixer = require('gulp-autoprefixer'),
  //gcmq = require('gulp-group-css-media-queries'),
  //clean_css = require("gulp-clean-css"),
  //rename = require("gulp-rename"),
  //uglify = require("gulp-uglify-es").default,
  //newer = require('gulp-newer'),
  //imagemin = require("gulp-imagemin"),
 // webp = require('gulp-webp'),
  //webpHTML = require("gulp-webp-html-nosvg"),
  //webpCSS = require("gulp-webpcss"),
  //ttf2woff = require('gulp-ttf2woff'),
  //ttf2woff2 = require('gulp-ttf2woff2')

export function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
      port: 3000,
      notify: false
    }
  });
};

export function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webpHTML())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};
export function plugincss() {
  return src(path.src.plugincss)
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
export function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded"
      }).on('error', scss.logError)
    )
    .pipe(
      webpcss({
        webpClass: '',
        noWebpClass: '.no-webp'
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(gcmq())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};
export function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};
export function jsmain() {
  return src(path.src.jsmain)
    .pipe(fileinclude())
    .pipe(uglify.default())
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
export function imagesCopy() {
  return src(path.src.img)
    .pipe(newer(path.build.img))
    .pipe(imagemin([
         imageminGifsicle({interlaced:true}),
         imageminMozjpeg({quality: 100,progressive: true}),
         imageminOptipng({optimizationLevel: 3})
       ])
     )  
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
};
export function webpCopy() {
  return src(path.src.img)
  .pipe(newer(path.build.img))
    .pipe(imagemin([
        imageminGifsicle({interlaced:true}),
         imageminMozjpeg({quality: 100,progressive: true}),
         imageminOptipng({optimizationLevel: 3})
      ])
    ) 
    .pipe(
      webp({
        quality: 100,
        method: 6
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}
export function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
};

export function media() {
  return src(path.src.media)
    .pipe(dest(path.build.media))
    .pipe(browsersync.stream())
};
export function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.plugincss], plugincss);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.jsmain], jsmain);
  gulp.watch([path.watch.img], imagesCopy);
  gulp.watch([path.watch.img], webpCopy);
  gulp.watch([path.watch.media], media);
}

export function clean(params) {
  return del(path.clean);
}

export let build = gulp.series(clean, gulp.parallel(js, jsmain, css, plugincss, html, imagesCopy, webpCopy, fonts, media));
let watch = gulp.parallel(build, watchFiles, browserSync);
export default watch
/* exports.fonts = fonts;
exports.js = js;
exports.jsmain = jsmain;
exports.css = css;
exports.plugincss = plugincss;
exports.html = html;
exports.media = media;
exports.build = build;
exports.watch = watch;
exports.default = watch; */
