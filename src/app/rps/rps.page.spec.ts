import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpsPage } from './rps.page';

describe('RpsPage', () => {
  let component: RpsPage;
  let fixture: ComponentFixture<RpsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
