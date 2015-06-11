+function($) {
  "use strict";
 
  var Shrinker = function(element, options) {
    var self = this;
    this.$element = $(element);
    this.options = options
    this.initializeVars();
    this.setHeight($(document).scrollTop());
    $(window).on('scroll', function () {
      self.setHeight($(document).scrollTop())
    });
  }
 
  Shrinker.prototype.isActive = function( scroll ) {
    if (typeof this.options.active == 'function') {
      return this.options.active(scroll);
    }
    return this.options.active
  }
 
  Shrinker.prototype.initializeVars = function() {
    this.big = (typeof this.options.shrinkerBig != 'undefined') ? this.options.shrinkerBig : this.$element.height();
    this.small = this.options.shrinkerSmall;
    this.starts = this.options.shrinkerStarts;
    this.ends = this.big - this.small + this.starts;
  }
 
  Shrinker.prototype.setHeight = function( scroll ) {
    if ( this.isActive( scroll ) ) {
      if ( scroll < this.starts ) {
        this.$element.addClass(this.options.shrinkerBigClass)
                     .removeClass(this.options.shrinkerSmallClass)
                     .removeClass(this.options.shrinkerTransitionClass)
                     .height(this.big);
      } else if ( scroll >= this.starts && scroll < this.ends ) {
        this.$element.height(this.big - (scroll - this.starts) - 1)
                     .addClass(this.options.shrinkerTransitionClass)
      } else if ( scroll > this.ends ) {
        this.$element.addClass(this.options.shrinkerSmallClass)
                     .removeClass(this.options.shrinkerBigClass)
                     .removeClass(this.options.shrinkerTransitionClass)
                     .height(this.small);
      }
    }
  }
 
  Shrinker.DEFAULTS = {
    shrinkerSmall: 50,
    shrinkerStarts: 0,
    shrinkerBigClass: 'shrinker-big',
    shrinkerSmallClass: 'shrinker-small',
    shrinkerTransitionClass: 'in',
    active: true
  }
 
  function Plugin(option) {
    var extraArgs = []
    for ( var i=1 ; i < arguments.length ; i++)
      extraArgs.push( arguments[i] )
 
    return this.each(function() {
      var $this = $(this)
        , data = $this.data('shrinker.plugin')
        , options = $.extend({}, Shrinker.DEFAULTS, $this.data(), typeof option == 'object' && option)
 
        data || $this.data('shrinker.plugin', (data = new Shrinker(this, options)))
 
        if (typeof option == 'string') {
          method = data[option]  
          if (typeof method == 'undefined')
            throw "Shrinker method: '" + option + "' does not exists."
          method.apply(data, extraArgs)
        }
    })
  }
 
  function loadByMarkup(selector) {
    (typeof selector == 'undefined') && (selector = document)
    $(selector).find('[data-toggle=shrinker]').each(function(e) {
      var $shrinker = $(this);
      Plugin.call($shrinker, $shrinker.data());
    })
  }
 
  $.fn.shrinker = Plugin
  $.shrinker = loadByMarkup
 
  loadByMarkup();
 
}(jQuery);
