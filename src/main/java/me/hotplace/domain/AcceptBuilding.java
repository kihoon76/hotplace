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
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getGoyubeonho() {
		return goyubeonho;
	}
	public void setGoyubeonho(String goyubeonho) {
		this.goyubeonho = goyubeonho;
	}
	public String getAcceptnum() {
		return acceptnum;
	}
	public void setAcceptnum(String acceptnum) {
		this.acceptnum = acceptnum;
	}
	public String getAcceptgubun() {
		return acceptgubun;
	}
	public void setAcceptgubun(String acceptgubun) {
		this.acceptgubun = acceptgubun;
	}
	public String getAcceptsingoil() {
		return acceptsingoil;
	}
	public void setAcceptsingoil(String acceptsingoil) {
		this.acceptsingoil = acceptsingoil;
	}
	public String getGwanligigan() {
		return gwanligigan;
	}
	public void setGwanligigan(String gwanligigan) {
		this.gwanligigan = gwanligigan;
	}
	public String getBuildinggubun() {
		return buildinggubun;
	}
	public void setBuildinggubun(String buildinggubun) {
		this.buildinggubun = buildinggubun;
	}
	public String getDaejiwichi() {
		return daejiwichi;
	}
	public void setDaejiwichi(String daejiwichi) {
		this.daejiwichi = daejiwichi;
	}
	public String getJimok() {
		return jimok;
	}
	public void setJimok(String jimok) {
		this.jimok = jimok;
	}
	public String getDaejiarea() {
		return daejiarea;
	}
	public void setDaejiarea(String daejiarea) {
		this.daejiarea = daejiarea;
	}
	public String getBuildingarea() {
		return buildingarea;
	}
	public void setBuildingarea(String buildingarea) {
		this.buildingarea = buildingarea;
	}
	public String getGeonpyeyul() {
		return geonpyeyul;
	}
	public void setGeonpyeyul(String geonpyeyul) {
		this.geonpyeyul = geonpyeyul;
	}
	public String getGrossfloorarea() {
		return grossfloorarea;
	}
	public void setGrossfloorarea(String grossfloorarea) {
		this.grossfloorarea = grossfloorarea;
	}
	public String getYongjeoglyul() {
		return yongjeoglyul;
	}
	public void setYongjeoglyul(String yongjeoglyul) {
		this.yongjeoglyul = yongjeoglyul;
	}
	public String getAreaforcalcyjl() {
		return areaforcalcyjl;
	}
	public void setAreaforcalcyjl(String areaforcalcyjl) {
		this.areaforcalcyjl = areaforcalcyjl;
	}
	public String getBuildingname() {
		return buildingname;
	}
	public void setBuildingname(String buildingname) {
		this.buildingname = buildingname;
	}
	public String getMainyongdo() {
		return mainyongdo;
	}
	public void setMainyongdo(String mainyongdo) {
		this.mainyongdo = mainyongdo;
	}
	public String getMainbuildingcount() {
		return mainbuildingcount;
	}
	public void setMainbuildingcount(String mainbuildingcount) {
		this.mainbuildingcount = mainbuildingcount;
	}
	public String getSubbuildingcount() {
		return subbuildingcount;
	}
	public void setSubbuildingcount(String subbuildingcount) {
		this.subbuildingcount = subbuildingcount;
	}
	public String getParkin() {
		return parkin;
	}
	public void setParkin(String parkin) {
		this.parkin = parkin;
	}
	public String getParkout() {
		return parkout;
	}
	public void setParkout(String parkout) {
		this.parkout = parkout;
	}
	public String getParkaround() {
		return parkaround;
	}
	public void setParkaround(String parkaround) {
		this.parkaround = parkaround;
	}
	public String getMparkin() {
		return mparkin;
	}
	public void setMparkin(String mparkin) {
		this.mparkin = mparkin;
	}
	public String getMparkout() {
		return mparkout;
	}
	public void setMparkout(String mparkout) {
		this.mparkout = mparkout;
	}
	public String getMparkaround() {
		return mparkaround;
	}
	public void setMparkaround(String mparkaround) {
		this.mparkaround = mparkaround;
	}
	public String getStartgubun() {
		return startgubun;
	}
	public void setStartgubun(String startgubun) {
		this.startgubun = startgubun;
	}
	public String getExpectedstart() {
		return expectedstart;
	}
	public void setExpectedstart(String expectedstart) {
		this.expectedstart = expectedstart;
	}
	public String getRealstart() {
		return realstart;
	}
	public void setRealstart(String realstart) {
		this.realstart = realstart;
	}
	public String getAcceptusegubun() {
		return acceptusegubun;
	}
	public void setAcceptusegubun(String acceptusegubun) {
		this.acceptusegubun = acceptusegubun;
	}
	public String getAcceptuseday() {
		return acceptuseday;
	}
	public void setAcceptuseday(String acceptuseday) {
		this.acceptuseday = acceptuseday;
	}
	public String getDongname() {
		return dongname;
	}
	public void setDongname(String dongname) {
		this.dongname = dongname;
	}
	public String getDongmainyongdo() {
		return dongmainyongdo;
	}
	public void setDongmainyongdo(String dongmainyongdo) {
		this.dongmainyongdo = dongmainyongdo;
	}
	public String getDongetcyongdo() {
		return dongetcyongdo;
	}
	public void setDongetcyongdo(String dongetcyongdo) {
		this.dongetcyongdo = dongetcyongdo;
	}
	public String getDongsedae() {
		return dongsedae;
	}
	public void setDongsedae(String dongsedae) {
		this.dongsedae = dongsedae;
	}
	public String getDongho() {
		return dongho;
	}
	public void setDongho(String dongho) {
		this.dongho = dongho;
	}
	public String getDonggagu() {
		return donggagu;
	}
	public void setDonggagu(String donggagu) {
		this.donggagu = donggagu;
	}
	public String getDongmainframe() {
		return dongmainframe;
	}
	public void setDongmainframe(String dongmainframe) {
		this.dongmainframe = dongmainframe;
	}
	public String getDongetcframe() {
		return dongetcframe;
	}
	public void setDongetcframe(String dongetcframe) {
		this.dongetcframe = dongetcframe;
	}
	public String getDongroofframe() {
		return dongroofframe;
	}
	public void setDongroofframe(String dongroofframe) {
		this.dongroofframe = dongroofframe;
	}
	public String getDongbuildingarea() {
		return dongbuildingarea;
	}
	public void setDongbuildingarea(String dongbuildingarea) {
		this.dongbuildingarea = dongbuildingarea;
	}
	public String getDonggfa() {
		return donggfa;
	}
	public void setDonggfa(String donggfa) {
		this.donggfa = donggfa;
	}
	public String getDongareaforcalcyjl() {
		return dongareaforcalcyjl;
	}
	public void setDongareaforcalcyjl(String dongareaforcalcyjl) {
		this.dongareaforcalcyjl = dongareaforcalcyjl;
	}
	public String getDongbasementcounnt() {
		return dongbasementcounnt;
	}
	public void setDongbasementcounnt(String dongbasementcounnt) {
		this.dongbasementcounnt = dongbasementcounnt;
	}
	public String getDonggroundcount() {
		return donggroundcount;
	}
	public void setDonggroundcount(String donggroundcount) {
		this.donggroundcount = donggroundcount;
	}
	public String getDongheight() {
		return dongheight;
	}
	public void setDongheight(String dongheight) {
		this.dongheight = dongheight;
	}
	public String getDongelevatorcount() {
		return dongelevatorcount;
	}
	public void setDongelevatorcount(String dongelevatorcount) {
		this.dongelevatorcount = dongelevatorcount;
	}
	
	 
}
