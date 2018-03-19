---
layout: home
---

<div class="index-content habit">
	<div class="section">
		<ul class="artical-cate">
		    <li style="text-align:left"><a href="/"><span>博客</span></a></li>
            <li style="text-align:center"><a href="/pages/project"><span>项目</span></a></li>
            <li class="on" style="text-align:right"><a href="/pages/habit"><span>兴趣</span></a></li>
		</ul>

		<div class="cate-bar"><span id="cateBar"></span></div>

		<ul class="artical-list">

			{% for item in site.data.habit %}

			<li>
			<h2><a href="{{ item.url }}">{{ item.title }}
			<dd style="font-size:10px; float:right">{{ item.source }}</dd>
			</a></h2>
			<div class="title-desc">{{ item.desc }}</div>
			</li>

			{% endfor %}
		</ul>
	</div>

	<div class="aside">
		<div id="footer">
			© copyright 2016 by 
			<a href="/pages/about" style="color:#d0604d">JeraKrs</a>
		</div>
	</div>
</div>
