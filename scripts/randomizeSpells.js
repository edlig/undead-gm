export function randomizeSpells(actor) {
  console.log('Undead GM | Рандомизация заклинаний для актора:', actor);

  // Проверка наличия актора и его системных данных
  if (!actor || !actor.system) {
    console.error('Undead GM | Актор или actor.system не определены.');
    return;
  }

  // Проверка наличия раздела заклинаний у актора
  if (actor.system.spells) {
    // Создаем глубокую копию текущих данных о заклинаниях
    const spells = foundry.utils.deepClone(actor.system.spells);

    // Проходим по каждому уровню заклинаний
    for (let level in spells) {
      // Проверяем, что уровень имеет максимальное количество слотов
      if (spells[level].max > 0) {
        // Рандомизируем количество использованных слотов
        spells[level].value = Math.floor(Math.random() * (spells[level].max + 1));
      }
    }

    // Обновляем данные актора с новыми значениями слотов заклинаний
    actor.update({ 'system.spells': spells });
  } else {
    console.warn('Undead GM | У актора отсутствует раздел заклинаний.');
  }
}
