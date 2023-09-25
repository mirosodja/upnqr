import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpnqrComponent } from './upnqr.component';

describe('UpnqrComponent', () => {
  let component: UpnqrComponent;
  let fixture: ComponentFixture<UpnqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpnqrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpnqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
