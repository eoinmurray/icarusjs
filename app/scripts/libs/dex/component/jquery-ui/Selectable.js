function Selectable(userConfig)
{
  var chart = DexComponent(userConfig,
  {
  	// The parent container of this chart.
    'parent'           : null,
    // Set these when you need to CSS style components independently.
    'id'               : 'Selectable',
    'class'            : 'Selectable',
    'width'            : 600,
    'height'           : 100,
    'xoffset'          : 10,
    'yoffset'          : 10,
    'label'            : "",
    'selection'        : [ "X", "Y" ],
    'options'          :
    {
    }
  });

  chart.render = function()
  {
    var chart = this,
        config = chart.config,
        i;

    chart.attr('options.selected',
    function(event, ui)
    {
      dex.console.log("SELECT", event, "UI", ui.selected.id);
      //$('#Selectable.label').val(ui.value);
      chart.notify({'type' : 'selected', 'id' : ui.selected.id});
    });

    chart.attr('options.unselected',
    function(event, ui)
    {
      dex.console.log("UNSELECT", event, "UI", ui);
      //$('#Selectable.label').val(ui.value);
      chart.notify({'type' : 'unselected', 'id' : ui.unselected.id});
    });

    // Create the main container.
    chart.main = jQuery('<div/>',
    {
      'id'    : config['id'],
      'class' : config['class']
    }).appendTo(config['parent']);

    // Create the main container.
    var label = jQuery('<div/>',
    {
      'id'    : config['id'] + '-label',
      'text'  : config['label']
    }).appendTo(chart.main);
  
    // Create the main container.
    var orderedList = jQuery('<ol/>',
    {
      'id'    : config['id'] + '-ol'
    }).appendTo(chart.main);
  
    for (i=0; i<config.selection.length; i++)
    {
      var selectable = jQuery('<li/>',
      {
        'id'    : i,
        'class' : 'ui-widget-content',
        'text'  : config.selection[i]
      }).appendTo(orderedList);
    }

    $('#' + config['id'] + '-ol').selectable(config.options);
  };

  chart.update = function()
  {
  };

  chart.dom = function()
  {
    return chart.main;
  };

  return chart;
}