import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILocation } from '../../../../interfaces/location.interface';

@Component({
  selector: 'app-add-location-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './add-location-form.component.html',
  styleUrls: ['./add-location-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLocationFormComponent {

  @Output() onAdd = new EventEmitter<ILocation>();

  addLocationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    coordinates: new FormGroup({
      lat: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)]),
      lng: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d*$/)])
    })
  });


  addLocation() {
    if (this.addLocationForm.invalid) {
      return;
    }

    const obj: ILocation = {
      name: this.addLocationForm.value.name,
      coordinates: {
        lat: Number(this.addLocationForm.value.coordinates.lat),
        lng: Number(this.addLocationForm.value.coordinates.lng)
      }
    }

    this.onAdd.emit(obj);
    this.addLocationForm.reset();

  }
}
