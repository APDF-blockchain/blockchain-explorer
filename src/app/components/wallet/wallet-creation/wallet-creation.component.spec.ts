import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreationComponent } from './wallet-creation.component';

describe('WalletCreationComponent', () => {
  let component: WalletCreationComponent;
  let fixture: ComponentFixture<WalletCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
