import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')!.value;
    const confirmPassword = control.get('confirmPassword')!.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  public static durationValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const durationHours = control.get('durationHours')!.value;
    const durationMinutes = control.get('durationMinutes')!.value;

    if (durationHours === '0' && durationMinutes === '00') {
      return { invalid: true };
    }
    return null;
  }

  public static minDateToday(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(control.value);

      if (selectedDate < today) {
        return { minDateToday: true };
      }
      return null;
    };
  }
}
