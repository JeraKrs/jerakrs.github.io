$(document).ready(function() {

	/* 是否为手机设备 */
	var isMobile = {
		Android: function() {
			 return navigator.userAgent.match(/Android/i);
		 }
		 ,BlackBerry: function() {
			 return navigator.userAgent.match(/BlackBerry/i);
		 }
		 ,iOS: function() {
			 return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		 }
		 ,Opera: function() {
			 return navigator.userAgent.match(/Opera Mini/i);
		 }
		 ,Windows: function() {
			 return navigator.userAgent.match(/IEMobile/i);
		 }
		 ,any: function() {
			 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		 }
	};

    /* 添加链接图标 */
    $('.blog a').each(function(index,element){
        var href = $(this).attr('href');
        if(href){
            if(href.indexOf('#') == 0){
            }else if ( href.indexOf('/') == 0 || href.toLowerCase().indexOf('jerakrs.com')>-1 ){
            }else if ($(element).has('img').length){
            }else{
                $(this).attr('target','_blank');
                $(this).addClass('external');
            }
        }
    });

    /* 添加目录 */
    (function(){
        if (!isMobile.any()) {
            addIndex();
        }

        function addIndex() {
            var menu = '<div id="menuIndex" class="sidemenu" style="top: 100px;"></div>';

            $('#content').append(menu);
            $('#menuIndex').css('max-height',$(window).height()-350);

            var tmpl = genTmpl();
			$('#menuIndex')
				.append($(tmpl))
				.delegate('a','click',function(e){
					e.preventDefault();

					var selector = $(this).attr('data-id') ? '#'+$(this).attr('data-id') : 'h1'
					var scrollNum = $(selector).offset().top;

					$('body, html').animate({ scrollTop: scrollNum-30 }, 400, 'swing');
				});
		}

		function genTmpl() {
			var h1txt = $('h1').text();
			var tmpl = '<ul><li id="test" class="h1"><a href="#">' + h1txt + '</a></li>';

			var heading = initHeading();
			var h2 = heading.h2;
			var h3 = heading.h3;

			for(var i=0;i<h2.length;i++){
				tmpl += '<li><a href="#" data-id="'+h2[i].id+'">'+h2[i].name+'</a></li>';

				if(h3[i]){
					for(var j=0;j<h3[i].length;j++){
						tmpl += '<li class="h3"><a href="#" data-id="'+h3[i][j].id+'">'+h3[i][j].name+'</a></li>';
					}
				}
			}
			tmpl += '</ul>';

			return tmpl;
		}

		function initHeading(){
			var h2 = [];
			var h3 = [];
			var h2index = 0;

			$.each($('.blog h2, .blog h3'),function(index,item){
				if(item.tagName.toLowerCase() == 'h2'){
					var h2item = {};
					h2item.name = $(item).text();
					h2item.id = 'menuIndex'+index;
					h2.push(h2item);
					h2index++;
				} else {
					var h3item = {};
					h3item.name = $(item).text();
					h3item.id = 'menuIndex'+index;
					if(!h3[h2index-1]){
						h3[h2index-1] = [];
					}
					h3[h2index-1].push(h3item);
				}
				item.id = 'menuIndex' + index;
			});

			return {h2:h2,h3:h3}
		}

	})();

	/* 目录选中特效 */
	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
			if (!uniqueId) {
				uniqueId = "Don't call this twice without a uniqueId";
			}
			if (timers[uniqueId]) {
				clearTimeout (timers[uniqueId]);
			}
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	$(window).load(function(){

		$(window).scroll(function(){

			var scrollTop = [];
			$.each($('#menuIndex li a'),function(index,item){
				var selector = $(item).attr('data-id') ? '#'+$(item).attr('data-id') : 'h1'
				var top = $(selector).offset().top;
				scrollTop.push(top);
			});
			var menuIndexTop = $('#menuIndex').offset().top;
			var menuIndexLeft = $('#menuIndex').offset().left;
			waitForFinalEvent(function(){

				var nowTop = $(window).scrollTop();
				var length = scrollTop.length;
				var index = 0;

				if(nowTop+60 > scrollTop[length-1]){
					index = length;
				}else{
					for(var i=0;i<length;i++){
						if(nowTop+60 <= scrollTop[i]){
							index = i;
							break;
						}
					}
				}

				if (index == 0) { index = 1; }
				$('#menuIndex li').removeClass('on');
				$('#menuIndex li').eq(index-1).addClass('on');
			});

			var scrollt = document.documentElement.scrollTop + document.body.scrollTop; //获取滚动后的高度 
			if(scrollt>200){  //判断滚动后高度超过200px
				$("#gotop").fadeIn(400); //淡入
			}else{
				$("#gotop").fadeOut(400); //淡出
			}

		});

		$(window).resize(function(){
			$('#menuIndex').css('max-height',$(window).height()-350);
		});
	})

	//当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部 
	$("#gotop").click(function(){        
		$("html,body").animate({scrollTop:"0px"},200);
	});

	// 代码高亮
	$('pre').addClass('prettyprint linenums'); //添加Google code Hight需要的class
	$.getScript('/js/prettify/prettify.js',function(){
		prettyPrint();
    });
});
