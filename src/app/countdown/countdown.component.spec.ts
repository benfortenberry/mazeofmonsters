import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressComponent } from './countdown.component';

describe('CountdownComponent', () => {
    let component: ProgressComponent;
    let fixture: ComponentFixture<ProgressComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProgressComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
