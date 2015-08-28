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
        $3 = $3.replace(/[\t ]*\*[\t ]|(?:\s*\*[\s\/]*)*$/g, ''); // reg => 多行处理|去掉$3后面没用的
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
        $4 = $4.replace(/[\t ]*\*[\t ]|(?:\s*\*[\s\/]*)*$/g, ''); // reg => 多行处理|去掉$3后面没用的
        if (i === 0) {
          singleResult['desc'] = $4;
        } else {
          singleResult['items'][i-1]['desc'] = $4;
        }
      }
    })
  });

  result[singleName] = singleResult;
})

// 模板渲染
html = _.template(tpl)({config: config, data: result});

// 生成doc
fs.writeFileSync(path.join('dest', config.name + '.html'), html);

// success log
console.log('all success!')