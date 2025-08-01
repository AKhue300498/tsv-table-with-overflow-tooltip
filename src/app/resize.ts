import { Observable } from 'rxjs';

export function resize(element: HTMLElement) {
  return new Observable((subscriber) => {
    const resizeOb = new ResizeObserver((etr) => {
      subscriber.next(etr);
    });
    resizeOb.observe(element);
    return () => {
      resizeOb.disconnect();
    };
  });
}
