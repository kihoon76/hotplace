package me.hotplace.domain;

import org.apache.ibatis.type.Alias;

@Alias("AcceptBuilding")
public class AcceptBuilding {

	private String pnu;							//PNU 코드
	private String goyubeonho;					//고유번호 
	private String acceptnum;					//허가번호
	private String acceptgubun;					//허가구분
	private String acceptsingoil;				//허가신고일
	private String gwanligigan;					//관리기간
	private String buildinggubun;				//건축구분
	private String daejiwichi;					//대지위치 
	private String jimok;						//지목
	private String daejiarea;					//대지면적
	private String buildingarea;				//건축면적
	private String geonpyeyul;					//건폐율
	private String grossfloorarea;				//연면적
	private String yongjeoglyul;				//용적율
	private String areaforcalcyjl;				//용적율 산정을 위한 면적
	private String buildingname;				//건축물 명칭
	private String mainyongdo;					//주용도
	private String mainbuildingcount;			//주건축물 수
	private String subbuildingcount;			//부속 건축물수
	private String parkin;						//주차장 자주식 옥내대
	private String parkout;						//주차장 자주식 옥외대
	private String parkaround;					//주차장 자주식 인근대
	private String mparkin;						//주차장 기계식 옥내대
	private String mparkout;					//주차장 기계식 옥외대
	private String mparkaround;					//주차장 기계식 인근대
	private String startgubun;					//착공구분 (착공|미착공)
	private String expectedstart;				//착공예정일
	private String realstart;					//실착공일
	private String acceptusegubun;				//사용승인구분
	private String acceptuseday;				//사용승인일
	private String dongname;					//동별개요 동명칭
	private String dongmainyongdo;				//동별개요 주용도
	private String dongetcyongdo;				//동별개요 기타용도
	private String dongsedae;					//동별개요 세대
	private String dongho;						//동별개요 호
	private String donggagu;					//동별개요 가구
	private String dongmainframe;				//동별개요 주구조
	private String dongetcframe;				//동별개요 기타구조
	private String dongroofframe;				//동별개요 지붕구조
	private String dongbuildingarea;			//동별개요 건축면적
	private String donggfa;						//동별개요 연면적
	private String dongareaforcalcyjl;			//동별개요 용적율 산정용 면적
	private String dongbasementcounnt;			//동별개요 지하층수
	private String donggroundcount;				//동별개요 지상층수
	private String dongheight;					//동별개요 높이
	private String dongelevatorcount;			//동별개요 
	
	 
}
