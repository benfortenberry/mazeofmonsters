import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeballPage } from './eyeball.page';

describe('Eyeball Page', () => {
  let component: EyeballPage;
  let fixture: ComponentFixture<EyeballPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EyeballPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeballPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
