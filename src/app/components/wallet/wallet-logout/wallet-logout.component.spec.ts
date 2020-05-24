import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLogoutComponent } from './wallet-logout.component';

describe('WalletLogoutComponent', () => {
  let component: WalletLogoutComponent;
  let fixture: ComponentFixture<WalletLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
