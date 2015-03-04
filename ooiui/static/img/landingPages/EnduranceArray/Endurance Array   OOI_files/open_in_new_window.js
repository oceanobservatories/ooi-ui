/*
Plugin Name: Open in New Window Plugin
Plugin URI: http://www.BlogsEye.com/
Description: Opens external links in a new window, keeping your blog page in the browser so you don't lose surfers to another site.
Version: 2.3
Author: Keith P. Graham
Author URI: http://www.BlogsEye.com/

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/
function kpg_oinw_action(event) {
	try {
		var b=document.getElementsByTagName("a");
		var ksrv=window.location.hostname;
		ksrv=ksrv.toLowerCase();
		for (var i = 0; i < b.length; i++) {
			// IE 6 bug - the anchor might not be a link and might not support hostname
			if (b[i] && b[i].href) {
				if (!(b[i].title)) {
					var ih=b[i].innerHTML;
					if (ih.indexOf('<img')==-1) { // check for img tag
						b[i].title=kpgremoveHTMLTags(b[i].innerHTML);
					}
				}
				var khref=b[i].href;
				khref=khref.toLowerCase();
				if ( b[i].target==null || b[i].target=='')  {
					if ( 
						khref.indexOf('http://')!=-1 ||
						khref.indexOf('https://')!=-1 ||
						khref.indexOf('ftp://')!=-1
					) {
						// check to see if target is on this domain.
						if (b[i].hostname && location.hostname) {
							if (b[i].hostname.toLowerCase() != location.hostname.toLowerCase()) {
								b[i].target="_blank";
							}
						} 
						if (b[i].target!="_blank"&&khref.indexOf(ksrv)==-1) { 					
							b[i].target="_blank";
						}
						if (b[i].target!="_blank"&&kpg_oinw_checktypes) {
							// list of types to check here
							for (k=0;k<kpg_oinw_list.length;k++) {
								if (khref.indexOf(kpg_oinw_list[k])!=-1) {
									b[i].target="_blank";
								}
							}
						} 
					}
				}
			}
		}
	} catch (ee) {}
}
// set the onload event
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", function(event) { kpg_oinw_action(event); }, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", function(event) { kpg_oinw_action(event); });
} else {
	var oldFunc = window.onload;
	window.onload = function() {
		if (oldFunc) {
			oldFunc();
		}
			kpg_oinw_action('load');
		};
}
function kpgremoveHTMLTags(ihtml){
	try {
		ihtml = ihtml.replace(/&(lt|gt);/g, function (strMatch, p1){
			return (p1 == "lt")? "<" : ">";
		});
		return ihtml.replace(/<\/?[^>]+(>|$)/g, "");
	} catch (eee) {
		return '';
	}
}	