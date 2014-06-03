function DexComponent(userConfig, defaultConfig)
{
  userConfig = userConfig || {};
  defaultConfig = defaultConfig || {};
  
  // This holds our event registry.
  this.registry = {};
  this.debug = false;

  if (userConfig.hasOwnProperty('config'))
  {
    this.config = dex.object.overlay(userConfig.config, defaultConfig);
  }
  else
  {
    this.config = dex.object.overlay(userConfig, defaultConfig);
  }

  //dex.console.log("HIERARCHY", this.config, userConfig, defaultConfig);

  this.attr = function(name, value)
  {
    if (arguments.length == 0)
    {
      return this.config;
    }
    else if (arguments.length == 1)
    {
      return this.config[name];
    }
    else if (arguments.length == 2)
    {
      //console.log("Setting Hieararchical: " + name + "=" + value);
      //console.dir(this.config);

      // This will handle the setting of a single attribute
      dex.object.setHierarchical(this.config, name, value, '.');
    }
    return this;
  };

  this.addListener = function(eventType, target, method)
  {
    var targets;

    if (this.debug)
    {
      console.log("Registering Target: " + eventType + "=" + target);
    }
    if (!this.registry.hasOwnProperty(eventType))
    {
      this.registry[eventType] = [];
    }

    this.registry[eventType].push(
    {
      target : target,
      method : method
    });
    //console.log("this.registry");
    //console.dir(eventthis.registry);
  };

this.notify = function(event)
{
  var targets, i;

  if (this.debug)
  {
    console.log("notify: " + event.type);
  }

  if (!this.registry.hasOwnProperty(event.type))
  {
    return this;
  }

  event.source = this;
  targets = this.registry[event.type];
  //console.log("TARGETS: " + targets.length);
  //console.dir(targets);
  for ( i = 0; i < targets.length; i++)
  {
    //console.dir("Calling Target: " + targets[i]["target"]);
    targets[i]["method"](event, targets[i]["target"]);
  }
};

  this.render = function()
  {
    console.log("Unimplemented routine: render()");
  };

  this.update = function()
  {
    console.log("Unimplemented routine: update()");
  };

  return this;
};
