import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonPage } from './simon.page';

describe('SimonPage', () => {
  let component: SimonPage;
  let fixture: ComponentFixture<SimonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
