# modoc
### An API documentation generator

##### Install

    git clone https://github.com/mhbseal/modoc.git
    cd modoc && npm install

##### Run

this repository contains mojs example(http://mhbseal.com/api/mojs.html), so we can run directly.

    node modoc.js

##### Directory introduction

    dest -- output directory 
    src --- intput directory
    config.json --- document config
    modoc.js --- main file
    template.html --- document template

##### Usage

1. edit config.json, configuration document information.
2. enter dest/images,replace logo.png.
3. enter src,clear this directory,copy your files to the directory.
4. run modoc, successfully, generate a doc({config.name}.html) in dest.
  
##### Examples
  
general document comment

    /**
     * description
     *
     * @param {string} 1
     * @param {object} 2
     *   - param {number} 3
     *   - param {string} 4
     * @param {function} 5
     *   - param {number} 6
     *   - param {function} 7
     *     - param 8
     * @return {object} 9
     *   - a {string} 10
     *   - b {number} 11
     */

after add generator
    
    /**
     * description
     *
     * @param {string} 1
     * @param {object} 2
     *   - param {number} 3
     *   - param {string} 4
     * @param {function} 5
     *   - param {number} 6
     *   - param {function} 7
     *     - param 8
     * @return {object} 9
     *   - a {string} 10
     *   - b {number} 11
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