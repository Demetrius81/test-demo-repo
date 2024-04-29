export default class Utilities {
  private static readonly STR_TEMPLATE_ALL_LETTERS: RegExp = /^[a-zA-Z]+$/;

  private static readonly STR_TEMPLATE_ALL_LETTERS_NUMS: RegExp = /^[a-zA-Z0-9]+$/;

  private static readonly STR_MIN_LENGTH: number = 3;

  public static generateUUID = (): string => {
    let d: number = new Date().getTime();
    let d2: number = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let rnd: number = Math.random() * 16;
      if (d > 0) {
        rnd = (d + rnd) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        rnd = (d2 + rnd) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }

      return (c === 'x' ? rnd : (rnd & 0x3) | 0x8).toString(16);
    });
  };

  public static disableElement = (...elements: (HTMLButtonElement | HTMLInputElement)[]): void => {
    elements.forEach((element) => {
      element.setAttribute('disabled', 'true');
      if (element instanceof HTMLButtonElement) {
        element.classList.remove('enabled');
        element.classList.add('disabled');
        element.setAttribute('disabled', 'disabled');
      } else {
        element.setAttribute('disabled', 'disabled');
      }
    });
  };

  public static enableElement = (...elements: (HTMLButtonElement | HTMLInputElement)[]): void => {
    elements.forEach((element) => {
      element.removeAttribute('disabled');
      if (element instanceof HTMLButtonElement) {
        element.classList.add('enabled');
        element.classList.remove('disabled');
        element.removeAttribute('disabled');
      } else {
        element.removeAttribute('disabled');
      }
    });
  };

  public static validateIsSomeLetter = (str: string): boolean => {
    return this.STR_TEMPLATE_ALL_LETTERS.test(str);
  };

  public static validateIsSomeLetterOrNum = (str: string): boolean => {
    return this.STR_TEMPLATE_ALL_LETTERS_NUMS.test(str);
  };

  public static validateIsDiffCases = (str: string): boolean => {
    return str.toLowerCase() !== str && str.toUpperCase() !== str;
  };

  public static validateIsCorrectLenght = (str: string): boolean => {
    return str.length > this.STR_MIN_LENGTH;
  };

  public static hideComponent = (el: HTMLElement) => {
    if (!el.classList.contains('hidden')) {
      el.classList.add('hidden');
    }
  };

  public static showComponent = (el: HTMLElement) => {
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    }
  };
}
