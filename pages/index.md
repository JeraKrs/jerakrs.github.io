---
layout: home
---

<div class="index-content index">
	<div class="section">
		<ul class="artical-cate">
		    <li style="text-align:left"><a href="/"><span>博客</span></a></li>
            <li class="on" style="text-align:center"><a href="/pages/index"><span>索引</span></a></li>
            <li style="text-align:right"><a href="/pages/about"><span>关于我</span></a></li>
		</ul>

		<div class="cate-bar"><span id="cateBar"></span></div>

		<ul class="artical-list">

			{% for item in site.data.proj %}

			<li><h2><a target="_blank" href="{{ item.url }}">{{ item.title }}
			<dd style="font-size:10px; float:right">{{ item.source }}</dd>
			</a></h2>
			<div class="title-desc">{{ item.desc }}</div></li>

			{% endfor %}

		</ul>
	</div>

	<div class="aside">
		<div id="footer">
			© copyright 2020 by 
			<a href="/pages/timeline" style="color:#d0604d">JeraKrs</a>
		</div>
	</div>
</div>
