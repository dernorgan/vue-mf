import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: ref([]), // Використовуємо ref для реактивного масиву тостів
  }),
  actions: {
    // Покращений метод showToast для гнучкості
    showToast({ message, type = 'success', duration = 3000 }) {
      const id = Date.now(); // Генерація унікального ID для кожного тосту
      const toast = { id, message, type };
      this.toasts.push(toast);

      setTimeout(() => {
        this.updateToastVisibility(id, true);
      }, 50);

      // Таймер для автоматичного приховування
      setTimeout(() => {
        this.updateToastVisibility(id, false);
      }, duration);

      // Таймер для видалення тосту
      setTimeout(() => {
        this.removeToast(id);
      }, duration + 2000);
    },

    // Оновлення видимості тосту
    updateToastVisibility(id, visible) {
      const toast = this.toasts.find(t => t.id === id);
      if (toast) {
        toast.visible = visible;
      }
    },

    // Видалення тосту за ID
    removeToast(id) {
      this.updateToastVisibility(id, false);

      setTimeout(() => {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index >= 0) {
          this.toasts.splice(index, 1);
        }
      }, 2000);

    },
  },
});
