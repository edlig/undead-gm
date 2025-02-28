export async function randomizeBRTLoot(actor) {
  console.log('Undead GM | Рандомизация добычи для актора:', actor);

  // Проверка наличия актора и его системных данных
  if (!actor?.system) {
    console.error('Undead GM | Актор или actor.system не определены.');
    return;
  }

 // Получение данных из флагов с использованием квадратных скобок
 const tables = actor.flags?.["better-rolltables"]?.["brt-actor-list-roll-table-list"];
 if (!tables) {
   console.warn('Undead GM | Таблицы лута не найдены в флагах актора.');
   return;
 }

 console.log('Undead GM | Таблицы лута:', tables);

   // Объект для группировки предметов по имени
   const itemsToAdd = {};

 // Проходим по каждой таблице
 for (const tableData of tables) {
   const { uuid, quantity, brtType } = tableData;

   // Получаем таблицу по UUID
   const table = await fromUuid(uuid);
   if (!table) {
     console.warn('Undead GM | Таблица не найдена:', uuid);
     continue;
   }

   // Определяем количество бросков
   let rollCount;
   try {
     const roll = new Roll(quantity);
     await roll.evaluate();
     rollCount = roll.total;
     console.log('Undead GM | Количество бросков для таблицы:', uuid, '=', rollCount);
   } catch (error) {
     console.error('Undead GM | Ошибка при определении количества бросков:', error);
     continue;
   }

   // Выполняем броски
   for (let i = 0; i < rollCount; i++) {
    try {
      const draw = await table.draw({ displayChat: false });
      if (draw.results.length > 0) {
        const result = draw.results[0];

        // Проверка, является ли результат ссылкой на существующий объект
        if (!result.documentCollection || !result.documentId) {
          console.warn('Undead GM | Результат не содержит ссылки на документ.');
          continue;
        }

        // Формирование UUID для компендиума
        const itemUuid = `Compendium.${result.documentCollection}.${result.documentId}`;
        console.log('Undead GM | UUID предмета:', itemUuid);

          // Получение документа предмета по ссылке
          const item = await fromUuid(itemUuid);
          if (!item) {
            console.warn('Undead GM | Предмет по указанной ссылке не найден.');
            continue;
          }

          // Создание копии данных предмета
          const itemData = item.toObject();

          // Если предмет уже есть в группе, увеличиваем его количество
          if (itemsToAdd[item.name]) {
            itemsToAdd[item.name].quantity += 1; // Увеличиваем количество
          } else {
            // Иначе добавляем новый предмет в группу
            itemsToAdd[item.name] = {
              data: itemData,
              quantity: 1 // Начальное количество
            };
          }
        }
      } catch (error) {
        console.error('Undead GM | Ошибка при розыгрыше из таблицы:', error);
      }
    }
  }

  // Добавляем сгруппированные предметы в инвентарь актора
  for (const itemName in itemsToAdd) {
    const { data, quantity } = itemsToAdd[itemName];

    // Устанавливаем количество для предмета
    data.system.quantity = quantity;

    // Добавляем предмет актеру
    await actor.createEmbeddedDocuments("Item", [data]);
    console.log('Undead GM | Предмет успешно добавлен актеру:', itemName, 'x', quantity);
 }
}