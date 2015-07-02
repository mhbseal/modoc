var
  fs = require('fs'),
  path = require('path'),
  _ = require('underscore'),
  data = [],
  result = {},
  skipDir = [],
  tpl, filenames, matchs, name, html, eachFile, fixDir, config;

// 读取config
config = JSON.parse(fs.readFileSync('config.json', {encoding: 'utf8'}));

// 排除目录矫正
_.each(config.skip, function(v) {skipDir.push(path.join('src', v))});

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
tpl = fs.readFileSync('template.html', {encoding: 'utf8'});
eachFile('src');

// 读取注释
data.forEach(function(text) {
  matchs = text.match(/\/\*\*[^*][\s\S]*?\*\//g);

  if (!matchs) { // 跳过不需要生成doc的js文件
    return;
  }

  matchs.forEach(function(match, i) {
    match.replace(/@(name|desc|grammar|param|returns|examples|more)\s*(?:\{(.*)\})?\s*([^@]*)/gi, function($0, $1, $2, $3){
      $1 = $1.toLowerCase();
      $3 = $3.replace(/(?:\s*\*[\s\/]*)*$/g, '');
      if (i === 0) { // js文件顶部注释信息
        if ($1 === 'name') { // name直接作为data的key存储此文件的内容
          result[name = $3] = {};
        } else {
          $3 = $3.replace(/[\t ]*\*[\t ]/g, '');
          result[name][$1] = $3;
        }
      } else { // 非顶部注释
        result[name]['items'] = result[name]['items'] || [];
        result[name]['items'][i-1] = result[name]['items'][i -1] || [];
        if ($1 === 'name' || $1 === 'desc' || $1 === 'grammar') {
          result[name]['items'][i-1].infos = result[name]['items'][i-1].infos || {};
          result[name]['items'][i-1].infos[$1] = $3;
        } else {
          $3 = $3.replace(/[\t ]*\*[\t ]/g, '');
          if ($1 === 'examples' || $1 === 'more') {
            result[name]['items'][i-1][$1] = $3;
          } else {
            result[name]['items'][i-1].params = result[name]['items'][i-1].params || [];
            result[name]['items'][i-1].params.push([$1, $2, $3]);
          }
        }
      }
    })
  })
})

// 模板渲染
html = _.template(tpl)({config: config, data: result});

// 生成doc
fs.writeFileSync(path.join('dest', config.name + '.html'), html);

// success log
console.log('all success!')