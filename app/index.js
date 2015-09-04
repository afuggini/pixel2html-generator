'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');
var _ = require('underscore');
var util = require('util');
var path = require('path');

var Generator = module.exports = function Generator(args, options) {

  yeoman.generators.Base.apply(this, arguments);

  this.paths = {
    src: 'assets/src',
    srcFonts: 'assets/src/fonts',
    srcIcons: 'assets/src/icons',
    srcImages: 'assets/src/images',
    srcVendors: 'assets/src/vendor',
    srcJs: 'assets/src/js'
  };


  this.destinationRoot('demo');

  //Options to set thru CLI
  this.option('projectName', {
    desc: 'Sets the project name i.e.: 3845',
    type: String,
    required: false
  });

  this.option('qtyPages', {
    desc: 'Sets the quantity of pages have the project i.e. 5 (1 homepage, 4 inners)',
    type: Number,
    required: false
  });

  this.option('projectType', {
    desc: 'Sets the type of project [desktop, responsive, mobile]',
    type: String,
    required: false
  });

  this.option('cssProcessor', {
    desc: 'Sets the CSS Preprocessor [sass, less, stylus]',
    type: String,
    required: false
  });

  this.option('frontEndFramework', {
    desc: 'Sets the framework of choice [basscss, bootstrap, foundation]',
    type: String,
    required: false
  });
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.log(
      chalk.white.bgRed.bold(
        'Welcome to Pixel2HTML Boilerplate Generator'
      )
    );
  }
};

Generator.prototype.askForProjectName = function askForProjectName() {

  var cb = this.async();
  var projectName = this.options.projectName;

  this.prompt(
    [{
      type: 'input',
      name: 'projectName',
      required: true,
      message: 'Give me the Project Name!',
      when: function() {
        return !projectName;
      }
    }],
    function(props) {
      this.projectName = props.projectName;
      cb();
    }.bind(this)
  );
};

Generator.prototype.askForQtyPages = function askForQtyPages() {

  var cb = this.async();
  var qtyPages = this.options.qtyPages;

  this.prompt(
    [{
      type: 'input',
      name: 'qtyPages',
      message: 'How many pages to will code?',
      when: function() {
        return !qtyPages;
      }
    }],
    function(props) {
      this.qtyPages = props.qtyPages;

      cb();
    }.bind(this)
  );
};

Generator.prototype.projectType = function projectType() {

  var cb = this.async();
  var projectType = this.options.projectType;


  this.prompt([{
      type: 'list',
      name: 'projectType',
      message: 'What type of page you will code? Pick one',
      choices: [{
        name: 'Desktop',
        value: 'desktop',
      }, {
        name: 'Responsive',
        value: 'responsive',
      }, {
        name: 'Mobile',
        value: 'mobile',
      }],
      when: function() {
        return !projectType;
      }
    }],
    function(props) {
      this.projectType = props.projectType;
      cb();
    }.bind(this));
};

Generator.prototype.askForCssProcessor = function askForCssProcessor() {

  var cb = this.async();
  var cssProcessor = this.options.cssProcessor

  this.prompt([{
      type: 'list',
      name: 'cssProcessor',
      message: 'What preprocessor would you like to use? Pick one',
      choices: [{
        name: 'Sass',
        value: 'sass',
      }, {
        name: 'Less',
        value: 'less',
      }, {
        name: 'Stylus',
        value: 'stylus',
      }],
      when: function() {
        return !cssProcessor;
      }

    }],
    function(props) {
      this.cssProcessor = props.cssProcessor;
      cb();
    }.bind(this));
};

Generator.prototype.askForFrontFramework = function askForFrontFramework() {

  var cb = this.async();
  var frontEndFramework = this.options.frontEndFramework;

  this.prompt([{
      type: 'list',
      name: 'frontEndFramework',
      message: 'What FrontEnd Framework do you like to include?',
      choices: [{
        name: 'BassCss',
        value: 'basscss',
      }, {
        name: 'Bootstrap',
        value: 'bootstrap',
      }, {
        name: 'Foundation',
        value: 'foundation',
      }, {
        name: 'None',
        value: false,
      }],
      when: function() {
        return !frontEndFramework;
      }
    }],
    function(props) {
      this.frontEndFramework = props.frontEndFramework;
      cb();
    }.bind(this));
};

Generator.prototype.askForjQuery = function askForjQuery() {
  var cb = this.async();
  var frontEndFramework = this.frontEndFramework;
  var jquery = this.jquery;

  this.prompt([{
    type: 'confirm',
    name: 'jquery',
    message: 'Would you like to use jQuery?',
    default: true,
    when: function() {
      return !frontEndFramework && !jquery;
    }
  }], function(props) {
    this.jquery = props.jquery;
    if()
    cb();
  }.bind(this));
};

Generator.prototype.askForJsModules = function askForJsModules() {
  var cb = this.async();
  var jquery = this.jquery;

  var prompts = [{
    type: 'checkbox',
    name: 'jsModules',
    message: 'Which modules would you like to include?',
    choices: [{
      value: 'parsleyjs',
      name: 'Form validation with Parsley.js',
      checked: true
    }, {
      value: 'modernizr',
      name: 'Add modernizr.js',
      checked: true
    }, {
      value: 'slider',
      name: 'Add Slider.js',
      checked: false
    }, {
      value: 'tabs',
      name: 'Add Tabs.js',
      checked: false
    }, {
      value: 'masonry',
      name: 'Add Masonry',
      checked: false
    }],
    when: function(jquery) {
      return jquery;
    }
  }];

  this.prompt(prompts, function(props) {

    var hasMod = function(mod) {
      return _.contains(props.jsModules, mod);
    };

    this.parsleyjs = hasMod('parsleyjs');
    this.slider = hasMod('slider');
    this.tabs = hasMod('tabs');
    this.modernizr = hasMod('modernizr');
    this.masonry = hasMod('masonry');

    cb();
  }.bind(this));
};

Generator.prototype.writeProjectFiles = function writeProjectFiles() {

  this.log(chalk.yellow('Copying package.json file and adding dependencies.'));
  this.fs.copyTpl(
    this.templatePath('base/_package.json'),
    this.destinationPath('package.json'), {
      projectName: this.projectName,
      cssPreprocessor: this.cssPreprocessor
    }
  );

  this.log(chalk.yellow('Copying jshintrc file.'));
  this.fs.copy(
    this.templatePath('base/jshintrc'),
    this.destinationPath('.jshintrc')
  );

  this.log(chalk.yellow('Copying git files.'));
  this.fs.copy(
    this.templatePath('git/gitignore'),
    this.destinationPath('.gitignore')
  );

  this.fs.copy(
    this.templatePath('git/gitattributes'),
    this.destinationPath('.gitattributes')
  );
};

Generator.prototype.writeGulpFiles = function writeGulpFiles() {

  this.log(chalk.yellow('Copying gulpfile.'));
  this.fs.copyTpl(
    this.templatePath('gulp/_gulpfile.js'),
    this.destinationPath('gulpfile.js')
  );
};

Generator.prototype.createFolders = function createFolders() {
  this.log(chalk.yellow('Creating directories.'));

  mkdirp('assets');

  _.each(this.paths, function(path) {
    mkdirp(path);
  });
};

Generator.prototype.writeBowerFile = function writeBowerFile() {

  var bowerJson = {
    projectName: 'pixel2html-' + _s.slugify(this.projectName),
    private: true,
    dependencies: {}
  };

  switch (this.frontEndFramework) {
    case 'bootstrap':
      switch (this.cssProcessor) {
        case 'sass':
          bowerJson.dependencies['bootstrap-sass'] = '~3.3.*';
          break; //sass
        case 'less':
          bowerJson.dependencies['bootstrap'] = '~3.3.*';
          break; //less
        case 'stylus':
          bowerJson.dependencies['bootstrap-stylus'] = '~4.0.*';
          break; //stylus
      }
      break; //bootstrap

    case 'basscss':
      switch (this.cssProcessor) {
        case 'sass':
          bowerJson.dependencies['basscss-sass'] = '~3.0.*';
          break; //sass

        default:
        case 'less':
        case 'stylus':
          bowerJson.dependencies['basscss'] = '~7.0.*';
          break; //less

      }
      break;

    case 'foundation':
      switch (this.cssProcessor) {
        case 'sass':
          bowerJson.dependencies['foundation'] = '~5.5.*';
          break; //sass
        case 'less':
          bowerJson.dependencies['foundation'] = '~5.5.*';
          break; //less
        case 'stylus':
          bowerJson.dependencies['foundation'] = '~5.5.*';
          break; //stylus
      }
      break;
  }
  if (this.jquery) {
    bowerJson.dependencies['jquery'] = '~2.1.*';
  }
  if (this.parsley) {
    bowerJson.dependencies['parsleyjs'] = '~2.1.*';
  }
  if (this.modernizr) {
    bowerJson.dependencies['modernizr'] = '~2.8.*';
  }

  this.fs.writeJSON('bower.json', bowerJson);
  this.fs.copy(
    this.templatePath('bower/bowerrc'),
    this.destinationPath('.bowerrc')
  );
};



