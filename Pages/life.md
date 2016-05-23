---
layout: home
---

<div class="index-content life">
	<div class="section">
		<ul class="artical-cate">
			<li><a href="/"><span>开发</span></a></li>
			<li class="on" style="text-align:center"><a href="/Pages/life"><span>生活</span></a></li>
			<li style="text-align:right"><a href="/Pages/algorithm"><span>算法</span></a></li>
		</ul>

		<div class="cate-bar"><span id="cateBar"></span></div>

		<ul class="artical-list">
			{% for post in site.categories.life %}
			<li>
			<h2><a href="{{ post.url }}">{{ post.title }}
			<dd style="font-size:10px; float:right">{{ post.date | date_to_string }}</dd>
			</a></h2>
			<div class="title-desc">{{ post.description }}</div>
			</li>
			{% endfor %}
		</ul>
	</div>

	<div class="aside">
		<div id="footer">
			© copyright 2016 by 
			<a href="/Pages/about" style="color:#d0604d">JeraKrs</a>
		</div>
	</div>
</div>
