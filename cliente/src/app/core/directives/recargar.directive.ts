import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appRecargar]',
})
export class RecargarDirective implements OnChanges {
  @Input() appRecargar!: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['appRecargar'] &&
      changes['appRecargar'].previousValue != undefined
    ) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
