/**
 * Google Apps Script endpoint for the Universe Telegram assistant.
 *
 * Sheet name: BotContent
 * Header row:
 * slug | titleRu | titleUz | descriptionRu | descriptionUz | price | schedule | groups | freeSeats
 */
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BotContent')
  if (!sheet) {
    return jsonResponse({ error: 'BotContent sheet not found' })
  }

  const values = sheet.getDataRange().getDisplayValues()
  if (values.length < 2) {
    return jsonResponse({ courses: [], updatedAt: new Date().toISOString() })
  }

  const headers = values[0].map((header) => header.trim())
  const courses = values.slice(1)
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index].trim()])))
    .filter((course) => course.slug)

  return jsonResponse({ courses, updatedAt: new Date().toISOString() })
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}
