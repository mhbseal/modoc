# modoc
### An API documentation generator

#### Install and Run

npm

    npm install modoc -g
    
    modoc --config <configPath>

github
    
    git clone https://github.com/mhbseal/modoc.git
    cd modoc && npm install
    
    node modoc.js --config <configPath>

#### Example
source contains mojs example[http://mhbseal.com/api/mojs.html] ,so wen can Enter 'exmpale' directory after install(npm or github)

npm

    modoc

github

    node ../modoc

#### Config
  
    {
      "name": "",
      "version": "",
      "repositoryUrl": "",
      "introduction": "",
      "paths": {
        "input": "",
        "output": ""
      },
        source: '',
      "skip": []
    }
    
#### Comment Example
  
general document comment

    /**
     * description
     *
     * @param {string} 1
     * @param {object} 2
     *   - a {number} 3
     *   - b {string} 4
     * @param {function} 5
     *   - param {number} 6
     *   - param {function} 7
     *     - param 8
     * @return {object} 9
     *   - c {string} 10
     *   - d {number} 11
     */

after add generator
    
    /**
     * description
     *
     * @param {string} 1
     * @param {object} 2
     *   - a {number} 3
     *   - b {string} 4
     * @param {function} 5
     *   - param {number} 6
     *   - param {function} 7
     *     - param 8
     * @return {object} 9
     *   - c {string} 10
     *   - d {number} 11
     * 
     * @name file name or method name or property name(required)
     * @example
     * var str = 'modoc';
     * num.toUpperCase();
     * ...
     * @more
     * this is more information,
     * modoc is very good.
     * ...
     */
