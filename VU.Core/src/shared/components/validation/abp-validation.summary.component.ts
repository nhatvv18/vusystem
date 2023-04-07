import {
  Component,
  Input,
  Injector,
  Renderer2,
  ElementRef,
  OnInit
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageService } from 'primeng/api';
import { AbpValidationError } from './abp-validation.api';

@Component({
  selector: 'abp-validation-summary',
  templateUrl: './abp-validation.summary.component.html'
})
export class AbpValidationSummaryComponent extends AppComponentBase implements OnInit {

  defaultValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'required',
      // immediateMessage: 'Trường bắt buộc nhập',
      immediateMessage: '',
    },
    {
      name: 'minlength',
      immediateMessage: 'Nhập ít nhất {0} kí tự',
      propertyKey: 'requiredLength',
    },
    {
      name: 'maxlength',
      immediateMessage: 'Nhập tối đa {0} kí tự',
      propertyKey: 'requiredLength',
    },
    {
      name: 'email',
      immediateMessage: 'Email không hợp lệ'
    },
    {
      name: 'pattern',
      immediateMessage: 'Trường không hợp lệ'
    },
    {
      name: 'validateEqual',
      immediateMessage: 'Trường nhập lại không khớp'
    },
    {
      name: 'min',
      immediateMessage: 'Giá trị phải lớn hơn hoặc bằng {0}',
      propertyKey: 'min'
    },
    {
      name: 'max',
      immediateMessage: 'Giá trị phải nhỏ hơn hoặc bằng {0}',
      propertyKey: 'max'
    },
  ];
  validationErrors = <AbpValidationError[]>this.defaultValidationErrors;

  @Input() control: AbstractControl;
  @Input() controlEl: ElementRef;

  constructor(injector: Injector, messageService: MessageService, public _renderer: Renderer2) {
    super(injector, messageService);
  }

  @Input() set customValidationErrors(val: AbpValidationError[]) {
    if (val && val.length > 0) {
      const defaults = this.defaultValidationErrors.filter(
        (defaultValidationError) =>
          !val.find(
            (customValidationError) =>
              customValidationError.name === defaultValidationError.name
          )
      );
      this.validationErrors = <AbpValidationError[]>[...defaults, ...val];
    }
  }

  ngOnInit() {
    if (this.controlEl) {
      this.control.valueChanges.subscribe(() => {
        if (
          this.control.valid &&
          (this.control.dirty || this.control.touched)
        ) {
          try {
            this._renderer.removeClass(this.controlEl, 'is-invalid');
          } catch {
          }
        }
      });
    }
  }

  getValidationErrorMessage(error: AbpValidationError): string {
    const propertyValue = this.control.errors[error.name][error.propertyKey];
    //nếu có message trực tiếp thì trả về luôn không phải translate
    if (error.immediateMessage) {
      if (propertyValue != null && propertyValue != undefined) {
        //return abp.utils.formatString(error.immediateMessage, propertyValue);
      }
      return error.immediateMessage;
    }
    return "";
  }
}
