export default class EventGenerator {
  public static generateEvent = (eventName: string): void => {
    const event = new Event(eventName, { bubbles: true, cancelable: true, composed: true });
    document.body.dispatchEvent(event);
  };
}
