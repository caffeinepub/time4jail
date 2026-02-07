/**
 * Development-time regression check for landing page CTA clickability.
 * Verifies that the "Report him!" button can receive pointer events and is not
 * covered by overlaying elements (e.g., sticky header).
 */

interface ClickabilityCheckResult {
  isClickable: boolean;
  overlayingElement: Element | null;
  message: string;
}

/**
 * Check if a CTA element would receive clicks at its center point.
 * Throws an error if an overlay is detected that would intercept clicks.
 * Can also be used to check authenticated landing primary action buttons.
 */
export function checkCtaClickability(ctaElement: HTMLElement): ClickabilityCheckResult {
  const rect = ctaElement.getBoundingClientRect();
  
  // Calculate center point of the CTA
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Check what element is at the center point
  const elementAtPoint = document.elementFromPoint(centerX, centerY);

  // The CTA should be the element at its center, or a child of it
  const isClickable = 
    elementAtPoint === ctaElement || 
    ctaElement.contains(elementAtPoint);

  if (!isClickable && elementAtPoint) {
    const overlayInfo = {
      tagName: elementAtPoint.tagName,
      className: elementAtPoint.className,
      id: elementAtPoint.id,
    };

    const errorMessage = `CTA button is covered by another element at (${centerX.toFixed(0)}, ${centerY.toFixed(0)}): ${overlayInfo.tagName}${overlayInfo.id ? `#${overlayInfo.id}` : ''}${overlayInfo.className ? `.${overlayInfo.className.split(' ').join('.')}` : ''}`;

    throw new Error(errorMessage);
  }

  // Additional checks at offset points (top-left, top-right, bottom-left, bottom-right)
  const offsets = [
    { x: rect.left + 10, y: rect.top + 10 },
    { x: rect.right - 10, y: rect.top + 10 },
    { x: rect.left + 10, y: rect.bottom - 10 },
    { x: rect.right - 10, y: rect.bottom - 10 },
  ];

  for (const offset of offsets) {
    const elementAtOffset = document.elementFromPoint(offset.x, offset.y);
    const isOffsetClickable = 
      elementAtOffset === ctaElement || 
      ctaElement.contains(elementAtOffset);

    if (!isOffsetClickable && elementAtOffset) {
      const overlayInfo = {
        tagName: elementAtOffset.tagName,
        className: elementAtOffset.className,
        id: elementAtOffset.id,
      };

      console.warn(
        `⚠️ CTA button corner at (${offset.x.toFixed(0)}, ${offset.y.toFixed(0)}) is covered by: ${overlayInfo.tagName}${overlayInfo.id ? `#${overlayInfo.id}` : ''}${overlayInfo.className ? `.${overlayInfo.className.split(' ').join('.')}` : ''}`
      );
    }
  }

  const successMessage = `✅ CTA button is clickable at center (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`;
  console.log(successMessage);

  return {
    isClickable: true,
    overlayingElement: null,
    message: successMessage,
  };
}

/**
 * Run clickability checks at multiple viewport widths (for manual testing).
 * This is a helper for development/testing purposes.
 */
export function runResponsiveClickabilityCheck(
  ctaElement: HTMLElement,
  viewportWidths: number[] = [375, 768, 1024, 1440]
): void {
  console.group('🔍 Responsive CTA Clickability Check');
  
  viewportWidths.forEach((width) => {
    console.log(`\nTesting at ${width}px viewport width:`);
    // Note: Actual viewport resizing would need to be done externally
    // This is a placeholder for the concept
    try {
      checkCtaClickability(ctaElement);
    } catch (error) {
      console.error(`❌ Failed at ${width}px:`, error);
    }
  });
  
  console.groupEnd();
}
