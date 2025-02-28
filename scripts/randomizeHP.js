export async function randomizeHP(actor) {
  console.log('Undead GM | Рандомизация HP для токена:', actor);

  if (!actor) {
    console.error('Undead GM | Токен не имеет актора. Невозможно обновить.');
    return;
  }

  // Проверяем, что актор имеет ID
  if (!actor.id) {
    console.error('Undead GM | Актор не имеет ID. Невозможно обновить.');
    return;
  }

  // Получаем формулу HP
  const hpFormula = actor.system.attributes?.hp?.formula;
  if (!hpFormula) {
    console.warn('Undead GM | Формула HP не найдена. Пропуск рандомизации HP.');
    return;
  }

  console.log('Undead GM | Формула HP:', hpFormula);

  try {
    // Создаем бросок
    const hpRoll = new Roll(hpFormula);

    // Выполняем бросок синхронно
    await hpRoll.evaluate();
    console.log('Undead GM | Результат броска HP:', hpRoll.total);

    // Подготавливаем данные для переопределения
    const update = {
      'system.attributes.hp.max': hpRoll.total,
      'system.attributes.hp.value': hpRoll.total
    };
    console.log('Undead GM | Данные для переопределения:', update);

    // Применяем переопределения к токену
    await actor.update(update);
    console.log('Undead GM | HP успешно обновлено для токена.');
  } catch (error) {
    console.error('Undead GM | Ошибка при обновлении HP:', error);
  }
}