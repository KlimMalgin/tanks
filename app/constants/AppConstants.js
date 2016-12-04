
/**
 * Изменение размера окна
 */
export const RESIZE = 'APP_RESIZE';

/**
 * Генерируется через AnimationStore. Уведомляет о перерисовке кадра.
 * Актуально для всех движущихся объектов на канве.
 */
export const ANIMATE = 'APP_ANIMATE';

/**
 * Генерируется через DisplayStore.
 * Уведомляет о создании динамического объекта на канве.
 */
export const CREATE_OBJECT = 'CREATE_OBJECT';

/**
 * Генерируется через DisplayStore.
 * Уведомляет об уничтожении динамического объекта на канве.
 */
export const DESTROY_OBJECT = 'DESTROY_OBJECT';

/**
 * Генерируется через RespawnStore.
 * Уведомляет о том, что уничтожен юнит,
 * связанный с respawn-точкой и можно его пересоздать.
 */
export const RESPAWN_FREELY = 'RESPAWN_FREELY';
