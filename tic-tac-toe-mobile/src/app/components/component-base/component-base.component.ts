import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class ComponentBase implements OnDestroy {
  public readonly destroyed$ = new Subject();

  constructor() {}

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
