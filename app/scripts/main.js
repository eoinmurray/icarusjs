/*global icarusjs, $*/

window.numeric = {}
numeric.linspace = function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}

window.loadingClass = {}

_.extend(loadingClass, Backbone.Events)

loadingClass.isDone = false

loadingClass.x = 0

loadingClass.tick = function(x){
    loadingClass.x += 0.25
    NProgress.set(loadingClass.x)
    if(loadingClass.x >= 1.){
        NProgress.done()
    }
}

loadingClass.done = function(){
    NProgress.set(1.0)
    NProgress.done()
    loadingClass.isDone = true
}


window.icarusjs = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        icarusjs.model = new icarusjs.Models.IcarusModel();

        icarusjs.view = new icarusjs.Views.IcarusView({
            model : icarusjs.model
        })

        icarusjs.datGuiView = new icarusjs.Views.DatGuiView({
            model : icarusjs.model
        })

        icarusjs.histogramView = new icarusjs.Views.HistogramView({
            IcarusView : icarusjs.view,
            model : icarusjs.model,
            el : '.container'
        })
    }
};

$(document).ready(function () {
    'use strict';


    $('.headline-center').delay(500).animate({ opacity: 1 }, 700)
    $('.documentation').delay(500).animate({ opacity: 1 }, 700)


    if ( Detector.webgl ){
        icarusjs.init();
    }

    function start(){
        $('.headline-container').fadeOut('fast')
        icarusjs.view.start()
    }

    $('.start').click(function(e){
        start()
    })

    if ( ! Detector.webgl ){
        $('.start').addClass('disabled').hide()
        $('.error').removeClass('hide')
    }



});
