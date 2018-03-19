---
layout: default
---
<link rel="stylesheet" href="/css/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/timeline.css">

<div class="index-content about">

	<div class="info-section">

		<!-- Introduction -->
		<div class="info-page">
			<div class="info-title">
				<i class="fa fa-male"></i>
				<strong>Introduction</strong>
			</div>
			<div class="info-body">
				<p class="info-content">
				Hi, I am JeraKrs, a retired ACMer and eagerness to finger-style.
				</p>
			</div>
		</div>

		<!-- Contact me -->
		<div class="info-page">
			<div class="info-title">
				<i class="fa fa-phone"></i>
				<strong>Contact me</strong>
			</div>
			<div class="info-body">
				<p class="info-content">
					<i class="fa fa-qq"></i>
					<strong>&nbsp;&nbsp;1040784362</strong>
				</p>
				<p class="info-content">
					<i class="fa fa-envelope"></i>
					<strong>&nbsp;&nbsp;Jerakrs@gmail.com</strong>
				</p>
			</div>
		</div>

		<!-- Social Link
		<div class="info-page">
			<div class="info-title">
				<i class="fa fa-info-circle"></i>
				<strong>Social Link</strong>
			</div>

			<div class="info-body">
				<a href="http://weibo.com/JeraKrs" target="_blank" rel="external">
					<button type="button" class="info-link link-darkred">
						<i class="fa fa-weibo"></i>
						<strong>微博</strong>
					</button>
				</a>

				<a href="https://www.douban.com/people/BearChild-/" target="_blank" rel="external">
					<button type="button" class="info-link link-green">
						<i class="fa fa-share-alt"></i>
						<strong>豆瓣</strong>
					</button>
				</a>

				<a href="https://github.com/JeraKrs" target="_blank" rel="external">
					<button type="button" class="info-link link-white">
						<i class="fa fa-github"></i>
						<strong>github</strong>
					</button>
				</a>

				<a href="https://disqus.com/by/JeraKrs/" target="_blank" rel="external">
					<button type="button" class="info-link link-blue">
						<i class="fa fa-commenting"></i>
						<strong>disqus</strong>
					</button>
				</a>

				<a href="http://blog.csdn.net/keshuai19940722" target="_blank" rel="external">
					<button type="button" class="info-link link-red">
						<i class="fa fa-book"></i>
						<strong>CSDN</strong>
					</button>
				</a>

				<a href="" target="_blank" rel="external">
					<button type="button" class="info-link link-black">
						<i class="fa fa-facebook"></i>
						<strong>facebook</strong>
					</button>
				</a>

				<a href="" target="_blank" rel="external">
					<button type="button" class="info-link link-darkblue">
						<i class="fa fa-twitter"></i>
						<strong>twitter</strong>
					</button>
				</a>

				<a href="" target="_blank" rel="external">
					<button type="button" class="info-link link-yellow">
						<i class="fa fa-stack-overflow"></i>
						<strong>overflow</strong>
					</button>
				</a>

			</div>
		</div>
		-->

		<!-- Timeline -->
		<div class="info-page">
			<div class="info-title">
				<i class="fa fa-clock-o"></i>
				<strong>Timeline</strong>
			</div>

			<div class="info-body">

				<div class="line-warp" id = "timeline-body">

					<div class="timeline-header">
            			<span class="badge"><span class="fa fa-clock-o"></span>My Timeline</span>
        			</div>

				{% for items in site.data.timeline %}

					<div class="breakline">
						------------------
						<span class="badge">&nbsp;&nbsp;{{ items.title }}&nbsp;&nbsp;</span>
						------------------
					</div>

					{% for item in items.events %}

					<div class="line-item">
						<div class="line-icon-warp">

						<span class="fa-stack fa-lg">
							<i class="fa fa-circle fa-stack-2x" style="color: {{ item.color }}"></i>
							<i class="fa {{ item.type }} fa-stack-1x" style="color: #ffffff"></i>
						</span>
						<span class="badge"> &nbsp;&nbsp;{{ item.badge }}&nbsp;&nbsp; </span>

						</div>

						<div class="line-content-box"><p>{{ item.desc }}</p></div>
					</div>

					{% endfor %}

				{% endfor %}

        		</div>

			</div>
			
		</div>

	</div>

	<div class="aside">
		<div id="footer">
			© copyright 2016 by 
			<a href="/pages/about" style="color:#d0604d">JeraKrs</a>
		</div>
	</div>
</div>
