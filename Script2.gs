function getBasketballResults() {
  const url = "https://competicionescabb.gesdeportiva.es/competicion.aspx?competencia=682&amp%3bcategoria=1472";
  const options = {muteHttpExceptions: true};
  const response = UrlFetchApp.fetch(url, options);
  const htmlBody = response.getContentText();
  const $ = Cheerio.load(htmlBody);
  const results = [];

  // Loop through each Categoria/Fase/Grupo combination
  const categorias = $('select[id="cphBody_ddlCategoria"] option');
  const fases = $('select[id="cphBody_ddlFase"] option');
  const grupos = $('select[id="cphBody_ddlGrupo"] option');
  for (let i = 1; i < categorias.length; i++) {
    for (let j = 1; j < fases.length; j++) {
      for (let k = 1; k < grupos.length; k++) {
        const categoria = $(categorias[i]).text();
        const fase = $(fases[j]).text();
        const grupo = $(grupos[k]).text();

        // Set the dropdown values and submit the form to get the results
        const form = $('form[name="aspnetForm"]');
        form.find('select[id="cphBody_ddlCategoria"]').val(categoria);
        form.find('select[id="cphBody_ddlFase"]').val(fase);
        form.find('select[id="cphBody_ddlGrupo"]').val(grupo);
        form.submit();
        Utilities.sleep(1000); // Wait for the page to load

        // Get the results table and loop through each row
        const tableRows = $('table[id="cphBody_tblGrilla"] tbody tr');
        for (let m = 1; m < tableRows.length; m++) {
          const row = $(tableRows[m]);
          const date = row.find('td:nth-child(1)').text();
          const matchDay = row.find('td:nth-child(2)').text();
          const homeTeam = row.find('td:nth-child(3)').text();
          const homeScore = row.find('td:nth-child(4)').text();
          const visitorScore = row.find('td:nth-child(6)').text();
          const visitorTeam = row.find('td:nth-child(7)').text();
          const stadium = row.find('td:nth-child(8)').text();

          // Add the results to the array
          results.push({
            categoria,
            fase,
            grupo,
            matchDay,
            homeTeam,
            homeScore,
            visitorTeam,
            visitorScore,
            date,
            stadium
          });
        }
      }
    }
  }

  // Log the results to the console
  console.log(results);
}
