var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
      if(frontendData.imageLazyLoad) {
        $(container).find('img').addClass("lazyload");
      }  
      if($(container).find('.owl-carousel').length > 0) { 
        $(container).find('.owl-carousel').each(function(){
          if(!$(this).hasClass('blog-instagrams')) {
            carouselSlider($(this));
          }
        });  
      }
      if($(container).find('.block-instafeed').length > 0) {
        $(container).find('.block-instafeed').each(function(){
          instagram($(this));
        });  
      } 
      floatElement();
      productReview();
      if($(container).find('.masonry-grid').length > 0) {
        var _masonry = $(container).find('.masonry-grid'); 
        _masonry.css('opacity', 0);
        _masonry.imagesLoaded(function(){
          _masonry.packery({
            itemSelector: ".masonry-grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: true
          });
        }); 
        setTimeout(function(){
          _masonry.animate({
            opacity: 1
          }, 200);
        }, 1000); 
      } 
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },
  
  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/* ================ SECTION ================ */

window.theme = window.theme || {};
window.theme = window.theme || {};
theme.Mainblock = (function () {
  this.$container = null;
  function mainblock(el) {
    this.$container = $(el); 
    if (this.$container.find('.slideshow.owl-carousel').length > 0) {
      var data_carousel = this.$container.find('.slideshow.owl-carousel').parent().find('.data-slideshow');
      if (data_carousel.data('auto')) {
        var autoplay = true;
        var autoplayTime = data_carousel.data('auto');
      }
      else {
        var autoplay = false;
        var autoplayTime = 5000;
      }
      if (data_carousel.data('transition') == 'fade' && data_carousel.data('transition') != '') {
        var transition = 'fadeOut';
      }
      else {
        var transition = false;
      }
      var slideContainer = this.$container.find('.slideshow.owl-carousel');
	  var navcus = $('.home-slider-nav .list');
      if(navcus.length > 0){
        var loop = false;
      }else{
        var loop = slideContainer.children().length > 1 ? true:false;
      }
      slideContainer.owlCarousel({
        items: 1,
        smartSpeed: 500,
        autoplay: autoplay,
        lazyLoad: true,
        loop: loop,
        autoplayTimeout: autoplayTime,
        autoplayHoverPause: true,
        animateOut: transition,
        dots: data_carousel.data('paging'),
        nav: data_carousel.data('nav'),
        navText: [data_carousel.data('prev'), data_carousel.data('next')],
        thumbs: true,
        thumbImage: false,
        thumbsPrerendered: true,
        thumbContainerClass: 'owl-thumbs',
        thumbItemClass: 'owl-thumb-item',
        onTranslated: function() {
          $('.owl-item.active').find('video').each(function() {
            this.play();
          });
        },
        onTranslate: function() {
          $('.owl-item').find('video').each(function() {
            this.pause();
          });
        }
      });
      if(navcus.length > 0) {
        navcus.on('click', 'li', function(e) {
          var i = $(this).index();
          slideContainer.trigger('to.owl.carousel', i);
        });
        slideContainer.on('changed.owl.carousel', function(e) {
          var i = e.item.index;
          navcus.find('.active').removeClass('active');
          navcus.find('li').eq(i).addClass('active');
        });
        navcus.find('li').eq(0).addClass('active');
      }
    } 
    if (this.$container.find('.slideshow.owl-carousel').parents('.full-screen-slider').length > 0) { 
      $('.full-screen-slider div.item').css({
        width: $(window).innerWidth(),
        height: $(window).innerHeight()
      });   
      $(window).resize(function(){ 
        $('.full-screen-slider div.item').css({
          width: $(window).innerWidth(),
          height: $(window).innerHeight()
        });   
      });
    }
    if (this.$container.find('.tab-product-collection').length > 0) { 
      var process = false, 
          $this = $(el),
          $inner = $this.find('.porto-tab-content'),
          cache = [];     
      cache[0] = $inner.html(); 
      $this.find('.products-tabs-title li').on('click', function(e) {

        e.preventDefault();
        var $this = $(this),
            atts = $this.data('atts'),
            index = $this.index();
        if( process || $this.hasClass('active-tab-title') ) return; process = true;
        loadTab(atts, index, $inner, $this, cache,  function(data) {
          if( data ) {
            $inner.html(data);   
            colorSwatchGrid();  
            productReview(); 
            SW.collection.checkWishlist();
            SW.collection.checkCompare();
            countDownInit();
            $('.product.product-col').find('.lazyloading').each(function() {
              lazySizes.loader.unveil(this);
            });
            if($inner.find('.owl-carousel').length > 0){
              carouselSlider($inner.find('.owl-carousel'));
            }
          }
        }); 
      }); 
      var loadTab = function(atts, index, holder, btn, cache, callback) {
        btn.parent().find('.active-tab-title').removeClass('active-tab-title');
        btn.addClass('active-tab-title'); 
        if( cache[index] ) {
          holder.addClass('loading');
          setTimeout(function() {
            callback(cache[index]);
            holder.removeClass('loading');
            process = false;
          }, 300);
          return;
        }
        holder.addClass('loading').parent().addClass('element-loading');
        btn.addClass('loading');
        $.ajax({
          url: atts, 
          dataType: 'html',
          method: 'GET',
          beforeSend: function() {
            $("#resultLoading").show();
          },
          success: function(data) {
            cache[index] = data;
            callback( data );
          },
          error: function(data) {
            console.log('ajax error');
          },
          complete: function() {
            holder.removeClass('loading').parent().removeClass('element-loading');
            btn.removeClass('loading');
            $("#resultLoading").hide();
            process = false; 
          },
        });
      };
    }
  }
  return mainblock;
}()); 
theme.mainblocks = {};
theme.MainblockSection = (function () {
  function MainblockSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var mainblock = this.mainblock = '#main-block-' + sectionId;
    theme.mainblocks[mainblock] = new theme.Mainblock(mainblock);
  }

  return MainblockSection;
}());
theme.MainblockSection.prototype = _.assignIn({}, theme.MainblockSection.prototype, {
  onUnload: function() {
    delete theme.mainblocks[this.mainblock];
  },
});

theme.Product = (function () {
  this.$container = null;
  function init(el) {
    this.$container = $(el); 
    if (this.$container.find('.owl-carousel').length > 0) {
      this.$container.find('.owl-carousel').each(function () {
        carouselSlider($(this));
      });
    }  
    countDownInit();
    productReview();
    SW.productMediaManager.init();
    SW.verticleScroll.init(); 
  }
  
  return init;
}());  
theme.product = {};
theme.ProductSection = (function () {
  function ProductSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var product = this.product = '#product-section-'+sectionId;
    theme.product[product] = new theme.Product(product);
  }

  return ProductSection;
}());
theme.ProductSection.prototype = _.assignIn({}, theme.ProductSection.prototype, {
  onUnload: function() {
    delete theme.product[this.product];
  },
});  

theme.BannerMasonryGrid = (function () {
  this.$container = null;
  function masonryInit(el) {
    this.$container = $(el);
    var $container = this.$container.find('.banner-masonry-grid');

    $container.css('opacity', 0);
    if ($container.length > 0) {
      $container.imagesLoaded(function(){
        $container.packery({
          itemSelector: ".masonry-grid-item",
          columnWidth: ".grid-sizer",
          percentPosition: true
        });
      });

      setTimeout(function(){
        $container.animate({
          opacity: 1
        }, 200);
      }, 500);
    }
  }

  return masonryInit;
}());  
theme.bannermasonry = {};
theme.BannerMasonrySection = (function () {
  function BannerMasonrySection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var bannermasonry = this.bannermasonry = '#banner-masonry-'+sectionId;
    theme.bannermasonry[bannermasonry] = new theme.BannerMasonryGrid(bannermasonry);
  }

  return BannerMasonrySection;
}());
theme.BannerMasonrySection.prototype = _.assignIn({}, theme.BannerMasonrySection.prototype, {
  onUnload: function() {
    delete theme.bannermasonry[this.bannermasonry];
  },
});   
theme.ProductsBannerSlider = (function () {
  this.$container = null;

  function productsbanner(el) {
    this.$container = $(el);
    $(el + " .half-image").css("min-height",$(el + " .half-content").outerHeight()+"px");

    setTimeout(function(){
      $(el + " .half-image").css("min-height",$(el + " .half-content").outerHeight()+"px");
    }, 5000);

    $(window).resize(function(){
      setTimeout(function(){
        $(el + " .half-image").css("min-height",$(el + " .half-content").outerHeight()+"px");
      }, 500);
    }); 
  }

  return productsbanner;
}()); 
theme.productsbanner = {};
theme.ProductBannerSection = (function () {
  function ProductBannerSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var productsbanner = this.productsbanner = '#products-banner-'+sectionId;
    theme.productsbanner[productsbanner] = new theme.ProductsBannerSlider(productsbanner);
  }

  return ProductBannerSection;
}());
theme.ProductBannerSection.prototype = _.assignIn({}, theme.ProductBannerSection.prototype, {
  onUnload: function() {
    delete theme.productsbanner[this.productsbanner];
  },
}); 
theme.OnePageCollection = (function () {
  this.$container = null;
  function onepage(el) {
    this.$container = $(el);

    if (this.$container.find('.owl-carousel').length > 0) {
      this.$container.find('.owl-carousel').each(function () {
        carouselSlider($(this));
      });
    }

    onpageAction();
    productReview();
    countDownInit();
    qtyInit();
  }

  function onpageAction() {
    $('.category-detail > .title-menu > a.parent').off('click').on('click', function (e) {
      if ($(this).hasClass('opened')) {
        $(this).parent().children('.menu-popup').fadeOut(200);
        $(this).removeClass('opened');
      }
      else {
        $(this).addClass('opened');
        $(this).parent().children('.menu-popup').fadeIn(200);
      }

      e.stopPropagation();
    });

    $('.category-detail > .title-menu > a.parent').parent().click(function (e) {
      e.stopPropagation();
    });

    $('html,body').click(function(){
      $(".category-detail > .title-menu > a.parent").parent().children(".menu-popup").fadeOut(200);
      $(".category-detail > .title-menu > a.parent").removeClass("opened");
    });

    $('.onepage-category .category-list > ul > li > a').off('click').on('click', function () {
      link_id = $(this).attr('data-link');
      $('#link_' + link_id).scrollToMe();
      var cur_item = $(this);

      setTimeout(function(){
        $(".onepage-category .category-list > ul > li > a").removeClass("active");
        $(cur_item).addClass("active");
      }, 500);
    });

    $(window).scroll(function () {
      $('.onepage-category .category-list > ul > li > a').each(function () {
        if ($('#link_' + $(this).attr('data-link')).offset() && ($(window).scrollTop() >= $('#link_' + $(this).attr('data-link')).offset().top - $(window).innerHeight() / 2) && ($(window).scrollTop() <= $('#link_' + $(this).attr('data-link')).offset().top + $('#link_' + $(this).attr('data-link')).height() - $(window).innerHeight() / 2)) {
          $(this).addClass('active');
          $('.onepage-category .category-list > ul > li > a:not([data-link=' + $(this).attr('data-link') + '])').removeClass('active');
        }
      });

      if ($('.onepage-category .category-list > ul').outerHeight() < $(this).innerHeight()) {
        $('.onepage-category .category-list > ul').removeClass('fixed-bottom');

        if ($(this).scrollTop() >= $('.onepage-category .category-list').offset().top - 24) {
          $('.onepage-category .category-list > ul').addClass('fixed-top');
        }
        else {
          $('.onepage-category .category-list > ul').removeClass('fixed-top');
        }
      }
      else {
        $('.onepage-category .category-list > ul').removeClass('fixed-top');
        if ($(this).scrollTop() >= $('.onepage-category .category-list').offset().top + $('.onepage-category .category-list > ul').outerHeight() + 46 - $(this).innerHeight()) {
          $('.onepage-category .category-list > ul').addClass('fixed-bottom');
        }
        else {
          $('.onepage-category .category-list > ul').removeClass('fixed-bottom');
        }
      }

      if (($('.onepage-category .category-list > ul').hasClass('fixed-bottom') && ($(this).scrollTop() + $(window).innerHeight() >= $('.footer-wrapper').offset().top)) || ($('.onepage-category .category-list > ul').hasClass('fixed-top') && ($(this).scrollTop() + $(window).innerHeight() >= $('.footer-wrapper').offset().top) && ($('.onepage-category .category-list > ul').offset().top + $('.onepage-category .category-list > ul').outerHeight() >= $('.footer-wrapper').offset().top) && ($(this).scrollTop() + $('.onepage-category .category-list > ul').outerHeight() + 70 >= $('.footer-wrapper').offset().top))) {
        $('.onepage-category .category-list > ul').addClass('absolute-bottom');
      }
      else {
        $('.onepage-category .category-list > ul').removeClass('absolute-bottom');
      }
    });
  }

  return onepage;
}()); 
theme.onepagecollections = {};
theme.OnePageSection = (function () {
  function OnePageSection(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var onepage = this.onepage = '#onepage-section-'+sectionId;
    theme.onepagecollections[onepage] = new theme.OnePageCollection(onepage);
  }

  return OnePageSection;
}());
theme.OnePageSection.prototype = _.assignIn({}, theme.OnePageSection.prototype, {
  onUnload: function() {
    delete theme.onepagecollections[this.onepage];
  },
});

function instagram(el) { 
  var instagram = $(el).find('.blog-instagrams').css('opacity', 0);
  if (instagram.length > 0) {
    var userID = instagram.data('userid'),
        token = instagram.data('token'),
        type = instagram.data('type'),
        count = instagram.data('count'),
        url = '//graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=' + token,
        desktop_large = instagram.data('desktop-large'),
        desktop = instagram.data('desktop'),
        tablet = instagram.data('tablet'),
        mobile = instagram.data('mobile'),
        nav = instagram.data('nav'),
        page = instagram.data('page'),
        margin = instagram.data('margin');
    
    if (instagram.data('autoplay')) {
      var autoplay = true;
      var autoplayTime = instagram.data('autoplay');
    } else {
      var autoplay = false;
      var autoplayTime = 5000;
    } 
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      cache: false,
      url: url,
      success: function(data) {
        for (var i = 0; i < count; i++) {
          if (data.data[i]) {  
            if(data.data[i].media_type == 'IMAGE') {
              if (frontendData.imageLazyLoad) {
                instagram.append("<div class='item insta-item' data-date='"+data.data[i].timestamp+"' data-sortid='"+i*2+"'><a target='_blank' href='" + data.data[i].permalink +"'><span class='content'><i class='icon-instagram'></i></span><img class='instagram-image lazyload' data-src='" + data.data[i].media_url +"' /></a></div>");
              }
              else {
                instagram.append("<div class='item insta-item' data-date='"+data.data[i].timestamp+"' data-sortid='"+i*2+"'><a target='_blank' href='" + data.data[i].permalink +"'><span class='content'><i class='icon-instagram'></i></span><img class='instagram-image' src='" + data.data[i].media_url +"' /></a></div>");
              }
            }
          }
        } 
        instagram.imagesLoaded().animate({
          'opacity' : 1
        }, 500); 
        if(type != 2){
          instagram.imagesLoaded(function(){
            instagram.owlCarousel({ 
              loop: true,
              margin: margin,
              responsiveClass: true,
              nav: nav,
              autoplay: autoplay,
              autoplayTimeout: autoplayTime,
              dots: page,
              lazyLoad: true, 
              responsive:{
                0:{
                  items:mobile 
                },
                600:{
                  items:tablet 
                },
                1000:{
                  items:desktop 
                },
                1400:{
                  items:desktop_large 
                }
              }
            });
          });
        }
      },
    });
  } 
}
function floatElement(){ 
  if($("[data-plugin-float-element]:not(.manual)").length == 0) return;
  $("[data-plugin-float-element]:not(.manual)").each(function() {
    var options = $(this).data("plugin-options");
    if (options && "string" == typeof options)
      try {
        options = JSON.parse(options.replace(/'/g, '"').replace(";", ""))
      } catch (options) {}
    $(this).themePluginFloatElement(options)
  })
}
function carouselSlider(el) {
  var carousel = el;
  var data_carousel = carousel.parent().find('.data-carousel');

  if (data_carousel.data('auto')) {
    var autoplay = true;
    var autoplayTime = data_carousel.data('auto');
  } else {
    var autoplay = false;
    var autoplayTime = 5000;
  } 
  if(data_carousel.data('stage')){
    var stagePadding = data_carousel.data('stage');
  }else{
    var stagePadding = '0';
  }
  var center = data_carousel.data('center') ? true : false;  

  var item_1200 = data_carousel.data('1200') ? data_carousel.data('1200') : 1;
  var item_992 = data_carousel.data('992') ? item_1200 <= data_carousel.data('992') ? item_1200 : data_carousel.data('992') : item_1200;
  var item_768 = data_carousel.data('768') ? item_1200 <= data_carousel.data('768') ? item_1200 : data_carousel.data('768') : item_992;
  var item_640 = data_carousel.data('640') ? item_1200 <= data_carousel.data('640') ? item_1200 : data_carousel.data('640') : item_768;
  var item_480 = data_carousel.data('480') ? item_1200 <= data_carousel.data('480') ? item_1200 : data_carousel.data('480') : item_640;
  var item_320 = data_carousel.data('320') ? item_1200 <= data_carousel.data('320') ? item_1200 : data_carousel.data('320') : item_480;
  var loop = carousel.children().length > data_carousel.data('items');

  carousel.owlCarousel({
    items: data_carousel.data('items'),
    smartSpeed: 500,
    autoplay: autoplay,
    loop: loop,
    lazyLoad: true,
    center: center,
    stagePadding: stagePadding,
    autoplayTimeout: autoplayTime,
    autoplayHoverPause: true,
    dots: data_carousel.data('paging'),
    margin: data_carousel.data('margin'),
    nav: carousel.children().length > data_carousel.data('items') ? data_carousel.data('nav'):false,
    navText: [data_carousel.data('prev'), data_carousel.data('next')],
    responsive: {
      0: {
        items: item_320,
      },
      480: {
        items: item_480,
      },
      640: {
        items: item_640,
      },
      768: {
        items: item_768,
      },
      992: {
        items: item_992,
      },
      1200: {
        items: item_1200,
      },
    },
    onInitialized: function() {
      $('.owl-item').find('.lazyloading').each(function() {
        lazySizes.loader.unveil(this);
      });
    }
  });

  var $thumbsOwl = carousel.owlCarousel();
  carousel.on('mouseenter', '.owl-item', function (e) {
    var i = $(this).index();
    carousel.find('.item img').removeClass('current');
    carousel.find('.item img').eq(i).addClass('current');
  });
  carousel.find('.active .item img').eq(0).addClass('current');
} 
function colorSwatchGrid() {
  $('.configurable-swatch-list li a').on('mouseenter', function (e) {
    e.preventDefault();
    var productImage = $(this).parents('.item-area').find('.product-image-area').find('.product-image');
    productImage.find('img.main').attr('src', $(this).data('image'));
  });
  $('.filter-item-list li a').on('mouseenter', function (e) {
    e.preventDefault();
    var productImage = $(this).parents('.product-inner').find('.product-image');
    productImage.find('img.main').attr('src', $(this).data('image'));
  });
}
function productReview() {
  if ($('.spr-badge').length > 0) {
    SPR.registerCallbacks();
    SPR.initRatingHandler();
    SPR.initDomEls();
    SPR.loadProducts();
    SPR.loadBadges();
  }
}
function qtyInit() {
  $('.qtyplus').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get its current value
    var currentVal = parseInt($(this).parents('form').find('input[name="quantity"]').val());
    // If is not undefined
    if (!isNaN(currentVal)) {
      // Increment
      $(this).parents('form').find('input[name="quantity"]').val(currentVal + 1);
    }
    else {
      // Otherwise put a 0 there
      $(this).parents('form').find('input[name="quantity"]').val(0);
    }
  });

  // This button will decrement the value till 0
  $('.qtyminus').click(function (e) {
    // Stop acting like a button
    e.preventDefault();
    // Get the field name
    fieldName = $(this).attr('field');
    // Get its current value
    var currentVal = parseInt($(this).parents('form').find('input[name="quantity"]').val());
    // If it isn't undefined or its greater than 0
    if (!isNaN(currentVal) && currentVal > 0) {
      // Decrement one
      $(this).parents('form').find('input[name="quantity"]').val(currentVal - 1);
    }
    else {
      // Otherwise put a 0 there
      $(this).parents('form').find('input[name="quantity"]').val(0);
    }
  });
}
function countDownInit() {
  if ($('.product-date').length > 0) {
    $('.product-date').each(function(i,item){
      var date = $(item).attr('data-date');
      var countdown = {
        "yearText": window.date_text.year_text,
        "monthText": window.date_text.month_text,
        "weekText": window.date_text.week_text,
        "dayText": window.date_text.day_text,
        "hourText": window.date_text.hour_text,
        "minText": window.date_text.min_text,
        "secText": window.date_text.sec_text,
        "yearSingularText": window.date_text.year_singular_text,
        "monthSingularText": window.date_text.month_singular_text,
        "weekSingularText": window.date_text.week_singular_text,
        "daySingularText": window.date_text.day_singular_text,
        "hourSingularText": window.date_text.hour_singular_text,
        "minSingularText": window.date_text.min_singular_text,
        "secSingularText": window.date_text.sec_singular_text
      };
      var template;
      if($(item).parents().is(".product-essential")) {
        template = '<div class="day"><span class="no">%d</span><span class="text">%td</span></div><div class="hours"><span class="no">%h</span><span class="text">%th</span></div><div class="min"><span class="no">%i</span><span class="text">%ti</span></div><div class="second"><span class="no">%s</span><span class="text">%ts</span></div>';
      }
      else {
        template = '<span class="offer-endtext">Sale Ends In: </span><span>%d days, %h : %i : %s</span>';
      }
      if(date) {
        var config = {date: date};
        $.extend(config, countdown);
        if(template) {
          config.template = template;
        }
        $(item).countdown(config);
      }
    });
  }
}
function isEmpty(el) {
  return !$.trim(el.html());
}
function checkItemCompareExist() {
  if ($('#compareTableList table > tbody > tr:first-child > td').length > 1) {
    return true;
  }
  return false;
}
function setQuantityDown(event) {
  var result = $(event.target).parents('.input-box').find('.quantity-selector');
  var qty = parseInt(result.val());
  if (qty > 1) {result.val(--qty);}
  return false;
}
function setQuantityUp(event) {
  var result = $(event.target).parents('.input-box').find('.quantity-selector');
  var qty = parseInt(result.val());
  result.val(++qty);
  return false;
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function removeWishlist (event){
  var currentHandle = $(event.target).data('productHandle');
  var handles = getCookie("wishlistItems");
  var productHandle = $('.link-wishlist').data('productHandle'); 
  var handlesAfterRemove = []; 
  if (handles != "") {
    var wishlistArr = JSON.parse(handles); 
    $.each( wishlistArr, function( key, value ) {
      if(value != currentHandle){
        handlesAfterRemove.push(value);
      }
    });
    var json_str = JSON.stringify(handlesAfterRemove);
    setCookie("wishlistItems", json_str);
    var wishlistCount = handlesAfterRemove.length;
    if(wishlistCount > 0){
      $('#wishlistCount').html('(' + wishlistCount + ')');
      $('.wishlistCount').html('(' + wishlistCount + ')');
      $('.header-wishlist-count-badge').html(wishlistCount).show();
    } else {
      $('#wishlistCount').html('(0)');
      $('.wishlistCount').html('(0)');
      $('.header-wishlist-count-badge').hide();
    }
    $(event.target).parents('tr').remove();
    var alertTemplate = '<div class="message alert alert-success">'+ $(event.target).data("productTitle") +' '+wishlistData.remove+'</div>';
    $( "#wishlistAlert").html(alertTemplate);

    if(currentHandle == productHandle){
      $('.link-wishlist').removeClass('active');
    } 
    $(".category-products .link-wishlist").each(function() {
      var checkHandle = $(this).data("productHandle");
      if(checkHandle == currentHandle){
        $(this).removeClass('active');
      }
    });

    if (isEmpty($('#wishlistTableList tbody'))) {
      setCookie('wishlistItems', '');
      var alertTemplate = '<p class="alert alert-warning"><span class="brackets">'+wishlistData.no_item+'</span></p>';
      $( "#wishlistAlert").append(alertTemplate); 
      $('#wishlistTableList .cart-table').hide();
    }
  }

}
function removeCompare (event){ 
  var currentHandle = $(event.target).parents('.product-image').find('.btn-delete-compare').data('productHandle');
  var handles = getCookie("compareItems");
  var productHandle = $('.link-compare').data('productHandle');
  var handlesAfterRemove = []; 
  if (handles != "") {
    var compareArr = JSON.parse(handles);

    $.each( compareArr, function( key, value ) {
      if(value != currentHandle){
        handlesAfterRemove.push(value);
      }
    });
    var json_str = JSON.stringify(handlesAfterRemove);
    setCookie("compareItems", json_str);
    var compareCount = handlesAfterRemove.length;
    if(compareCount > 0){
      $('#compareCount').html('(' + compareCount + ')');
      $('#header-compare .compareCount').html('('+compareCount+')');
    } else {
      $('#compareCount').html('');
      $('#header-compare .compareCount').html('');
    }

    var classRemove = $(event.target).parents('td').attr("class");
    $("#compareTableList").find('.'+classRemove).remove();
    var alertTemplate = '<div class="message alert alert-success">'+ $(event.target).parents(".product-image").find(".btn-delete-compare").data("productTitle") +' '+compareData.remove+'</div>';
    $( "#compareAlert").html(alertTemplate);

    if(currentHandle == productHandle){
      $('.link-compare').removeClass('active');
    } 
    $(".category-products .link-compare").each(function() {
      var checkHandle = $(this).data("productHandle");
      if(checkHandle == currentHandle){
        $(this).removeClass('active');
      }
    });

    if (!checkItemCompareExist()) {
      $('#compareTableList').hide();
      setCookie('compareItems', '');
      var alertTemplate = '<p class="alert alert-warning"><span class="brackets">'+compareData.no_item+'</span></p>';
      $( "#compareAlert").append(alertTemplate);
    }
  }

}


var SW = SW || {};
(function ($) {
  var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
  var $window = $(window);
  var body = $("body");
  var deviceAgent = navigator.userAgent.toLowerCase();
  var isMobileAlt = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/);
  var imageZoomThreshold = 20;
  var loading = false;
  var noMoreProducts = false;
  var infiniteMode = $('.infinite-loader').data('mode');

  SW.megamenu = {
    init: function() {
      var item = $('.top-navigation li.level0.parent');
      item.each(function(){
        if($(this).find('li.active').length > 0 ) {
          $(this).addClass('active');
        }
      });

      $('.main-navigation').find("li.m-dropdown .menu-wrap-sub ul > li.parent").mouseover(function() {
        var popup = $(this).children(".menu-wrap-sub");
        var w_width = $(window).innerWidth();

        if(popup) {
          var pos = $(this).offset();
          var c_width = $(popup).outerWidth();
          if(w_width <= pos.left + $(this).outerWidth() + c_width) {
            $(popup).css("left", "auto");
            $(popup).css("right", "100%");
            $(popup).css("border-radius", "6px 0 6px 6px");
          }
          else {
            $(popup).css("left", "100%");
            $(popup).css("right", "auto");
            $(popup).css("border-radius", "0 6px 6px 6px");
          }
        }
      });

      $('.main-navigation').find("li.static-dropdown.parent,li.m-dropdown.parent").mouseover(function() {
        var popup = $(this).children(".menu-wrap-sub");
        var w_width = $(window).innerWidth();
        if(popup) {
          var pos = $(this).offset();
          var c_width = $(popup).outerWidth();
          if(w_width <= pos.left + c_width) {
            $(popup).css("left", "auto");
            $(popup).css("right", "0");
            $(popup).css("border-radius", "6px 0 6px 6px");
          }
          else {
            $(popup).css("left", "0");
            $(popup).css("right", "auto");
            $(popup).css("border-radius", "0 6px 6px 6px");
          }
        }
      });
    },
  };

  SW.page = {
    init: function() {
      if($('.collection-main-banner').find('.move-below-header').length > 0) {
        var banner = $('.collection-main-banner');
        var banner_clone = $('.collection-main-banner').first().clone();
        banner_clone.appendTo('.top-container .category-banner');
        banner.remove();
      }

      if($('body').find('#resultLoading').attr('id') != 'resultLoading') {
        $('body').append('<div id="resultLoading" style="display:none"><div class="spinner"></div></div>');
      }

      if($('#popup_newsletter').length > 0) {
        var newsletter = $('#popup_newsletter');
        SW.page.newsletterPopupInit(newsletter);
      }

      SW.page.headerInit();
      SW.page.setVisualState();

      $('.smart_input').on('change', function() {
        'use strict';
        SW.page.setVisualState();
      }); 
	  floatElement();
      if($('.carousel-init.owl-carousel').length > 0) {
        var carousel = $('.carousel-init.owl-carousel');
        carousel.each(function(){
          carouselSlider($(this));
        });
      }
      if($('.block-instafeed').length > 0) {
        var instar = $('.block-instafeed');
        instar.each(function(){
          instagram($(this));
        });
      }
	  if($('.masonry-init.masonry-grid').length > 0) {
        var _masonry = $('.masonry-init.masonry-grid');
        _masonry.each(function(){
          var m_item = $(this); 
          m_item.css('opacity', 0);
          m_item.imagesLoaded(function(){
            m_item.packery({
              itemSelector: ".masonry-grid-item",
              columnWidth: ".grid-sizer",
              percentPosition: true
            });
          }); 
          setTimeout(function(){
            m_item.animate({
              opacity: 1
            }, 200);
          }, 1000);
        });
      } 
      $(".checkout-info .shipping a").click(function() {
        if ($(this).hasClass('collapsed')) {
          $(this).parent().removeClass('closed');
        }
        else {
          $(this).parent().addClass('closed');
        }
      });
      $( ".porto_products_filter_form" ).submit(function( event ) { 
        event.preventDefault(); 
        var $form = $( this )
        	$data = '?constraint=',
            $i = 0,
            price = $form.find( "select[name='price']" ).val(),
            color = $form.find( "select[name='color']" ).val(),
            size = $form.find( "select[name='size']" ).val(),
            url = $form.attr( "action" ); 
        if(price){
          $i = $i+1;
          $data += $i>1?'+'+price:price; 
        }
        if(color){ 
          $i = $i+1;
          $data += $i>1?'+'+color:color;
        }
        if(size){ 
          $i = $i+1;
          $data += $i>1?'+'+size:size;
        }
        var new_url = url+$data;
        return window.location.href=new_url;
      });
      SW.page.wordRotateInit();
      SW.page.simpleDropdown();
      SW.page.ajaxSearch();
    },
    headerInit: function() {
      $(".search-area a.search-icon").click(function (e) {
        $(".top-links-icon").parent().children().children("ul.links").removeClass("d-block");
        if ($('.search-extended').is('.show')) {
          $('.search-extended').removeClass('d-block');
        }
        else {
          $('.search-extended').addClass('d-block');
        }

        e.stopPropagation();
      });

      $(".top-links-icon").click(function(e) {
        $(".search-area a.search-icon").parent().children(".search-extended").removeClass("d-block");
        if($(this).parent().children().children("ul.links").hasClass("d-block")) {
          $(this).parent().children().children("ul.links").removeClass("d-block");
        }
        else {
          $(this).parent().children().children("ul.links").addClass("d-block");
        }

        e.stopPropagation();
      });

      $(".search-area a.search-icon").parent().click(function(e) {
        e.stopPropagation();
      });

      $(".mini-cart").hover(function() {
        $(this).children().children('.cart-wrapper').fadeIn(200);
      }, function() {
        $(this).children().children('.cart-wrapper').fadeOut(200);
      });

      $("html,body").click(function() {
        $(".top-links-icon").parent().children().children("ul.links").removeClass("d-block");
        $(".search-area a.search-icon").parent().children(".search-extended").removeClass("d-block");
      });

      $('.menu-icon, .mobile-nav-overlay, .close-sidebar-menu').click(function(event) {
        if(!$('body').hasClass('md-mobile-menu') && ($(".header-container").hasClass('type11') || $(".header-container").hasClass('type13') || $(".header-container").hasClass('type7'))) {
          $('body').addClass('md-mobile-menu');
        }

        if(!$('body').hasClass('mobile-nav-shown')) {
          $('body').addClass('mobile-nav-shown', function() {
            setTimeout(function() {
              $(document).one("click",function(e) {
                var target = e.target;
                if (!$(target).is('.mobile-nav') && !$(target).parents().is('.mobile-nav')) {
                  $('body').removeClass('mobile-nav-shown');
                }
              });
            }, 111);
          });
        }
        else {
          $('body').removeClass('mobile-nav-shown');
          $(".mobile-nav").removeClass("d-block");
        }
      });

      $(".header-container .toggle-menu .menu-container>a").click(function() { 
        if ($(this).next().find('.main-navigation').hasClass("show")) {
          $(this).next().find('.main-navigation').removeClass("show");
          $(this).parents('.toggle-menu').removeClass('open');
        }
        else {
          $(this).next().find('.main-navigation').addClass("show");
          $(this).parents('.toggle-menu').addClass('open');
        } 

        if($(window).width()<=991) {
          if ($(".mobile-nav").hasClass("d-block")) {
            $(".mobile-nav").removeClass("d-block");
            $(".mobile-nav").slideUp();
            $('body').removeClass('mobile-nav-shown');
          }
          else {
            $(".mobile-nav").addClass("d-block");
            $(".mobile-nav").slideDown();
            $('body').addClass('mobile-nav-shown', function() {
              setTimeout(function() {
                $(document).one("click",function(e) {
                  var target = e.target;
                  if (!$(target).is('.mobile-nav') && !$(target).parents().is('.mobile-nav')) {
                    $('body').removeClass('mobile-nav-shown');
                  }
                });
              }, 111);
            });
          }
        }
      });
    },
    simpleDropdown: function() {
      $('.input-dropdown-inner').each(function() {
        var dd = $(this);
        var btn = dd.find('> a');
        var input = dd.find('> input');
        var list = dd.find('> .list-wrapper');
        inputPadding();

        $(document).click(function(e) {
          var target = e.target;
          if (dd.hasClass('dd-shown') && !$(target).is('.input-dropdown-inner') && !$(target).parents().is('.input-dropdown-inner')) {
            hideList();
            return false;
          }
        });

        btn.on('click', function(e) {
          e.preventDefault();
          if (dd.hasClass('dd-shown')) {
            hideList();
          }
          else {
            showList();
          }
          return false;
        });

        list.on('click', 'a', function(e) {
          e.preventDefault();
          var value = $(this).data('val');
          var label = $(this).html();
          list.find('.current-item').removeClass('current-item');
          $(this).parent().addClass('current-item');

          if (value != 0) {
            list.find('ul:not(.children) > li:first-child').show();
          }
          else if (value == 0) {
            list.find('ul:not(.children) > li:first-child').hide();
          }

          btn.html(label);
          input.val(value);
          $(this).closest("form.has-categories-dropdown").attr("action", "/search/collections/" + value);
          hideList();
          inputPadding();
        });

        function showList() {
          dd.addClass('dd-shown');
          list.slideDown(100);
        }

        function hideList() {
          dd.removeClass('dd-shown');
          list.slideUp(100);
        }

        function inputPadding() {
          var paddingValue = dd.innerWidth() + dd.parent().siblings('.searchsubmit').innerWidth() + 17,
              padding = 'padding-right';
          if($('body').hasClass('rtl')) {
            padding = 'padding-left';
          }
          dd.parent().parent().find( '.s' ).css( padding, paddingValue );
        }
      });
    },
    ajaxSearch: function() {
      if(!frontendData.ajax_search) {
        return false;
      }

      var form = $('form.searchform');
      var request = null;
      form.each(function() {
        var $this = $(this),
            $results = $this.parent().find('.autocomplete-suggestions'),
            input = $this.find('input[name="q"]');

        $(this).find('input[name="q"]').attr("autocomplete", "off").bind("keyup change", function() {
          var key = $(this).val();
          if (key.trim() == '') {
            $results.hide();
          }
          else {
            if(!frontendData.search_by_collection) {
              var url = "/search?type=product&q=" + key;
            }
            else {
              var val = input.val(), 
                product_cat = $this.find('[name="product_cat"]').val();
              if(product_cat) {
                var url = "/search/collections/" + product_cat + "?type=product&q=" + val;
              }
              else {
                var url = "/search?type=product&q=" + val;
              }
            }
            if(frontendData.search)
              form.addClass("search-loading");
            if (request != null) request.abort();
            request = $.get(url + "&view=json", function(e) {
              $results.html(e); 
              setTimeout(function() {
                form.removeClass("search-loading");
              }, 300)
            });
            $results.show(500);
          }
        })
        $( 'body' ).click( function() {
          $results.hide(), form.removeClass("search-loading");
        });
        $( '.shopify-search-results' ).click( function( e ) {
          e.stopPropagation();
        });
      });
    },
    newsletterPopupInit: function(newsletter){
      $('#popup_newsletter .subcriper_label input').on('click', function(){
        if($(this).parent().find('input:checked').length){
          SW.collection.createCookie('newsletterSubscribe', 'true', 1);
        }
        else {
          SW.collection.readCookie('newsletterSubscribe');
        }
      });
      $('#popup_newsletter .input-box button.button').on('click', function(){
        var button = $(this);
        setTimeout(function(){
          if(!button.parent().find('input#popup-newsletter').hasClass('validation-failed')){
            SW.collection.createCookie('newsletterSubscribe', 'true', 1);
          }
        }, 500);
      });
      if (SW.collection.readCookie('newsletterSubscribe') == null) {
        setTimeout(function(){
          var mpInstance = $.magnificPopup.instance;
          if (mpInstance.isOpen) {
            mpInstance.close();
            setTimeout(function() {
              $.magnificPopup.open({
                items: {
                  src: $('#popup_newsletter'),
                  type: 'inline'
                },
                removalDelay: 350,
                mainClass: 'mfp-smooth-fade',
                midClick: true,
                fixedBgPos: true
              });
            },360);
          }
          else {
            $.magnificPopup.open({
              items: {
                src: $('#popup_newsletter'),
                type: 'inline'
              },
              removalDelay: 350,
              mainClass: 'mfp-smooth-fade',
              midClick: true,
              fixedBgPos: true
            });
          }
        }, newsletterData.delay);
      }
    },  
    setVisualState: function() {
      'use strict';
      $('.smart_input').each(function() {
        'use strict';
        var $value = $(this).val();
        if ($(this).is(':checked')) {
          $(this).next().addClass("checked");
        }
        else {
          $(this).next().removeClass("checked");
        }
      });
    }, 
    wordRotateInit: function() {
      $(".word-rotate").each(function() {
        var $this = $(this),
            itemsWrapper = $(this).find(".word-rotate-items"),
            items = itemsWrapper.find("> span"),
            firstItem = items.eq(0),
            itemHeight = firstItem.height(),
            currentItem = 1,
            currentTop = 0,
            itemWidth = firstItem.width();

        $this
          .height(itemHeight)
          .addClass("active");
        setInterval(function() {
          currentTop = (currentItem * itemHeight);
          itemWidth = items.eq(currentItem).width();
          itemsWrapper.animate({
            top: -(currentTop) + "px",
            width: itemWidth
          }, 300, function() {
            currentItem++;
            if(currentItem == items.length) {
              itemsWrapper.css("top", 0);
              currentItem = 1;
            }
          });
        }, 2000);
      });
    },
  };
  SW.collection = {
    init: function() {
      var wishlistCount = 0;
      var compareCount = 0;
      var compareItemhandles = getCookie("compareItems");
      if (compareItemhandles != "") {
        var compareArr = JSON.parse(compareItemhandles);
        compareCount = compareArr.length;
        if(compareCount > 0) {
          $('#header-compare .compareCount').html('('+compareCount+')');
        }
      }

      /*Get number of wishlist*/
      var handles = getCookie("wishlistItems");
      if (handles != "") {
        var wishlistArr = JSON.parse(handles);
        wishlistCount = wishlistArr.length;
        if(wishlistCount > 0) {
          $('#header-wishlist .wishlistCount').html('('+wishlistCount+')');
          $('.header-wishlist-count-badge').html(wishlistCount).show();
        }
      }

      SW.collection.checkWishlist();
      SW.collection.checkCompare(); 

      if($('.product-deal .product-date').length > 0) {
        var productsDeal = $('.product-date');
        productsDeal.each(function(){
          SW.collection.productDealInit($(this));
        });
      } 
 
      $(document).on("click", ".close-box", function(){
        $(this).parents('.box-popup').removeClass('d-block');
      }) 

      $(document).on("click", ".btn-remove-cart", function(e) {
        if(cartData.ajax_cart_use == false ) return;
        e.preventDefault();
        $(this).closest('li').find('.ajax-loading').show();
        SW.collection.removeCartInit($(this).data('id'));
      });

      $(document).on("click", ".filter-bar a", function(e) {
        e.preventDefault();
        if ($('.filter-option-group').is('.open')) {
          $('.filter-option-group').removeClass('open');
        }
        else {
          $('.filter-option-group').addClass('open');
        }
      });

      /*wishlist & compare*/
      $(document).on('click', '.link-wishlist',function (e) {
        e.preventDefault();
        $("#resultLoading").show();
        var productHandle = $(this).data('productHandle');

        Shopify.getProduct(productHandle, function(product) {
          var checkItemExist = false;
          var wishlistArr = [];
          var handles = getCookie("wishlistItems");

          if (handles != "") {
            var wishlistArr = JSON.parse(handles);
            wishlistCount = wishlistArr.length;
            $.each( wishlistArr, function( key, value ) {
              if(value == product.handle){
                checkItemExist = true;
                return false;
              }
            });
          }
          else {
            var wishlistArr = [product.handle];
            var json_str = JSON.stringify(wishlistArr);
            setCookie("wishlistItems", json_str);
            wishlistCount = 1;
          }

          if(checkItemExist) {
            if (isEmpty($('#wishlistTableList tbody'))) {
              SW.collection.genarate(wishlistArr);
              $('#wishlistCount').html('(' + wishlistCount + ')');
            }
            var alertTemplate = '<div class="message alert alert-warning">'+ product.title +' '+wishlistData.item_exist+'</div>';
            $( "#wishlistAlert").html(alertTemplate);
          }
          else {
            if (handles != "") {
              wishlistArr.push(product.handle);
              var json_str = JSON.stringify(wishlistArr);
              setCookie("wishlistItems", json_str);
              wishlistCount = wishlistArr.length;
              if (isEmpty($('#wishlistTableList tbody'))) {
                SW.collection.genarate(wishlistArr);
              }
              else {
                SW.collection.genarate([product.handle]);
              }
            }
            else {
              SW.collection.genarate(wishlistArr);
            }

            $('#header-wishlist .wishlistCount').html('('+wishlistCount+')');
            $('#wishlistCount').html('(' + wishlistCount + ')');
            $('.header-wishlist-count-badge').html(wishlistCount).show();
            var alertTemplate = '<div class="message alert alert-success">'+ product.title +' '+wishlistData.item_added+'</div>';
            $( "#wishlistAlert").html(alertTemplate);
            SW.collection.checkWishlist();
          }

          setTimeout(function() {
            $("#resultLoading").hide();
            $("#wishlistModal").modal("show");
          }, 700);

        });
      });

      $('#wishlistModal').on('hidden.bs.modal', function () {
        $('#opacity').removeClass('active');
      });

      $(document).on('click','.wishlist-popup', function() {
        $("#resultLoading").show();
        if (isEmpty($('#wishlistTableList tbody'))) {
          var handles = getCookie("wishlistItems");
          if (handles != "") {
            var wishlistArr = JSON.parse(handles);
            SW.collection.genarate(wishlistArr);
            $('#wishlistCount').html('(' + wishlistCount + ')');

            setTimeout(function() {
              $("#resultLoading").hide();
              $("#wishlistModal").modal("show");
            }, 700);
          }
          else {
            $("#resultLoading").hide();
            $("#wishlistModal").modal("show");
            var alertTemplate = ' <p class="alert alert-warning"><span class="brackets">'+wishlistData.no_item+'</span></p>';
            $( "#wishlistAlert").html(alertTemplate);
          }
        }
        else {
          $('#wishlistTableList .cart-table').show();
          $("#resultLoading").hide();
          $("#wishlistModal").modal("show");
        }
      });

      $("#wishlistModal").on('change', 'select', function() {
        var productHandle = $(this).parents('form').data('handle');
        var $thisForm = $(this).parents('form');
        var optionArr = [];

        $thisForm.find('.selector-wrapper select').each(function() {
          var optionSelected = $(this).data('position');
          var valueSelected = this.value;
          optionArr.push(valueSelected);
        });

        Shopify.getProduct(productHandle, function(product) {
          $.each(product.variants, function( key, value ) {
            var checkGetId = false;
            $.each(optionArr, function( index, optionValue ) {
              if(optionArr[index] == value.options[index]) {
                checkGetId = true;
              }
              else {
                checkGetId = false;
                return false;
              }
            });

            if(checkGetId) {
              $thisForm.find("input[name='id']").val(value.id);
              return false;
            }
          });
        });
      });

      $("#compareBox").on('change', 'select', function() {
        var productHandle = $(this).parents('form').data('handle');
        var $thisForm = $(this).parents('form');
        var optionArr = [];

        $thisForm.find('.selector-wrapper select').each(function() {
          var optionSelected = $(this).data('position');
          var valueSelected = this.value;
          optionArr.push(valueSelected);
        });

        Shopify.getProduct(productHandle, function(product) {
          $.each(product.variants, function( key, value ) {
            var checkGetId = false;
            $.each(optionArr, function( index, optionValue ) {
              if(optionArr[index] == value.options[index]) {
                checkGetId = true;
              }
              else {
                checkGetId = false;
                return false;
              }
            });

            if(checkGetId) {
              $thisForm.find("input[name='id']").val(value.id);
              return false;
            }
          });
        });
      });

      $(document).on('click', '.link-compare', function () {
        $('#opacity').addClass('active');
        $("#resultLoading").show();;
        $('#compareTableList').show();
        var productHandle = $(this).data('productHandle');

        Shopify.getProduct(productHandle, function(product) {
          var checkItemExist = false;
          var compareArr = [];
          var handles = getCookie("compareItems");

          if (handles != "") {
            var compareArr = JSON.parse(handles);
            compareCount = compareArr.length;
            $.each( compareArr, function( key, value ) {
              if(value == product.handle){
                checkItemExist = true;
                return false;
              }
            });
          }
          else {
            var compareArr = [product.handle];
            var json_str = JSON.stringify(compareArr);
            setCookie("compareItems", json_str);
            compareCount = 1;
          }

          if(checkItemExist){
            if (!checkItemCompareExist()) {
              SW.collection.genarateCompareTable(compareArr);
              $('#compareCount').html('(' + compareCount + ')');
            }
            var alertTemplate = '<div class="message alert alert-warning">'+ product.title +' '+compareData.item_exist+'</div>';
            $("#compareAlert").html(alertTemplate);
          }
          else {
            if (handles != "") {
              compareArr.push(product.handle);
              var json_str = JSON.stringify(compareArr);
              setCookie("compareItems", json_str);
              compareCount = compareArr.length;
              if (!checkItemCompareExist()) {
                SW.collection.genarateCompareTable(compareArr);
              }
              else {
                SW.collection.genarateCompareTable([product.handle]);
              }
            }
            else {
              SW.collection.genarateCompareTable(compareArr);
            }

            $('#header-compare .compareCount').html('('+compareCount+')');
            $('#compareCount').html('(' + compareCount + ')');
            var alertTemplate = '<div class="message alert alert-success">'+ product.title +' '+compareData.item_added+'</div>';
            $( "#compareAlert").html(alertTemplate);
            SW.collection.checkCompare();
          }

          setTimeout(function() {
            $("#resultLoading").hide();
            $("#compareBox").modal("show");
          }, 700);
        });
      });

      $('#compareBox').on('hidden.bs.modal', function () {
        $('#opacity').removeClass('active');
      });

      $(document).on('click','#header-compare', function() {
        $("#resultLoading").show();
        if (!checkItemCompareExist()) {
          var handles = getCookie("compareItems");
          if (handles != "") {
            var compareArr = JSON.parse(handles);
            SW.collection.genarateCompareTable(compareArr);
            $('#compareCount').html('(' + compareCount + ')');

            setTimeout(function() {
              $("#resultLoading").hide();
              $("#compareBox").modal("show");
            }, 700);
          }
          else {
            var alertTemplate = ' <p class="alert alert-warning"><span class="brackets">'+compareData.no_item+'</span></p>';
            $( "#compareAlert").html(alertTemplate);
            $("#compareTableList").hide();
            $("#resultLoading").hide();
            $("#compareBox").modal("show");
          }
        }
        else {
          $("#resultLoading").hide();
          $("#compareBox").modal("show");
        }
      });

      $('#wishlistModal').on('click', '.add-cart-wishlist', function() { 
        $(this).parents('tr').find('.add-to-cart').click();
        $(this).parents('tr').find('.remove-wishlist').click();
        $("#wishlistModal").modal("hide");
      });

      $('#compareBox').on('click', '.add-cart-compare', function() {
        var className = $(this).parent('td').attr('class');
        var quantity =  $(this).parents('td').find('.quantity-selector').val();
        $(this).parents('tr').prev().find('.'+className).find('form').find("input[name='quantity']").val(quantity);
        $(this).parents('tr').prev().find('.'+className).find('.add-to-cart').click();
        $(this).parents('tbody').find('.'+className).find('.btn-delete-compare').click();
        $("#compareBox").modal("hide");
      });

      $("[data-with-product]").each(function() {
        SW.collection.prevNextProductData($(this));
      });

      SW.collection.addToCart();
      SW.collection.quickViewInit();
      SW.collection.sidebarMenuInit(); 
      SW.collection.limitedAsFilter(); 
      SW.collection.layoutFilter();
      colorSwatchGrid();
      countDownInit();
      SW.collection.initInfiniteScrolling();
      SW.collection.sidebarInitToggle(); 
      qtyInit();
      if ($.fn.themeSticky) {
        setTimeout(function(){
          SW.collection.stickySidebar();
        }, 500);
      }
      SW.collection.productsLoadMore();
    },
    createCookie: function(name, value, days) {
      var expires;
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
      }
      else {
        expires = "";
      }
      document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
    },
    readCookie: function(name) {
      var nameEQ = escape(name) + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
      }
      return null;
    },
    eraseCookie: function(name) {
      SW.collection.createCookie(name, "", -1);
    },
    animateItems: function(productsInstance) {
      productsInstance.find(".product").each(function(aj) {
        $(this).css('opacity', 1);
        $(this).addClass("item-animated");
        $(this).delay(aj * 200).animate({
          opacity: 1
        }, 500, "easeOutExpo", function() {
          $(this).addClass("item-animated");
        });
      });
    }, 
    productDealInit: function(productDeal) {
      var date = productDeal.data('date');
      if(date) {
        var config = {date: date};
        $.extend(config, countdown);
        $.extend(config, countdownConfig);
        if(countdownTemplate) {
          config.template = countdownTemplate;
        }
        productDeal.countdown(config);
      }
    },
    quickViewInit: function() {
      $(document).on("click", ".quickview", function(e) {
        e.preventDefault();
        var url = $(this).attr("href"),
            item = $(this);
        SW.collection.quickViewLoad(url, item);
      });
    },
    quickViewLoad: function(url, el) {
      $("#resultLoading").show();
      $.ajax({
        url: url,
        dataType: "html",
        type: "GET",
        success: function(data) {
          $.magnificPopup.open({
            items: {
              src: '<div class="popup-quick-view">' + data + '</div>', // can be a HTML string, jQuery object, or CSS selector
              type: 'inline'
            },
            mainClass: 'mfp-smooth-fade',
            removalDelay: 350,
            callbacks: {
              open: function() {
                $("#resultLoading").hide();
                SW.verticleScroll.init();
                if($('.carousel-init.owl-carousel').length > 0) {
                  var carousel = $('.carousel-init.owl-carousel');
                  carousel.each(function() {
                    carouselSlider($(this));
                  });
                }
                SW.productMediaManager.init();
                countDownInit();  
                productReview();
                $('body').addClass("quickview-raised");
              },
              close: function() {
                $('body').removeClass("quickview-raised");
                $(".popup-quick-view").empty();
                $('.zoomContainer').remove();
                SW.productMediaManager.init();
              }
            },
          });
        },
        complete: function() {
          el.removeClass("loading");
          SW.productMediaManager.destroyZoom();
        },
        error: function() {
          console.log("Quick view error");
        }
      })
    },
    prevNextProductData: function(el) {
      var e = el.data("with-product"),
          t = el.find('script[type="text/template"]'),
          i = t.html();
      $.getJSON("/products/" + e + ".json", function(e) {
        var a = e.product;
        var r;
        i = i.replace(/#title#/g, a.title);
        if(a.image) {
          r = a.image.src.lastIndexOf(".");
          i = i.replace(/\[img:([a-z]*)\]/gi, a.image.src.slice(0, r) + "_$1" + a.image.src.slice(r)), t.replaceWith(i);
        } else {
          i = i.replace(/\[img:([a-z]*)\]/gi, ''), t.replaceWith(i);
        }
      });
    },
    addToCart: function() {
      if(cartData.ajax_cart_use == false ) {
        return;
      }

      $(document).on("click", ".add-to-cart", function(e) {
        e.preventDefault();
        var a = $(this);
        var form = a.closest("form");
        return $.ajax({
          type: "POST",
          url: "/cart/add.js",
          async: !0,
          data: form.serialize(),
          dataType: "json",
          beforeSend: function() {
            if(a.parents('.product-inner').length > 0) {
              a.parents('.product-inner').find(".loader-container").show();
            }
            else {
              $("#resultLoading").show();
            }
          },
          error: function(t) {
            var box = $('#error-notice'),
                i = $.parseJSON(t.responseText);
            box.find(".heading").html(i.message);
            box.find(".message").html(i.description);

            setTimeout(function() {
              $(".loader-container").hide();
              $("#resultLoading").hide();
              box.addClass('d-block');

              setTimeout(function() {
                box.removeClass('d-block');
              }, 5e3);
            }, 500);
          },
          success: function(t) {
            Shopify.getCart(function(e) {
              var i = parseInt(form.find('input[name="quantity"]').val()),
                  box = $('#cart-box');

              box.find(".product-link").attr("href", t.url),
              box.find(".product-img").attr("src", Shopify.resizeImage(t.image, "medium")).attr("alt", t.title),
              box.find(".product-title .product-link").html(t.title),
              box.find(".product-price").html(Shopify.formatMoney(t.price, money_format));
			  if(routes_url=='/')routes_url='';
              $.get(routes_url+"/cart?view=json", function(e) {
                $(".cart-inner-content").html(e);
              }),$.getJSON("/cart.js", function(e) {
                $(".cart-total .cart-qty").html(e.item_count);
                $('.porto-sticky-navbar .cart-items').html(e.item_count);
              }); 

              $.magnificPopup.close();

              setTimeout(function() {
                $(".loader-container").hide();
                $("#resultLoading").hide();

                if(cartData.shopping_cart_action == 'popup') {
                  box.addClass('d-block');
                  setTimeout(function() {
                    box.removeClass('d-block');
                  }, 5e3);
                }

                if(cartData.shopping_cart_action == 'widget') {
                  if($('.header-container').hasClass('sticky-header')){
                    $('.main-top-nav .mini-cart .cart-wrapper').fadeIn(200);
                  }
                  else {
                    $('.mini-cart .cart-wrapper').fadeIn(200);
                  }

                  timeoutNumber = setTimeout(function() {
                    $('.mini-cart .cart-wrapper').fadeOut(200);
                  }, 3500 );
                }
              }, 500);
            });
            return false;
          },
          cache: !1
        });
      });
    },
    removeCartInit: function(id,r) {
      if(cartData.ajax_cart_use == false ) {
        return;
      } 
      $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data:  'quantity=0&id='+id,
        dataType: 'json',
        beforeSend: function() {},
        success: function(t) {
          if(routes_url=='/')routes_url='';
          $.get(routes_url+"/cart?view=json", function(e) {
            $(".cart-inner-content").html(e);
          }),$.getJSON("/cart.js", function(e) {
            $(".cart-total .cart-qty").html(e.item_count);
            $('.porto-sticky-navbar .cart-items').html(e.item_count);
          }); 
        },
        error: function(XMLHttpRequest, textStatus) {
          Shopify.onError(XMLHttpRequest, textStatus);
        }
      });
    },
    stickySidebar: function () {
      $(".sidebar .block-main-canvas, .sidebar-right .block-main-canvas").themeSticky({
        autoInit: true,
        minWidth: 992,
        containerSelector: '.row, .container',
        autoFit: true,
        paddingOffsetBottom: 10,
        paddingOffsetTop: 60
      });
    },
    sidebarMenuInit: function() {
      $("#mobile-menu, #categories_nav").mobileMenu({
        accordion: true,
        speed: 400,
        closedSign: 'collapse',
        openedSign: 'expand',
        mouseType: 0,
        easing: 'easeInOutQuad'
      });
    }, 
    limitedAsFilter: function() {
      $(document).on("change", ".limited-view .field", function(e) {
        e.preventDefault();
        var t = $(this), limit = t.val(); 
        $.ajax({
          type: "Post",
          url: '/cart.js',
          data: {
            "attributes[pagination]": limit
          },

          success: function (data) {
            window.location.reload();
          },

          error: function (xhr, text) {
            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description); 
          },
          dataType: 'json'
        });
        
      });
    },
    layoutFilter: function() {
      $(document).on("click", ".view-mode a", function(e) {
        e.preventDefault();
        var t = $(this), layout = t.data('layout');
        $.ajax({
          type: "Post",
          url: '/cart.js',
          data: {
            "attributes[layout]": layout
          },

          success: function (data) {
            window.location.reload();
          },

          error: function (xhr, text) {
            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description); 
          },
          dataType: 'json'
        });
      });
    }, 
    sidebarInitToggle: function() { 
      var titleToggle = '[data-has-collapse] .block-title';  
      body.off('click.toggleContent').on('click.toggleContent', titleToggle, function () { 
        $(this).toggleClass('closed');
        $(this).next().slideToggle();
      }); 
    }, 
    offsetTop: function() {
      setTimeout(function() {
        $("html,body").animate({
          scrollTop: $(".toolbar").offset().top
        }, 500);
      }, 100);
    },  
    initInfiniteScrolling: function() {
      $(window).scroll(function() {
        if ($('.infinite-loader').length > 0) {
          if($(window).scrollTop() >= $(".infinite-loader").offset().top-$(window).height()+100) {
            if(infiniteMode == "byscroll" && loading == false && noMoreProducts == false) {
              SW.collection.doInfiniteScrolling();
            }
          }
        }
      });
      if ($('.infinite-loader').length > 0) { 
        $(document).off('click', '.infinite-loader a').on('click', '.infinite-loader a',  function(e) { 
          e.preventDefault();
          if(loading == false && noMoreProducts == false) {
            SW.collection.doInfiniteScrolling();
          }
        });
      }
    },
    doInfiniteScrolling: function() {
      var currentList = $('#collection-main .products-grid');
      var products = $('#products-grid');

      if (currentList) {
        var loaderParent = $('.infinite-loader').first();
        var showMoreButton = $('.infinite-loader .btn-load-more').first();
        $.ajax({
          type: 'GET',
          url: loaderParent.data('getfrom'),
          beforeSend: function() {
            showMoreButton.text("Loading...");
            showMoreButton.show();
            loading = true;
          },
          success: function(data) {
            loading = false;
            var items = $(data).find('#collection-main .products-grid .item');
            if (items.length > 0) {
              products.append(items);  
              //get link of Show more
              if ($(data).find('.infinite-loader').length > 0) {
                loaderParent.data('getfrom', $(data).find('.infinite-loader').attr('data-getfrom'));
                if(infiniteMode == 'byscroll') {
                  showMoreButton.hide();
                }
                else {
                  showMoreButton.text('Load More...');
                }
              }
              else { 
                noMoreProducts = true;
                showMoreButton.hide();
              }  
              colorSwatchGrid(); 
              productReview();
            }
          },
          error: function(xhr, text) {
            showMoreButton.hide();
            loading = false;
          },
          dataType: "html"
        });
      }
    },
    checkWishlist: function() {
      var productHandle = $('.product-options-bottom .link-wishlist').data('productHandle');
      var handles = getCookie("wishlistItems");
      if (handles != "") {
        var wishlistArr = JSON.parse(handles);
        $.each( wishlistArr, function( key, value ) {
          if(value == productHandle){
            $('.product-options-bottom .link-wishlist').addClass('active');
            return false;
          }
        });

        $(".category-products .link-wishlist").each(function() {
          var currentHandle = $(this).data("productHandle");
          if($.inArray(currentHandle, wishlistArr) > -1) {
            $(this).addClass('active');
          }
        });
      }
    },
    checkCompare: function() {
      var productHandle = $('.product-options-bottom .link-compare').data('productHandle');
      var handles = getCookie("compareItems");

      if (handles != "") {
        var compareArr = JSON.parse(handles);
        $.each(compareArr, function (key, value) {
          if (value == productHandle) {
            $('.product-options-bottom .link-compare').addClass('active');
            return false;
          }
        });

        $(".category-products .link-compare").each(function() {
          var currentHandle = $(this).data("productHandle");
          if($.inArray(currentHandle, compareArr) > -1) {
            $(this).addClass('active');
          }
        });
      }
    },
    genarate: function(wishlistArr) {
      var count = wishlistArr.length,
          stock = wishlistData.outstock;  
      $.each( wishlistArr, function( key, productHandle ) {
        Shopify.getProduct(productHandle, function(product) {
          var addToCartTemplate = '';
          var htmlAddtocart = '<a class="btn-button btn-dark text-uppercase add-cart" href="'+product.url+'">'+wishlistData.addtocart+'</a>';
          var checkHideOption = false; 
          var htmlOptionTemplate = '<form action="/cart/add" method="post" enctype="multipart/form-data" data-handle="'+product.handle+'">'; 
          htmlOptionTemplate += '<input type="hidden" name="id" value="'+product.variants[0].id+'">'; 
          htmlOptionTemplate += '<input type="hidden" name="quantity" value="1">';
          htmlOptionTemplate += '<button type="button" class="button btn-cart add-to-cart hide">'+wishlistData.addtocart+'</button></form>';
          htmlOptionTemplate += '<a href="javascript:void(0)" class="btn-button btn-dark text-uppercase add-cart add-cart-wishlist">'+wishlistData.addtocart+'</a>';
          if (product.variants.length > 1) {
            addToCartTemplate = htmlAddtocart
            $('#wishlistModalBody .product-add-to-cart').html(htmlAddtocart);
          }else{
            addToCartTemplate = htmlOptionTemplate
            $('#wishlistModalBody .product-add-to-cart').html(htmlOptionTemplate);
          } 
          if(product.available){
            stock = wishlistData.instock
          }
          var htmlTemplate = $('#wishlistModalBody tbody').html();
          var html = '';
          var img = product.featured_image.lastIndexOf(".");
          var productUrl = `https://ppgaerospacestore.com/products/${product.handle}`;
          fetch(productUrl)
            .then((response) => response.text())
            .then((html2) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html2, 'text/html');
              const liveInventoryCount = doc.querySelector('.live-inventory-count');
              var addToCartButton = '';
              if (liveInventoryCount.textContent == 'Out of Stock') {
                addToCartButton = '<div id="custom-contact-support-button" class="button-wrapper-content" style="display:block;"><a href="/pages/contact" class="btn-button btn-dark text-uppercase add-cart add-cart-wishlist"><span>Contact Customer Service</span></a></div>'
              } else {
                addToCartButton = addToCartTemplate
              }
              
              html += htmlTemplate.replace(/#image#/g, product.featured_image.slice(0, img) + "_150x" + product.featured_image.slice(img))
                .replace(/#title#/g, product.title)
                .replace(/#urlProduct#/g, product.url)
                .replace(/#handle#/g, product.handle)
                .replace(/#stock#/g, stock)
                .replace(/#quantityLeft#/g, liveInventoryCount.textContent)
                .replace(/#addToCartButton#/g, addToCartButton)
                .replace(/#price#/g, Shopify.formatMoney(product.price, money_format));

              $("#wishlistTableList tbody").append(html);
              $('#wishlistTableList .cart-table').show(); 
            })
            .catch((error) => {
              console.error(`Error fetching or parsing product URL ${productUrl}:`, error);
            })           
        });
      });
    },
    genarateCompareTable: function(compareArr) {
      var count = compareArr.length;
      var countCurrentItem = $('#compareTableList table > tbody > tr:first-child > td').length;

      $.each( compareArr, function( key, productHandle ) {
        Shopify.getProduct(productHandle, function(product) {
          if (typeof product.options !== 'undefined') {
            var optionTemplate = ' <td class="compare-item-'+countCurrentItem+'"> <form action="/cart/add" method="post" enctype="multipart/form-data" data-handle="'+product.handle+'">';
            $.each( product.options, function( index, option ) {
              var optionClass = '';
              if(option.name == 'Title') {
                optionClass = 'hide';
              }
              optionTemplate += '<div class="selector-wrapper js product-form__item '+optionClass+'">';
              optionTemplate += '<label>'+option.name+'</label>';
              optionTemplate += '<select id="conpareSingleOptionSelector-'+option.position+'" data-position = "option'+option.position+'" class="single-option-selector single-option-selector-wishlist product-form__input">';
              $.each( option.values, function( key, value ) {
                optionTemplate += '<option value="'+value+'" data-price="">'+ value +'</option>';
              });
              optionTemplate += '</select></div>';
            });
            optionTemplate += '<input type="hidden" name="id" value="'+product.variants[0].id+'"> <input type="hidden" name="quantity" value="1">';
            optionTemplate += '<button type="button" class="button btn-cart add-to-cart hide">Add cart hidden</button></form></td>';
          }

          var img = product.featured_image.lastIndexOf(".");
          var featuresTemplate = '<td class="compare-item-'+countCurrentItem+'">';
          if (frontendData.imageLazyLoad) {
            featuresTemplate += '<div class="product-image"><img data-src="'+product.featured_image.slice(0, img) + "_350x" + product.featured_image.slice(img)+'" class="lazyload"><a class="btn-delete-compare" data-product-title="'+ product.title +'" data-product-handle="'+product.handle+'" href="javascript:void(0);" onclick="removeCompare(event)"><i aria-hidden="true" class="icon-cancel"></i></a></div>';
          }
          else {
            featuresTemplate += '<div class="product-image"><img src="'+product.featured_image.slice(0, img) + "_350x" + product.featured_image.slice(img)+'"><a class="btn-delete-compare" data-product-title="'+ product.title +'" data-product-handle="'+product.handle+'" href="javascript:void(0);" onclick="removeCompare(event)"><i aria-hidden="true" class="icon-cancel"></i></a></div>';
          }
          featuresTemplate += '<span class="product-title">'+ product.title +'</span>';
          featuresTemplate += '</td>';
		  
          if(product.available) {
            var availabilityTemplate = '<td class="compare-item-'+countCurrentItem+'">';
            availabilityTemplate += '<div class="product-shop-stock-avai"><p class="availability in-stock"><span><span class="brackets">'+obProductData.in_stock+'</span></span></p></div>';
            availabilityTemplate += '</td>';
          }
          else {
            var availabilityTemplate = ' <td class="compare-item-'+countCurrentItem+'">';
              availabilityTemplate += '<div class="product-shop-stock-avai"><p class="availability in-stock"><span><span class="brackets">'+obProductData.out_of_stock+'</span></span></p></div>';
            availabilityTemplate += '</td>';
          }
          var addClassHide = '';
          if(product.compare_at_price <= 0 || !product.compare_at_price) {
            addClassHide = 'hide';
          }

          var priceTemplate = '<td class="compare-item-'+countCurrentItem+'">';
          priceTemplate += '<div class="product-shop-stock-price">';
          priceTemplate += '<div class="price">';
          priceTemplate += '<span class="special-price"><span class="price">'+Shopify.formatMoney(product.price, money_format)+'</span></span>';
          priceTemplate += '<span class="compare-price '+ addClassHide +'"><span class="price">'+Shopify.formatMoney(product.compare_at_price, money_format)+'</span></span>';
          priceTemplate += '</div>';
          priceTemplate += '</div>';
          priceTemplate += '</td>';

          var actionTemplate = '<td class="compare-item-'+countCurrentItem+'">';
          actionTemplate += '<div class="product-type-main product-view">';
          actionTemplate += '<div class="product-options-bottom">';
          actionTemplate += '<div class="add-to-cart-box">';
          actionTemplate += '<div class="input-box">';
          actionTemplate += '<input type="text" name="quantity" value="1" min="1" class="quantity-selector"> ';
          actionTemplate += '<div class="plus-minus">';
          actionTemplate += '<div class="increase items" onclick="setQuantityUp(event)"><i class="icon-up-dir"></i></div>';
          actionTemplate += '<div class="reduced items" onclick="setQuantityDown(event)"><i class="icon-down-dir"></i></div>';
          actionTemplate += '</div>';
          actionTemplate += '</div>';
          actionTemplate += ' </div>';
          actionTemplate += '</div>';
          actionTemplate += '</div>';

          if(product.available) {
            actionTemplate += '<a href="javascript:void(0);" class="add-cart-compare btn-button">'+obProductData.add_to_cart+'</a></td>';
          }
          else {
            actionTemplate += '<span class="btn-button">'+obProductData.sold_out+'</span>';
          }

          $("#compareTableList table tbody tr:first-child").append(featuresTemplate);
          $("#compareTableList table tbody tr:nth-child(2)").append(availabilityTemplate);
          $("#compareTableList table tbody tr:nth-child(3)").append(priceTemplate);
          $("#compareTableList table tbody tr:nth-child(4)").append(optionTemplate);
          $("#compareTableList table tbody tr:nth-child(5)").append(actionTemplate);
          ++countCurrentItem;
        });
      });
    },
    productsLoadMore: function(){
      var process = false,
          intervalID;
      $('.porto-products-element').each(function() {
        var $this = $(this),
            cache = [],
            inner = $this.find('.porto-products-holder');
        if( ! inner.hasClass('pagination-arrows') ) return;
        cache[1] = inner.html();
        $this.on('recalc', function() {
          calc();
        });
        $(window).resize(function() {
          calc();
        });
        var calc = function() {
          var height = inner.outerHeight();
          if( inner.hasClass('pagination-more-tn') || inner.hasClass('pagination-view-all') ) {
            $this.stop().css({height: height + 46});
          }else {
            $this.stop().css({height: height});
          }
        };
        inner.imagesLoaded(function() {
          inner.trigger('recalc');
        }); 
      }); 
      SW.collection.clickOnScrollButton( '.porto-products-load-more.load-on-scroll' , false, 300 );
      $(document).off('click', '.porto-products-load-more').on('click', '.porto-products-load-more',  function(e) {
        e.preventDefault();
        if( process ) return; process = true;
        var $this = $(this),
            holder = $this.parent().siblings('.products-container').children(), 
            ajaxurl = $this.attr("href"), 
            paged = holder.data('paged'); 
        paged++; 
        loadProducts( 'load-more', ajaxurl, paged, holder, $this, [], function(data) {
          if( data ) {
            var items = $(data).find('.porto-products-holder').html(),
                status = $(data).find('.products-footer').data('status'),
                moreurl = $(data).find('.products-footer .porto-products-load-more').attr("href"),
                paged = $(data).find('.porto-products-holder').data('paged'); 
            status == 'have-posts' ? $this.attr("href", moreurl) : $this.remove();  
            if( holder.hasClass('masonry-grid') ) {
              packeryAppend(holder, items);
            } else {
              holder.append(items);
            }    
            holder.imagesLoaded().progress(function() {
              SW.collection.clickOnScrollButton( '.porto-products-load-more.load-on-scroll' , true, 300 );
            }); 
            holder.data('paged', paged); 
          }
        });

      });
      var loadProducts = function( btnType, ajaxurl, paged, holder, btn, cache, callback) {
        if( cache[paged] ) {
          holder.addClass('loading');
          setTimeout(function() {
            if(paged == 1) { 
              callback(cache[paged]);
              var items = $(cache[paged]);
              holder.html(items).attr('data-paged', '1');
              holder.imagesLoaded().progress(function() {
                holder.parent().trigger('recalc');
              });   
              colorSwatchGrid();  
              productReview(); 
              SW.collection.checkWishlist();
              SW.collection.checkCompare();
              countDownInit(); 
              if(frontendData.imageLazyLoad) {
                $("img").each(function() {
                  if($(this).data('src')) {
                    $(this).attr("src", $(this).data('src'));
                  }
                });
              } 
            }else {
              callback(cache[paged]);
            } 
            holder.removeClass('loading');
            process = false;
          }, 300);
          return;
        }
        if (btnType == 'arrows') holder.addClass('loading').parent().addClass('element-loading');
        btn.addClass('loading');
        $.ajax({
          url: ajaxurl,
          dataType: "html",
          type: "GET",
          success: function(data) {
            cache[paged] = data;
            callback( data );
          },
          error: function(data) {
            console.log('ajax error');
          },
          complete: function() {
            if (btnType == 'arrows') holder.removeClass('loading').parent().removeClass('element-loading');
            btn.removeClass('loading');
            process = false;  
          },
        });
      }; 
      var packeryAppend = function(el, items) { 
        var items = $(items); 
        el.append(items).packery( 'addItems', items );
        el.imagesLoaded().progress(function() {
          el.packery('layout');
        });
      };
    },
    clickOnScrollButton: function( btnClass, destroy, offset ) {
      if( typeof $.waypoints != 'function' ) return;

      var $btn = $(btnClass );
      if( destroy ) {
        $btn.waypoint('destroy');
      }

      if( ! offset ) {
        offset = 0;
      } 
      $btn.waypoint(function(){
        $btn.trigger('click');
      }, { offset: function() {
        return $(window).outerHeight() + parseInt(offset);                    
      } });
    }
  };
  SW.productMediaManager = {
    destroyZoom: function() {
      $('.zoomContainer').remove();
      $('.product-image-gallery .gallery-image').removeData('elevateZoom');
    },
    init: function() {
      if(dataZoom.position == 'inside') {
        var zoomConfig = {gallery:'more-slides',zoomType: "inner",cursor: 'pointer',scrollZoom: false};
      }
      else {
        var zoomConfig = {gallery:'more-slides',cursor: 'pointer',scrollZoom: false,zoomWindowFadeIn: 500,zoomWindowFadeOut: 500,lensFadeIn: 500,lensFadeOut: 500,borderSize: 3,lensBorderSize: 2,lensBorderColour: "#999",borderColour: "#ddd"};
      }

      var zoomImage = $('#product-featured-image');
      var imageGallery = $('.product-image-gallery');
      imageGallery.addClass('loading');
      imagesLoaded(zoomImage, function() {
        if(!isMobileAlt) {
          zoomImage.elevateZoom(zoomConfig);
        }
        imageGallery.removeClass('loading');
      }); 
      var vertical = false;
      if($('.thumb-vertical').length>0) {
        vertical = true;
      } 
      if(vertical) {
        $('#more-slides a').find('img').eq(0).addClass('current');
      }
      $(document).on('mouseenter','#more-slides a', function() {
        if(vertical){
          var i = $(this).index(); 
          $('#more-slides a').find('img').removeClass('current');
          $('#more-slides a').find('img').eq(i).addClass('current');
        }
        var targetImage = $(this).closest('.product-img-list').find('#product-featured-image');
        if (targetImage.attr('src') != $(this).data('image')) {
          $('.zoomContainer').remove();
          targetImage.removeData('elevateZoom');
          targetImage.attr('src', $(this).data('image'));
          targetImage.data('zoom-image', $(this).data('zoom-image'));
          imageGallery.addClass('loading');
          imagesLoaded(targetImage, function() {
            if(!isMobileAlt) {
              targetImage.elevateZoom(zoomConfig);
            }
            imageGallery.removeClass('loading');
          });
        }
      }); 
      
      if(dataZoom.lightbox && !isMobileAlt) {
        $("#product-featured-image, .product-image-gallery .icon-zoom").bind("click", function(e) {
          var ez = $('#product-featured-image').data('elevateZoom');
          $.fancybox(ez.getGalleryList());
          return false;
        });
      }
    },
  };
  SW.verticleScroll = {
    init: function(){
      if($('.product-img-box .vertical-carousel').length > 0){
        var carousel = $('.product-img-box .vertical-carousel');
        SW.verticleScroll.carouselInit(carousel);
      }
    },
    carouselInit: function(carousel){
      var count = carousel.find('a').length;
      if (count <= 3) {
        carousel.parents('.more-views-verticle').find('.more-views-nav').hide();
      }
      $(".product-img-box #carousel-up").on("click", function () {
        if (!$(".product-img-box .vertical-carousel").is(':animated')) {
          var bottom = $(".product-img-box .vertical-carousel > div:last-child");
          var clone = $(".product-img-box .vertical-carousel > div:last-child").clone();
          clone.prependTo(".product-img-box .vertical-carousel");
          $(".product-img-box .vertical-carousel").animate({
            "top": "-=85"
          }, 0).stop().animate({
            "top": '+=85'
          }, 250, function () {
            bottom.remove();
          }); 
        }
      });
      $(".product-img-box #carousel-down").on("click", function () {
        if (!$(".product-img-box .vertical-carousel").is(':animated')) {
          var top = $(".product-img-box .vertical-carousel > div:first-child");
          var clone = $(".product-img-box .vertical-carousel > div:first-child").clone();
          clone.appendTo(".product-img-box .vertical-carousel");
          $(".product-img-box .vertical-carousel").animate({
            "top": '-=85'
          }, 250, function () {
            top.remove();
            $(".product-img-box .vertical-carousel").animate({
              "top": "+=85"
            }, 0);
          }); 
        }
      });
    }
  } 
  SW.footer = {
    init: function() {
      SW.footer.backToTopInit();
    },
    backToTopInit: function() {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('#back-top').fadeIn();
        }
        else {
          $('#back-top').fadeOut();
        }
      });

      $('#back-top a').click(function () {
        $('body,html').animate({
          scrollTop: 0
        }, 800);
        return false;
      });
    },
  };
  SW.onReady = {
    init: function() {
      SW.megamenu.init();
      SW.page.init();
      SW.collection.init();
      SW.footer.init();  
    },
  };
  SW.onLoad = {
    init: function() {},
  };
  $(document).ready(function(){
    SW.onReady.init();
  });
  $(window).load(function(){
    SW.onLoad.init();
  });
}(jQuery));  
$(document).ready(function(){
  var sections = new theme.Sections(); 
  sections.register('banner-masonry-section', theme.BannerMasonrySection);  
  sections.register('onepage-section', theme.OnePageSection);  
  sections.register('main-section', theme.MainblockSection);
  sections.register('products-banner-section', theme.ProductBannerSection);  
  sections.register('product-section', theme.ProductSection); 
});