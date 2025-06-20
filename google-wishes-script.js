// Google Apps Script для работы с пожеланиями
// Этот код нужно вставить в Google Apps Script

// ID вашей Google Sheets таблицы (замените на свой)
const SHEET_ID = 'ВАШ_SHEET_ID_ЗДЕСЬ';
const SHEET_NAME = 'Лист1'; // или название вашего листа

function doPost(e) {
  try {
    // Отладочная информация
    console.log('doPost вызван с параметрами:', e);
    console.log('e.postData:', e.postData);
    console.log('e.parameter:', e.parameter);
    
    let data;
    
    // Проверяем наличие postData
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
      console.log('Используем JSON данные:', data);
    } else if (e.parameter) {
      // FormData через параметры
      data = {
        name: e.parameter.name || '',
        text: e.parameter.text || ''
      };
      console.log('Используем FormData параметры:', data);
    } else {
      throw new Error('Нет данных для обработки');
    }
    
    // Проверяем обязательные поля
    if (!data.name || !data.text) {
      throw new Error('Отсутствуют обязательные поля: name или text');
    }
    
    // Добавляем пожелание в таблицу
    const result = addWish(data);
    console.log('Пожелание добавлено:', result);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Пожелание добавлено',
        data: result
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Ошибка в doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    console.log('doGet вызван с параметрами:', e);
    console.log('e.parameter:', e.parameter);
    
    // Проверяем, что это за действие
    if (e.parameter && e.parameter.action === 'add') {
      // Добавляем новое пожелание
      const data = {
        name: e.parameter.name || '',
        text: e.parameter.text || ''
      };
      
      console.log('Добавляем пожелание:', data);
      
      // Проверяем обязательные поля
      if (!data.name || !data.text) {
        throw new Error('Отсутствуют обязательные поля: name или text');
      }
      
      const result = addWish(data);
      console.log('Пожелание добавлено:', result);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'Пожелание добавлено',
          data: result
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Получаем все пожелания
      const wishes = getAllWishes();
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          data: wishes
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    console.error('Ошибка в doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('');
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