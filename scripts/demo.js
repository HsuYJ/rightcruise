(function() {

	var lang = window.navigator.language || window.navigator.userLanguage;
	var html, body, liveDemo;

	var Setting = {
		brandHeight: 80,
		contentHeight: undefined,
	};

	var State = {
		// boolean
		isBodyScrollable: undefined,
		onScroll: false,
		onDemo: false,
		scrolling: false, // throttle of locationHashManager()
		// number
		scrollValue: undefined,
		previousHash: undefined,
		sectionScroll: {
			sectionNum: undefined,
			section: [0],
			duration: 1000, // ms
			fps: 60,
		},
		timer: {
			sectionScroll: null
		},
		sectionTitles: []
	};

	var ContentHead = []; // collectContentHead()

	var Content = [
		[
			{h2: [
				'什麼是 rightCruise.js',
				'What Is rightCruise.js']},
			{h3: [
				'任何地點 右鍵捲動',
				'Right button scrolling']},
			{p: [
				'rightCruise.js 讓使用者在網頁上任何位置皆能使用滑鼠右鍵捲動網頁。現在就在Live Demo中試試！',
				'rightCruise.js makes it possible to scroll via mousedown right button in anywhere of web page. You can try it in Live Demo!']},
			{h3: [
				'特色',
				'Features']},
			{li: [
				'仍能與 <INPUT> 元素正確互動',
				'<INPUT> element still interactable']},
			{li: [
				'仍能與 <TEXTAREA> 元素正確互動',
				'<TEXTAREA> element still interactable']},
			{li: [
				'右鍵選單(contextmenu)仍能正常使用',
				'Contextmenu(mouse right button click) still work']},
			{li: [
				'在滑鼠未被偵測的情況下不會自行啟用',
				'Would not active without mouse detected']},
		],
		[
			{h2: [
				'用法',
				'Usage']},
			{h3: [
				'安裝',
				'Install']},
			{p: [
				'首先置入 rightCruise.js 於你的專案資料夾，再將以下程式碼加入 你的專案.html 的 <head> 中：',
				'Put rightCruise.js under your project directory, insert the following code to the <head> of yourProject.html:']},
			{pre: '<script type="text/javascript" src="path/to/rightCruisr.js"></script>'},
			{h3: [
				'啟動',
				'Active']},
			{p: [
				'要啟動 rightCruise.js ，只需在 你的專案.js 加入以下代碼：',
				'To enable rightCruise.js, simply write following code in yourProject.js:']},
			{pre: 'rightCruise.active();'},
			{p: [
				'或者，將 rightCruise.js 文件中的 Setting.autoActive 改為 true，它將會在 document 戴入完成後自動執行：',
				'or, change the value of \'Setting.autoActive\' under rightCruise.js to \'true\', it will auto-execute when document is ready:']},
			{pre:
				'rightCruise.js:\n' +
				'  var Setting = {\n' +
				'    autoActive: true;\n' +
				'  };'
			}
		],
		[
			{h2: [
				'事件(Event)',
				'Event']},
			{h3: [
				'rightCruise事件',
				'rightCruise Events'
				]},
			{p: [
				'當使用者使用 rightCruise.js 時，會觸發相關的rightCruise事件(Event)，你可以在 Live Demo 中觀察到。',
				'When rightCruise is triggered by user, a rightCruise event will fire, you can check it in Live Demo.']},
			{h3: [
				'事件類別',
				'Event types']},
			{p: [
				'總共有2個 rightCruise 事件，捲動(cruise)以及捲動結束(cruiseend)：',
				'There are two event types of rightCruise.js, cruise and cruiseend:']},
			{h3: [
				'捲動(cruise)',
				'cruise']},
			{p: [
				'當使用者按下(mousedown)滑鼠右鍵並移動(mousemove)時，就會觸發「捲動」(cruise)事件。你可以用以下代碼監聽此事件：',
				'When user mousedown mouse right button and move, a evet named \'cruise\' will throw. You can listen to it by following code:']},
			{pre: 'document.addEventListener(\'cruise\', yourFunction, false);'},
			{h3: [
				'捲動結束(cruiseend)',
				'cruiseend']},
			{p: [
				'當使用者在「捲動」(cruise)後放開(mouseup)滑鼠右鍵時，就會觸發「捲動結束」(cruiseend)事件。你可以用以下代碼監聽此事件：',
				'When user mouseup after rightCruise, a event named \'cruiseend\' will throw. You can listen to it by following code:']},
			{pre: 'document.addEventListener(\'cruiseend\', yourFunction, false);'},
		],
		[
			{h2: [
				'<SELECT> 元素', 
				'<SELECT> element']},
			{h3: [
				'如同原創', 
				'Same as origin']},
			{p: [
				'選單(<SELECT>)元素將被一個與之無異的複製品取代，唯獨複製品的選項(option)可以藉由滑鼠右鍵進行捲動這點不同。', 
				'The <SELECT> element will replaced by a duplicate when user click,' +
				' the duplicate itself is no different from the original <SELECT>,' +
				' but the option list of duplicate can be scrolling by mouse right button.']},
			{h3: [
				'行為', 
				'Behavior']},
			{p: [
				'當點選選單(<SELECT>)時，選單會自行捲動至目前選擇的項目(selected option)位置。', 
				'The option list will auto-scroll to the location of selected option.']}
		],
		[
			{h2: [
				'瀏覽器相容',
				'Browser Compatibility']},
			{p: [
				'',
				'rightCruise.js is built only for desktop browsers, check the browser compatibility at following chart:']},
			{code: function() {

				var table = createEl({
					type: 'table',
					className: 'table',
					style:
						'border: 1px solid #CCC;' +
						'border-radius: 4px 4px 0 0;' +
						'border-collapse: separate;'
				});
				var browsers = {
					IE: '10+',
					Chrome: '46+',
					Firefox: '42+'
				};
				var keys = Object.keys(browsers);
				var tr, th, td, i;
				// table head
				var thead = createEl({
					type: 'thead',
					style:
						'background: #CCC;'
				});

				table.appendChild(thead);
				tr = createEl({ type: 'tr' });
				thead.appendChild(tr);
				th = createEl({ type: 'th', text: 'Browser' });
				tr.appendChild(th);

				for (i = 0; i < keys.length; i++) {
					th = createEl({ type: 'th', text: keys[i] });
					tr.appendChild(th);
				}
				// table body
				var tbody = createEl({ type: 'tbody' });

				table.appendChild(tbody);
				tr = createEl({ type: 'tr' });
				tbody.appendChild(tr);
				th = createEl({ type: 'th', text: 'Version' });
				tr.appendChild(th);

				for (i = 0; i < keys.length; i++) {
					td = createEl({ type: 'td', text: browsers[keys[i]] });
					tr.appendChild(td);
				}

				return table;
			}},
		],
		[
			{h2: [
				'方法',
				'Methods']},
			{p: [
				'rightCruise共計有3種方法：',
				'There are only three methods in rightCruise:']},
			{h3: '1. rightCruise.active()'},
			{p: [
				'.active() 方法用以啟動 rightCruise.js。',
				'The .active() method enables rightCruise.js.']},
			{h4: [
				'執行代碼',
				'Syntax']},
			{pre: 'rightCruise.active();'},
			{h3: '2. rightCruise.sleep()'},
			{p: [
				'.sleep() 方法用於關閉 rightCruise.js。',
				'The .sleep() method disables rightCruise.js.']},
			{h4: [
				'執行代碼',
				'Syntax']},
			{pre: 'rightCruise.sleep();'},
			{h3: '3. rightCruise.set()'},
			{p: [
				'.set() 方法用於改變 rightCruise 之設定。',
				'The .set() method changes Settings of rightCruise.js.']},
			{h4: [
				'執行代碼',
				'Syntax']},
			{pre: 'rightCruise.set({ property1: \"\", property2: \"\", property3: \"\", ... });'},
			{h4: [
				'.set() 設定項目',
				'Properties of .set()']},
			{code: function() { return generateContentLink('scrollMarkedElOnly', 9); }},
			{code: function() { return generateContentLink('transmit', 10); }},
			{code: function() { return generateContentLink('oneDirection', 11); }},
			{code: function() { return generateContentLink('momentum', 12); }},
			{code: function() { return generateContentLink('maxHeight', 13); }},
			{code: function() { return generateContentLink('zIndex', 14); }}
		],
		[
			{h2: [
				'設定項目',
				'Settings']},
			{p: [
				'rightCruise.js 的設定項目。',
				'The properties of setting of rightCruise.js.']},
			{h3: [
				'位置',
				'Path']},
			{p: [
				'打開 rightCruise.js 文件，搜尋 "var Setting"：',
				'Open rightCruise.js and search for "var Setting":']},
			{pre:
				'var Setting = {\n' +
				'  property: value,\n' +
				'};'
			},
			{h3: [
				'設定項目一覽',
				'Properties of Setting']},
			{code: function() { return generateContentLink('autoActive', 7); }},
			{code: function() { return generateContentLink('showState', 8); }},
			{code: function() { return generateContentLink('scrollMarkedElOnly', 9); }},
			{code: function() { return generateContentLink('transmit', 10); }},
			{code: function() { return generateContentLink('oneDirection', 11); }},
			{code: function() { return generateContentLink('momentum', 12); }},
			{code: function() { return generateContentLink('maxHeight', 13); }},
			{code: function() { return generateContentLink('zIndex', 14); }}
		],
		[
			{h3: 'Setting.autoActive'},
			{h3: [
				'說明',
				'Description']},
			{p: [
				'設定此項目以開啟/關閉當網頁戴入完成時，rightCruise.js 是否自行啟動。',
				'Change the value of autoActive to enable / disable auto-executing of rightCruise.js when document is ready.']},
			{h3: [
				'位置',
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  autoActive: true;\n' +
				'};'
			},
			{h3: [
				'數值',
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值',
				'Default value']},
			{pre: 'true'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'否', 
				'flase']}
		],
		[
			{h3: 'Setting.showState'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'設定此項目以開啟/關閉使用者藉由 console 取得 rightCruise.js 之狀態(States)與設定(Settings)的通道。' +
				'打開 console (按下F12)並輸入 "rightCruise.state" 或 "rightCruise.setting" 以觀察數值。(僅讀取)',
				'Enable / Disable a console access to States and Settings of rightCruise.js. ' +
				'Open the console(press F12), and type "rightCruise.state" or ' +
				'"rightCruise.setting" to see.(read only)'
			]},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  showState: false;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: 'false'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更', 
				'Modify by rightCruise.set()']},
			{pre: [
				'否', 
				'flase']}
		],
		[
			{h3: 'Setting.scrollMarkedElOnly'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'若此項目設定為 true，rightCruise 將只會捲動"被標記的"元素。' +
				'且無論被標記的元素之overflow數值為何，都會被rightCruise捲動。',
				'Set this value to true, rightCruise will scroll marked elements only, ' +
				'and no matter what is the value of overflow of marked element, rightCruise will scroll it.'
			]},
			{h3: [
				'標記 / 解除標記元素',
				'Mark / unmark element']},
			{pre: 'elementYouWantToMark.setAttribute(\'cruisemark\', true / false);'},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  scrollMarkedElOnly: false;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: 'false'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'是',
				'true']}
		],
		[
			{h3: 'Setting.transmit'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'當一個可被捲動的元素被捲動至極限時，當下一次使用者進行捲動時，rightCruise 將捲動此元素的父元素(parenrNode)。',
				'When a scrollable element has been scrolled to the limitation, rightCruise will scroll' +
				' it\'s parent element(parentNode) at next time user scroll this element with rightCruise.'
			]},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  transmit: true;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: 'true'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'是',
				'true']}
		],
		[
			{h3: 'Setting.oneDirection'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'若此項目設定為 true，使用者同時間只能擇一進行水平或垂直捲動。',
				'When this value has been set to true, user can only scroll horizontally or vertically at a time.']},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  oneDirection: false;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: 'false'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'是',
				'true']}
		],
		[
			{h3: 'Setting.momentum'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'開啟/關閉捲動結束時的慣性滑移(momentum)效果。',
				'Momentum scrolling after rightCruise end.']},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  momentum: true;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'true / false'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: 'true'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'是',
				'true']}
		],
		[
			{h3: 'Setting.maxHeight'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'選單(<SELECT>)的選項(option)列表的 max-height 數值。',
				'The max-height of option list of <SELECT>.']},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  maxHeight: undefined;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'number(unit: px)'},
			{h3: [
				'默認數值', 
				'Default value']},
			{p: [
				'此數值會在 rightCruise.js 啟動後計算並設定。',
				'This value will set after rightCruise.js activated.']},
			{pre: 'according to window.innerHeight'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'是',
				'true']}
		],
		[
			{h3: 'Setting.zIndex'},
			{h3: [
				'說明', 
				'Description']},
			{p: [
				'選單(<SELECT>)的選項(option)列表的 z-index 數值。',
				'The z-index of option list of <SELECT>.']},
			{h3: [
				'位置', 
				'Path']},
			{pre:
				'var Setting = {\n' +
				'  zIndex: undefined;\n' +
				'};'
			},
			{h3: [
				'數值', 
				'Value']},
			{pre: 'number'},
			{h3: [
				'默認數值', 
				'Default value']},
			{pre: '622'},
			{h3: [
				'是否可藉由rightCruise.set() 方法進行變更',
				'Modify by rightCruise.set()']},
			{pre: [
				'可',
				'true']}
		],
	];

	function demo() {

		if (document.readyState !== 'complete') {
			window.requestAnimationFrame(demo);
			return;
		}

		var i, j;
		// evaluate Settings
		Setting.contentHeight = window.innerHeight - Setting.brandHeight;
		//console.log(Setting.contentHeight);
		// initial modify
		// collect content head
		collectContentHead();
		// mainframe
		generateMainframe();
		// navigator
		generateNavigator();
		// content
		generateContent();
		// backNavi
		generateBackNavi();
		// demo
		generateDemo();
		// footer
		generateFooter();
		// event catcher
		EvtHandler.wheel(1);
		EvtHandler.scrollValueChange(1);
		EvtHandler.hashchange(1);
		// autoScroll
		setTimeout(function() { checkScrollState(); }, 50);
		//console.log('Content section:', State.sectionScroll.section);
	}

	function collectContentHead() {

		var i;

		for(i = 0; i < Content.length; i++) {
			ContentHead.push(convertSectionTitleToHash(i));
		}
		// foot
		ContentHead.push('foot');
	}

	function generateMainframe() {
		// container
		var container = createEl({
			id: 'container'
		});
		body.appendChild(container);
		// brand
		var brandHolder = createEl({
			id: 'brandHolder',
			style:
				'height: ' + Setting.brandHeight + 'px;'
		});
		container.appendChild(brandHolder);

		var brand = createEl({
			type: 'h1',
			id: 'brand',
			text: 'rightCruise.js',
			className: 'brand',
			style:
				'position: fixed;'
		});
		brandHolder.appendChild(brand);

		var brandSub = createEl({
			type: 'h3',
			text: 'Live Demo',
			style:
				'display: inline;' +
				'margin-left: 1em;' +
				'opacity: 0;'
		});
		brand.appendChild(brandSub);
		// row_main
		var row_main = createRow({
			row: {
				id: 'row_main',
			},
			col: {
				id: 'row_main_col',
				amount: 2,
				width: [250, '90%']
			}
		});
		container.appendChild(row_main);
		// row_content
		var row_content = createRow({
			row: {
				id: 'row_content'
			},
			col: {
				id: 'row_content_col',
				amount: 2,
				width: ['80%', '20%']
			}
		});
		document.getElementById('row_main_col1').appendChild(row_content);
	}

	function generateNavigator() {

		var navHolder = createEl({
			className: 'navHolder'
		});
		document.getElementById('row_main_col0').appendChild(navHolder);

		var navFrame = createEl({
			className: 'navFrame',
			style:
				'width:' + navHolder.clientWidth +'px;'
		});
		navHolder.appendChild(navFrame);

		var i;

		for (i = 0; i < Content.length; i++) {
			var tagName = Object.keys(Content[i][0])[0];
			var text = Content[i][0][tagName];

			text = (text.constructor === Array) ? text[(lang === 'zh-TW') ? 0 : 1] : text;

			var navItem = createEl({
				type: 'a',
				text: text,
				className: 'navItem' + ((tagName === 'h3') ? ' subItem' : '')
			});
			navItem.setAttribute('navnum', i);
			EvtHandler.click(navItem, 1);
			navFrame.appendChild(navItem);
		}
	}

	function generateContent() {

		var contentHolder = document.getElementById('row_content_col0');
		var i;

		for (i = 0; i < Content.length; i++) {
			var content = Content[i];
			var contentItem = createEl({
				className: 'contentItem'
			});
			var j;

			if (i === (Content.length - 1)) { contentItem.style.minHeight = Setting.contentHeight + 'px'; }

			contentHolder.appendChild(contentItem);
			// generate contents
			for (j = 0; j < content.length; j++) {
				var tagName = Object.keys(content[j])[0];
				var contentText = content[j][tagName];

				if (contentText.constructor === Array) { contentText = contentText[(lang === 'zh-TW') ? 0 : 1]; }
				
				if (tagName !== 'pre' && contentText.constructor === String) { contentText = contentText.replace(/</g, '&lt').replace(/>/g, '&gt'); }

				if (tagName === 'code') {
					contentItem.appendChild(content[j].code());
					continue;
				}

				var contentPart = createEl({
					type: tagName,
					text: (tagName === 'pre' ? contentText : ''),
					className: ((j === 0) ? 'contentTitle' : '')
				});
				contentPart.innerHTML += (tagName === 'pre' ? '' : contentText);

				if (content[j].href) {
					var hrefItem = createEl({
						type: 'a'
					});
					hrefItem.setAttribute('href', content[j].href);
					hrefItem.appendChild(contentPart.firstChild);
					contentPart.appendChild(hrefItem);
				}

				contentItem.appendChild(contentPart);
			}
			// add to section
			State.sectionScroll.section.push(contentItem.clientHeight + State.sectionScroll.section[i]);
		}
	}

	function generateContentLink(text, navNum) {

		var linkHolder = createEl({
			type: 'li',
			style:
				'cursor: pointer;'
		});

		var link = createEl({
			type: 'a',
			text: text

		});
		link.setAttribute('navnum', navNum);
		EvtHandler.click(link, 1);
		linkHolder.appendChild(link);

		return linkHolder;
	}

	function generateDemo() {

		var liveDemoHolder = createEl({
			id: 'liveDemoHolder',
			style:
				'width: 100%;' +
				'height: 40px;'
		});
		document.getElementById('row_content_col1').appendChild(liveDemoHolder);

		var liveDemoFrame = createEl({
			id: 'liveDemoFrame',
			className: 'liveDemoFrame',
			style:
				'overflow: hidden;' +
				'width: ' + liveDemoHolder.clientWidth + 'px;' +
				'height: 40px;' +
				'transform: translate3d(0px, 0px, 0px);' +
				'-moz-transform: translate3d(0px, 0px, 0px);' +
				'-webkit-transform: translate3d(0px, 0px, 0px);'

		});
		liveDemoHolder.appendChild(liveDemoFrame);
		liveDemoFrame.style.cssText +=
			'left: ' + liveDemoFrame.offsetLeft + 'px;' +
			'top: ' + liveDemoFrame.offsetTop + 'px;';

		var liveDemoTitle = createEl({
			id: 'liveDemoTitle',
			className: 'liveDemoTitle'
		});
		liveDemoFrame.appendChild(liveDemoTitle);

		var liveDemoTitleText = createEl({
			type: 'span',
			id: 'liveDemoTitleText',
			text: 'Live Demo',
			style:
				'float: left;'
		});
		liveDemoTitle.appendChild(liveDemoTitleText);

		var liveDemoBtn = createEl({
			id: 'liveDemoBtn',
			className: 'liveDemoBtn overlooked'
		});
		liveDemoBtn.title = 'Enlarge Demo';
		liveDemoBtn.addEventListener('click', toogleDemo, false);

		var liveDemoBtnIcon = createEl({
			id: 'liveDemoBtnIcon',
			style:
				'width: 20px;' +
				'height: 20px;' +
				'background: url(./images/icon_resize_lg.png);'
		});
		liveDemoBtn.appendChild(liveDemoBtnIcon);
		liveDemoTitle.appendChild(liveDemoBtn);

		var liveDemo = createEl({
			type: 'iframe',
			id: 'liveDemo',
			className: 'liveDemo',
			style:
				'height: 0px;'
		});
		liveDemo.src = './liveDemo.html';
		liveDemoFrame.appendChild(liveDemo);

		liveDemo.onload = LiveDemo.init;
	}

	function generateBackNavi() {

		var holder = createEl({
			id: 'backNaviHolder',
			style:
				'position: relative;' +
				'width: 100%;'
		});
		document.getElementById('row_content_col1').appendChild(holder);

		var frame = createEl({
			style:
				'position: fixed;' +
				'bottom: 10px;' +
				'width: ' + holder.clientWidth + 'px;'
		});
		holder.appendChild(frame);

		var btnBackToTop = createEl({
			text: (lang === 'zh-TW') ? '返回頂端' : 'Top',
			className: 'backNaviItem',
			style:
				'margin-bottom: 0px;' +
				'padding: 0px;' +
				'height: 0px;'
		});
		btnBackToTop.setAttribute('navnum', 0);
		EvtHandler.click(btnBackToTop, 1);
		frame.appendChild(btnBackToTop);

		var btnBackToMathod = createEl({
			text: ((lang === 'zh-TW') ? '返回' : '') + ContentHead[5],
			className: 'backNaviItem',
			style:
				'margin-bottom: 0px;' +
				'padding: 0px;' +
				'height: 0px;'
		});
		btnBackToMathod.setAttribute('navnum', 5);
		EvtHandler.click(btnBackToMathod, 1);
		frame.appendChild(btnBackToMathod);

		var btnBackToSettings = createEl({
			text: ((lang === 'zh-TW') ? '返回' : '') + ContentHead[6],
			className: 'backNaviItem',
			style:
				'margin-bottom: 0px;' +
				'padding: 0px;' +
				'height: 0px;'
		});
		btnBackToSettings.setAttribute('navnum', 6);
		EvtHandler.click(btnBackToSettings, 1);
		frame.appendChild(btnBackToSettings);
	}

	function generateFooter() {

		var footer = createEl({
			id: 'footer',
			text: 'This is Footer.',
			className: 'footer'
		});
		body.appendChild(footer);
		// modify last section
		var section = State.sectionScroll.section;

		section[section.length - 1] -= (Setting.contentHeight - footer.clientHeight);
	}

	function checkScrollState() { // for document initial

		var el = (State.isBodyScrollable || (State.isBodyScrollable = Is.bodyScrollable())) ? body : html;
		var sectionNum = State.sectionScroll.sectionNum = Determine.sectionNum(el);
		console.log('SectionNum:', sectionNum);
		lightNav(sectionNum, ((sectionNum === Content.length) ? 0 : 1));
		hashChange();
	}

	var EvtHandler = {

		method: function(Switch) {

			return (Switch ? 'add' : 'remove') + 'EventListener';
		},

		click: function(el, Switch) { // for navItems

			el[EvtHandler.method(Switch)]('click', click, false);
		},

		scrollValueChange: function(Switch) {

			document[EvtHandler.method(Switch)]('scroll', scrollValueChange, false);
		},

		hashchange: function(Switch) {

			window[EvtHandler.method(Switch)]('hashchange', hashChange, false);
		},

		wheel: function (Switch) {

			document[EvtHandler.method(Switch)]('wheel', wheel, false);
		},
	};
	// user action
	function wheel(e) {

		if (State.onScroll) { e.preventDefault(); }
	}

	function click(e) { // listener: navItems
		
		if (State.onScroll) { return; }

		var href = this.href;
		// get section number
		var sectionNum = this.getAttribute('navnum') * 1;
		// update state
		State.onScroll = true;
		// scroll
		sectionScrollTo(sectionNum, function() {
			// update state
			State.onScroll = false;
		});
	}

	function scrollValueChange(e) {
		//console.log('ScrollValueChange');
		if (State.onScroll) { return; }

		var isBodyScrollable = (State.isBodyScrollable !== undefined) ? State.isBodyScrollable : State.isBodyScrollable = Is.bodyScrollable();
		var scrollEl = isBodyScrollable ? body : html;
		var sectionNum = Determine.sectionNum(scrollEl);

		document.activeElement.blur();
		// switch navItem
		lightNav(sectionNum, ((sectionNum === Content.length) ? 0 : 1));
		// update sectionNum
		State.sectionScroll.sectionNum = sectionNum;
		// toogle backNavi
		if (sectionNum < 7) {
			toogleBackNavi(0, 0);
			toogleBackNavi(1, 0);
			toogleBackNavi(2, 0);

			if (sectionNum > 0) { toogleBackNavi(0, 1); }

			if (sectionNum === 5 || sectionNum === 6) {
				toogleBackNavi((sectionNum - 4), 1);
			}
		}
	}

	function hashChange(e) { // hub of user action
		console.log('Hash change', e);
		if (State.onScroll) { return; }

		var hash = window.location.hash.replace('#', '');
		//console.log(State.onDemo, hash);
		if (State.onDemo && hash !== 'demo') { toogleDemo(); }
	}
	// liveDemo
	var LiveDemo = {

		Content: [
			{title: 'Image', id: 'caseImage'},
			{title: 'CruiseMark', id: 'caseCruiseMark'},
			{title: 'Transmit', id: 'caseTransmit'},
			{title: 'Select', id: 'caseSelect'}
		],

		ControlCode: [
			{name: 'active()', code: 'active()', oppositeNum: 1, def: true, exe: function() { liveDemo.window.rightCruise.active(); }},
			{name: 'sleep()', code: 'sleep()', oppositeNum: 0, exe: function() { liveDemo.window.rightCruise.sleep(); }},
			{name: 'scrollMarkedElOnly: true', code: 'set({\n  scrollMarkedElOnly: true\n})', oppositeNum: 3, exe: function() { liveDemo.window.rightCruise.set({scrollMarkedElOnly: true}); }},
			{name: 'scrollMarkedElOnly: false', code: 'set({\n  scrollMarkedElOnly: false\n})', oppositeNum: 2, def: true, exe: function() { liveDemo.window.rightCruise.set({scrollMarkedElOnly: false}); }},
			{name: 'transmit: true', code: 'set({\n  transmit: true\n})', oppositeNum: 5, def: true, exe: function() { liveDemo.window.rightCruise.set({transmit: true}); }},
			{name: 'transmit: false', code: 'set({\n  transmit: false\n})', oppositeNum: 4, exe: function() { liveDemo.window.rightCruise.set({transmit: false}); }},
			{name: 'oneDirection: true', code: 'set({\n  oneDirection: true\n})', oppositeNum: 7, exe: function() { liveDemo.window.rightCruise.set({oneDirection: true}); }},
			{name: 'oneDirection: false', code: 'set({\n  oneDirection: false\n})', oppositeNum: 6, def: true, exe: function() { liveDemo.window.rightCruise.set({oneDirection: false}); }},
			{name: 'momentum: true', code: 'set({\n  momentum: true\n})', oppositeNum: 9, def: true, exe: function() { liveDemo.window.rightCruise.set({momentum: true}); }},
			{name: 'momentum: false', code: 'set({\n  momentum: false\n})', oppositeNum: 8, exe: function() { liveDemo.window.rightCruise.set({momentum: false}); }},
			{name: 'maxHeight: 400', code: 'set({\n  maxHeight: 400\n})', oppositeNum: 11, exe: function() { liveDemo.window.rightCruise.set({maxHeight: 400}); }},
			{name: 'maxHeight: 800', code: 'set({\n  maxHeight: 800\n})', oppositeNum: 10, exe: function() { liveDemo.window.rightCruise.set({maxHeight: 800}); }},
			{name: 'zIndex: 100', code: 'set({\n  zIndex: 100\n})', oppositeNum: 13, exe: function() { liveDemo.window.rightCruise.set({zIndex: 100}); }},
			{name: 'zIndex: 800', code: 'set({\n  zIndex: 800\n})', oppositeNum: 12, exe: function() { liveDemo.window.rightCruise.set({zIndex: 800}); }}
		],

		State: {
			onCode: false, // for LiveDemo.codeConsole()
			onMove: false, // throttle of LiveDemo.movePanel() triggered by mousemove event
			startPos: [], // for LiveDemo.movePanel()
			lastPos: [], // for LiveDemo.movePanel()
			panelPos: [0, 0], // for LiveDemo.movePanel()
		},
		
		Node: {
			container: null,
			naviHolder: null,
			panelHolder: null,
			panelMonitor: null,
			panelConsole: null,
			contentHolder: null,
			contentItems: {}, // generate by LiveDemo.generateMainframe()
		},

		Timer: {
			codeConsole: null
		},

		init: function() {

			var liveDemoWindow = document.getElementById('liveDemo').contentWindow;

			liveDemo = {
				window: liveDemoWindow,
				document: liveDemoWindow.document,
				html: liveDemoWindow.document.documentElement,
				body: liveDemoWindow.document.body
			};
			//console.log('Initial LiveDemo', liveDemo);
			liveDemo.body.style.overflow = 'auto';
			LiveDemo.generateMainframe();
			LiveDemo.generateNavigator();
			LiveDemo.generatePanel();

			var itemsName = Object.keys(LiveDemo.generateContent);
			var i;

			for (i = 0; i < itemsName.length; i++) {
				LiveDemo.generateContent[itemsName[i]]();
			}
		},

		generateMainframe: function() {

			var container = LiveDemo.Node.container = createEl({
				id: 'container',
				style:
					'margin: 0 auto;' +
					'max-width: 960px;' +
					'min-height: 80%;'
			});
			liveDemo.body.appendChild(container);
			// navigator
			var naviHolder = LiveDemo.Node.naviHolder = createEl({
				id: 'naviHolder',
				style:
					'position: relative;' +
					'width: 100%;' +
					'height: 140px;'
			});
			container.appendChild(naviHolder);
			// panel
			var boxShadowValue = '0 0 9px 1px #000;';
			var panelHolder = LiveDemo.Node.panelHolder = createEl({
				id: 'panelHolder',
				className: 'panel panel-default',
				style:
					'z-index: 500;' +
					'position: fixed;' +
					'right: 10px;' +
					'top: 60x;' +
					'width: 260px;' +
					'box-shadow: ' + boxShadowValue +
					'-moz-box-shadow: ' + boxShadowValue +
					'-webkit-box-shadow: ' + boxShadowValue
			});
			container.appendChild(panelHolder);
			// content
			var contentHolder = LiveDemo.Node.contentHolder = createEl({
				id: 'contentHolder',
				style:
					''
			});
			container.appendChild(contentHolder);

			var Content = LiveDemo.Content;
			var i;

			for (i = 0; i < Content.length; i++) {
				var contentItem = createEl({
					style:
						'display: ' + ((i === 0) ? 'block' : 'none') + ';' +
						'padding-bottom: 0;' +
						'min-height: 640px;'
				});
				contentHolder.appendChild(contentItem);
				LiveDemo.Node.contentItems[Content[i].id] = contentItem;

				var contentTitle = createEl({
					type: 'h3',
					id: Content[i].id,
					text: 'Case: ' + Content[i].title,
					style:
						'padding-bottom: 10px;' +
						'width: 25%;' +
						'border-bottom: 1px solid #CCC;'
				});
				contentItem.appendChild(contentTitle);
			}
		},

		generateNavigator: function() {

			var Content = LiveDemo.Content;
			var naviHolder = LiveDemo.Node.naviHolder;
			var naviFrame = createEl({
				type: 'ul',
				className: 'nav nav-pills nav-justified',
				style:
					'position: fixed;' +
					'padding: 80px 15px 10px 15px;' +
					'width: 930px;' +
					'background: #FFF;' +
					'border-bottom: 1px solid #CCC;'
			});
			naviHolder.appendChild(naviFrame);
			
			for (i = 0; i < Content.length; i++) {
				var naviItem = createEl({
					type: 'li',
					className: (i === 0) ? 'active' : '',
					style:
						'cursor: pointer;'
				});
				naviItem.setAttribute('contentitemnum', i);
				naviItem.setAttribute('role', 'presentation');
				naviItem.addEventListener('click', LiveDemo.changeContent, false);
				naviFrame.appendChild(naviItem);

				var naviLink = createEl({
					type: 'a',
					text: Content[i].title
				});
				naviItem.appendChild(naviLink);
			}
		},

		generatePanel: function() {

			var Code = LiveDemo.ControlCode;
			var panelHolder = LiveDemo.Node.panelHolder;
			var phead = createEl({
				className: 'panel-heading',
				text: 'ControlPanel',
				style:
					'cursor: move;' +
					'-ms-user-select: none;' +
					'-moz-user-select: none;' +
					'-webkit-user-select: none;'
			});
			phead.addEventListener('mousedown', LiveDemo.movePanel, false);
			panelHolder.appendChild(phead);

			var pmonitor = LiveDemo.Node.panelMonitor = createEl({
				id: 'monitor',
				text: 'event state',
				style:
					'float: right;' +
					'width: 8em;' +
					'height: 18px;' +
					'line-height: 18px;' +
					'background: #333;' +
					'font-family: Consolas, "Source Code Pro";' +
					'text-align: center;' +
					'color: #EEE;' +
					'border: 1px solid #CCC;' +
					'border-radius: 2px;'
			});
			liveDemo.document.addEventListener('cruise', LiveDemo.updateEventState, false);
			liveDemo.document.addEventListener('cruiseend', LiveDemo.updateEventState, false);
			phead.appendChild(pmonitor);

			var pbody = createEl({
				className: 'panel-body'
			});
			panelHolder.appendChild(pbody);

			var pconsole = LiveDemo.Node.panelConsole = createEl({
				type: 'textarea',
				style:
					'resize: none;' +
					'width: 100%;' +
					'height: 6.5em;' +
					'background: #333;' +
					'font-family: Consolas, "Source Code Pro";' +
					'color: #EEE;'
			});
			pconsole.value = 'Press following buttons to change setting.';
			pconsole.setAttribute('spellcheck', false);
			pconsole.setAttribute('readonly', true);
			pbody.appendChild(pconsole);

			var plist = createEl({
				type: 'ul',
				className: 'list-group',
				style:
					'overflow: auto;' +
					'margin: 15px 0 0 0;'
			});
			pbody.appendChild(plist);

			var i;

			for (i = 0; i < Code.length; i++) {
				var listItem = createEl({
					type: 'a',
					id: 'listItem' + i,
					text: Code[i].name,
					className: 'list-group-item',
					style:
						'height: 34px;' +
						'line-height: 14px;' +
						'font-size: 14px;' +
						'cursor: pointer;'
				});
				if (Code[i].def) { listItem.classList.add('active'); }
				listItem.setAttribute('codenum', i);
				listItem.addEventListener('click', LiveDemo.codeConsole, false);
				plist.appendChild(listItem);
			}
		},

		generateContent: {

			caseImage: function() {

				var Content = LiveDemo.Content;
				var contentHolder = LiveDemo.Node.contentItems.caseImage;
				var imageHolder = createEl({
					style:
						'overflow: auto;' +
						'margin: 15px auto;' +
						'width: 640px;' +
						'height: 640px;' +
						'background: #CCC;' +
						'border: 1px solid #CCC;' +
						'border-radius: 2px;'
				});
				var img = createEl({ type: 'img' });

				img.setAttribute('draggable', false);
				img.src = './images/iceberg-643567_1920.jpg';
				imageHolder.appendChild(img);		
				contentHolder.appendChild(imageHolder);
			},

			caseCruiseMark: function() {

				var Content = LiveDemo.Content;
				var contentHolder = LiveDemo.Node.contentItems.caseCruiseMark;
				var row = createRow({
					row: {

					},
					col: {
						style:
							'',
						amount: 2,
						width: ['50%', '50%']
					}
				});
				contentHolder.appendChild(row);

				var col0 = row.children[0];
				var col1 = row.children[1];
				var head0 = createEl({ type: 'h4', text: 'Normal Element'});
				var title00 = createEl({ type: 'p', text: 'style.overflow = auto'});
				var normalEl0 = createEl({
					style:
						'overflow: auto;' +
						'margin-bottom: 15px;' +
						'padding: 15px;' +
						'width: 100%;' +
						'height: 320px;' +
						'background: #EEE;' +
						'border: 1px solid #CCC;' +
						'border-radius: 2px;'
				});
				col0.appendChild(head0);
				col0.appendChild(title00);
				col0.appendChild(normalEl0);

				var normalChild = createEl({ type: 'img' });

				normalChild.setAttribute('draggable', false);
				normalChild.src = './images/iceberg-643567_1920.jpg';
				normalEl0.appendChild(normalChild);

				var title01 = createEl({ type: 'p', text: 'style.overflow = hidden'});
				var normalEl1 = normalEl0.cloneNode(true);

				normalEl1.style.overflow = 'hidden';
				col0.appendChild(title01);
				col0.appendChild(normalEl1);

				var head1 = createEl({ type: 'h4', text: 'Marked Element'});
				var title10 = createEl({ type: 'p', text: 'style.overflow = auto'});
				var markedEl0 = normalEl0.cloneNode(true);

				markedEl0.setAttribute('cruisemark', true);
				col1.appendChild(head1);
				col1.appendChild(title10);
				col1.appendChild(markedEl0);

				var title11 = createEl({ type: 'p', text: 'style.overflow = hidden'});
				var markedEl1 = markedEl0.cloneNode(true);

				markedEl1.style.overflow = 'hidden';
				col1.appendChild(title11);
				col1.appendChild(markedEl1);
			},

			caseTransmit: function() {

				var Content = LiveDemo.Content;
				var contentHolder = LiveDemo.Node.contentItems.caseTransmit;
				var transmitParent = createEl({
					style:
						'overflow: auto;' +
						'margin: 0 auto;' +
						'padding: 15px;' +
						'width: 640px;' +
						'height: 640px;' +
						'background: #EEE;' +
						'border: 1px solid #CCC;' +
						'border-radius: 2px;'
				});
				contentHolder.appendChild(transmitParent);

				var transmitChild = createEl({
					style:
						'overflow: auto;' +
						'margin: 0 auto;' +
						'width: 320px;' +
						'height: 320px;' +
						'background: #EEE;' +
						'border: 1px solid #CCC;'
				});
				transmitChild.appendChild(createEl({
					type: 'h4',
					text: '<TEXTAREA>'
				}));
				transmitParent.appendChild(transmitChild);

				var transmitFiller = createEl({
					style:
						'width: 960px;' +
						'height: 960px;'
				});
				transmitParent.appendChild(transmitFiller);

				var transmitGson = createEl({
					type: 'textarea',
					style:
						'width: 100%;' +
						'height: 50%;'
				});
				transmitGson.value = 'Cruising is a social activity that primarily consists of driving a car. Cruising can be an expression of the freedom of possessing a driver\'s license. Cruising is distinguished from regular driving by the social and recreational nature of the activity, which is characterized by an impulsively random, often aimless course. A popular route (or "strip") is often the focus of cruising. "Cruise nights" are evenings during which cars drive slowly, bumper-to-bumper, through small towns. Another common form is a "Booze Cruise": this is where a group of people go out "cruising" and drinking. A cruise can be a meeting of car enthusiasts at a predetermined location, organised predominantly through the internet (in recent times) but also largely through mobile phone, word of mouth or simply by a cruise being established enough that it becomes a regular event.';
				transmitChild.appendChild(transmitGson);
			},

			caseSelect: function() {

				var Content = LiveDemo.Content;
				var contentHolder = LiveDemo.Node.contentItems.caseSelect;
				var content_select = [
					{text: 'optgroup0', childrenAmount: 5},
					{text: 'optgroup1(disabled)', childrenAmount: 10},
					{text: 'optgroup2', childrenAmount: 20},
					{text: 'optgroup3', childrenAmount: 40},
					{text: 'optgroup4', childrenAmount: 80},
				];
				var selectHolder = createEl({
					type: 'select',
					style:
						'display: block;' +
						'margin: 15px auto;' +
						'width: 400px;'
				});
				var i;

				for (i = 0; i < content_select.length; i++) {
					var disabled = (i === 1) ? true : false;
					var optgroup = createEl({
						type: 'optgroup'
					});
					optgroup.label = content_select[i].text;
					selectHolder.appendChild(optgroup);

					for (j = 0; j < content_select[i].childrenAmount; j++) {
						var option = createEl({
							type: 'option',
							text: (content_select[i].text + '_' + j),
							style:
								'color: #' + parseInt(Math.random() * 1000) + ';'
						});
						option.disabled = disabled;
						optgroup.appendChild(option);
					}
				}
				contentHolder.appendChild(selectHolder);
			},
		},

		// mathods
		changeContent: function() {
			// this = naviItem
			var items = LiveDemo.Node.contentItems;
			var itemsName = Object.keys(items);
			var naviItems = LiveDemo.Node.naviHolder.firstChild.children;
			var itemNum = this.getAttribute('contentitemnum');
			var i;

			for (i = 0; i < itemsName.length; i++) {
				items[itemsName[i]].style.display = 'none';
				naviItems[i].classList.remove('active');
			}

			items[itemsName[itemNum]].style.display = 'block';
			naviItems[itemNum].classList.add('active');
		},

		updateEventState: function(e) {

			var monitor = LiveDemo.Node.panelMonitor;

			monitor.textContent = e.type;

			if(e.type === 'cruiseend') {
				// clean monitor after 1000ms
				setTimeout(function() {

					monitor.textContent = 'event state';
				}, 1000);
			}
		},

		movePanel: function(e) {

			var State = LiveDemo.State;
			var panelPos = State.panelPos;
			var userSelectValue = 'user-select:';
			// move start
			if (e.type === 'mousedown' && e.button === 0) {
				userSelectValue += 'none;';

				liveDemo.body.style.cssText +=
					'-ms-' + userSelectValue +
					'-moz-' + userSelectValue +
					'-webkit-' + userSelectValue;

				State.startPos = [e.clientX, e.clientY];
				
				liveDemo.document.addEventListener('mousemove', LiveDemo.movePanel, false);
				liveDemo.document.addEventListener('mouseup', LiveDemo.movePanel, false);
				return;
			}
			// move
			if (e.type === 'mousemove') {

				if (State.onMove) { return; }

				State.onMove = true;
				
				window.requestAnimationFrame(function() {

					if (!State.onMove) { return; }

					var startPos = State.startPos;
					var movePos = State.lastPos = [e.clientX, e.clientY];
					var gap = [
						movePos[0] - startPos[0],
						movePos[1] - startPos[1]
					];
					var transformValue;

					gap[0] += panelPos[0];
					gap[1] += panelPos[1];

					transformValue = 'transform: translate3d(' + gap[0] + 'px, ' + gap[1] + 'px, 0px);';

					LiveDemo.Node.panelHolder.style.cssText +=
						transformValue +
						'-moz-' + transformValue +
						'-webkit-' + transformValue;

					State.onMove = false;
				});
			}
			// move end
			if (e.type === 'mouseup') {
				var startPos = State.startPos;
				var endPos = State.lastPos;
				var gap = [
					endPos[0] - startPos[0],
					endPos[1] - startPos[1]
				];

				State.onMove = false;

				userSelectValue += 'initial;';

				liveDemo.body.style.cssText +=
					'-ms-' + userSelectValue +
					'-moz-' + userSelectValue +
					'-webkit-' + userSelectValue;

				panelPos[0] += gap[0];
				panelPos[1] += gap[1];
				liveDemo.document.removeEventListener('mousemove', LiveDemo.movePanel, false);
				liveDemo.document.removeEventListener('mouseup', LiveDemo.movePanel, false);
			}
		},

		codeConsole: function() {

			var State = LiveDemo.State;

			if (State.onCode) { return; }

			var Code = LiveDemo.ControlCode;
			var pconsole = LiveDemo.Node.panelConsole;
			var codeNum = this.getAttribute('codenum');
			var oppositeNum = Code[codeNum].oppositeNum;
			var code = ('rightCruise.' + Code[codeNum].code + ';').split('');
			var catchValue = '';
			var countLimit = code.length;
			var count = 0;
			// update state
			State.onCode = true;
			// clean and set active
			liveDemo.document.getElementById('listItem' + oppositeNum).classList.remove('active');
			this.classList.add('active');
			// clean console
			pconsole.value = '';
			// code console
			LiveDemo.Timer.codeConsole = setInterval(function() {

				catchValue += code.shift();
				pconsole.value = catchValue + '_';
				count++;
				// check if end of code
				if (count === countLimit) {
					clearInterval(LiveDemo.Timer.codeConsole);
					pconsole.value = catchValue + '\n_';
					Code[codeNum].exe();
					setTimeout(function() {

						pconsole.value = catchValue;
						State.onCode = false;
					}, 1000 / 20);
				}
			}, 1000 / 20);
		}
	};
	// view changers
	function lightNav(navNum, Switch) {

		var navItems = document.getElementsByClassName('navItem');
		var i;
		
		for (i = 0; i < navItems.length; i++) {
			navItems[i].classList.remove('selected');
			navItems[i].classList.add('overlooked');
		}

		if (Switch) {
			navItems[navNum].classList.add('selected');
			navItems[navNum].classList.remove('overlooked');
		}
	}

	function sectionScrollTo(sectionNum, callback) {
		//console.log(sectionNum);
		if (sectionNum === State.sectionScroll.sectionNum) {
			callback();
			return;
		}

		var isBodyScrollable = (State.isBodyScrollable !== undefined) ? State.isBodyScrollable : (State.isBodyScrollable = Is.bodyScrollable());
		var scrollEl = isBodyScrollable ? body : html;
		var FPS = State.sectionScroll.fps;
		var Duration = State.sectionScroll.duration; // animate duration, ms
		var dpf = 1000 / FPS; // duration(ms) per frame
		var frames = Math.round(Duration / dpf);
		var middleFram = Math.round(frames / 2);
		var parity = (frames % 2) ? 1 : 2; // 1: odd, 2: even
		var accelerateTimes = (frames + parity) * middleFram / 2;
		var frameCount = 0;
		var ScrollValue = scrollEl.scrollTop; // now scrollValue
		var scrollValue = State.sectionScroll.section[sectionNum]; // target scrollValue
		var gap = Math.abs(scrollValue - ScrollValue);
		var acceleration = gap / accelerateTimes;
		var delta = (scrollValue > ScrollValue) ? 1 : -1;
		var spf = 0; // speed(px) per frame
		var timemark = Date.now();
		
		State.timer.sectionScroll = setInterval(function() {
			//console.log('Section scrolling...', State.onScroll);
			// update speed
			if (acceleration > 0) {
				if (
					parity === 1 && frameCount >= middleFram ||
					parity === 2 && frameCount > middleFram
				) { acceleration *= -1; }
			}
			if (
				parity === 1 ||
				parity === 2 && frameCount !== middleFram
			) { spf += acceleration; }
			// scroll
			scrollEl.scrollTop += (delta * Math.round(spf));
			// update FrameCount
			frameCount++;
			// check if end of scroll
			if (frameCount >= frames) {
				// match value
				scrollEl.scrollTop = scrollValue;
				// clear interval
				clearInterval(State.timer.sectionScroll);
				// update State
				State.sectionScroll.sectionNum = sectionNum;
				console.log('End of scrolling, duration:', Date.now() - timemark, 'ms');
				// callback
				if (callback) { callback(); }
			}
		}, 1000 / FPS);
	}

	function toogleDemo() {

		var Switch = State.onDemo ? false : true;
		var isBodyScrollable = (State.isBodyScrollable !== undefined) ? State.isBodyScrollable : (State.isBodyScrollable = Is.bodyScrollable());
		var scrollEl = isBodyScrollable ? body : html;
		var brand = document.getElementById('brand');
		var holder = document.getElementById('liveDemoHolder');
		var frame = document.getElementById('liveDemoFrame');
		var btnIcon = document.getElementById('liveDemoBtnIcon');
		var liveDemo = document.getElementById('liveDemo');
		var transformValue = Switch ? 'translate3d(-' + (frame.offsetLeft + 1) + 'px, -' + (frame.offsetTop + 45) + 'px, 0px);' : 'translate3d(0px, 0px, 0px);';
		var overflowDelayTime = (Switch ? 0 : 250);

		State.onDemo = Switch;

		if (Switch) { window.location.hash = 'demo'; }

		window.setTimeout(function() {

			frame.style.overflow = (Switch ? 'visible' : 'hidden');
		}, overflowDelayTime);

		brand.children[0].style.opacity = (Switch ? 1 : 0);
		body.style.overflow = (Switch ? 'hidden' : 'visible');
		liveDemo.style.cssText +=
			'width: ' + (Switch ? window.innerWidth + 'px;' : '0px;') +
			'height: ' + (Switch ? window.innerHeight + 'px;' : '0px;') +
			'transform: ' + transformValue +
			'-moz-transform: ' + transformValue +
			'-webkit-transform: ' + transformValue;
		
		liveDemoBtn.title = (Switch ? 'Go Back' : 'Enlarge Demo');
		liveDemoBtn.classList[Switch ? 'add' : 'remove']('liveDemoBtnOn');
		btnIcon.style.background = 'url(./images/icon_' + (Switch ? 'back' : 'resize_lg') + '.png)';
	}

	function toogleBackNavi(naviNum, Switch) {

		var el = document.getElementById('backNaviHolder').children[0].children[naviNum];
		var value = Switch ? null : 0 + 'px';

		el.style.marginBottom = value;
		el.style.paddingTop = value;
		el.style.paddingRight = value;
		el.style.paddingBottom = value;
		el.style.paddingLeft = value;
		el.style.height = value;
	}
	// helper
	function createEl(args) {
		/*
		args: {
			type, id, classNmae, style, text
		}
		*/
		if (!args) { args = {}; }
		if (!args.type) { args.type = 'div'; }

		var el = document.createElement(args.type);

		if (args.id) { el.id = args.id; }
		if (args.className) {
			var classes = args.className.split(' ');
			var i;

			for (i = 0; i < classes.length; i++) {
				el.classList.add(classes[i]);
			}
		}
		if (args.style) { el.style.cssText += args.style; }
		if (args.text) { el.appendChild(document.createTextNode(args.text)); }

		return el;
	}

	function createRow(args) {
		/*
		args: {
			row: {
				id, className, style
			},
			col: {
				id(head-token), className(separate with space), style(with semicolon), amount(number),
				width(format: 12(='12px'), '12px', '12%'. Array)
			}
		}
		*/
		var row = createEl({
			id: args.row.id,
			className: 'row ' + args.row.className,
			style: args.row.style
		});
		var pcSum = 0; // pc: percentage
		var pxSum = 0;
		var width = {
			value: [],
			unit: []
		};
		var i;
		// add up pxSum, pcSum
		for (i = 0; i < args.col.amount; i++) {
			var widthValue = args.col.width[i].toString();
			var value = width.value[i] = parseFloat(widthValue);
			var unit = width.unit[i] = (widthValue.replace(value, '') || 'px');

			if (unit === '%') { pcSum += value; }
			else { pxSum += value; }
		}
		//console.log(width.value, width.unit, pcSum, pxSum);
		// evaluate value if fomat = '%'
		for (i = 0; i < args.col.amount; i++) {
			if (width.unit[i] === '%') { width.value[i] = width.value[i] / pcSum; }
		}
		//console.log(width.value);
		// generate columns
		for (i = 0; i < args.col.amount; i++) {
			var widthAttribute;

			if (width.unit[i] === 'px') {
				widthAttribute = width.value[i] + 'px';
			} else { // unit === '%'
				widthAttribute = 'calc((100% - ' + pxSum + 'px) * ' + width.value[i] + ')';
			}
			var col = createEl({
				id: args.col.id ? args.col.id + i : '',
				className: 'col',
				style:
					'width: ' + widthAttribute + ';' +
					args.col.style
			});

			row.appendChild(col);
		}

		return row;
	}

	function setHashByDelta(delta) {

		var sectionNum = Math.max(State.sectionScroll.sectionNum + delta, 0);
		// change hash
		window.location.hash = ContentHead[sectionNum] || 'foot'; // 'foot' is the replacement of 'footer', prevent bookmark scroll
		// then, hashChange() will do all the left things
	}

	function convertSectionTitleToHash(sectionNum) {

		var tagName = Object.keys(Content[sectionNum][0])[0];
		var text = Content[sectionNum][0][tagName];

		text = (text.constructor === Array) ? text[(lang === 'zh-TW') ? 0 : 1] : text;

		return text.replace(/ /g, '').replace(/\./g, '');
	}

	var Is = {

		bodyScrollable: function() { // check at initial

			var body = document.body;
			var bodyWidth = body.style.width || 0;
			var windowWidth = document.documentElement.clientWidth;
			var bodyScrollLeft = body.scrollLeft;
			// prepare
			body.style.width = Math.max(parseFloat(bodyWidth), windowWidth) + 1 + 'px';
			body.scrollLeft = 1;
			// check
			var scrollable = body.scrollLeft ? true : false;
			// recover
			body.scrollLeft = bodyScrollLeft;
			body.style.width = bodyWidth ? bodyWidth : null;
			console.log('Body scrollable:', scrollable);

			return scrollable;
		},
	};

	var Determine = {

		sectionNum: function(el) {

			var section = State.sectionScroll.section;
			var scrollTop = el.scrollTop;
			var i;
			// reverse check
			for (i = (section.length - 1); i > -1; i--) {
				if (scrollTop >= section[i]) {
					//console.log('Section Number:', i);
					return i;
				}
			}
		}
	};

	window.onload = function() {

		html = document.documentElement;
		body = document.body;

		demo();
	};
}());
