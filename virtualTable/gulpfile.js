const gulp = require('gulp'),
  minimist = require('minimist'),
  gulpSSH = require('gulp-ssh'),
  fs = require('fs'),
  glob = require('glob'),
  shell = require('shelljs');
// javascriptObfuscator = require('gulp-javascript-obfuscator');

const projectSVN = 'https://192.168.100.188/svn/jso/finchinaAPP/trunk/WebContent/finance_f9',
  bugFixSVN = 'https://192.168.100.188/svn/jso/finchinaAPP/tags/bugfix/WebContent/finance_f9',
  releaseSVN = 'https://192.168.100.188/svn/jso/finchinaAPP/release/WebContent/finance_f9',
  serverPath = '/opt/tomcat-search/webapps/finchinaAPP/finance_f9',
  bundlePath = './dist',
  commitMsg = 'DDC-12694 APPF9财务附注第一期';

gulp.task('build', cb => {
  shell.rm('-rf', bundlePath);
  const { path: buildPath } = minimist(process.argv.slice(2));
  if (buildPath) {
    console.log(`------------------begin build ${buildPath}------------------`);
    shell.exec(`yarn build --path ${buildPath}`);
    console.log(`------------------finish build ${buildPath}------------------`);
  } else {
    glob.sync('./src/pages/*').forEach(path => {
      const stat = fs.statSync(path);
      if (stat.isDirectory()) {
        const model = path.replace('./src/pages/', '');
        console.log(`------------------begin build ${model}------------------`);
        shell.exec(`yarn build --path ${model}`);
        console.log(`------------------finish build ${model}------------------`);
      }
    });
  }
  cb();
});

gulp.task('checkout', cb => {
  shell.exec(`svn checkout ${projectSVN}`);
  cb();
});

gulp.task('checkoutBugFix', cb => {
  shell.exec(`svn checkout ${bugFixSVN}`);
  cb();
});

gulp.task('checkoutRelease', cb => {
  shell.exec(`svn checkout ${releaseSVN}`);
  cb();
});

gulp.task('checkIn', cb => {
  const msgOptions = {
    string: 'm',
    default: { m: commitMsg },
  };

  const options = minimist(process.argv.slice(2), msgOptions);
  const svnProjectPath = projectSVN.split('/').pop();
  shell.cd(svnProjectPath);
  shell.rm('-r', '*');
  shell.cd('..');
  shell.cp('-R', bundlePath + '/*', svnProjectPath);
  shell.cp('-R', './*.png', svnProjectPath);
  shell.cp('-R', './*.png', bundlePath);
  shell.cp('-R', './*.svg', svnProjectPath);
  shell.cp('-R', './*.svg', bundlePath);
  shell.cd(svnProjectPath);
  shell.exec('svn add * --force');
  shell.exec(`svn commit -m "${options.m}"`);
  shell.cd('..');

  cb();
});

gulp.task('removeMap', cb => {
  shell.rm('./dist/**/assets/**/*.map');
  cb();
});

gulp.task('upload30', cb => {
  const ssh1 = new gulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host: '10.15.97.30',
      username: 'root',
      password: '',
    },
  });

  setTimeout(() => {
    gulp.src(`${bundlePath}/**`).pipe(ssh1.dest(serverPath));
    cb();
  }, 1000);
});

gulp.task('upload42', cb => {
  const ssh2 = new gulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host: '10.15.97.42',
      username: 'root',
      password: '',
    },
  });
  setTimeout(() => {
    gulp.src(`${bundlePath}/**`).pipe(ssh2.dest(serverPath));
    cb();
  }, 1000);
});

gulp.task('buildFiles', function(cb) {
  shell.rm('-rf', bundlePath);
  shell.exec('npm run build');
  cb();
});

gulp.task('trunk', gulp.series('buildFiles', 'removeMap', 'checkout', 'checkIn', 'upload30'));
gulp.task('bugfix', gulp.series('buildFiles', 'removeMap', 'checkoutBugFix', 'checkIn', 'upload42'));

gulp.task('checkInUpload', gulp.series('checkout', 'checkIn', 'upload30'));
gulp.task('release', gulp.series('buildFiles', 'removeMap', 'checkoutRelease', 'checkIn'));
gulp.task('default', gulp.series('buildFiles', 'removeMap', 'checkout', 'checkIn', 'upload30'));

