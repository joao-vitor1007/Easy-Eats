import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilGarcom } from './perfilGarcom';

describe('PerfilGarcom', () => {
  let component: PerfilGarcom;
  let fixture: ComponentFixture<PerfilGarcom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilGarcom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilGarcom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
