import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TictactoePage } from './tictactoe.page';

describe('TictactoePage', () => {
  let component: TictactoePage;
  let fixture: ComponentFixture<TictactoePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TictactoePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TictactoePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
