/**
 * Serves the FactoryOS web application.
 *
 * @return {GoogleAppsScript.HTML.HtmlOutput} Web application page.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('FactoryOS');
}