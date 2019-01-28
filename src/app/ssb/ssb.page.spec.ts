import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsbPage } from './ssb.page';

describe('SsbPage', () => {
    let component: SsbPage;
    let fixture: ComponentFixture<SsbPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SsbPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SsbPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
