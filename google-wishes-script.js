// Google Apps Script для работы с пожеланиями
// Этот код нужно вставить в Google Apps Script

// ID вашей Google Sheets таблицы (замените на свой)
const SHEET_ID = 'ВАШ_SHEET_ID_ЗДЕСЬ';
const SHEET_NAME = 'Лист1'; // или название вашего листа

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Добавляем пожелание в таблицу
    const result = addWish(data);
    
    const output = ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Пожелание добавлено',
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Добавляем CORS заголовки
    output.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    return output;
      
  } catch (error) {
    const output = ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    output.setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    
    return output;
  }
}

function doGet(e) {
  try {
    // Получаем все пожелания
    const wishes = getAllWishes();
    
    const output = ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: wishes
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    output.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    return output;
      
  } catch (error) {
    const output = ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
    output.setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    
    return output;
  }
}

function doOptions(e) {
  const output = ContentService.createTextOutput('');
  
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  return output;
}

function addWish(wishData) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // Генерируем ID
  const id = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  // Добавляем строку в таблицу
  sheet.appendRow([
    id,
    wishData.name,
    wishData.text,
    timestamp
  ]);
  
  return {
    id: id,
    name: wishData.name,
    text: wishData.text,
    timestamp: timestamp
  };
}

function getAllWishes() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Пропускаем заголовок (первую строку)
  const wishes = [];
  for (let i = 1; i < data.length; i++) {
    wishes.push({
      id: data[i][0],
      name: data[i][1],
      text: data[i][2],
      timestamp: data[i][3]
    });
  }
  
  // Сортируем по времени (новые сначала)
  wishes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return wishes;
}

// Тестовая функция для проверки
function testAddWish() {
  const testWish = {
    name: 'Тестер',
    text: 'Это тестовое пожелание!'
  };
  
  const result = addWish(testWish);
  console.log('Результат:', result);
}

function testGetWishes() {
  const wishes = getAllWishes();
  console.log('Пожелания:', wishes);
} 