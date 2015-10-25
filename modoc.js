var
  fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  data = [],
  result = {},
  skipDir = [],
  configPath = './modoc.config.js',
  tpl, filenames, matchs, name, html, eachFile, fixDir, config, srcPath, distPath;

// 读取目录
process.argv.forEach(function(argv, i) {
  if (argv === '--config') {
    configPath = process.argv[i + 1];
  }
});

// 读取config内容
try {
  config = require(path.join(process.cwd(), configPath));
} catch (e) {
  console.log('config missing');
  return;
}

// 路径
srcPath = config.paths.input;
distPath = config.paths.output;

// 排除目录矫正
_.each(config.skip, function(v) {skipDir.push(path.join(srcPath, v))});

// 遍历src文件夹读取js
eachFile = function(dir) {
  filenames = fs.readdirSync(dir);
  filenames.forEach(function(filename) {
    fixDir = path.join(dir, filename);
    if (~skipDir.indexOf(fixDir)) { // 如果目录等于config中的排除目录直接跳过
      return;
    } else {
      if (path.extname(filename) !== '') {
        data.push(fs.readFileSync(fixDir, {encoding: 'utf8'}));
        // file dir log
        console.log(fixDir + '......loading');
      } else if (filename !== '.DS_Store') {
        eachFile(fixDir);
      }
    }
  })
};

// 读取数据
tpl = fs.readFileSync(path.join(__dirname, 'template.html'), {encoding: 'utf8'});
eachFile(srcPath);

// 读取注释
data.forEach(function(text) { // 循环文件
  matchs = text.match(/\/\*\*[^*][\s\S]*?\*\//g);

  if (!matchs) { // 跳过不需要生成doc的js文件
    return;
  }

  var 
    singleResult = {items: []},
    singleName;

  matchs.forEach(function(match, i) { // 循环文件中的注释
    singleResult['items'][i-1] = {params: []};
    match.replace(/@(name|grammar|param|return|example|more)\s(?:\{(.*)\})?\s*([^@]*)|\/\*\*[*\s]+([^@]+)/gi, function($0, $1, $2, $3, $4) {
      if ($1) { // 非描述信息
        $1 = $1.toLowerCase();
        $3 = $3.replace(/[\t ]*\*[\t ]?|(?:\s*\*[\s\/]*)*$/g, ''); // reg => 多行处理|去掉$3后面没用的
        if (i === 0) { // js文件顶部注释信息
          if ($1 === 'name') { // name直接作为data的key存储此文件的内容
            singleName = $3;
          } else {
            singleResult[$1] = $3;
          }
        } else { // 非顶部注释
          if ($1 === 'name' || $1 === 'grammar') { // name/grammar
            singleResult['items'][i-1][$1] = $3;
          } else {
            if ($1 === 'example' || $1 === 'more') { // example/more
              singleResult['items'][i-1][$1] = $3;
            } else { // param/return
              singleResult['items'][i-1]['params'].push([$1, $2, $3]);
            }
          }
        }
      } else { // 描述
        $4 = $4.replace(/[\t ]*\*[\t ]?|(?:\s*\*[\s\/]*)*$/g, ''); // reg => 多行处理|去掉$3后面没用的
        if (i === 0) {
          singleResult['desc'] = $4;
        } else {
          singleResult['items'][i-1]['desc'] = $4;
        }
      }
    })
  });

  if (singleName) result[singleName] = singleResult;
})

// 模板渲染
html = _.template(tpl)({config: config, data: result});

// 创建生成目录
!fs.existsSync(distPath) && fs.mkdirSync(distPath);
!fs.existsSync(path.join(distPath, 'images')) && fs.mkdirSync(path.join(distPath, 'images'));

// 生成doc
fs.writeFileSync(path.join(distPath, config.name + '.html'), html);
// 生成html需要的image
fs.writeFileSync(path.join(distPath, 'images/logo.png'), fs.readFileSync(path.join(__dirname, 'images/logo.png')));
fs.writeFileSync(path.join(distPath, 'images/background.png'), fs.readFileSync(path.join(__dirname, 'images/background.png')));

// success log
console.log('all success!')