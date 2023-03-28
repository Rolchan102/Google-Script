function readBasketballResults() {
  var url = "https://competicionescabb.gesdeportiva.es/competicion.aspx?competencia=682&amp%3bcategoria=1472";
  var html = UrlFetchApp.fetch(url).getContentText();
  var doc = XmlService.parse(html);
  
  var results = [];
  
  var categoriaOptions = doc.getRootElement().getChild("body").getChild("form").getChild("div")
    .getChild("table").getChild("tbody").getChild("tr").getChild("td", 0)
    .getChild("select", 0).getChildren("option");
  var faseOptions = doc.getRootElement().getChild("body").getChild("form").getChild("div")
    .getChild("table").getChild("tbody").getChild("tr").getChild("td", 1)
    .getChild("select", 0).getChildren("option");
  var grupoOptions = doc.getRootElement().getChild("body").getChild("form").getChild("div")
    .getChild("table").getChild("tbody").getChild("tr").getChild("td", 2)
    .getChild("select", 0).getChildren("option");
  
  for (var i = 0; i < categoriaOptions.length; i++) {
    var categoria = categoriaOptions[i].getValue();
    for (var j = 0; j < faseOptions.length; j++) {
      var fase = faseOptions[j].getValue();
      for (var k = 0; k < grupoOptions.length; k++) {
        var grupo = grupoOptions[k].getValue();
        
        var payload = {
          "__EVENTTARGET": "",
          "__EVENTARGUMENT": "",
          "__VIEWSTATE": "",
          "__VIEWSTATEGENERATOR": "",
          "__EVENTVALIDATION": "",
          "ctl00$ContentPlaceHolder1$DropDownList_Categoria": categoria,
          "ctl00$ContentPlaceHolder1$DropDownList_Fase": fase,
          "ctl00$ContentPlaceHolder1$DropDownList_Grupo": grupo,
          "ctl00$ContentPlaceHolder1$DropDownList_Jornada": "0"
        };
        
        var options = {
          "method": "POST",
          "payload": payload
        };
        
        var response = UrlFetchApp.fetch(url, options);
        var html = response.getContentText();
        var doc = XmlService.parse(html);
        
        var table = doc.getRootElement().getChild("body").getChild("form").getChild("div")
          .getChild("table", 0);
        var rows = table.getChild("tbody").getChildren("tr");
        for (var r = 1; r < rows.length; r++) {
          var cells = rows[r].getChildren("td");
          var result = {
            "Categoria": categoria,
            "Fase": fase,
            "Grupo": grupo,
            "Jornada": cells[0].getValue(),
            "Local": cells[1].getValue(),
            "LocalScore": cells[2].getValue(),
            "Visitante": cells[3].getValue(),
            "VisitanteScore": cells[4].getValue(),
            "Fecha": cells[5].getValue(),
            "Campo": cells[6].getValue()
          };
          results.push(result);
        }
      }
    }
  }
  
  Logger.log(results);
}
