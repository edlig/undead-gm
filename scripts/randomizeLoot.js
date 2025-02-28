export async function randomizeLoot(actor) {
  console.log('Undead GM | Рандомизация добычи для актора:', actor);

  // Проверка наличия актора и его системных данных
  if (!actor?.system) {
    console.error('Undead GM | Актор или actor.system не определены.');
    return;
  }

  // Получение таблицы лута по имени
  const lootTable = game.tables.getName("Gem10");
  if (!lootTable) {
    console.warn('Undead GM | Таблица лута "Gem10" не найдена.');
    return;
  }

  try {
    // Розыгрыш результата из таблицы лута
    const draw = await lootTable.draw({ displayChat: false });
    if (!draw.results.length) {
      console.warn('Undead GM | Результаты розыгрыша пусты.');
      return;
    }

    // Получение первого результата
    const result = draw.results[0];

    // Проверка, является ли результат ссылкой на существующий объект
    if (!result.documentCollection || !result.documentId) {
      console.warn('Undead GM | Результат не содержит ссылки на документ.');
      return;
    }

    // Формирование UUID для компендиума
    const uuid = `Compendium.${result.documentCollection}.${result.documentId}`;
    console.log('Undead GM | UUID:', uuid);

    // Получение документа предмета по ссылке
    const item = await fromUuid(uuid);
    if (!item) {
      console.warn('Undead GM | Предмет по указанной ссылке не найден.');
      return;
    }

    // Создание копии данных предмета
    const itemData = item.toObject();

    // Добавление предмета актеру
    await actor.createEmbeddedDocuments("Item", [itemData]);
    console.log('Undead GM | Предмет успешно добавлен актеру.');
  } catch (error) {
    console.error('Undead GM | Ошибка при розыгрыше из таблицы лута:', error);
  }
}