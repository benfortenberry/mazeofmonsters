import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinPage } from './win.page';

describe('WinPage', () => {
  let component: WinPage;
  let fixture: ComponentFixture<WinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
