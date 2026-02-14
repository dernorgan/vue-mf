// composables/usePopup.js
import { markRaw, ref } from 'vue'
import { disableHtmlScroll, enableHtmlScroll } from '@utils/stopScroll.js'

/**
 * popups — ref масив. В шаблонах Vue авто-розгортає ref, тож v-for="p in popups" працює.
 * В скриптах для доступу/модифікації — використовуй popups.value.
 */
const popups = ref([])

export const usePopup = () => {
	/**
	 * Відкриває попап.
	 * @param {string|number} id - id передається зовні (не генеруємо автоматично)
	 * @param {Component} component - сам компонент (.vue) або render-функція
	 * @param {object} props - props для компонента
	 * @param {object} options - { replaceExisting: boolean, preventDuplicates: boolean }
	 */
	const openPopup = (id, component, props = {}, options = {}) => {
		disableHtmlScroll()
		if (id === undefined || id === null) {
			throw new Error('openPopup: id is required')
		}
		const comp = markRaw(component)

		const existingIndex = popups.value.findIndex((p) => p.id === id)

		if (options.replaceExisting && existingIndex !== -1) {
			popups.value[existingIndex] = { id, component: comp, props }
			return id
		}

		if (options.preventDuplicates && existingIndex !== -1) {
			return id
		}

		popups.value.push({ id, component: comp, props })
		return id
	}

	/** Закрити попап по id. Якщо id не передано — закриває останній */
	const closePopup = (id) => {
		enableHtmlScroll()
		if (id === undefined || id === null) {
			popups.value.pop()
			return
		}
		const idx = popups.value.findIndex((p) => p.id === id)
		if (idx !== -1) popups.value.splice(idx, 1)
	}

	const closeLastPopup = () => {
		enableHtmlScroll()
		if (popups.value.length) popups.value.pop()
	}

	const closeAll = () => {
		popups.value = []
	}

	/** Повністю замінити масив попапів */
	const setPopups = (newArray) => {
		popups.value = newArray.map((p) => ({
			...p,
			component: markRaw(p.component),
		}))
	}

	return {
		popups,
		openPopup,
		closePopup,
		closeLastPopup,
		closeAll,
		setPopups,
	}
}
