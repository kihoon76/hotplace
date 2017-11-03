/**
 * @namespace hotplace.database
 */
(function(db, $) {
	
	var _db = {};
	
	/**
	 * @memberof hotplace.database
	 * @function getStartXIdx
	 * @param {string} dataType
	 * @param {number} boundswx 바운드의 극서값 
	 * @param {number} level 현재 화면 줌레벨
	 * @param {number} sIdx 극서로 정렬된 배열 pivot 시작값
	 * @param {number} eIdx 극서로 정렬된 배열 pivot 마지막값
	 * @desc 현재  margin이 적용된  화면의 시작점에서 시작할 데이터 index
	 */
	db.getStartXIdx = function(dataType, boundswx, level, sIdx, eIdx) {
		var result;
		var data = _db[level][dataType];
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
			result = db.getStartXIdx(dataType, boundswx, level, 0, cIdx);
		}
		else {//오른쪽에 있슴
			result = db.getStartXIdx(dataType, boundswx, level, cIdx, eIdx);
		}
		
		//console.log('result ==> ' + result);
		return result;
	}
	
	/**
	 * @memberof hotplace.database
	 * @function setLevelData
	 * @param {number} level
	 * @param {string} dataType
	 * @param {object} data 데이터값
	 * @desc 레벨의 dataType의 data를 저장한다
	 */
	db.setLevelData = function (level, dataType, data) {
		if(!_db[level]) _db[level] = {};
		_db[level][dataType] = data;
	}
	
	/**
	 * @memberof hotplace.database
	 * @function getLevelData
	 * @param {number} level
	 * @param {string} dataType
	 * @desc 레벨의 dataType의 data를 저장한다
	 */
	db.getLevelData = function(level, dataType) {
		 return (_db[level]) ? _db[level][dataType] : null;
	}
	
	/**
	 * @memberof hotplace.db
	 * @function hasData
	 * @param {number} level
	 * @param {string} dataType
	 * @returns {boolean} 해당 레벨에 데이터가 있는지 체크
	 * @desc 해당 레벨에 데이터가 있는지 체크
	 */
	db.hasData = function(level, dataType) {
		if(_db[level] && _db[level][dataType] && _db[level][dataType].length > 0) return true;
		return false;
	}
	
	
	/**
	 * @memberof hotplace.database
	 * @function initLevel
	 * @param {number} level
	 * @param {string} dataType
	 * @desc 레벨의 특정 데이터 타입 또는 전체 데이터를 지운다.
	 */
	db.initLevel = function(level, dataType) {
		if(dataType) {
			if(_db[level] && _db[level][dataType]) _db[level][dataType];
		}
		else {
			if(_db[level]) _db[level] = null;
		}
	}
}(
	hotplace.database = hotplace.database || {},
	jQuery
));
