import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
  ComponentRef,
  Injector,
  NgZone,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ContentObserver } from '@angular/cdk/observers';
import { Subject, fromEvent, merge } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[appLazyOverflowTooltip]',
  standalone: true,
  hostDirectives: [MatTooltip],
})
export class LazyOverflowTooltipDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private tooltipComponent!: MatTooltip;
  private resizeObserver: ResizeObserver | null = null;
  private isTooltipInjected = false;
  private currentText = '';

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private injector: Injector,
    private contentObserver: ContentObserver,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.setupHoverListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyTooltip();
    this.disconnectResizeObserver();
  }

  private setupHoverListeners(): void {
    const element = this.elementRef.nativeElement;

    merge(fromEvent(element, 'mouseenter'), fromEvent(element, 'focusin'))
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleHoverEnter();
      });

    merge(fromEvent(element, 'mouseleave'), fromEvent(element, 'focusout'))
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleHoverLeave();
      });
  }

  private observeContentChanges(): void {
    this.contentObserver
      .observe(this.elementRef.nativeElement)
      .pipe(debounceTime(50), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        // Content changed, reset tooltip if it exists
        if (this.isTooltipInjected) {
          this.updateTooltipContent();
        }
      });
  }

  private observeResize(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.ngZone.runOutsideAngular(() => {
        this.resizeObserver = new ResizeObserver(() => {
          // Run change detection when resize occurs
          this.ngZone.run(() => {
            if (this.isTooltipInjected) {
              this.updateTooltipVisibility();
            }
          });
        });

        this.resizeObserver.observe(this.elementRef.nativeElement);
      });
    }
  }

  private handleHoverEnter(): void {
    if (this.checkIfOverflowing(this.elementRef.nativeElement)) {
      this.observeContentChanges();
      this.observeResize();
      this.injectTooltip();
      this.updateTooltipVisibility();
    }
  }

  private handleHoverLeave(): void {
    if (this.tooltipComponent) {
      this.tooltipComponent.hide();
    }
  }

  private injectTooltip(): void {
    if (this.isTooltipInjected) return;

    try {
      // Create tooltip component
      runInInjectionContext(this.injector, () => {
        this.tooltipComponent = inject(MatTooltip);
      });
      // Configure toolti
      const tooltipInstance = this.tooltipComponent;
      tooltipInstance._overlayRef = null as any;

      // Set initial properties
      tooltipInstance.position = 'above';
      tooltipInstance.showDelay = 500;
      tooltipInstance.hideDelay = 0;
      tooltipInstance.touchGestures = 'auto';

      // Manually trigger tooltip initialization

      this.isTooltipInjected = true;
      this.updateTooltipContent();
    } catch (error) {
      console.error('Failed to inject tooltip:', error);
    }
  }

  private updateTooltipContent(): void {
    if (!this.tooltipComponent) return;

    const element = this.elementRef.nativeElement;
    const text = this.getElementText(element);

    if (text !== this.currentText) {
      this.currentText = text;
      this.tooltipComponent.message = text;
    }
  }

  private updateTooltipVisibility(): void {
    if (!this.tooltipComponent) return;

    const element = this.elementRef.nativeElement;
    const isOverflowing = this.checkIfOverflowing(element);

    if (isOverflowing && this.currentText) {
      this.tooltipComponent.show();
    } else {
      this.tooltipComponent.hide();
    }
  }

  private checkIfOverflowing(element: HTMLElement): boolean {
    // Check for text overflow
    const isTextOverflowing =
      element.scrollWidth > element.clientWidth ||
      element.scrollHeight > element.clientHeight;

    // Additional check for text truncation with ellipsis
    const computedStyle = window.getComputedStyle(element);
    const hasEllipsis =
      computedStyle.textOverflow === 'ellipsis' ||
      computedStyle.overflow === 'hidden' ||
      computedStyle.whiteSpace === 'nowrap';

    return (
      isTextOverflowing ||
      (hasEllipsis && element.scrollWidth > element.clientWidth)
    );
  }

  private getElementText(element: HTMLElement): string {
    // Get the visible text content, handling various scenarios
    let text = element.textContent?.trim() || '';

    // If element has input, get its value
    if (element.tagName === 'INPUT') {
      text = (element as HTMLInputElement).value || text;
    }

    // If element has select, get selected option text
    if (element.tagName === 'SELECT') {
      const selectedOption = (element as HTMLSelectElement).selectedOptions[0];
      text = selectedOption?.textContent?.trim() || text;
    }

    return text;
  }

  private destroyTooltip(): void {
    if (this.tooltipComponent) {
      try {
        this.tooltipComponent.ngOnDestroy();
      } catch (error) {
        console.error('Error destroying tooltip:', error);
      }
      this.isTooltipInjected = false;
    }
  }

  private disconnectResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
