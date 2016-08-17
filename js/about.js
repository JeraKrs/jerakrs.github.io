function addBreakLine(title) {
	var temp = document.createElement('div');
	temp.setAttribute('class', 'breakline');
	temp.innerHTML = "------------------&nbsp;&nbsp;<span class='badge'>&nbsp;&nbsp;" + title + "&nbsp;&nbsp;</span>&nbsp;&nbsp;------------------";
	document.getElementById('timeline-body').appendChild(temp);
}

function addLineItem(item) {
	var div = document.createElement('div');
	div.setAttribute('class', 'line-item');

	var warp = document.createElement('div');
	warp.setAttribute('class', 'line-icon-warp');
	warp.innerHTML = "<span class='fa-stack fa-lg'><i class='fa fa-circle fa-stack-2x' style='color: " + item['color'] + "'></i><i class='fa " + item['type'] + " fa-stack-1x' style='color: #ffffff'></i></span><span class='badge'> &nbsp;&nbsp;" + item['badge'] + "&nbsp;&nbsp; </span>";

	var content = document.createElement('div');
	content.setAttribute('class', 'line-content-box');
	content.innerHTML = "<p>" + item['desc'] + "</p>";

	div.appendChild(warp);
	div.appendChild(content);
	document.getElementById('timeline-body').appendChild(div);
}

function load() {	

	var TimeLine = new Array();

	TimeLine[5] = {
		title: '2 0 1 6',
		body: new Array(),
	}
	TimeLine[5]['body'][3] = { color: '#FFC125', type: 'fa-lightbulb-o', badge: 'Just Now', desc: 'Nothing to say~' }
	TimeLine[5]['body'][2] = { color: '#9932CC', type: 'fa-users', badge: 'Jul 2016', desc: 'Working in Pusic Company.' }
	TimeLine[5]['body'][1] = { color: '#CD6600', type: 'fa-home', badge: 'May 2016', desc: 'Built my personal blog site, JeraKrs.com.' }
	TimeLine[5]['body'][0] = { color: '#CD5C5C', type: 'fa-book', badge: 'Apr 2016', desc: 'Finished undergraduates \' graduation project, 《Application of Automatic Publishing Platform Based on LXC》.' }


	TimeLine[4] = {
		title: '2 0 1 5',
		body: new Array(),
	}
	TimeLine[4]['body'][1] = { color: '#CD3700', type: 'fa-trophy', badge: 'Nov 2015', desc: 'The ACM-ICPC Asia Regional Contest EC-final 2015, Silver Medal.' }
	TimeLine[4]['body'][0] = { color: '#CD3700', type: 'fa-user', badge: 'May 2015', desc: 'The 2014-2015 National Scholarship.' }


	TimeLine[3] = {
		title: '2 0 1 4',
		body: new Array(),
	}
	TimeLine[3]['body'][1] = { color: '#CD3700', type: 'fa-trophy', badge: 'Nov 2014', desc: 'The 39th ACM-ICPC Asia Guangzhou and Shanghai Regional Contest, Bronze Medal.' }
	TimeLine[3]['body'][0] = { color: '#CD3700', type: 'fa-user', badge: 'Apr 2014', desc: 'Gained "Fujian Provence Excellent League Member" title.' }


	TimeLine[2] = {
		title: '2 0 1 3',
		body: new Array(),
	}
	TimeLine[2]['body'][2] = { color: '#CD3700', type: 'fa-trophy', badge: 'Dec 2013', desc: 'The 4th Fujian Provence Collegiate Programming Contest, Gold Medal.' }
	TimeLine[2]['body'][1] = { color: '#CD3700', type: 'fa-trophy', badge: 'Jul 2013', desc: 'The 4th "lanqiao" National Collegiate Programming Contest, the second award.' }
	TimeLine[2]['body'][0] = { color: '#9932CC', type: 'fa-users', badge: 'Mar 2013', desc: 'Joined Laboratory 104, started to learn algorithm.' }


	TimeLine[1] = {
		title: '2 0 1 2',
		body: new Array(),
	}
	TimeLine[1]['body'][0] = { color: '#31699d', type: 'fa-university', badge: 'Sep 2012', desc: 'Entered the Fujian Normal University.' }


	TimeLine[0] = { 
		title:	'e a r l i e r',
		body:	new Array(),
	}
	TimeLine[0]['body'][1] = { color: '#FFC125', type: 'fa-music', badge: 'Mar 2010', desc: 'Started to play the guitar.' }
	TimeLine[0]['body'][0] = { color: '#ff9357', type: 'fa-child', badge: 'Jul 1994', desc: 'I was bron.' }

	
	var line = TimeLine.length - 1;
	while (line >= 0) {

		var idx = TimeLine[line]['body'].length - 1;

		addBreakLine(TimeLine[line]['title']);

		while (idx >= 0) {
			item = TimeLine[line]['body'][idx];
			idx = idx - 1;

			addLineItem(item);
		}
		line = line - 1;
	}
}
