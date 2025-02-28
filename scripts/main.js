import { randomizeHP } from './randomizeHP.js';
import { randomizeCoins } from './randomizeCoins.js';
import { randomizeSpells } from './randomizeSpells.js';
import { randomizeLoot } from './randomizeLoot.js';
import { randomizeBRTLoot } from './randomizeBRTLoot.js';


class UndeadGM {
  constructor() {
    console.log('Undead GM | Initializing...');
    this.initHooks();
  }

  /**
   * Инициализация хуков
   */
  initHooks() {
    console.log('Undead GM | Initializing hooks...');

    // Хук для перехвата данных токена до его создания
    Hooks.on('createToken', async (tokenDoc, options, userId) => {
      console.log('Undead GM | Token created:', tokenDoc);
    
      // Найти соответствующий Token на сцене
      const token = canvas.tokens.get(tokenDoc.id);
      if (!token) {
        console.warn('Undead GM | Token not found on canvas.');
        return;
      }
    
      console.log('Undead GM | Found Token on canvas:', token);
    
      // Проверяем, что токен не привязан к актеру
      if (!token.document.actorLink) {
        console.log('Undead GM | Unlinked token detected.');
    
        // Получаем актера токена
        const actor = token.actor;
        if (!actor) {
          console.warn('Undead GM | Token has no actor. Skipping randomization.');
          return;
        }
    
        // Применяем рандомизацию
        await randomizeHP(actor);
        await randomizeCoins(actor);
        // await randomizeSpells(actor);
        await randomizeBRTLoot(actor);
        // await randomizeLoot(actor);

      }
    });
  }
}


// Инициализация модуля
Hooks.once('init', () => {
  console.log('Undead GM | Initializing module...');
  new UndeadGM();
});