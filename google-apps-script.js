// GOOGLE APPS SCRIPT КОД
// Скопируйте этот код в script.google.com и создайте новый проект

function doPost(e) {
  try {
    // ID вашей Google Sheets таблицы (найдите в URL таблицы)
    const SHEET_ID = 'ВСТАВЬТЕ_СЮДА_ID_ВАШЕЙ_ТАБЛИЦЫ';
    
    // Открываем таблицу
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Если это первая запись, создаем заголовки
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Дата и время', 'Трансфер', 'Предпочтения по еде', 'Алкоголь', 'Ребенок на празднике']
      ]);
    }
    
    // Получаем данные из формы
    const timestamp = e.parameter.timestamp || new Date().toLocaleString('ru-RU');
    const transfer = e.parameter.transfer || 'Не указано';
    const food = e.parameter.food || 'Не указано';
    const alcohol = e.parameter.alcohol || 'Не указано';
    const child = e.parameter.child || 'Не указано';
    
    // Добавляем новую строку в таблицу
    sheet.appendRow([timestamp, transfer, food, alcohol, child]);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Данные успешно сохранены'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // В случае ошибки
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Функция для тестирования (необязательно)
function testScript() {
  const testData = {
    parameter: {
      timestamp: new Date().toLocaleString('ru-RU'),
      transfer: 'Только до торжества',
      food: 'Не ем мясо',
      alcohol: 'Красное вино',
      child: 'Нет'
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
} 