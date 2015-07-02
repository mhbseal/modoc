# modoc
### An API documentation generator

##### Repository

    git clone https://github.com/mhbseal/modoc.git
    npm install

##### Run

this repository contains mojs example,so we can run directly.http://mhbseal.com/api/mojs.html

    node modoc

##### Directory introduction

    dest -- output directory 
    src --- intput directory
    config.json --- document config
    modoc.js --- main file
    template.html --- document template

##### Use steps

1. edit config.json, configuration document information.
2. enter dest/images,replace logo.png.
3. enter src,clear this directory,copy your files to the current directory.
4. run modoc, successfully, generate a doc({config.name}.html) in dest.

##### Comment grammar

    /**
     * @name --- file name or method name or property name
     * @desc --- description
     * @grammar
     *
     * @param
     * @returns
     *
     * @examples
     * @more
     */
  
##### Examples
  
    use
    /**
     * @name file name or method name or property name
     * @desc description
     *
     * @param {string} string type parameter
     * @param {object} object type parameter
     *   - param {number} child parameter
     *   - param {string} child parameter
     * @param {function} function type parameter
     *   - param {number} function parameter
     *   - param {string} function parameter
     * @returns {*}
     * 
     * @examples
     * var num = 'modoc';
     * num.toUpperCase();
     * ...
     * @more
     * this is more information,
     * modoc is very good.
     * ...
     */
  
    don't use
    /***
     * ...
     */
  
    or
    /*
     * ...
     */
