import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemPage } from './gems.page';

describe('GemPage', () => {
    let component: GemPage;
    let fixture: ComponentFixture<GemPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GemPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GemPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
