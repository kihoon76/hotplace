package me.hotplace.reporter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.StringReader;
import java.net.URLEncoder;
import java.nio.charset.Charset;

import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.css.CssFile;
import com.itextpdf.tool.xml.css.StyleAttrCSSResolver;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;

@Component("pdfItext")
public class PdfItext {
	
	@Value("#{pathCfg['handlebars']}")
	String handlebarsRootPath;
	
	@Value("#{pathCfg['css']}")
	String cssRootPath;
	
	//http://zero-gravity.tistory.com/251
	public void make(HttpServletResponse response, JsonObject jo) throws DocumentException, IOException {
		String docName = "다운로드_문서";
		// Document 생성
		Document doc = new Document(PageSize.A4 , 50, 50, 50, 50);    // 용지 및 여백 설정(marginLeft, marginRight, marginTop, marginBottom)
		
		OutputStream os = response.getOutputStream();
		// PdfWriter 생성
		PdfWriter writer = PdfWriter.getInstance(doc, os);
		writer.setInitialLeading(12.5f);
		
		
		
		if(jo != null && jo.get("docName") != null) docName = jo.get("docName").getAsString();
		
		String fileName = URLEncoder.encode(docName, "UTF-8"); // 파일명이 한글일 땐 인코딩 필요
		//response.setHeader("Content-Transper-Encoding", "binary");
		//response.setHeader("Content-Disposition", "inline; filename=" + fileName + ".pdf");
		//doc open
		doc.open();
		XMLWorkerHelper helper = XMLWorkerHelper.getInstance();
		
		//css
		CSSResolver cssResolver = new StyleAttrCSSResolver();
		
		if(isExist(jo, "cssName")){
			CssFile cssFile = helper.getCSS(new FileInputStream(cssRootPath + jo.get("cssName").getAsString() + ".css"));
			cssResolver.addCss(cssFile);
		}
		
		//HTML font
		//XMLWorkerFontProvider fontProvider = new XMLWorkerFontProvider(XMLWorkerFontProvider.DONTLOOKFORFONTS);
		//fontProvider.register("", "");   // MalgunGothic은 alias
		//CssAppliers cssAppliers = new
		
		HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
		htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
		
		PdfWriterPipeline pdf = new PdfWriterPipeline(doc, writer);
		HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
		CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);
		
		XMLWorker worker = new XMLWorker(css, true);
		XMLParser xmlParser = new XMLParser(worker, Charset.forName("UTF-8"));
		
		
		
		// 폰트 설정에서 별칭으로 줬던 "MalgunGothic"을 html 안에 폰트로 지정한다.
		StringBuilder htmlStr = new StringBuilder();
		htmlStr.append("<html><head><body style='font-family: MalgunGothic;'>");
		htmlStr.append(getHtmlString(jo));
		htmlStr.append("</body></head></html>");
		
		StringReader strReader = new StringReader(htmlStr.toString());
		xmlParser.parse(strReader);
		 
		doc.close();
		writer.close();
		os.close();
	}
	
	private boolean isExist(JsonObject jo, String key) {
		if(jo != null && jo.get(key) != null) return true;
		return false;
	}
	
	private org.jsoup.nodes.Document getJsoupDoc(String fileName) throws IOException {
		 return Jsoup.parse(new File(handlebarsRootPath + fileName + ".handlebars"), "utf-8"); 
	}
	
	private String getHtmlString(JsonObject jo) {
		String r = "<p>문서내용이 존재하지 않습니다.</p>";
		try {
			System.err.println(jo.get("fileName").getAsString());
			org.jsoup.nodes.Document doc = getJsoupDoc(jo.get("fileName").getAsString());
			r = doc.toString();
		} 
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return r;
	}
}
