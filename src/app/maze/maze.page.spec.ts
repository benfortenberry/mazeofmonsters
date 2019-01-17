import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MazePage } from './maze.page';

describe('MazePage', () => {
  let component: MazePage;
  let fixture: ComponentFixture<MazePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MazePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
