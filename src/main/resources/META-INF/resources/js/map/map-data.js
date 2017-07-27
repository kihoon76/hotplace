var mapData = function($m) {
	var _db = {};
	
	/*
	 * 서버에서 가져온 전 데이터를 저장
	 * {
	 * 	 'level' : {
	 * 		'data' : [{"weight":2.6,"location":[126.80104492131,37.57776528544,126.80329443915,37.57956742328], "drawed":true}],
	 *      		
	 *    }
	 * }
	 * 
	 * data의 drawed 항목은 DB에서 가져올 때는 없는 항목이고 범위를 구하는 과정에서 추가된다. 
	 * */ 
	
	function isCached(level) {
		return (_db[level]) ? true : false;
	}
	
	/*
	 * 현재  margin이 적용된  화면의 시작점에서 시작할 데이터 index
	 * */
	function getStartXIdx(boundswx, level, sIdx, eIdx) {
		var result;
		var data = _db[level]['data'];
		sIdx = (sIdx == undefined) ? 0 : sIdx;
		eIdx = (eIdx == undefined) ? data.length - 1 : eIdx;
		
		var range = eIdx-sIdx;
		var cIdx = sIdx + Math.floor(range/2);
		var idxValue = data[cIdx].location[0];
		
		if(idxValue == boundswx) return cIdx;
		
		//5개 범위 안에 있으면 그만 찾고 시작점을 반환
		if(range < 5) return sIdx;
		
		//왼쪽에 있슴
		if(idxValue > boundswx) {
			result = getStartXIdx(boundswx, level, 0, cIdx);
		}
		else {//오른쪽에 있슴
			result = getStartXIdx(boundswx, level, cIdx, eIdx);
		}
		
		//console.log('result ==> ' + result);
		return result;
	}
	
	function setLevelData(level, data) {
		_db[level] = {}, _db[level].data = data; 
	}
	
	function hasData(level) {
		if(_db[level] && _db[level].data && _db[level].data.length > 0) return true;
		return false;
	}
	
	function getLevelData(level) {
		 return _db[level].data;
	}
	
	return {
		isCached: isCached,
		getStartXIdx: getStartXIdx,
		setLevelData: setLevelData,
		hasData: hasData,
		getLevelData: getLevelData
	}
}(
		
);