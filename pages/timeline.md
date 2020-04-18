---
layout: default
---
<link rel="stylesheet" href="/css/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/timeline.css">

<div class="index-content timeline">

	<div class="info-section">

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
		© copyright 2020 by 
		<a href="/pages/timeline" style="color:#d0604d">JeraKrs</a>
		</div>
	</div>

</div>
