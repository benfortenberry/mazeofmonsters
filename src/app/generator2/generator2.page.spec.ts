import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Generator2Page } from './generator2.page';

describe('Generator2Page', () => {
  let component: Generator2Page;
  let fixture: ComponentFixture<Generator2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Generator2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Generator2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
